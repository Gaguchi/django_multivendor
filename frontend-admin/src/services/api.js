import { getToken, refreshToken, clearToken } from '../utils/auth';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.bazro.ge';

async function handleResponse(response) {
  if (response.ok) {
    return response.json();
  }
  
  // If response is 401, try to refresh token
  if (response.status === 401) {
    console.log('Token expired, attempting to refresh...');
    const refreshed = await refreshToken();
    
    if (refreshed) {
      // Retry the original request with new token
      console.log('Token refreshed successfully, retrying original request');
      const originalRequest = response.url;
      const method = response.method;
      const headers = {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      };
      const retryResponse = await fetch(originalRequest, { method, headers });
      return handleResponse(retryResponse);
    } else {
      console.log('Token refresh failed, clearing authentication');
      clearToken(); // Clear tokens if refresh fails
      throw new Error('Your session has expired. Please log in again.');
    }
  }

  // Handle other errors
  try {
    const error = await response.json();
    throw new Error(error.detail || error.message || `API Error: ${response.status}`);
  } catch (e) {
    throw new Error(`Network error: ${response.statusText || response.status}`);
  }
}

export async function login(username, password) {
  try {
    const response = await fetch(`${API_URL}/api/users/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    return handleResponse(response);
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
        'Content-Type': 'application/json',
      },
    });
    
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching profile:', error);
    
    // Return null on error instead of throwing to handle gracefully
    if (error.message.includes('expired')) {
      clearToken();
    }
    return null;
  }
}

// More API functions will go here
