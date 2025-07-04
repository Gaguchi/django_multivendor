import { useAuth } from '../contexts/AuthContext';

export default function AuthDebugger() {
  const { user, loading } = useAuth();
  
  // Get tokens directly from localStorage
  const storedTokens = localStorage.getItem('authTokens');
  let parsedTokens = null;
  try {
    parsedTokens = storedTokens ? JSON.parse(storedTokens) : null;
  } catch (e) {
    console.error('Error parsing stored tokens:', e);
  }
  
  const debugInfo = {
    user: user ? {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    } : 'Not authenticated',
    loading: loading ? 'Loading...' : 'Loaded',
    storedTokens: parsedTokens ? {
      hasAccess: !!parsedTokens.access,
      hasRefresh: !!parsedTokens.refresh,
      accessToken: parsedTokens.access ? `${parsedTokens.access.substring(0, 20)}...` : 'None'
    } : 'No tokens in localStorage',
    localStorage: {
      authTokens: localStorage.getItem('authTokens') ? 'Present' : 'Missing',
      userProfile: localStorage.getItem('userProfile') ? 'Present' : 'Missing'
    },
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'Default (api.bazro.ge)',
    currentUrl: window.location.href
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      right: 0, 
      background: 'rgba(0, 0, 0, 0.9)', 
      color: 'white', 
      padding: '10px', 
      fontSize: '11px',
      zIndex: 9999,
      maxWidth: '400px',
      maxHeight: '500px',
      overflow: 'auto',
      borderRadius: '0 0 0 8px'
    }}>
      <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>🔍 Auth Debug</h4>
      <pre style={{ margin: 0, fontSize: '10px', lineHeight: '1.2' }}>
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
      <button 
        onClick={() => window.location.reload()} 
        style={{ 
          marginTop: '10px', 
          padding: '5px 10px', 
          fontSize: '10px',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '3px',
          cursor: 'pointer'
        }}
      >
        🔄 Reload Page
      </button>
    </div>
  );
}
