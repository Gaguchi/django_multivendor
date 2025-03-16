import { useState } from 'react';

export default function OAuthDebug() {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const [logs, setLogs] = useState([{
    time: new Date().toISOString(),
    message: 'OAuth Debug Page Loaded'
  }]);
  
  const addLog = (message) => {
    setLogs(prev => [
      ...prev,
      { time: new Date().toISOString(), message }
    ]);
  };
  
  // Test with different redirect URIs
  const redirectUris = [
    `https://${window.location.host}/auth/callback`,
    `http://${window.location.host}/auth/callback`,
    'https://shop.bazro.ge/auth/callback'
  ];
  
  const testRedirectUri = (uri) => {
    addLog(`Testing redirect URI: ${uri}`);
    // Just log for debug purposes
    console.log(`Would use: ${uri}`);
    addLog(`Origin: ${window.location.origin}`);
    addLog(`Host: ${window.location.host}`);
  };
  
  return (
    <div className="container py-5">
      <h1>OAuth Debug</h1>
      
      <div className="card mb-4">
        <div className="card-header">Environment Info</div>
        <div className="card-body">
          <p><strong>API Base URL:</strong> {baseURL}</p>
          <p><strong>Current Origin:</strong> {window.location.origin}</p>
          <p><strong>Current Host:</strong> {window.location.host}</p>
          <p><strong>OAuth Redirect URI:</strong> {import.meta.env.VITE_REDIRECT_URI}</p>
        </div>
      </div>
      
      <div className="card mb-4">
        <div className="card-header">Test Redirect URIs</div>
        <div className="card-body d-flex gap-2">
          {redirectUris.map((uri, index) => (
            <button 
              key={index} 
              className="btn btn-outline-primary"
              onClick={() => testRedirectUri(uri)}
            >
              Test {uri.includes('https') ? 'HTTPS' : 'HTTP'} URI
            </button>
          ))}
        </div>
      </div>
      
      <div className="card">
        <div className="card-header">Debug Logs</div>
        <div className="card-body">
          <pre style={{maxHeight: '400px', overflow: 'auto'}}>
            {logs.map((log, index) => (
              <div key={index}>
                [{log.time}] {log.message}
              </div>
            ))}
          </pre>
        </div>
      </div>
    </div>
  );
}
