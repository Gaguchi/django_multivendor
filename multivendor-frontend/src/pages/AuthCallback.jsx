import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      console.error('Google OAuth error:', error);
      navigate('/login');
      return;
    }

    if (code) {
      console.log('Received auth code:', code);
      // Send the code to your backend
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/auth/google/callback/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          code,
          redirect_uri: 'http://localhost:5173/auth/callback'
        }),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('refreshToken', data.refresh);
          navigate('/');
        } else {
          throw new Error('No token received');
        }
      })
      .catch(error => {
        console.error('Authentication error:', error);
        navigate('/login');
      });
    }
  }, [location, navigate]);

  return (
    <div>
      Processing authentication...
    </div>
  );
};

export default AuthCallback;
