import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'
import App from './App' 
import { initializeExternalScripts } from './utils/loadScripts'

// Ensure React is properly available globally for debugging
if (typeof window !== 'undefined') {
  window.React = React
  window.ReactDOM = ReactDOM
}

// Initialize external scripts (jQuery, Bootstrap, etc.)
initializeExternalScripts() 

// Create a stable QueryClient instance to prevent unnecessary re-renders
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000,
      gcTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 2,
    },
  },
})

const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div role="alert" style={{ padding: '20px', textAlign: 'center' }}>
    <h2>An error occurred:</h2>
    <pre style={{ color: 'red', whiteSpace: 'pre-wrap' }}>{error.message}</pre>
    <button onClick={resetErrorBoundary}>Try again</button>
  </div>
)

// Safety check before rendering
const rootElement = document.getElementById('root')
if (!rootElement) {
  console.error('🚨 Root element not found')
  throw new Error('Root element not found')
}

// Ensure React and ReactDOM are available
if (!React || !ReactDOM) {
  console.error('🚨 React or ReactDOM not available')
  throw new Error('React dependencies not loaded')
}

console.log('✅ Starting React application render')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary 
        FallbackComponent={ErrorFallback}
        onError={(error, errorInfo) => {
          console.error('🚨 React Error Boundary caught error:', error)
          console.error('🚨 Error Info:', errorInfo)
        }}
      >
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
)