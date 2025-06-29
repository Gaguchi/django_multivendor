import { getToken, refreshToken, clearToken, getVendorId, ensureValidToken } from '../utils/auth';

// API URL with fallback to local development server if not specified in env
const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.bazro.ge';
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
    
    // Don't attempt token refresh for vendor endpoints or auth-related endpoints
    if (!response.url.includes('/login/') && 
        !response.url.includes('/token/') && 
        !response.url.includes('/auth/') &&
        !response.url.includes('/vendor')) {
      
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

// --- Order Management Functions ---

// Get vendor orders with optional filters
export async function getVendorOrders(filters = {}) {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters.status) {
      queryParams.append('status', filters.status);
    }
    if (filters.limit) {
      queryParams.append('limit', filters.limit);
    }
    
    const url = `${API_URL}/api/orders/vendor/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    // For vendor endpoints, only use master token authentication
    const headers = {
      'X-Master-Token': import.meta.env.VITE_MASTER_TOKEN,
      'Accept': 'application/json'
    };
    
    // Add vendor ID header if available
    const vendorId = getVendorId();
    if (vendorId) {
      headers['X-Vendor-ID'] = vendorId;
    }
    
    // Debug logging
    console.log('Making vendor orders request to:', url);
    console.log('Request headers:', {
      'X-Master-Token': headers['X-Master-Token'] ? 'Present' : 'Missing',
      'X-Vendor-ID': headers['X-Vendor-ID'] || 'Missing'
    });
    
    const response = await fetch(url, { headers });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching vendor orders:', error);
    throw error;
  }
}

// Get specific order details for vendor
export async function getVendorOrderDetail(orderNumber) {
  try {
    // For vendor endpoints, only use master token authentication
    const headers = {
      'X-Master-Token': import.meta.env.VITE_MASTER_TOKEN,
      'Accept': 'application/json'
    };
    
    // Add vendor ID header if available
    const vendorId = getVendorId();
    if (vendorId) {
      headers['X-Vendor-ID'] = vendorId;
    }
    
    const response = await fetch(`${API_URL}/api/orders/${orderNumber}/vendor-detail/`, {
      headers
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching vendor order detail:', error);
    throw error;
  }
}

// Update order status (vendor action)
export async function updateOrderStatus(orderNumber, status) {
  try {
    // For vendor endpoints, only use master token authentication
    const headers = {
      'X-Master-Token': import.meta.env.VITE_MASTER_TOKEN,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    // Add vendor ID header if available
    const vendorId = getVendorId();
    if (vendorId) {
      headers['X-Vendor-ID'] = vendorId;
    }
    
    const response = await fetch(`${API_URL}/api/orders/${orderNumber}/update-status/`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ status })
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}

// Get categories without authentication (for registration)
export async function getCategories() {
  try {
    const response = await fetch(`${API_URL}/api/categories/`, {
      headers: { 
        'Accept': 'application/json'
      }
    });
    const data = await handleResponse(response);
    console.log("Categories response:", data);
    return data.results || data; // Handle paginated or direct response
  } catch (error) {
    console.error("Error fetching categories:", error);
    return []; // Return empty array if categories fail to load
  }
}

// Vendor registration API
export async function registerVendor(vendorData) {
  try {
    console.log('Attempting vendor registration with data:', vendorData);
    
    // Check if vendorData is FormData or regular object
    const isFormData = vendorData instanceof FormData;
    
    let requestOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      }
    };
    
    if (isFormData) {
      // For FormData, don't set Content-Type (browser will set it with boundary)
      requestOptions.body = vendorData;
    } else {
      // For regular object, stringify and set Content-Type
      requestOptions.headers['Content-Type'] = 'application/json';
      requestOptions.body = JSON.stringify(vendorData);
    }
    
    const response = await fetch(`${API_URL}/api/vendors/register/`, requestOptions);
    
    console.log('Vendor registration response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Vendor registration error details:', errorData);
      
      // Create a more user-friendly error message
      let errorMessage = 'Registration failed. ';
      if (errorData.email) {
        errorMessage += 'Email: ' + (Array.isArray(errorData.email) ? errorData.email[0] : errorData.email) + ' ';
      }
      if (errorData.store_name) {
        errorMessage += 'Store name: ' + (Array.isArray(errorData.store_name) ? errorData.store_name[0] : errorData.store_name) + ' ';
      }
      if (errorData.detail) {
        errorMessage += errorData.detail;
      }
      if (errorData.error) {
        errorMessage += errorData.error;
      }
      
      const error = new Error(errorMessage.trim());
      error.response = { data: errorData };
      throw error;
    }
    
    const data = await response.json();
    console.log('Vendor registration successful:', data);
    return data;
  } catch (error) {
    console.error('Vendor registration error:', error);
    throw error;
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
    // Ensure token is valid before making the request
    await ensureValidToken();
    
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
  // Ensure token is valid before making the request
  await ensureValidToken();
  
  const response = await fetch(`${API_URL}/api/vendors/products/my_products/`, {
    headers: { 
      'Authorization': `Bearer ${getToken()}`,
      'Accept': 'application/json'
    }
  });
  return handleResponse(response);
}

export async function getProductByIdApi(id) {
  const masterToken = import.meta.env.VITE_MASTER_TOKEN;
  const headers = {};
  
  // Try master token first if available, otherwise use Bearer token
  if (masterToken) {
    headers['X-Master-Token'] = masterToken;
  } else if (getToken()) {
    headers['Authorization'] = `Bearer ${getToken()}`;
  }
  
  headers['Accept'] = 'application/json';

  console.log(`Fetching product ${id} with headers:`, headers);
  const response = await fetch(`${API_URL}/api/vendors/products/${id}/`, { headers });
  return handleResponse(response);
}

export async function createProductApi(productData) {
  // Log the productData, stringifying File objects to their names for readability
  console.log("Attempting to create product with data (api.js):", JSON.stringify(productData, (key, value) => {
    if (value instanceof File) {
      return value.name; // Represent File objects by their names in this log
    }
    return value;
  }, 2));

  const formData = new FormData();

  // Append standard fields from productData
  for (const key in productData) {
    if (key !== 'managedImages' && key !== 'selectedThumbnailId' && productData[key] !== null && productData[key] !== undefined) {
      formData.append(key, productData[key]);
    }
  }

  let thumbnailFilename = null;
  if (productData.selectedThumbnailId && productData.managedImages) {
    const thumbnailImage = productData.managedImages.find(img => img.id === productData.selectedThumbnailId);
    if (thumbnailImage && thumbnailImage.file && thumbnailImage.file.name) { // Check file and file.name
      thumbnailFilename = thumbnailImage.file.name;
    } else if (thumbnailImage && thumbnailImage.name) { // Fallback if file.name isn't there but image.name is (e.g. from initialData)
        thumbnailFilename = thumbnailImage.name;
    }
    // Add more specific logging for thumbnail selection
    console.log("Thumbnail selection - ID:", productData.selectedThumbnailId, "Found image:", thumbnailImage, "Derived filename:", thumbnailFilename);
  }

  // Detailed logging for managedImages before appending to FormData
  console.log("productData.managedImages in createProductApi before loop:", productData.managedImages);
  if (productData.managedImages && Array.isArray(productData.managedImages)) {
    productData.managedImages.forEach((img, index) => {
      console.log(`Inspecting managedImages[${index}]:`, img);
      console.log(`managedImages[${index}].file:`, img.file);
      console.log(`managedImages[${index}].file instanceof File:`, img.file instanceof File);
    });
  } else {
    console.warn("productData.managedImages is not an array or is undefined:", productData.managedImages);
  }

  // Append image files
  if (productData.managedImages && Array.isArray(productData.managedImages)) {
    productData.managedImages.forEach((image, index) => {
      if (image.file instanceof File) {
        // Backend expects 'images[]'
        formData.append('images[]', image.file, image.file.name); // Ensure original filename is passed
        console.log(`Appended file to FormData: images[] - ${image.file.name} (size: ${image.file.size})`);
      } else {
        console.warn(`Skipped appending image ${index} (id: ${image.id}, name: ${image.name || 'N/A'}) because image.file is not a File object or is missing. image.file value:`, image.file);
      }
    });
  }

  // Append the filename of the designated thumbnail
  if (thumbnailFilename) {
    formData.append('thumbnail_filename', thumbnailFilename);
    console.log(`Appended thumbnail_filename to FormData: ${thumbnailFilename}`);
  } else if (productData.managedImages && productData.managedImages.length > 0 && productData.managedImages[0].file instanceof File) {
    // Default to first image's name if no specific thumbnail selected and first image is a new file
    const firstImageFile = productData.managedImages[0].file;
    formData.append('thumbnail_filename', firstImageFile.name);
    console.log(`Appended first image as default thumbnail_filename: ${firstImageFile.name}`);
  } else {
    console.log("No specific thumbnail_filename to append, or first image is not a new file.");
  }

  // Log FormData entries for debugging (cannot directly log FormData object content easily)
  console.log("Constructed FormData to send (entries will be logged by the loop below if supported, or check network tab):");
  // Standard way to log FormData entries
  for (let [key, value] of formData.entries()) {
    if (value instanceof File) {
      console.log(`FormData entry: ${key} = File { name: "${value.name}", size: ${value.size}, type: "${value.type}" }`);
    } else {
      console.log(`FormData entry: ${key} = ${value}`);
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
  console.log("Updating product with data (api.js):", JSON.stringify(productData, (key, value) => {
    if (key === 'file' && value instanceof File) {
      return value.name; // Show filename for File objects
    }
    return value;
  }, 2));

  // Check if we have new images to upload - if so, use FormData
  const hasNewImages = productData.managedImages && 
    productData.managedImages.some(img => img.file instanceof File);

  if (hasNewImages) {
    // Use FormData for updates with images
    const formData = new FormData();

    // Append standard fields from productData
    for (const key in productData) {
      if (key === 'managedImages' || key === 'selectedThumbnailId') {
        continue; // Skip image-specific fields, handle them separately
      }
      if (productData[key] !== null && productData[key] !== undefined) {
        if (typeof productData[key] === 'object' && !(productData[key] instanceof File)) {
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
      }
    }

    // Append new image files
    if (productData.managedImages) {
      productData.managedImages.forEach((imgObject) => {
        if (imgObject.file instanceof File) {
          formData.append('images', imgObject.file, imgObject.file.name);
        }
      });
    }

    // Append the filename of the designated thumbnail
    if (thumbnailFilename) {
      formData.append('thumbnail_filename', thumbnailFilename);
    }

    console.log("Sending FormData for update:");
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`FormData entry: ${key} -> Name: ${value.name}, Size: ${value.size}, Type: ${value.type}`);
      } else {
        console.log(`FormData entry: ${key} -> ${value}`);
      }
    }

    const response = await fetch(`${API_URL}/api/vendors/products/${id}/`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
      body: formData
    });

    return handleResponse(response);
  } else {
    // No new images, use JSON for simple update
    const jsonData = { ...productData };
    delete jsonData.managedImages;
    delete jsonData.selectedThumbnailId;

    const response = await fetch(`${API_URL}/api/vendors/products/${id}/`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jsonData)
    });
    return handleResponse(response);
  }
}

export async function deleteProductApi(id) {
  const masterToken = import.meta.env.VITE_MASTER_TOKEN;
  const headers = {};
  
  // For delete operations, prefer Bearer token if available, otherwise master token
  if (getToken()) {
    headers['Authorization'] = `Bearer ${getToken()}`;
  } else if (masterToken) {
    headers['X-Master-Token'] = masterToken;
  }
  
  console.log(`Deleting product ${id} with headers:`, headers);
  const response = await fetch(`${API_URL}/api/vendors/products/${id}/`, {
    method: 'DELETE',
    headers: headers
  });
  return handleResponse(response);
}

// Email availability check API
export async function checkEmailAvailability(email) {
  try {
    console.log('Checking email availability for:', email);
    
    const response = await fetch(`${API_URL}/api/users/check-email/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email: email.toLowerCase().trim() })
    });
    
    console.log('Email check response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Email check error details:', errorData);
      throw new Error('Failed to check email availability');
    }
    
    const data = await response.json();
    console.log('Email availability check result:', data);
    return data; // Should return { available: true/false }
  } catch (error) {
    console.error('Email availability check error:', error);
    throw error;
  }
}

// Get vendor profile information
export async function getVendorProfile() {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token available');
    }

    // Ensure token is valid before making the request, but don't wait too long
    try {
      await ensureValidToken();
    } catch (tokenError) {
      console.warn('Token validation failed, attempting request anyway:', tokenError);
      // Continue with the request using the current token
    }
    
    const response = await fetch(`${API_URL}/api/vendors/profile/`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching vendor profile:', error);
    throw error;
  }
}
