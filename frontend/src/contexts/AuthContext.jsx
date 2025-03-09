import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authTokens, setAuthTokens] = useState(() => {
    // Try to get tokens from localStorage on initial load
    const tokens = localStorage.getItem('authTokens');
    return tokens ? JSON.parse(tokens) : null;
  });

  // Set up axios interceptor for authentication
  useEffect(() => {
    if (authTokens) {
      // Set default Authorization header for all requests
      api.defaults.headers.common['Authorization'] = `Bearer ${authTokens.access}`;
    } else {
      // Remove Authorization header if no tokens
      delete api.defaults.headers.common['Authorization'];
    }
  }, [authTokens]);

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
          // If token is invalid, logout user
          if (error.response && error.response.status === 401) {
            logout();
          }
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [authTokens]);

  const login = async (data) => {
    // Store tokens in localStorage and state
    const tokens = {
      access: data.access || data.token,
      refresh: data.refresh,
    };
    localStorage.setItem('authTokens', JSON.stringify(tokens));
    setAuthTokens(tokens);

    // Set the user data
    const userData = {
      username: data.username || data.user?.username,
      email: data.email || data.user?.email,
      firstName: data.firstName || data.user?.firstName || data.userprofile?.first_name,
      lastName: data.lastName || data.user?.lastName || data.userprofile?.last_name,
      id: data.id || data.user?.id,
      profile: data.userprofile || data.user?.profile,
    };
    setUser(userData);

    return userData;
  };

  const logout = () => {
    // Clear tokens and user data
    localStorage.removeItem('authTokens');
    setAuthTokens(null);
    setUser(null);
  };

  const refreshToken = async () => {
    if (!authTokens?.refresh) return false;

    try {
      const response = await api.post('/api/token/refresh/', {
        refresh: authTokens.refresh,
      });

      const newTokens = {
        access: response.data.access,
        refresh: authTokens.refresh,
      };
      
      localStorage.setItem('authTokens', JSON.stringify(newTokens));
      setAuthTokens(newTokens);
      return true;
    } catch (error) {
      console.error('Error refreshing token:', error);
      logout();
      return false;
    }
  };

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