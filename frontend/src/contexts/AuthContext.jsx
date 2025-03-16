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

  // This effect only runs once during initial load
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
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [authTokens]); // Only depend on authTokens, not user

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
    if (tokenRefreshing) return false;
    
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
      return true;
    } catch (error) {
      console.error('Error refreshing token manually:', error);
      logout();
      return false;
    } finally {
      setTokenRefreshing(false);
    }
  };

  // Check token expiration only once per 10 minutes, not continuously
  useEffect(() => {
    if (!authTokens?.access) return;

    // Helper function to decode token and get expiration time
    const getTokenExpiration = (token) => {
      try {
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) return 0;
        
        const payload = JSON.parse(atob(tokenParts[1]));
        return payload.exp * 1000; // Convert to milliseconds
      } catch (error) {
        console.error('Error decoding token:', error);
        return 0;
      }
    };
    
    const checkTokenExpiration = async () => {
      try {
        const exp = getTokenExpiration(authTokens.access);
        const now = Date.now();
        
        // If token expires in less than 5 minutes, refresh it
        if (exp - now < 5 * 60 * 1000) {
          console.log('Token expiring soon, refreshing...');
          await refreshToken();
        }
      } catch (error) {
        console.error('Error checking token expiration:', error);
      }
    };

    // Run once on mount and then every 10 minutes
    checkTokenExpiration();
    
    // Much longer interval to prevent constant checking
    const interval = setInterval(checkTokenExpiration, 10 * 60 * 1000); // 10 minutes
    
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