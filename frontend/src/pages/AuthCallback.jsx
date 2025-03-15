import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        
        // Check for redirect from Facebook with no code (error case)
        if (location.hash === '#_=_' && !code) {
          // Go to homepage with error state
          navigate('/', { 
            replace: true,
            state: { 
              authSuccess: false,
              error: 'Authentication failed. Please try again.' 
            }
          });
          return;
        }
        
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
          // Go to homepage with error state, no redirect loop
          navigate('/', { 
            replace: true,
            state: { 
              authSuccess: false,
              error: 'No authorization code received' 
            }
          });
          return;
        }

        const baseURL = import.meta.env.VITE_API_BASE_URL;
        const callbackEndpoint = `${baseURL}/api/users/auth/${provider}/callback/`;

        const response = await axios.post(callbackEndpoint, {
          code,
          redirect_uri: window.location.origin + '/auth/callback',
          state
        });

        // Store auth data correctly in localStorage to match what's expected in the app
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('refreshToken', response.data.refresh);
        
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        // Update auth context
        await login({
          token: response.data.token,
          access: response.data.token, // Include both formats to ensure compatibility
          refresh: response.data.refresh,
          user: response.data.user
        });
        
        // Navigate home
        navigate('/', { 
          replace: true,
          state: { 
            authSuccess: true,
            message: 'Successfully logged in!' 
          }
        });

      } catch (error) {
        console.error('Auth callback error:', error);
        
        // Always go to homepage, not login page
        navigate('/', { 
          replace: true,
          state: { 
            authSuccess: false,
            error: 'Authentication failed. Please try again.' 
          }
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
