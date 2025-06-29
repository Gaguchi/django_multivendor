/**
 * Enhanced API Service with Industry-Standard Token Management
 * 
 * Features:
 * - Automatic token refresh before expiration
 * - Smart request queuing during refresh
 * - Comprehensive error handling
 * - Race condition prevention
 * - Performance optimization
 */

import { tokenManager } from '../utils/enhancedAuth.js';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.bazro.ge';

/**
 * Enhanced fetch wrapper with automatic token management
 */
async function enhancedFetch(url, options = {}) {
  // Ensure we have a valid token before making the request
  const tokenValid = await tokenManager.ensureValidToken();
  
  if (!tokenValid && !isPublicEndpoint(url)) {
    throw new Error('Authentication required');
  }
  
  // Prepare headers
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers
  };
  
  // Add authentication header for protected endpoints
  if (!isPublicEndpoint(url) && tokenManager.isAuthenticated()) {
    headers['Authorization'] = `Bearer ${tokenManager.getAccessToken()}`;
  }
  
  // Add vendor-specific headers if needed
  if (isVendorEndpoint(url) && tokenManager.isVendor()) {
    headers['X-Master-Token'] = 'your-super-secret-token'; // This should match backend
    const vendorId = tokenManager.getVendorId();
    if (vendorId) {
      headers['X-Vendor-ID'] = vendorId;
    }
  }
  
  const requestOptions = {
    ...options,
    headers,
    credentials: 'include'
  };
  
  try {
    const response = await fetch(url, requestOptions);
    return await handleResponse(response, url, requestOptions);
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}

/**
 * Handle response with smart error handling and retry logic
 */
async function handleResponse(response, originalUrl, originalOptions) {
  // If response is OK, return the parsed JSON
  if (response.ok) {
    try {
      return await response.json();
    } catch (error) {
      // Some endpoints might return empty responses
      if (response.status === 204) {
        return null;
      }
      console.error('Error parsing successful response:', error);
      throw new Error('Invalid response format from server');
    }
  }
  
  // Handle 401 Unauthorized errors
  if (response.status === 401) {
    return await handle401Error(response, originalUrl, originalOptions);
  }
  
  // Handle other error statuses
  return await handleOtherErrors(response);
}

/**
 * Handle 401 Unauthorized errors with smart retry logic
 */
async function handle401Error(response, originalUrl, originalOptions) {
  console.log('Received 401 Unauthorized, URL:', originalUrl);
  
  // Don't attempt token refresh for certain endpoints
  if (isPublicEndpoint(originalUrl) || isAuthEndpoint(originalUrl)) {
    throw await createErrorFromResponse(response);
  }
  
  // If we're already refreshing, queue this request
  if (tokenManager.isRefreshing) {
    console.log('Token refresh in progress, queuing request');
    return await tokenManager.queueRequest({
      url: originalUrl,
      ...originalOptions
    });
  }
  
  // Attempt token refresh
  console.log('Token expired, attempting to refresh...');
  const refreshed = await tokenManager.performRefresh();
  
  if (refreshed) {
    console.log('Token refreshed, retrying original request');
    
    // Update the authorization header with the new token
    const newHeaders = {
      ...originalOptions.headers,
      'Authorization': `Bearer ${tokenManager.getAccessToken()}`
    };
    
    // Retry the original request
    const retryResponse = await fetch(originalUrl, {
      ...originalOptions,
      headers: newHeaders
    });
    
    return await handleResponse(retryResponse, originalUrl, originalOptions);
  } else {
    console.log('Token refresh failed, redirecting to login');
    throw new Error('Your session has expired. Please log in again.');
  }
}

/**
 * Handle other HTTP error statuses
 */
async function handleOtherErrors(response) {
  let errorMessage = 'An error occurred';
  let errorCode = 'UNKNOWN_ERROR';
  
  try {
    const errorData = await response.json();
    errorMessage = errorData.detail || errorData.message || errorMessage;
    errorCode = errorData.error_code || errorData.error || errorCode;
  } catch (e) {
    // If we can't parse the error response, use the status text
    errorMessage = response.statusText || `HTTP ${response.status}`;
  }
  
  const error = new Error(errorMessage);
  error.status = response.status;
  error.code = errorCode;
  
  throw error;
}

/**
 * Create error from response
 */
async function createErrorFromResponse(response) {
  let errorMessage = 'Request failed';
  
  try {
    const errorData = await response.json();
    errorMessage = errorData.detail || errorData.message || errorMessage;
  } catch (e) {
    errorMessage = response.statusText || `HTTP ${response.status}`;
  }
  
  const error = new Error(errorMessage);
  error.status = response.status;
  
  return error;
}

/**
 * Check if endpoint is public (doesn't require authentication)
 */
function isPublicEndpoint(url) {
  const publicEndpoints = [
    '/login/',
    '/register/',
    '/token/',
    '/auth/',
    '/check-email/',
    '/endpoints/'
  ];
  
  return publicEndpoints.some(endpoint => url.includes(endpoint));
}

/**
 * Check if endpoint is authentication-related
 */
function isAuthEndpoint(url) {
  const authEndpoints = [
    '/login/',
    '/register/',
    '/token/',
    '/auth/'
  ];
  
  return authEndpoints.some(endpoint => url.includes(endpoint));
}

/**
 * Check if endpoint requires vendor-specific headers
 */
function isVendorEndpoint(url) {
  const vendorEndpoints = [
    '/vendors/',
    '/orders/'
  ];
  
  return vendorEndpoints.some(endpoint => url.includes(endpoint));
}

// API functions using enhanced fetch

/**
 * Authentication APIs
 */
export async function login(username, password) {
  console.log('Attempting login with username:', username);
  
  const loginEndpoint = `${API_URL}/api/users/login/`;
  
  try {
    const response = await enhancedFetch(loginEndpoint, {
      method: 'POST',
      body: JSON.stringify({ login: username, password })
    });
    
    console.log('Login successful:', response);
    return response;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

export async function register(userData) {
  console.log('Attempting registration');
  
  const registerEndpoint = `${API_URL}/api/users/register/`;
  
  try {
    const response = await enhancedFetch(registerEndpoint, {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    
    console.log('Registration successful:', response);
    return response;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
}

/**
 * Vendor APIs
 */
export async function fetchVendorProfile() {
  console.log('Fetching vendor profile');
  
  const profileEndpoint = `${API_URL}/api/vendors/profile/`;
  
  try {
    const response = await enhancedFetch(profileEndpoint);
    console.log('Vendor profile fetched:', response);
    return response;
  } catch (error) {
    console.error('Failed to fetch vendor profile:', error);
    throw error;
  }
}

export async function updateVendorProfile(profileData) {
  console.log('Updating vendor profile');
  
  const updateEndpoint = `${API_URL}/api/vendors/profile/`;
  
  try {
    const response = await enhancedFetch(updateEndpoint, {
      method: 'PATCH',
      body: JSON.stringify(profileData)
    });
    
    console.log('Vendor profile updated:', response);
    return response;
  } catch (error) {
    console.error('Failed to update vendor profile:', error);
    throw error;
  }
}

/**
 * Order Management APIs
 */
export async function fetchVendorOrders(params = {}) {
  console.log('Fetching vendor orders with params:', params);
  
  const queryString = new URLSearchParams(params).toString();
  const ordersEndpoint = `${API_URL}/api/orders/vendor-orders/${queryString ? '?' + queryString : ''}`;
  
  try {
    const response = await enhancedFetch(ordersEndpoint);
    console.log('Vendor orders fetched:', response);
    return response;
  } catch (error) {
    console.error('Failed to fetch vendor orders:', error);
    throw error;
  }
}

export async function fetchOrderDetail(orderId) {
  console.log('Fetching order detail for ID:', orderId);
  
  const orderEndpoint = `${API_URL}/api/orders/vendor-orders/${orderId}/`;
  
  try {
    const response = await enhancedFetch(orderEndpoint);
    console.log('Order detail fetched:', response);
    return response;
  } catch (error) {
    console.error('Failed to fetch order detail:', error);
    throw error;
  }
}

export async function updateOrderStatus(orderId, newStatus) {
  console.log('Updating order status:', { orderId, newStatus });
  
  const updateEndpoint = `${API_URL}/api/orders/vendor-orders/${orderId}/update-status/`;
  
  try {
    const response = await enhancedFetch(updateEndpoint, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus })
    });
    
    console.log('Order status updated:', response);
    return response;
  } catch (error) {
    console.error('Failed to update order status:', error);
    throw error;
  }
}

/**
 * Product Management APIs
 */
export async function fetchVendorProducts(params = {}) {
  console.log('Fetching vendor products with params:', params);
  
  const queryString = new URLSearchParams(params).toString();
  const productsEndpoint = `${API_URL}/api/vendors/products/${queryString ? '?' + queryString : ''}`;
  
  try {
    const response = await enhancedFetch(productsEndpoint);
    console.log('Vendor products fetched:', response);
    return response;
  } catch (error) {
    console.error('Failed to fetch vendor products:', error);
    throw error;
  }
}

export async function createProduct(productData) {
  console.log('Creating new product');
  
  const createEndpoint = `${API_URL}/api/vendors/products/`;
  
  try {
    const response = await enhancedFetch(createEndpoint, {
      method: 'POST',
      body: JSON.stringify(productData)
    });
    
    console.log('Product created:', response);
    return response;
  } catch (error) {
    console.error('Failed to create product:', error);
    throw error;
  }
}

export async function updateProduct(productId, productData) {
  console.log('Updating product:', productId);
  
  const updateEndpoint = `${API_URL}/api/vendors/products/${productId}/`;
  
  try {
    const response = await enhancedFetch(updateEndpoint, {
      method: 'PATCH',
      body: JSON.stringify(productData)
    });
    
    console.log('Product updated:', response);
    return response;
  } catch (error) {
    console.error('Failed to update product:', error);
    throw error;
  }
}

export async function deleteProduct(productId) {
  console.log('Deleting product:', productId);
  
  const deleteEndpoint = `${API_URL}/api/vendors/products/${productId}/`;
  
  try {
    const response = await enhancedFetch(deleteEndpoint, {
      method: 'DELETE'
    });
    
    console.log('Product deleted:', response);
    return response;
  } catch (error) {
    console.error('Failed to delete product:', error);
    throw error;
  }
}

/**
 * Analytics APIs
 */
export async function fetchVendorAnalytics(params = {}) {
  console.log('Fetching vendor analytics with params:', params);
  
  const queryString = new URLSearchParams(params).toString();
  const analyticsEndpoint = `${API_URL}/api/vendors/analytics/${queryString ? '?' + queryString : ''}`;
  
  try {
    const response = await enhancedFetch(analyticsEndpoint);
    console.log('Vendor analytics fetched:', response);
    return response;
  } catch (error) {
    console.error('Failed to fetch vendor analytics:', error);
    throw error;
  }
}

/**
 * Utility functions
 */
export async function checkApiHealth() {
  console.log('Checking API health');
  
  const healthEndpoint = `${API_URL}/api/endpoints/`;
  
  try {
    const response = await enhancedFetch(healthEndpoint);
    console.log('API health check:', response);
    return response;
  } catch (error) {
    console.error('API health check failed:', error);
    throw error;
  }
}

// Export enhanced API instance for custom requests
export const api = {
  get: (url, options = {}) => enhancedFetch(url, { method: 'GET', ...options }),
  post: (url, data, options = {}) => enhancedFetch(url, { 
    method: 'POST', 
    body: JSON.stringify(data), 
    ...options 
  }),
  patch: (url, data, options = {}) => enhancedFetch(url, { 
    method: 'PATCH', 
    body: JSON.stringify(data), 
    ...options 
  }),
  put: (url, data, options = {}) => enhancedFetch(url, { 
    method: 'PUT', 
    body: JSON.stringify(data), 
    ...options 
  }),
  delete: (url, options = {}) => enhancedFetch(url, { method: 'DELETE', ...options })
};

export default api;
