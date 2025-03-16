import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  // Use refs to prevent duplicate API requests
  const isProcessingRef = useRef(false);
  const successRef = useRef(false);
  
  useEffect(() => {
    // Prevent multiple auth attempts with the same code
    if (isProcessingRef.current || successRef.current) {
      console.log('Already processing or completed auth, skipping');
      return;
    }
    
    const handleAuthCallback = async () => {
      isProcessingRef.current = true;
      
      try {
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        
        console.log('Auth callback triggered:', {
          hasCode: !!code,
          stateHint: state ? state.substring(0, 10) + '...' : 'missing'
        });
        
        // Facebook often redirects with #_=_ hash
        if (location.hash === '#_=_' && !code) {
          throw new Error('No authorization code received from Facebook');
        }
        
        if (!code) {
          throw new Error('No authorization code received');
        }

        // Determine provider from state
        const isFacebookLogin = state?.includes('facebook') || location.hash.includes('#_=_');
        const provider = isFacebookLogin ? 'facebook' : 'google';
        
        // Build the exact same redirect URI that was used in the initial auth request
        const redirectUri = `https://${window.location.host}/auth/callback`;
        
        // Create a single axios instance just for this request to avoid interceptors
        const baseURL = import.meta.env.VITE_API_BASE_URL;
        const callbackEndpoint = `${baseURL}/api/users/auth/${provider}/callback/`;
        
        // Create a CancelToken to abort if needed
        const source = axios.CancelToken.source();
        const timeoutId = setTimeout(() => source.cancel('Request timeout'), 15000);
        
        try {
          // Direct axios call without using the api instance to avoid interceptors
          const response = await axios({
            method: 'post',
            url: callbackEndpoint,
            data: {
              code,
              redirect_uri: redirectUri,
              state
            },
            cancelToken: source.token,
            // Don't send any tokens with this request
            headers: {
              'Content-Type': 'application/json',
              'Authorization': undefined
            }
          });

          clearTimeout(timeoutId);
          
          // Mark as successful
          successRef.current = true;
          
          // Extract and normalize token data
          const tokens = {
            access: response.data.token || response.data.access,
            refresh: response.data.refresh
          };
          
          // Only proceed if we have valid tokens
          if (!tokens.access || !tokens.refresh) {
            throw new Error('Invalid token data received');
          }
          
          // Store tokens in localStorage
          localStorage.setItem('authTokens', JSON.stringify(tokens));
          
          // Login with the tokens
          await login(tokens);
          
          // Success - go to homepage
          navigate('/', {
            replace: true,
            state: { 
              authSuccess: true,
              message: 'Login successful!' 
            }
          });
        } catch (requestError) {
          if (axios.isCancel(requestError)) {
            console.log('Request canceled:', requestError.message);
            throw new Error('Request timeout - please try again');
          }
          throw requestError;
        }
      } catch (error) {
        console.error('Auth callback error:', error.message);
        
        // Redirect to home with error message
        navigate('/', {
          replace: true,
          state: { 
            authSuccess: false,
            error: `Authentication failed: ${error.message}` 
          }
        });
      }
    };

    handleAuthCallback();
    
    // When component unmounts, clean up
    return () => {
      isProcessingRef.current = false;
    };
  }, []); // Empty dependency array - execute once only on mount

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Completing login...</p>
        <small className="text-muted mt-2">Please wait while we process your request.</small>
      </div>
    </div>
  );
}
