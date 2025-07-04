import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import api from '../services/api';

export default function AuthRecovery() {
  const { user, loading } = useAuth();
  const [recovery, setRecovery] = useState({ attempting: false, error: null, success: false });

  const attemptTokenRecovery = async () => {
    setRecovery({ attempting: true, error: null, success: false });
    
    try {
      const storedTokens = localStorage.getItem('authTokens');
      if (!storedTokens) {
        throw new Error('No tokens found in localStorage');
      }
      
      const tokens = JSON.parse(storedTokens);
      if (!tokens.access) {
        throw new Error('No access token found');
      }
      
      // Try to fetch profile with stored token
      console.log('Attempting to fetch profile with stored token...');
      const response = await api.get('/api/users/profile/', {
        headers: { Authorization: `Bearer ${tokens.access}` }
      });
      
      console.log('Profile fetch successful:', response.data);
      setRecovery({ attempting: false, error: null, success: true });
      
      // Force page reload to reinitialize auth context
      setTimeout(() => window.location.reload(), 1000);
      
    } catch (error) {
      console.error('Token recovery failed:', error);
      setRecovery({ 
        attempting: false, 
        error: error.response?.data?.detail || error.message, 
        success: false 
      });
    }
  };

  const clearAuthAndRedirect = () => {
    localStorage.removeItem('authTokens');
    localStorage.removeItem('userProfile');
    window.location.href = '/login';
  };

  if (user || loading) {
    return null; // Don't show if user is loaded or still loading
  }

  return (
    <div style={{ 
      position: 'fixed', 
      top: '50%', 
      left: '50%', 
      transform: 'translate(-50%, -50%)',
      background: 'white', 
      padding: '20px', 
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      zIndex: 10000,
      maxWidth: '400px',
      textAlign: 'center'
    }}>
      <h3 style={{ color: '#dc3545', marginBottom: '15px' }}>🔐 Authentication Issue</h3>
      
      <p style={{ marginBottom: '15px', color: '#666' }}>
        You appear to be logged in, but we're having trouble verifying your session.
      </p>
      
      {recovery.attempting && (
        <p style={{ color: '#007bff' }}>🔄 Attempting to recover your session...</p>
      )}
      
      {recovery.error && (
        <div style={{ 
          background: '#f8d7da', 
          color: '#721c24', 
          padding: '10px', 
          borderRadius: '4px',
          marginBottom: '15px',
          fontSize: '14px'
        }}>
          <strong>Error:</strong> {recovery.error}
        </div>
      )}
      
      {recovery.success && (
        <div style={{ 
          background: '#d4edda', 
          color: '#155724', 
          padding: '10px', 
          borderRadius: '4px',
          marginBottom: '15px'
        }}>
          ✅ Session recovered! Reloading page...
        </div>
      )}
      
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button 
          onClick={attemptTokenRecovery}
          disabled={recovery.attempting}
          style={{ 
            padding: '8px 16px', 
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: recovery.attempting ? 'not-allowed' : 'pointer',
            opacity: recovery.attempting ? 0.6 : 1
          }}
        >
          🔄 Retry Login
        </button>
        
        <button 
          onClick={clearAuthAndRedirect}
          style={{ 
            padding: '8px 16px', 
            background: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🚪 Fresh Login
        </button>
      </div>
      
      <small style={{ display: 'block', marginTop: '10px', color: '#999' }}>
        This usually happens due to expired tokens or connection issues.
      </small>
    </div>
  );
}
