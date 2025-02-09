import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        
        // Detect Facebook login by checking state or URL parameters
        const isFacebookLogin = state?.includes('facebook') || 
                              location.search.includes('granted_scopes') || 
                              location.hash.includes('#_=_');
        
        const provider = isFacebookLogin ? 'facebook' : 'google';
        
        console.log('Auth callback details:', {
          code: code?.substring(0, 10) + '...',
          state,
          provider,
          isFacebookLogin,
          fullUrl: window.location.href
        });

        if (!code) {
          throw new Error('No authorization code received');
        }

        const baseURL = import.meta.env.VITE_API_BASE_URL;
        const callbackEndpoint = `${baseURL}/api/users/auth/${provider}/callback/`;

        const response = await axios.post(callbackEndpoint, {
          code,
          redirect_uri: window.location.origin + '/auth/callback',
          state
        });

        // Store auth data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('refreshToken', response.data.refresh);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Update auth context
        await login(response.data);
        
        // Navigate home
        navigate('/', { replace: true });

      } catch (error) {
        console.error('Auth callback error:', error);
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        navigate('/login', { 
          replace: true,
          state: { error: 'Authentication failed. Please try again.' } 
        });
      }
    };

    handleAuthCallback();
  }, [login, location, navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Completing login...</p>
      </div>
    </div>
  );
}
