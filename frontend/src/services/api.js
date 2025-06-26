import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://127.0.0.1:8000'; // Changed localhost to 127.0.0.1

// Create the API instance
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Shorten timeout to prevent hanging
  timeout: 15000,
  withCredentials: true // Important for CORS with credentials
});

// Global refresh state - CRITICAL for preventing infinite loops
let isRefreshing = false;
let refreshSubscribers = [];
let tokenRefreshPromise = null;
let lastRefreshTime = 0;
const MIN_REFRESH_INTERVAL = 30000; // 30 seconds minimum between refreshes

// Function to add callbacks to the refresh subscriber queue
const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

// Function to resolve all subscribers with the new token
const onTokenRefreshed = (newToken) => {
  refreshSubscribers.forEach(callback => callback(newToken));
  refreshSubscribers = [];
};

// Function to handle failed refresh
const onRefreshFailed = (error) => {
  refreshSubscribers.forEach(callback => callback(null, error));
  refreshSubscribers = [];
};

// Using localStorage for token storage
const getAuthTokens = () => {
  const authTokensStr = localStorage.getItem('authTokens');
  if (!authTokensStr) return null;
  
  try {
    return JSON.parse(authTokensStr);
  } catch (e) {
    console.error('Error parsing auth tokens:', e);
    return null;
  }
};

// Function to refresh the token
const refreshToken = async () => {
  const now = Date.now();
  
  // Prevent refreshing too frequently
  if (now - lastRefreshTime < MIN_REFRESH_INTERVAL) {
    console.log('Token refresh attempted too soon, skipping');
    return getAuthTokens()?.access;
  }
  
  const tokens = getAuthTokens();
  
  if (!tokens?.refresh) {
    throw new Error('No refresh token available');
  }
  
  lastRefreshTime = now;
  
  try {
    // Use a direct axios instance to avoid auth interceptors
    const response = await axios.post(
      `${baseURL}/api/token/refresh/`,
      { refresh: tokens.refresh },
      { headers: { 'Authorization': '' } }
    );
    
    // Store the new tokens
    const newTokens = {
      access: response.data.access,
      refresh: tokens.refresh,  // Keep existing refresh token
    };
    
    localStorage.setItem('authTokens', JSON.stringify(newTokens));
    
    return newTokens.access;
  } catch (error) {
    console.error('Token refresh failed:', error);
    localStorage.removeItem('authTokens');
    throw error;
  }
};

// Request interceptor - add authorization header and guest session key
api.interceptors.request.use(
  config => {
    // Skip auth header for token endpoints
    if (config.url?.includes('/token/') || config.url?.includes('/auth/')) {
      return config;
    }
    
    const tokens = getAuthTokens();
    if (tokens?.access) {
      config.headers['Authorization'] = `Bearer ${tokens.access}`;
    } else {
      // For guest users, add session key to headers for cart operations
      const guestSessionKey = localStorage.getItem('guestSessionKey');
      if (guestSessionKey) {
        // Add guest session key for cart-related endpoints
        if (config.url?.includes('/cart/') || config.url?.includes('/carts/')) {
          config.headers['X-Guest-Session-Key'] = guestSessionKey;
          console.log('[API] Adding guest session key to request:', guestSessionKey, 'for URL:', config.url);
        }
      }
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor - handle 401 errors (token expired)
api.interceptors.response.use(
  response => response, 
  async error => {
    const originalRequest = error.config;
    
    // If not a 401 error or no refresh token, just reject
    if (error.response?.status !== 401 || !getAuthTokens()?.refresh) {
      return Promise.reject(error);
    }
    
    // If we already tried to refresh for this request or we're in token refresh endpoint, reject
    if (originalRequest._retry || originalRequest.url?.includes('/token/refresh/')) {
      return Promise.reject(error);
    }

    // Mark request as retried
    originalRequest._retry = true;
    
    if (!isRefreshing) {
      isRefreshing = true;
      tokenRefreshPromise = refreshToken()
        .then(newToken => {
          onTokenRefreshed(newToken);
          return newToken;
        })
        .catch(error => {
          onRefreshFailed(error);
          throw error;
        })
        .finally(() => {
          isRefreshing = false;
          tokenRefreshPromise = null;
        });
    }
    
    try {
      // Wait for the token refresh
      const newToken = await tokenRefreshPromise;
      
      // Update the header with new token and retry
      originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
      return axios(originalRequest);
    } catch (error) {
      // If refresh failed, go to login
      window.location.href = '/login';
      return Promise.reject(error);
    }
  }
);

export default api;