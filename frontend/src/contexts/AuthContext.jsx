import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Verify token and get user data
          const response = await api.get('/api/users/profile/');
          setUser(response.data);
        } catch (error) {
          // Token validation failed - clear everything
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (authData) => {
    try {
      const userData = authData.user || authData;
      
      // Set token in localStorage and axios defaults
      if (authData.token) {
        localStorage.setItem('token', authData.token);
        localStorage.setItem('refreshToken', authData.refresh);
        api.defaults.headers.common.Authorization = `Bearer ${authData.token}`;
      }
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Instead of redirecting immediately, return true so the calling component can handle redirection
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    // Perform logout actions without redirecting
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    delete api.defaults.headers.common.Authorization;
    
    // Return true to indicate success (calling component will handle redirect)
    return true;
  };

  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};