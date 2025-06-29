const TOKEN_KEY = 'admin_access_token';
const REFRESH_TOKEN_KEY = 'admin_refresh_token';
const USER_DATA_KEY = 'admin_user_data';
const VENDOR_ID_KEY = 'admin_vendor_id';

// Add a debug function to check token status
export const debugTokenStatus = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  const userData = localStorage.getItem(USER_DATA_KEY);
  
  console.log('Token Status Check:');
  console.log('- Access Token exists:', !!token);
  console.log('- Refresh Token exists:', !!refreshToken);
  console.log('- User Data exists:', !!userData);
  
  // If token exists, check its structure without revealing the full token
  if (token) {
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        // It's a proper JWT with header, payload, and signature
        try {
          // Only decode the payload (middle part)
          const payload = JSON.parse(atob(parts[1]));
          console.log('- Token payload structure:', Object.keys(payload));
          
          // Check for expiration
          if (payload.exp) {
            const expDate = new Date(payload.exp * 1000);
            const now = new Date();
            console.log('- Token expires:', expDate.toLocaleString());
            console.log('- Token expired:', expDate < now);
          }
        } catch (e) {
          console.log('- Could not decode token payload');
        }
      } else {
        console.log('- Token does not appear to be a valid JWT');
      }
    } catch (e) {
      console.log('- Error examining token:', e);
    }
  }
  
  return {
    hasToken: !!token,
    hasRefreshToken: !!refreshToken,
    hasUserData: !!userData
  };
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setToken = (token, refreshToken, userData) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
  localStorage.removeItem(VENDOR_ID_KEY);
};

export const isAuthenticated = () => {
  const token = getToken();
  
  if (!token) {
    console.log('No token found, not authenticated');
    return false;
  }
  
  // Basic token validation (optional)
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.log('Token does not appear to be a valid JWT');
      return false;
    }
    
    // Check expiration only if we can parse the token
    try {
      const payload = JSON.parse(atob(parts[1]));
      if (payload.exp) {
        const expDate = new Date(payload.exp * 1000);
        const now = new Date();
        if (expDate < now) {
          console.log('Token is expired according to JWT payload');
          return false;
        }
      }
    } catch (e) {
      // If we can't parse the payload, just assume it's valid
      console.log('Could not check token expiration, assuming valid');
    }
  } catch (e) {
    console.error('Error validating token:', e);
  }
  
  return true;
};

export const getUserData = () => {
  try {
    const userData = localStorage.getItem(USER_DATA_KEY);
    if (!userData) {
      console.log('No user data found in localStorage');
      return null;
    }
    
    const parsedData = JSON.parse(userData);
    console.log('User data retrieved:', Object.keys(parsedData));
    return parsedData;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

export const isVendor = () => {
  const userData = getUserData();
  
  if (!userData) {
    console.log('No user data, cannot determine vendor status');
    return false;
  }
  
  // Check for profile in different possible formats
  const profile = userData.profile || userData.userprofile;
  
  if (!profile) {
    console.log('No profile data found in user data');
    return false;
  }
  
  const userType = profile.user_type || profile.userType;
  const isUserVendor = userType === "vendor";
  
  console.log('User type:', userType);
  console.log('Is user vendor:', isUserVendor);
  
  return isUserVendor;
};

export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      console.log('No refresh token available');
      return false;
    }

    // Log the first few characters of the refresh token (for debugging)
    console.log(`Refresh token found (starts with: ${refreshToken.substring(0, 10)}...)`);

    // Use the correct endpoint from environment or fall back to default
    const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.bazro.ge';
    const refreshEndpoint = `${API_URL}/api/token/refresh/`;
    console.log('Attempting to refresh token at:', refreshEndpoint);
    
    const response = await fetch(refreshEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include', // Include cookies if any
      body: JSON.stringify({ refresh: refreshToken }),
    });

    // Log response status for debugging
    console.log('Token refresh response status:', response.status);

    if (response.ok) {
      const data = await response.json();
      console.log('Token successfully refreshed');
      
      // Store the new access token
      localStorage.setItem(TOKEN_KEY, data.access);
      
      // If a new refresh token is provided, store it too
      if (data.refresh) {
        localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh);
        console.log('New refresh token stored');
      }
      
      // Log the structure of the response (without showing the actual token)
      console.log('Refresh response structure:', Object.keys(data));
      return true;
    } else {
      // Try to get error details
      try {
        const errorData = await response.json();
        console.error('Token refresh error details:', errorData);
      } catch (e) {
        console.error('Could not parse error response:', e);
        
        // Try to get the raw text
        try {
          const rawError = await response.text();
          console.error('Raw error response:', rawError);
        } catch (textError) {
          console.error('Could not get raw error text:', textError);
        }
      }
      
      // If unauthorized, clear tokens
      if (response.status === 401) {
        console.log('Refresh token is invalid or expired, clearing auth');
        clearToken();
      }
      
      return false;    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    console.error("Error stack:", error.stack);
    
    // Don't clear tokens for network errors - could be temporary
    if (error.name !== 'TypeError' && error.name !== 'NetworkError') {
      clearToken();
    }
    
    return false;
  }
};

// Vendor ID management
export const getVendorId = () => {
  const vendorId = localStorage.getItem(VENDOR_ID_KEY);
  console.log('Getting vendor ID from localStorage:', vendorId);
  return vendorId;
};

export const setVendorId = (vendorId) => {
  console.log('Setting vendor ID in localStorage:', vendorId);
  if (vendorId) {
    localStorage.setItem(VENDOR_ID_KEY, vendorId.toString());
  } else {
    localStorage.removeItem(VENDOR_ID_KEY);
  }
};

export const clearVendorId = () => {
  localStorage.removeItem(VENDOR_ID_KEY);
};
