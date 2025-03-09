import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:8000';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true // Important for CORS with credentials
});

// Track if we're currently refreshing the token
let isRefreshing = false;
// Queue of requests to be retried after token refresh
let failedQueue = [];

// Process queue of failed requests
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  // Reset failed queue
  failedQueue = [];
};

// Function to refresh token
const refreshAccessToken = async () => {
  // Only create a new promise if we don't have one in progress
  if (!refreshPromise) {
    refreshPromise = new Promise(async (resolve, reject) => {
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        console.log('Attempting to refresh token...');
        
        // Use axios directly to avoid interceptors
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/token/refresh/`,
          { refresh: refreshToken }
        );
        
        const { access } = response.data;
        localStorage.setItem('token', access);
        
        // Update the authorization header
        api.defaults.headers.common.Authorization = `Bearer ${access}`;
        
        console.log('Token refreshed successfully');
        resolve(access);
      } catch (error) {
        console.error('Token refresh failed:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        reject(error);
      } finally {
        refreshPromise = null;
      }
    });
  }
  
  return refreshPromise;
};

// This function will retry a failed request with a new token
const retryOriginalRequest = async (originalRequest) => {
  try {
    const token = await refreshAccessToken();
    originalRequest.headers.Authorization = `Bearer ${token}`;
    return api(originalRequest);
  } catch (error) {
    // If refresh fails, redirect to login and reject
    window.location.href = '/login';
    return Promise.reject(error);
  }
};

// Add request debugging
api.interceptors.request.use(
  config => {
    // Log request (but don't log sensitive data)
    const { url, method } = config;
    console.debug(`API Request: ${method?.toUpperCase() || 'GET'} ${url}`);
    return config;
  },
  error => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response debugging
api.interceptors.response.use(
  response => {
    // Log response (but don't log sensitive data)
    const { url, method } = response.config;
    console.debug(`API Response: ${method?.toUpperCase() || 'GET'} ${url}`, response.status);
    return response;
  },
  async error => {
    if (error.response) {
      const { url, method } = error.config;
      console.error(`API Error: ${method?.toUpperCase() || 'GET'} ${url}`, error.response.status, error.response.data);
    } else if (error.request) {
      console.error('API Request Error: No response received', error.request);
    } else {
      console.error('API Error:', error.message);
    }

    // Get the original request config
    const originalRequest = error.config;
    
    // If there's no response or the request was already retried, reject immediately
    if (!error.response || originalRequest._retry) {
      return Promise.reject(error);
    }
    
    // Handle 401 errors specifically
    if (error.response.status === 401) {
      console.log('401 detected for URL:', originalRequest.url);
      
      // Mark that this request has been retried
      originalRequest._retry = true;
      
      // If we're already refreshing, add this request to the queue
      if (isRefreshing) {
        console.log('Token refresh already in progress, queuing request');
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            console.log('Using new token from queue for', originalRequest.url);
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }
      
      // Start refreshing
      isRefreshing = true;
      console.log('Starting token refresh process');
      
      try {
        // Use the refresh token to get a new access token
        const token = await refreshAccessToken();
        
        // Process any queued requests
        processQueue(null, token);
        
        // Retry the original request with the new token
        console.log('Retrying original request with new token');
        return api({
          ...originalRequest,
          headers: {
            ...originalRequest.headers,
            Authorization: `Bearer ${token}`
          }
        });
      } catch (refreshError) {
        // If refresh fails, reject all queued requests
        console.error('Token refresh failed, rejecting all queued requests');
        processQueue(refreshError, null);
        
        // Redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    // If not a 401, just reject the promise
    return Promise.reject(error);
  }
);

// Expose the refreshToken function for manual refresh if needed
api.refreshToken = refreshAccessToken;

export default api;

// Export utility functions for handling API errors
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with an error status
    const { data, status } = error.response;
    
    // Format error message
    let errorMessage = 'An error occurred.';
    
    if (typeof data === 'string') {
      errorMessage = data;
    } else if (data.detail) {
      errorMessage = data.detail;
    } else if (data.message) {
      errorMessage = data.message;
    } else if (data.error) {
      errorMessage = data.error;
    } else if (data.non_field_errors) {
      errorMessage = data.non_field_errors.join(' ');
    } else if (typeof data === 'object') {
      // Handle field errors (e.g., {"email": ["This field is required"]})
      const fieldErrors = Object.entries(data)
        .filter(([key]) => key !== 'status')
        .map(([field, errors]) => {
          if (Array.isArray(errors)) {
            return `${field}: ${errors.join(' ')}`;
          }
          return `${field}: ${errors}`;
        });
      
      if (fieldErrors.length > 0) {
        errorMessage = fieldErrors.join('. ');
      }
    }
    
    return {
      message: errorMessage,
      status: status,
      data: data
    };
  } else if (error.request) {
    // Request was made but no response received
    return {
      message: 'No response received from server. Please check your internet connection.',
      status: 0,
      data: null
    };
  } else {
    // Something else happened in setting up the request
    return {
      message: error.message || 'Unknown error occurred',
      status: 0,
      data: null
    };
  }
};