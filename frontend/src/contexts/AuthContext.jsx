import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokenRefreshing, setTokenRefreshing] = useState(false);
  const [authTokens, setAuthTokens] = useState(() => {
    const tokens = localStorage.getItem('authTokens');
    return tokens ? JSON.parse(tokens) : null;
  });

  useEffect(() => {
    const loadUser = async () => {
      if (authTokens) {
        try {
          const response = await api.get('/api/users/profile/', {
            headers: { Authorization: `Bearer ${authTokens.access}` }
          });
          const userData = {
            ...response.data,
            firstName: response.data.profile?.first_name,
            lastName: response.data.profile?.last_name,
          };
          setUser(userData);
        } catch (error) {
          console.error('Error loading user initially:', error);
          if (error.response?.status === 401) {
            logout();
          }
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (data) => {
    let loggedInUserData = null;
    try {
      console.log('[AuthContext] Login data received:', data);
      const tokens = {
        access: data.access || data.token,
        refresh: data.refresh,
      };

      if (!tokens.access) {
        console.error('[AuthContext] Invalid token data received:', data);
        throw new Error('No access token provided');
      }

      console.log('[AuthContext] Storing tokens:', tokens);
      localStorage.setItem('authTokens', JSON.stringify(tokens));
      setAuthTokens(tokens);

      try {
        const profileResponse = await api.get('/api/users/profile/', {
          headers: { Authorization: `Bearer ${tokens.access}` }
        });
        loggedInUserData = {
          ...profileResponse.data,
          firstName: profileResponse.data.profile?.first_name,
          lastName: profileResponse.data.profile?.last_name,
        };
        console.log('[AuthContext] Setting user data after profile fetch:', loggedInUserData);
        setUser(loggedInUserData);
      } catch (profileError) {
        console.error("[AuthContext] Failed to fetch user profile after login:", profileError);
        logout();
        throw new Error("Failed to verify user profile after login.");
      }

      const guestSessionKey = localStorage.getItem('guestSessionKey');
      if (guestSessionKey) {
        console.log('[AuthContext] Guest session key found, attempting merge:', guestSessionKey);
        try {
          await api.post('/api/cart/carts/merge_cart/', {
            session_key: guestSessionKey
          });
          console.log('[AuthContext] Backend merge_cart called successfully.');
          localStorage.removeItem('guestSessionKey');
          console.log('[AuthContext] Guest session key removed from localStorage.');
        } catch (mergeError) {
          console.error('[AuthContext] Error calling merge_cart endpoint:', mergeError);
          localStorage.removeItem('guestSessionKey');
          console.warn('[AuthContext] Guest session key removed even after merge error to prevent retries.');
        }
      } else {
        console.log('[AuthContext] No guest session key found, skipping merge.');
      }

      return loggedInUserData;

    } catch (error) {
      console.error('[AuthContext] Error during login process:', error);
      logout();
      throw error;
    }
  };

  const logout = () => {
    console.log('[AuthContext] Logging out user.');
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
        headers: { 'Authorization': '' }
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

  useEffect(() => {
    if (!authTokens?.access) return;

    const getTokenExpiration = (token) => {
      try {
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) return 0;

        const payload = JSON.parse(atob(tokenParts[1]));
        return payload.exp * 1000;
      } catch (error) {
        console.error('Error decoding token:', error);
        return 0;
      }
    };

    const checkTokenExpiration = async () => {
      try {
        const exp = getTokenExpiration(authTokens.access);
        const now = Date.now();

        if (exp - now < 5 * 60 * 1000) {
          console.log('Token expiring soon, refreshing...');
          await refreshToken();
        }
      } catch (error) {
        console.error('Error checking token expiration:', error);
      }
    };

    checkTokenExpiration();

    const interval = setInterval(checkTokenExpiration, 10 * 60 * 1000);

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