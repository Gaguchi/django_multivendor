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
  const response = await fetch(`${API_URL}/api/vendors/products/`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return handleResponse(response);
}

export async function getProductByIdApi(id) {
  const response = await fetch(`${API_URL}/api/vendors/products/${id}/`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return handleResponse(response);
}

export async function createProductApi(productData) {
  // Log the productData, stringifying File objects to their names for readability
  console.log("Attempting to create product with data (api.js):", JSON.stringify(productData, (key, value) => {
    if (key === 'file' && value instanceof File) {
      return value.name; // Show filename for File objects
    }
    return value;
  }, 2));

  const formData = new FormData();

  // Append standard fields from productData
  for (const key in productData) {
    if (key === 'managedImages' || key === 'selectedThumbnailId') {
      continue; // Skip image-specific fields, handle them separately
    }
    if (productData[key] !== null && productData[key] !== undefined) {
      // If a field is an object (e.g., attributes), Django REST Framework might expect it JSON stringified
      // or handled with dot notation in field names if using certain parsers.
      // For now, append directly. If issues arise, this might need JSON.stringify for specific complex fields.
      if (typeof productData[key] === 'object' && !(productData[key] instanceof File)) {
        // Example: if attributes are { color: 'red', size: 'M' }
        // formData.append(key, JSON.stringify(productData[key]));
        // For now, let's assume flat or simple values are expected by the backend for non-file fields.
        // This part might need adjustment based on backend expectations for complex/nested data.
        // A common pattern is to flatten (e.g., attributes.color) or stringify.
        // Given the current structure, most fields are primitive or arrays of primitives (like tags).
        formData.append(key, productData[key]);
      } else {
        formData.append(key, productData[key]);
      }
    }
  }

  let thumbnailFilename = null;
  if (productData.selectedThumbnailId && productData.managedImages) {
    const thumbnailImageObject = productData.managedImages.find(img => img.id === productData.selectedThumbnailId);
    if (thumbnailImageObject && thumbnailImageObject.file instanceof File) {
      thumbnailFilename = thumbnailImageObject.file.name;
    } else if (thumbnailImageObject && thumbnailImageObject.isExternal) {
      // If the thumbnail is an existing external image, backend might need its URL or ID.
      // For 'create' this is less common, but good to consider for 'update'.
      // formData.append('existing_thumbnail_identifier', thumbnailImageObject.preview); // e.g. its URL
    }
  }

  // Append image files
  if (productData.managedImages) {
    productData.managedImages.forEach((imgObject) => {
      if (imgObject.file instanceof File) { // Only upload actual File objects
        // The third argument to append (filename) is often useful for the server.
        formData.append('images', imgObject.file, imgObject.file.name);
      }
      // Note: If initialImages contained URLs of already uploaded images (isExternal: true),
      // and these need to be preserved or re-associated, the backend API must support this.
      // For a 'create' operation, typically only new files are uploaded.
    });
  }

  // Append the filename of the designated thumbnail
  if (thumbnailFilename) {
    formData.append('thumbnail_filename', thumbnailFilename);
  } else if (productData.managedImages && productData.managedImages.some(img => img.file instanceof File) && !thumbnailFilename) {
    // If images are being uploaded but no thumbnail was explicitly selected,
    // the backend might default to the first one, or this could be an error/warning.
    console.warn("Images are present, but no specific thumbnail filename could be determined. Backend might use a default.");
  }
  
  // Log FormData entries for debugging (cannot directly log FormData object content easily)
  console.log("Constructed FormData to send (entries will be logged below):");
  for (let [key, value] of formData.entries()) {
    if (value instanceof File) {
      console.log(`FormData entry: ${key} -> Name: ${value.name}, Size: ${value.size}, Type: ${value.type}`);
    } else {
      console.log(`FormData entry: ${key} -> ${value}`);
    }
  }

  const response = await fetch(`${API_URL}/api/vendors/products/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      // 'Accept': 'application/json', // Optional: Inform server we prefer JSON response
      // Content-Type for FormData is set automatically by the browser, including the boundary.
      // Explicitly setting 'Content-Type': 'multipart/form-data' can sometimes cause issues if the boundary is wrong.
    },
    body: formData // Send the FormData object
  });

  // handleResponse should ideally be robust enough to parse JSON errors,
  // which DRF typically provides even for multipart requests.
  return handleResponse(response);
}

export async function updateProductApi(id, productData) {
  const response = await fetch(`${API_URL}/api/vendors/products/${id}/`, {
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
  const response = await fetch(`${API_URL}/api/vendors/products/${id}/`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return handleResponse(response);
}
