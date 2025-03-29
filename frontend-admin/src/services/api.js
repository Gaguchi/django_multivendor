import { getToken, refreshToken } from '../utils/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function handleResponse(response) {
  if (response.ok) {
    return response.json();
  }
  
  // If response is 401, try to refresh token
  if (response.status === 401) {
    const refreshed = await refreshToken();
    if (refreshed) {
      // Retry the original request
      const originalRequest = response.url;
      const method = response.method;
      const headers = {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      };
      const retryResponse = await fetch(originalRequest, { method, headers });
      return handleResponse(retryResponse);
    }
  }

  // Handle other errors
  const error = await response.json().catch(() => ({ 
    message: 'Something went wrong' 
  }));
  throw new Error(error.detail || error.message || 'API Error');
}

export async function login(username, password) {
  const response = await fetch(`${API_URL}/api/users/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  
  return handleResponse(response);
}

export async function fetchProfile() {
  if (!getToken()) return null;
  
  const response = await fetch(`${API_URL}/api/users/profile/`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    },
  });
  
  return handleResponse(response);
}

// More API functions will go here
