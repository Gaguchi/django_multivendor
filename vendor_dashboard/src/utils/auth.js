const TOKEN_KEY = 'admin_access_token';
const REFRESH_TOKEN_KEY = 'admin_refresh_token';
const USER_DATA_KEY = 'admin_user_data';
const VENDOR_ID_KEY = 'admin_vendor_id';

// Token management constants
const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes before expiry
const TOKEN_REFRESH_RETRY_DELAY = 30 * 1000; // 30 seconds between retries
const MAX_REFRESH_RETRIES = 3;

// Global state for token management
let refreshPromise = null;
let refreshTimer = null;
let refreshRetryCount = 0;

// Enhanced token expiry check with detailed info
export const getTokenExpiryInfo = () => {
  const token = getToken();
  
  if (!token) {
    return { isValid: false, isExpired: true, timeToExpiry: 0, shouldRefresh: true };
  }

  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { isValid: false, isExpired: true, timeToExpiry: 0, shouldRefresh: true };
    }

    const payload = JSON.parse(atob(parts[1]));
    
    if (!payload.exp) {
      // No expiry info, assume valid but check periodically
      return { isValid: true, isExpired: false, timeToExpiry: Infinity, shouldRefresh: false };
    }

    const expDate = new Date(payload.exp * 1000);
    const now = new Date();
    const timeToExpiry = expDate.getTime() - now.getTime();
    const isExpired = timeToExpiry <= 0;
    const shouldRefresh = timeToExpiry <= TOKEN_REFRESH_THRESHOLD && timeToExpiry > 0;

    return {
      isValid: true,
      isExpired,
      timeToExpiry,
      shouldRefresh,
      expiryDate: expDate,
      payload
    };
  } catch (error) {
    console.error('Error parsing token:', error);
    return { isValid: false, isExpired: true, timeToExpiry: 0, shouldRefresh: true };
  }
};

// Proactive token refresh
export const ensureValidToken = async () => {
  // Prevent multiple simultaneous refresh attempts
  if (refreshPromise) {
    console.log('Token refresh already in progress, waiting...');
    return await refreshPromise;
  }

  const tokenInfo = getTokenExpiryInfo();
  
  if (!tokenInfo.isValid || tokenInfo.isExpired) {
    console.log('Token is invalid or expired, attempting refresh...');
    return await performTokenRefresh();
  }

  if (tokenInfo.shouldRefresh) {
    console.log(`Token expires in ${Math.round(tokenInfo.timeToExpiry / 1000)}s, refreshing proactively...`);
    return await performTokenRefresh();
  }

  // Token is still valid and doesn't need refresh yet
  scheduleNextRefresh(tokenInfo.timeToExpiry);
  return true;
};

// Perform the actual token refresh with retry logic
const performTokenRefresh = async () => {
  refreshPromise = (async () => {
    try {
      const success = await refreshToken();
      
      if (success) {
        refreshRetryCount = 0;
        console.log('Token refresh successful');
        
        // Schedule next refresh
        const newTokenInfo = getTokenExpiryInfo();
        if (newTokenInfo.isValid && !newTokenInfo.isExpired) {
          scheduleNextRefresh(newTokenInfo.timeToExpiry);
        }
        
        return true;
      } else {
        // Retry logic
        refreshRetryCount++;
        
        if (refreshRetryCount < MAX_REFRESH_RETRIES) {
          console.log(`Token refresh failed, retrying in ${TOKEN_REFRESH_RETRY_DELAY / 1000}s (attempt ${refreshRetryCount}/${MAX_REFRESH_RETRIES})`);
          
          setTimeout(() => {
            refreshPromise = null;
            performTokenRefresh();
          }, TOKEN_REFRESH_RETRY_DELAY);
          
          return false;
        } else {
          console.error('Token refresh failed after maximum retries, logging out...');
          clearToken();
          
          // Redirect to login or emit event
          window.dispatchEvent(new CustomEvent('auth:logout', { 
            detail: { reason: 'token_refresh_failed' } 
          }));
          
          return false;
        }
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      refreshRetryCount++;
      
      if (refreshRetryCount >= MAX_REFRESH_RETRIES) {
        clearToken();
        window.dispatchEvent(new CustomEvent('auth:logout', { 
          detail: { reason: 'token_refresh_error', error } 
        }));
      }
      
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return await refreshPromise;
};

// Schedule the next automatic refresh
const scheduleNextRefresh = (timeToExpiry) => {
  // Clear existing timer
  if (refreshTimer) {
    clearTimeout(refreshTimer);
  }

  // Don't schedule if token is about to expire or already expired
  if (timeToExpiry <= TOKEN_REFRESH_THRESHOLD) {
    return;
  }

  // Schedule refresh 5 minutes before expiry
  const refreshDelay = timeToExpiry - TOKEN_REFRESH_THRESHOLD;
  
  console.log(`Next token refresh scheduled in ${Math.round(refreshDelay / 1000)}s`);
  
  refreshTimer = setTimeout(() => {
    console.log('Scheduled token refresh triggered');
    performTokenRefresh();
  }, refreshDelay);
};

// Initialize automatic token management
export const initializeTokenManagement = () => {
  console.log('Initializing automatic token management...');
  
  // Check current token and schedule refresh if needed
  const tokenInfo = getTokenExpiryInfo();
  
  if (tokenInfo.isValid && !tokenInfo.isExpired) {
    if (tokenInfo.shouldRefresh) {
      console.log('Token needs immediate refresh');
      performTokenRefresh();
    } else {
      console.log('Token is valid, scheduling next refresh');
      scheduleNextRefresh(tokenInfo.timeToExpiry);
    }
  } else if (tokenInfo.isExpired) {
    console.log('Token is expired, attempting refresh...');
    performTokenRefresh();
  }

  // Listen for visibility changes to refresh when tab becomes active
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      console.log('Tab became visible, checking token status...');
      ensureValidToken();
    }
  });

  // Listen for storage changes (if user logs in/out in another tab)
  window.addEventListener('storage', (e) => {
    if (e.key === TOKEN_KEY) {
      if (e.newValue) {
        console.log('Token updated in another tab, reinitializing...');
        initializeTokenManagement();
      } else {
        console.log('Token cleared in another tab');
        clearTimeout(refreshTimer);
        refreshTimer = null;
      }
    }
  });
};

// Clean up token management
export const cleanupTokenManagement = () => {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
  refreshPromise = null;
  refreshRetryCount = 0;
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);

// Token storage functions (will be enhanced with migration support below)
const setTokenBase = (token, refreshToken, userData) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
};

const clearTokenBase = () => {
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

// Debug function to log token status
export const debugTokenStatus = () => {
  const tokenInfo = getTokenExpiryInfo();
  console.log('=== Token Status Debug ===');
  console.log('Token info:', tokenInfo);
  console.log('Is authenticated:', isAuthenticated());
  console.log('Is vendor:', isVendor());
  console.log('Vendor ID:', getVendorId());
  console.log('=========================');
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

// Enhanced Token Management Migration Support
// This file provides backward compatibility while migrating to the enhanced token system

// Try to import enhanced token manager, fall back to legacy if not available
let enhancedTokenManager = null;
let useEnhancedAuth = false;

try {
  // Attempt to load enhanced token management
  import('./enhancedAuth.js').then(module => {
    enhancedTokenManager = module.tokenManager;
    useEnhancedAuth = true;
    console.log('✅ Enhanced token management loaded');
    
    // Migrate existing tokens to enhanced system
    migrateToEnhancedAuth();
  }).catch(error => {
    console.log('⚠️ Enhanced auth not available, using legacy system:', error.message);
  });
} catch (error) {
  console.log('⚠️ Could not load enhanced auth, using legacy system');
}

// Migration function to move from legacy to enhanced auth
function migrateToEnhancedAuth() {
  if (!enhancedTokenManager) return;
  
  try {
    // Get existing tokens from legacy storage
    const accessToken = localStorage.getItem(TOKEN_KEY);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    const userData = localStorage.getItem(USER_DATA_KEY);
    
    if (accessToken && refreshToken) {
      console.log('🔄 Migrating tokens to enhanced system');
      
      // Parse user data
      let parsedUserData = null;
      try {
        parsedUserData = userData ? JSON.parse(userData) : null;
      } catch (e) {
        console.error('Error parsing legacy user data:', e);
      }
      
      // Set tokens in enhanced system
      enhancedTokenManager.setTokens(accessToken, refreshToken, parsedUserData);
      
      console.log('✅ Token migration completed');
    }
  } catch (error) {
    console.error('❌ Token migration failed:', error);
  }
}

// Enhanced function wrappers that use enhanced auth when available
export const enhancedRefreshToken = async () => {
  if (useEnhancedAuth && enhancedTokenManager) {
    return await enhancedTokenManager.performRefresh();
  }
  return await refreshToken(); // Fall back to legacy
};

export const enhancedEnsureValidToken = async () => {
  if (useEnhancedAuth && enhancedTokenManager) {
    return await enhancedTokenManager.ensureValidToken();
  }
  // Legacy doesn't have proactive refresh, just check if authenticated
  return isAuthenticated();
};

export const enhancedGetTokenInfo = () => {
  if (useEnhancedAuth && enhancedTokenManager) {
    return enhancedTokenManager.getTokenInfo();
  }
  
  // Legacy token info
  const token = getToken();
  if (!token) {
    return { isValid: false, isExpired: true, timeToExpiry: 0, shouldRefresh: true };
  }
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { isValid: false, isExpired: true, timeToExpiry: 0, shouldRefresh: true };
    }
    
    const payload = JSON.parse(atob(parts[1]));
    if (!payload.exp) {
      return { isValid: true, isExpired: false, timeToExpiry: Infinity, shouldRefresh: false };
    }
    
    const expDate = new Date(payload.exp * 1000);
    const now = new Date();
    const timeToExpiry = expDate.getTime() - now.getTime();
    const isExpired = timeToExpiry <= 0;
    const shouldRefresh = timeToExpiry <= TOKEN_REFRESH_THRESHOLD && timeToExpiry > 0;
    
    return {
      isValid: true,
      isExpired,
      timeToExpiry,
      shouldRefresh,
      expiryDate: expDate,
      payload
    };
  } catch (error) {
    return { isValid: false, isExpired: true, timeToExpiry: 0, shouldRefresh: true };
  }
};

// Enhanced debug function
export const enhancedDebugTokenStatus = () => {
  if (useEnhancedAuth && enhancedTokenManager) {
    return enhancedTokenManager.getDebugInfo();
  }
  
  // Legacy debug info
  const tokenInfo = enhancedGetTokenInfo();
  return {
    tokenInfo,
    isAuthenticated: isAuthenticated(),
    isVendor: isVendor(),
    vendorId: getVendorId(),
    isRefreshing: false,
    retryCount: 0,
    queuedRequests: 0,
    lastRefreshTime: 0,
    system: 'legacy'
  };
};

// Export the enhanced versions
export { enhancedSetToken as setToken, enhancedClearToken as clearToken };

// Export enhanced token manager reference for direct access
export const getEnhancedTokenManager = () => enhancedTokenManager;
export const isEnhancedAuthAvailable = () => useEnhancedAuth;
