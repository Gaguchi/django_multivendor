/**
 * Enhanced JWT Token Management Service
 * 
 * Industry-standard token management with:
 * - Automatic refresh before expiration
 * - Smart retry logic with exponential backoff
 * - Race condition prevention
 * - Comprehensive error handling
 * - Performance optimization
 */

// Configuration constants
const TOKEN_CONFIG = {
  ACCESS_TOKEN_KEY: 'admin_access_token',
  REFRESH_TOKEN_KEY: 'admin_refresh_token',
  USER_DATA_KEY: 'admin_user_data',
  VENDOR_ID_KEY: 'admin_vendor_id',
  
  // Timing configurations (in milliseconds)
  REFRESH_THRESHOLD: 5 * 60 * 1000,        // 5 minutes before expiry
  RETRY_DELAY_BASE: 1000,                  // Base delay for exponential backoff
  MAX_RETRY_ATTEMPTS: 3,                   // Maximum number of retry attempts
  MIN_REFRESH_INTERVAL: 30 * 1000,         // Minimum time between refresh attempts
  REFRESH_TIMEOUT: 10 * 1000,              // Timeout for refresh requests
  
  // Error codes
  ERROR_CODES: {
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',
    TOKEN_INVALID: 'TOKEN_INVALID',
    REFRESH_FAILED: 'REFRESH_FAILED',
    NETWORK_ERROR: 'NETWORK_ERROR',
    RATE_LIMITED: 'RATE_LIMITED',
    SERVER_ERROR: 'SERVER_ERROR'
  }
};

// Global state management
class TokenManager {
  constructor() {
    this.refreshPromise = null;
    this.refreshTimer = null;
    this.retryCount = 0;
    this.lastRefreshTime = 0;
    this.requestQueue = [];
    this.isRefreshing = false;
    this.listeners = new Set();
    
    // Initialize token management
    this.init();
  }
  
  /**
   * Initialize token management system
   */
  init() {
    this.scheduleTokenCheck();
    this.setupEventListeners();
    this.checkTokenOnInit();
  }
  
  /**
   * Check token status on initialization
   */
  checkTokenOnInit() {
    const tokenInfo = this.getTokenInfo();
    
    if (tokenInfo.isValid && !tokenInfo.isExpired) {
      if (tokenInfo.shouldRefresh) {
        console.log('Token needs immediate refresh on init');
        this.performRefresh();
      } else {
        console.log('Token is valid, scheduling next refresh');
        this.scheduleNextRefresh(tokenInfo.timeToExpiry);
      }
    } else if (tokenInfo.isExpired) {
      console.log('Token is expired on init, clearing auth');
      this.clearTokens();
    }
  }
  
  /**
   * Setup event listeners for token management
   */
  setupEventListeners() {
    // Listen for visibility changes to refresh when tab becomes active
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        console.log('Tab became visible, checking token status...');
        this.ensureValidToken();
      }
    });
    
    // Listen for storage changes (if user logs in/out in another tab)
    window.addEventListener('storage', (e) => {
      if (e.key === TOKEN_CONFIG.ACCESS_TOKEN_KEY) {
        if (e.newValue) {
          console.log('Token updated in another tab, reinitializing...');
          this.init();
        } else {
          console.log('Token cleared in another tab');
          this.clearRefreshTimer();
          this.notifyListeners('logout', { reason: 'external_logout' });
        }
      }
    });
    
    // Listen for online/offline events
    window.addEventListener('online', () => {
      console.log('Connection restored, checking token status...');
      this.ensureValidToken();
    });
  }
  
  /**
   * Get detailed token information
   */
  getTokenInfo() {
    const token = this.getAccessToken();
    
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
      const shouldRefresh = timeToExpiry <= TOKEN_CONFIG.REFRESH_THRESHOLD && timeToExpiry > 0;
      
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
  }
  
  /**
   * Ensure token is valid, refresh if needed
   */
  async ensureValidToken() {
    // Prevent multiple simultaneous refresh attempts
    if (this.refreshPromise) {
      console.log('Token refresh already in progress, waiting...');
      return await this.refreshPromise;
    }
    
    const tokenInfo = this.getTokenInfo();
    
    if (!tokenInfo.isValid || tokenInfo.isExpired) {
      console.log('Token is invalid or expired, attempting refresh...');
      return await this.performRefresh();
    }
    
    if (tokenInfo.shouldRefresh) {
      console.log(`Token expires in ${Math.round(tokenInfo.timeToExpiry / 1000)}s, refreshing proactively...`);
      return await this.performRefresh();
    }
    
    // Token is still valid and doesn't need refresh yet
    this.scheduleNextRefresh(tokenInfo.timeToExpiry);
    return true;
  }
  
  /**
   * Perform token refresh with comprehensive error handling
   */
  async performRefresh() {
    // Check if we're already refreshing
    if (this.refreshPromise) {
      return await this.refreshPromise;
    }
    
    // Check minimum refresh interval
    const now = Date.now();
    if (now - this.lastRefreshTime < TOKEN_CONFIG.MIN_REFRESH_INTERVAL) {
      console.log('Refresh attempted too soon, skipping');
      return false;
    }
    
    this.isRefreshing = true;
    this.lastRefreshTime = now;
    
    this.refreshPromise = this._executeRefresh();
    
    try {
      const result = await this.refreshPromise;
      this.retryCount = 0; // Reset retry count on success
      return result;
    } finally {
      this.refreshPromise = null;
      this.isRefreshing = false;
    }
  }
  
  /**
   * Execute the actual refresh logic
   */
  async _executeRefresh() {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      console.error('No refresh token available');
      this.clearTokens();
      this.notifyListeners('logout', { reason: 'no_refresh_token' });
      return false;
    }
    
    try {
      const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.bazro.ge';
      const refreshEndpoint = `${API_URL}/api/token/refresh/`;
      
      console.log('Attempting token refresh...');
      
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TOKEN_CONFIG.REFRESH_TIMEOUT);
      
      const response = await fetch(refreshEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ refresh: refreshToken }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Token refresh successful');
        
        // Store new tokens
        this.setAccessToken(data.access);
        if (data.refresh) {
          this.setRefreshToken(data.refresh);
        }
        
        // Schedule next refresh
        const newTokenInfo = this.getTokenInfo();
        if (newTokenInfo.isValid && !newTokenInfo.isExpired) {
          this.scheduleNextRefresh(newTokenInfo.timeToExpiry);
        }
        
        // Process queued requests
        this.processQueuedRequests(data.access);
        
        // Notify listeners
        this.notifyListeners('refresh_success', { token: data.access });
        
        return true;
      } else {
        // Handle specific error responses
        return await this._handleRefreshError(response);
      }
      
    } catch (error) {
      return await this._handleRefreshException(error);
    }
  }
  
  /**
   * Handle refresh error responses
   */
  async _handleRefreshError(response) {
    let errorData = null;
    
    try {
      errorData = await response.json();
    } catch (e) {
      console.error('Could not parse error response:', e);
    }
    
    const errorCode = errorData?.error_code || 'UNKNOWN_ERROR';
    const errorMessage = errorData?.detail || `HTTP ${response.status}`;
    
    console.error(`Token refresh failed: ${errorMessage} (${errorCode})`);
    
    switch (response.status) {
      case 401:
        // Token expired or invalid - clear tokens and logout
        this.clearTokens();
        this.notifyListeners('logout', { 
          reason: 'token_expired', 
          error: errorMessage,
          code: errorCode 
        });
        return false;
        
      case 429:
        // Rate limited - implement exponential backoff
        const retryAfter = errorData?.retry_after || this._calculateBackoffDelay();
        console.log(`Rate limited, retrying in ${retryAfter}ms`);
        
        setTimeout(() => {
          this.refreshPromise = null;
          this.performRefresh();
        }, retryAfter);
        
        return false;
        
      case 500:
      case 502:
      case 503:
        // Server error - retry with exponential backoff
        return await this._retryRefresh(errorMessage, errorCode);
        
      default:
        // Other errors - treat as permanent failure
        this.clearTokens();
        this.notifyListeners('logout', { 
          reason: 'refresh_failed', 
          error: errorMessage,
          code: errorCode 
        });
        return false;
    }
  }
  
  /**
   * Handle refresh exceptions (network errors, timeouts, etc.)
   */
  async _handleRefreshException(error) {
    console.error('Token refresh exception:', error);
    
    if (error.name === 'AbortError') {
      console.error('Token refresh timed out');
      return await this._retryRefresh('Request timeout', 'TIMEOUT');
    }
    
    if (error.name === 'TypeError' || error.message.includes('fetch')) {
      console.error('Network error during token refresh');
      return await this._retryRefresh('Network error', 'NETWORK_ERROR');
    }
    
    // Unknown error - treat as permanent failure
    this.clearTokens();
    this.notifyListeners('logout', { 
      reason: 'refresh_error', 
      error: error.message,
      code: 'UNKNOWN_ERROR' 
    });
    return false;
  }
  
  /**
   * Retry refresh with exponential backoff
   */
  async _retryRefresh(errorMessage, errorCode) {
    this.retryCount++;
    
    if (this.retryCount >= TOKEN_CONFIG.MAX_RETRY_ATTEMPTS) {
      console.error('Max refresh retries exceeded, logging out');
      this.clearTokens();
      this.notifyListeners('logout', { 
        reason: 'max_retries_exceeded', 
        error: errorMessage,
        code: errorCode 
      });
      return false;
    }
    
    const delay = this._calculateBackoffDelay();
    console.log(`Retrying token refresh in ${delay}ms (attempt ${this.retryCount}/${TOKEN_CONFIG.MAX_RETRY_ATTEMPTS})`);
    
    setTimeout(() => {
      this.refreshPromise = null;
      this.performRefresh();
    }, delay);
    
    return false;
  }
  
  /**
   * Calculate exponential backoff delay
   */
  _calculateBackoffDelay() {
    const baseDelay = TOKEN_CONFIG.RETRY_DELAY_BASE;
    const maxDelay = 30000; // 30 seconds max
    const delay = Math.min(baseDelay * Math.pow(2, this.retryCount - 1), maxDelay);
    
    // Add jitter to prevent thundering herd
    const jitter = Math.random() * 0.1 * delay;
    return delay + jitter;
  }
  
  /**
   * Schedule next automatic refresh
   */
  scheduleNextRefresh(timeToExpiry) {
    this.clearRefreshTimer();
    
    // Don't schedule if token is about to expire or already expired
    if (timeToExpiry <= TOKEN_CONFIG.REFRESH_THRESHOLD) {
      return;
    }
    
    // Schedule refresh before the threshold
    const refreshDelay = timeToExpiry - TOKEN_CONFIG.REFRESH_THRESHOLD;
    
    console.log(`Next token refresh scheduled in ${Math.round(refreshDelay / 1000)}s`);
    
    this.refreshTimer = setTimeout(() => {
      console.log('Scheduled token refresh triggered');
      this.performRefresh();
    }, refreshDelay);
  }
  
  /**
   * Schedule periodic token checks
   */
  scheduleTokenCheck() {
    // Check token status every minute
    setInterval(() => {
      if (!document.hidden) {
        this.ensureValidToken();
      }
    }, 60000);
  }
  
  /**
   * Clear refresh timer
   */
  clearRefreshTimer() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }
  
  /**
   * Process queued requests after successful refresh
   */
  processQueuedRequests(newToken) {
    const queue = [...this.requestQueue];
    this.requestQueue = [];
    
    queue.forEach(({ resolve, reject, originalRequest }) => {
      // Update authorization header
      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
      
      // Retry the original request
      fetch(originalRequest.url, originalRequest)
        .then(response => resolve(response))
        .catch(error => reject(error));
    });
  }
  
  /**
   * Add request to queue during refresh
   */
  queueRequest(originalRequest) {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ resolve, reject, originalRequest });
    });
  }
  
  /**
   * Add event listener for token events
   */
  addEventListener(listener) {
    this.listeners.add(listener);
  }
  
  /**
   * Remove event listener
   */
  removeEventListener(listener) {
    this.listeners.delete(listener);
  }
  
  /**
   * Notify all listeners of token events
   */
  notifyListeners(event, data) {
    this.listeners.forEach(listener => {
      try {
        listener(event, data);
      } catch (error) {
        console.error('Error in token event listener:', error);
      }
    });
  }
  
  // Token storage methods
  getAccessToken() {
    return localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
  }
  
  setAccessToken(token) {
    localStorage.setItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY, token);
  }
  
  getRefreshToken() {
    return localStorage.getItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY);
  }
  
  setRefreshToken(token) {
    localStorage.setItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY, token);
  }
  
  getUserData() {
    const userData = localStorage.getItem(TOKEN_CONFIG.USER_DATA_KEY);
    try {
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }
  
  setUserData(userData) {
    localStorage.setItem(TOKEN_CONFIG.USER_DATA_KEY, JSON.stringify(userData));
  }
  
  getVendorId() {
    return localStorage.getItem(TOKEN_CONFIG.VENDOR_ID_KEY);
  }
  
  setVendorId(vendorId) {
    localStorage.setItem(TOKEN_CONFIG.VENDOR_ID_KEY, vendorId);
  }
  
  /**
   * Set all tokens and user data
   */
  setTokens(accessToken, refreshToken, userData) {
    this.setAccessToken(accessToken);
    this.setRefreshToken(refreshToken);
    this.setUserData(userData);
    
    // Restart token management with new tokens
    this.init();
  }
  
  /**
   * Clear all tokens and user data
   */
  clearTokens() {
    localStorage.removeItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
    localStorage.removeItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_CONFIG.USER_DATA_KEY);
    localStorage.removeItem(TOKEN_CONFIG.VENDOR_ID_KEY);
    
    this.clearRefreshTimer();
    this.requestQueue = [];
    this.retryCount = 0;
  }
  
  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    const tokenInfo = this.getTokenInfo();
    return tokenInfo.isValid && !tokenInfo.isExpired;
  }
  
  /**
   * Check if user is a vendor
   */
  isVendor() {
    const userData = this.getUserData();
    return userData?.profile?.user_type === 'vendor';
  }
  
  /**
   * Get debug information
   */
  getDebugInfo() {
    const tokenInfo = this.getTokenInfo();
    return {
      tokenInfo,
      isAuthenticated: this.isAuthenticated(),
      isVendor: this.isVendor(),
      vendorId: this.getVendorId(),
      isRefreshing: this.isRefreshing,
      retryCount: this.retryCount,
      queuedRequests: this.requestQueue.length,
      lastRefreshTime: this.lastRefreshTime
    };
  }
  
  /**
   * Cleanup when destroying the instance
   */
  destroy() {
    this.clearRefreshTimer();
    this.listeners.clear();
    this.requestQueue = [];
  }
}

// Create singleton instance
const tokenManager = new TokenManager();

// Export public API
export {
  tokenManager,
  TOKEN_CONFIG
};

// Legacy compatibility exports
export const getToken = () => tokenManager.getAccessToken();
export const setToken = (accessToken, refreshToken, userData) => 
  tokenManager.setTokens(accessToken, refreshToken, userData);
export const clearToken = () => tokenManager.clearTokens();
export const isAuthenticated = () => tokenManager.isAuthenticated();
export const isVendor = () => tokenManager.isVendor();
export const getVendorId = () => tokenManager.getVendorId();
export const setVendorId = (vendorId) => tokenManager.setVendorId(vendorId);
export const refreshToken = () => tokenManager.performRefresh();
export const ensureValidToken = () => tokenManager.ensureValidToken();
export const debugTokenStatus = () => {
  const debugInfo = tokenManager.getDebugInfo();
  console.log('=== Enhanced Token Status Debug ===');
  console.log('Token info:', debugInfo.tokenInfo);
  console.log('Is authenticated:', debugInfo.isAuthenticated);
  console.log('Is vendor:', debugInfo.isVendor);
  console.log('Vendor ID:', debugInfo.vendorId);
  console.log('Is refreshing:', debugInfo.isRefreshing);
  console.log('Retry count:', debugInfo.retryCount);
  console.log('Queued requests:', debugInfo.queuedRequests);
  console.log('===================================');
  return debugInfo;
};

export default tokenManager;
