import { getToken, refreshToken, clearToken } from '../utils/auth';

// API URL with fallback to local development server if not specified in env
const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://127.0.0.1:8000';
console.log('API URL configured as:', API_URL);

async function handleResponse(response) {
  // If response is OK, simply return the parsed JSON
  if (response.ok) {
    try {
      return await response.json();
    } catch (error) {
      console.error('Error parsing successful response:', error);
      throw new Error('Invalid response format from server');
    }
  }

  // Special handling for 401 Unauthorized errors
  if (response.status === 401) {
    console.log('Received 401 Unauthorized, URL:', response.url);
    
    // Only attempt token refresh if this isn't a login or token-related request
    if (!response.url.includes('/login/') && 
        !response.url.includes('/token/') && 
        !response.url.includes('/auth/')) {
      
      console.log('Token expired, attempting to refresh...');
      const refreshed = await refreshToken();
      
      if (refreshed) {
        console.log('Token refreshed, retrying original request');
        
        // Clone the original request but add the new token
        const retryResponse = await fetch(response.url, {
          method: response.method || 'GET',
          headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: response._bodyInit // Include the original body if any
        });
        
        return handleResponse(retryResponse);
      } else {
        console.log('Refresh failed, clearing auth');
        clearToken();
        throw new Error('Your session has expired. Please log in again.');
      }
    }
  }

  try {
    const error = await response.json();
    throw new Error(error.detail || error.message || `API Error: ${response.status}`);
  } catch {
    throw new Error(`Network error: ${response.statusText || response.status}`);
  }
}

// Add dual endpoint support for login to match Python test
export async function login(username, password) {
  try {
    // Determine which endpoint to use based on global variable set in the Login component
    const useTokenEndpoint = window.useTokenEndpoint || false;
    
    // Choose the appropriate endpoint
    const loginEndpoint = useTokenEndpoint 
      ? `${API_URL}/api/token/` 
      : `${API_URL}/api/users/login/`;
    
    console.log('Attempting login at:', loginEndpoint);
    
    // Prepare the body based on the endpoint
    let requestBody;
    if (useTokenEndpoint) {
      // The /api/token/ endpoint might expect 'username' or 'email'
      // For now, let's assume it also expects 'username' as per previous logic.
      // If this also needs to be 'login', this will need adjustment.
      requestBody = JSON.stringify({ username, password });
      console.log('Request body for /api/token/:', requestBody);
    } else {
      // The /api/users/login/ endpoint expects 'login' (can be username or email)
      requestBody = JSON.stringify({ login: username, password });
      console.log('Request body for /api/users/login/:', requestBody);
    }
    
    const response = await fetch(loginEndpoint, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include', // Ensure cookies (like CSRF or session) are sent
      body: JSON.stringify({ login: username, password }) // Changed 'username' to 'login'
    });
    
    // Log response status for debugging
    console.log('Login response status:', response.status);
    
    // For login requests, handle 401 differently than token refreshes
    if (response.status === 401) {
      console.error('Login failed: Invalid credentials');
      
      // Try to get more details from the response
      try {
        const errorData = await response.json();
        console.error('Login error details:', errorData);
        throw new Error(errorData.detail || 'Invalid username or password');
      } catch (parseError) {
        throw new Error('Invalid username or password');
      }    }
    
    // If we got here, something other than 401 error or success
    if (!response.ok) {
      console.error(`Login failed with status: ${response.status}`);
      throw new Error(`Login failed with status: ${response.status}`);
    }
    
    // Success path - attempt to parse JSON response
    try {
      const data = await response.json();
      console.log('Login successful, response structure:', Object.keys(data));
      return data;
    } catch (error) {
      console.error('Error parsing login response:', error);
      
      // Attempt to get raw text
      try {
        const rawText = await response.text();
        console.error('Raw response text:', rawText);
        throw new Error('Invalid response format from server');
      } catch (textError) {
        console.error('Error getting raw response text:', textError);
        throw new Error('Could not process server response');
      }
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function fetchProfile() {
  if (!getToken()) return null;
  try {
    const response = await fetch(`${API_URL}/api/users/profile/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      }
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching profile:', error);
    if (error.message.includes('expired')) clearToken();
    return null;
  }
}

// Example category APIs
export async function getCategoriesApi() {
  try {
    const response = await fetch(`${API_URL}/api/categories/`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    const data = await handleResponse(response);
    console.log("Categories API raw response:", data);
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

// Example product APIs
export async function getProductsApi() {
  const response = await fetch(`${API_URL}/vendors/products/`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return handleResponse(response);
}

export async function getProductByIdApi(id) {
  const response = await fetch(`${API_URL}/vendors/products/${id}/`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return handleResponse(response);
}

export async function createProductApi(productData) {
  const response = await fetch(`${API_URL}/vendors/products/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(productData)
  });
  return handleResponse(response);
}

export async function updateProductApi(id, productData) {
  const response = await fetch(`${API_URL}/vendors/products/${id}/`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(productData)
  });
  return handleResponse(response);
}

export async function deleteProductApi(id) {
  const response = await fetch(`${API_URL}/vendors/products/${id}/`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return handleResponse(response);
}
