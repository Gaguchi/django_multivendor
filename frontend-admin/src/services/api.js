import { getToken, refreshToken, clearToken } from '../utils/auth';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.bazro.ge';

async function handleResponse(response) {
  if (response.ok) return response.json();

  if (response.status === 401) {
    console.log('Token expired, attempting to refresh...');
    const refreshed = await refreshToken();
    if (refreshed) {
      console.log('Token refreshed, retrying request');
      const retryResponse = await fetch(response.url, {
        method: response.type,
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      });
      return handleResponse(retryResponse);
    } else {
      console.log('Refresh failed, clearing auth');
      clearToken();
      throw new Error('Your session has expired. Please log in again.');
    }
  }

  try {
    const error = await response.json();
    throw new Error(error.detail || error.message || `API Error: ${response.status}`);
  } catch {
    throw new Error(`Network error: ${response.statusText || response.status}`);
  }
}

export async function login(username, password) {
  const response = await fetch(`${API_URL}/api/users/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return handleResponse(response);
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
