import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { setToken } from '../utils/auth';

function OAuthCallback() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = import.meta.env.VITE_API_URL || 'https://api.bazro.ge'; // Update with production URL

  useEffect(() => {
    const processOAuthCallback = async () => {
      try {
        // Get the authorization code from the URL
        const urlParams = new URLSearchParams(location.search);
        const authCode = urlParams.get('code');
        const state = urlParams.get('state');
        
        // Determine provider from state parameter
        const provider = state && state.includes('facebook') ? 'facebook' : 'google';
        
        if (!authCode) {
          throw new Error('No authorization code received');
        }

        console.log(`Processing ${provider} OAuth callback with code: ${authCode.substring(0, 10)}...`);
        
        // Use the correct API URL and include credentials
        const response = await fetch(`${API_URL}/api/users/auth/${provider}/callback/`, {
          method: 'POST',
          credentials: 'include', // Important for CORS
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: authCode,
            redirect_uri: window.location.origin + '/auth/callback',
            state: state
          }),
        });

        if (!response.ok) {
          let errorMessage = 'Failed to authenticate';
          try {
            const errorData = await response.json();
            errorMessage = errorData.detail || errorData.error || errorMessage;
          } catch (e) {
            console.error('Error parsing error response:', e);
          }
          throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log('OAuth authentication successful');

        // Check if user is a vendor
        if (!data.user?.profile?.user_type || data.user.profile.user_type !== 'vendor') {
          throw new Error('Access denied. Only vendors can access the admin panel.');
        }

        // Store tokens and user data
        setToken(
          data.token, 
          data.refresh, 
          {
            username: data.user.username,
            email: data.user.email,
            firstName: data.user.firstName || data.user.first_name,
            lastName: data.user.lastName || data.user.last_name,
            profile: data.user.profile
          }
        );

        // Redirect to dashboard
        navigate('/');
      } catch (err) {
        console.error('OAuth callback error:', err);
        setError(err.message || 'Authentication failed');
        setTimeout(() => {
          navigate('/login', { state: { error: err.message } });
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    processOAuthCallback();
  }, [navigate, location]);

  if (loading) {
    return (
      <div className="auth-loading-container" style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        background: '#f8f9fa'
      }}>
        <div className="loading-spinner" style={{ marginBottom: '20px' }}>
          <div className="preloading"><span></span></div>
        </div>
        <div style={{ fontSize: '18px', color: '#333' }}>
          Processing your login...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="auth-error-container" style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        background: '#f8f9fa'
      }}>
        <div style={{ 
          padding: '20px', 
          background: '#fff', 
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          maxWidth: '500px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#e74c3c', marginBottom: '15px' }}>Authentication Failed</h3>
          <p style={{ marginBottom: '20px' }}>{error}</p>
          <div>Redirecting to login page...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-success-container" style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      background: '#f8f9fa'
    }}>
      <div style={{ 
        padding: '20px', 
        background: '#fff', 
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        maxWidth: '500px',
        textAlign: 'center'
      }}>
        <h3 style={{ color: '#2ecc71', marginBottom: '15px' }}>Login Successful</h3>
        <p style={{ marginBottom: '20px' }}>You are now being redirected to the dashboard.</p>
      </div>
    </div>
  );
}

export default OAuthCallback;
