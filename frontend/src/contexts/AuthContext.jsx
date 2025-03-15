import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokenRefreshing, setTokenRefreshing] = useState(false);
  const [authTokens, setAuthTokens] = useState(() => {
    // Try to get tokens from localStorage on initial load
    const tokens = localStorage.getItem('authTokens');
    return tokens ? JSON.parse(tokens) : null;
  });

  // Set up axios interceptor for authentication
  useEffect(() => {
    // Request interceptor - set token on every request
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        if (authTokens?.access) {
          config.headers.Authorization = `Bearer ${authTokens.access}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle token expired errors
    const responseInterceptor = api.interceptors.response.use(
      (response) => response, 
      async (error) => {
        const originalRequest = error.config;
        
        // If error is 401 Unauthorized and we have a refresh token and haven't tried refreshing yet
        if (error.response?.status === 401 && authTokens?.refresh && !originalRequest._retry) {
          // Prevent multiple simultaneous refresh attempts
          if (tokenRefreshing) {
            // Wait for the refresh to complete
            await new Promise(resolve => {
              const checkComplete = () => {
                if (!tokenRefreshing) {
                  resolve();
                } else {
                  setTimeout(checkComplete, 100);
                }
              };
              checkComplete();
            });
            // Add the new token to the request
            if (authTokens?.access) {
              originalRequest.headers.Authorization = `Bearer ${authTokens.access}`;
              return api(originalRequest);
            }
          }

          originalRequest._retry = true;
          setTokenRefreshing(true);
          
          try {
            // Try to refresh token
            const response = await api.post('/api/token/refresh/', {
              refresh: authTokens.refresh,
            }, {
              headers: { 'Authorization': '' } // Don't send current token for refresh
            });

            const newTokens = {
              access: response.data.access,
              refresh: authTokens.refresh, // Keep existing refresh token
            };
            
            // Update tokens in localStorage and state
            localStorage.setItem('authTokens', JSON.stringify(newTokens));
            setAuthTokens(newTokens);
            
            // Retry the original request with new token
            originalRequest.headers.Authorization = `Bearer ${newTokens.access}`;
            setTokenRefreshing(false);
            return api(originalRequest);
          } catch (refreshError) {
            console.error('Error refreshing token:', refreshError);
            // If refresh fails, logout
            setTokenRefreshing(false);
            logout();
            return Promise.reject(refreshError);
          }
        }
        
        // If it's another error or refresh token doesn't exist, reject
        return Promise.reject(error);
      }
    );

    // Clean up interceptors when component unmounts
    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [authTokens, tokenRefreshing]);

  // Check if user is authenticated on initial load
  useEffect(() => {
    const loadUser = async () => {
      if (authTokens) {
        try {
          const response = await api.get('/api/users/profile/');
          const userData = {
            ...response.data,
            firstName: response.data.profile?.first_name,
            lastName: response.data.profile?.last_name,
          };
          setUser(userData);
        } catch (error) {
          console.error('Error loading user:', error);
          // Don't logout here - the interceptor will handle token refresh if needed
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [authTokens]);

  const login = async (data) => {
    try {
      console.log('Login data received:', data);
      
      // Handle both token formats (string or object)
      const tokens = {
        access: data.access || data.token,
        refresh: data.refresh,
      };
      
      // Validate tokens before storing
      if (!tokens.access) {
        console.error('Invalid token data received:', data);
        throw new Error('No access token provided');
      }
      
      console.log('Storing tokens:', tokens);
      
      // Store tokens first to ensure they're available
      localStorage.setItem('authTokens', JSON.stringify(tokens));
      setAuthTokens(tokens);
  
      // Set the user data with a more robust approach to handle different formats
      const userData = {
        username: data.username || data.user?.username || '',
        email: data.email || data.user?.email || '',
        firstName: data.firstName || data.user?.firstName || data.userprofile?.first_name || data.user?.profile?.first_name || '',
        lastName: data.lastName || data.user?.lastName || data.userprofile?.last_name || data.user?.profile?.last_name || '',
        id: data.id || data.user?.id || '',
        profile: data.userprofile || data.user?.profile || {},
      };
      
      console.log('Setting user data:', userData);
      setUser(userData);
  
      return userData;
    } catch (error) {
      console.error('Error during login:', error);
      // Don't automatically logout on error, just report the error
      throw error;
    }
  };

  const logout = () => {
    // Clear tokens and user data
    localStorage.removeItem('authTokens');
    setAuthTokens(null);
    setUser(null);
  };

  const refreshToken = async () => {
    if (!authTokens?.refresh) return false;
    setTokenRefreshing(true);

    try {
      const response = await api.post('/api/token/refresh/', {
        refresh: authTokens.refresh,
      }, {
        headers: { 'Authorization': '' } // Don't send current token for refresh
      });

      const newTokens = {
        access: response.data.access,
        refresh: response.data.refresh || authTokens.refresh,
      };
      
      localStorage.setItem('authTokens', JSON.stringify(newTokens));
      setAuthTokens(newTokens);
      setTokenRefreshing(false);
      return true;
    } catch (error) {
      console.error('Error refreshing token manually:', error);
      logout();
      setTokenRefreshing(false);
      return false;
    }
  };

  // Check if token is about to expire and refresh it preemptively
  useEffect(() => {
    if (!authTokens?.access) return;

    const checkTokenExpiration = async () => {
      try {
        // Get the expiration from the JWT (without using a library)
        const tokenParts = authTokens.access.split('.');
        if (tokenParts.length !== 3) throw new Error('Invalid token format');
        
        const payload = JSON.parse(atob(tokenParts[1]));
        const exp = payload.exp * 1000; // Convert to milliseconds
        const now = Date.now();
        
        // If token expires in less than 5 minutes, refresh it
        if (exp - now < 5 * 60 * 1000) {
          await refreshToken();
        }
      } catch (error) {
        console.error('Error checking token expiration:', error);
      }
    };

    // Check token expiration every minute
    const interval = setInterval(checkTokenExpiration, 60000);
    
    // Run once immediately
    checkTokenExpiration();
    
    return () => clearInterval(interval);
  }, [authTokens]);

  const value = {
    user,
    authTokens,
    login,
    logout,
    refreshToken,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);