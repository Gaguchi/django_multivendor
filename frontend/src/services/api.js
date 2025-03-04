import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Track if we're refreshing to prevent multiple refresh calls
let isRefreshing = false;
// Store waiting requests
let failedQueue = [];
// Store the refresh promise to reuse for concurrent requests
let refreshPromise = null;

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
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

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => response,
  async error => {
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