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
        // Get code from URL and determine provider
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        
        console.log('Auth callback params:', { code, state });

        if (!code) {
          throw new Error('No authorization code received');
        }

        const provider = state?.includes('facebook') ? 'facebook' : 'google';
        const baseURL = import.meta.env.VITE_API_BASE_URL;
        const callbackEndpoint = `${baseURL}/api/users/auth/${provider}/callback/`;

        console.log('Calling endpoint:', callbackEndpoint);

        const response = await axios.post(callbackEndpoint, {
          code,
          redirect_uri: window.location.origin + '/auth/callback',
          state
        });

        console.log('Auth callback response:', response.data);

        if (!response.data.token) {
          throw new Error('No token received from server');
        }

        // Store authentication data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('refreshToken', response.data.refresh);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Update auth context
        await login(response.data);
        
        // Navigate home
        navigate('/', { replace: true });

      } catch (error) {
        console.error('Auth callback error:', error);
        console.error('Error response:', error.response?.data);
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
