import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((options) => {
    const {
      title = 'Notification',
      message = '',
      type = 'info',
      duration = 4000
    } = options;

    const id = Date.now() + Math.random();
    const toast = { id, title, message, type, duration };

    setToasts(prev => [...prev, toast]);

    // Auto remove after duration
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const value = {
    toasts,
    showToast,
    removeToast
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, onRemove }) {
  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999,
      pointerEvents: 'none'
    }}>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          toast={toast}
          onRemove={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
}

function Toast({ toast, onRemove }) {
  const getIcon = (type) => {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'warning': return '⚠';
      case 'info':
      default: return 'ℹ';
    }
  };

  const getColors = (type) => {
    switch (type) {
      case 'success':
        return { bg: '#d4edda', border: '#c3e6cb', text: '#155724' };
      case 'error':
        return { bg: '#f8d7da', border: '#f5c6cb', text: '#721c24' };
      case 'warning':
        return { bg: '#fff3cd', border: '#ffeeba', text: '#856404' };
      case 'info':
      default:
        return { bg: '#d1ecf1', border: '#bee5eb', text: '#0c5460' };
    }
  };

  const colors = getColors(toast.type);

  return (
    <div
      style={{
        backgroundColor: colors.bg,
        border: `1px solid ${colors.border}`,
        color: colors.text,
        padding: '12px 16px',
        borderRadius: '4px',
        marginBottom: '10px',
        minWidth: '300px',
        maxWidth: '400px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        pointerEvents: 'auto',
        position: 'relative',
        animation: 'slideInRight 0.3s ease-out'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <span style={{ marginRight: '8px', fontSize: '16px' }}>
          {getIcon(toast.type)}
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
            {toast.title}
          </div>
          <div style={{ fontSize: '14px' }}>
            {toast.message}
          </div>
        </div>
        <button
          onClick={onRemove}
          style={{
            background: 'none',
            border: 'none',
            color: colors.text,
            cursor: 'pointer',
            fontSize: '16px',
            marginLeft: '8px',
            opacity: 0.7
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default ToastContext;
