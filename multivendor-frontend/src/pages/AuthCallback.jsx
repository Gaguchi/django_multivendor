import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');
    const rawState = searchParams.get('state');
    const error = searchParams.get('error');

    // Detect if this is a Facebook callback by checking URL parameters
    const isFacebookCallback = location.search.includes('granted_scopes') || 
                             location.hash.includes('#_=_');
    
    const provider = isFacebookCallback ? 'facebook' : 'google';
    
    console.log('AuthCallback debug:', {
      code: code?.substring(0, 10) + '...',
      rawState,
      provider,
      isFacebookCallback,
      fullUrl: window.location.href
    });

    if (error) {
      console.error(`${provider} OAuth error:`, error);
      navigate('/login');
      return;
    }

    if (code) {
      console.log(`Processing ${provider} auth code`);
      
      const callbackEndpoint = `${import.meta.env.VITE_API_BASE_URL}/api/users/auth/${provider}/callback/`;
      console.log(`Calling ${provider} callback endpoint:`, callbackEndpoint);

      axios.post(callbackEndpoint, {
        code,
        redirect_uri: `${window.location.origin}/auth/callback`,
        state: rawState
      })
      .then(response => {
        console.log(`${provider} callback response:`, response.data);
        if (response.data.token) {
          const { token, refresh, user } = response.data;
          localStorage.setItem('token', token);
          localStorage.setItem('refreshToken', refresh);
          localStorage.setItem('user', JSON.stringify(user));
          login({ token, user });
          navigate('/');
        }
      })
      .catch(error => {
        console.error(`${provider} authentication error:`, {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          provider
        });
        navigate('/login');
      });
    }
  }, [location, navigate, login]);

  return <div>Processing authentication...</div>;
};

export default AuthCallback;
