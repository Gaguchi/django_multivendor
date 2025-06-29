import React from 'react';

/**
 * ErrorMessage Component - Consistent error message display
 * @param {Object} props
 * @param {string} props.message - Error message to display
 * @param {string} props.type - Error type: 'danger', 'warning', 'info'
 * @param {boolean} props.dismissible - Whether error can be dismissed
 * @param {function} props.onDismiss - Function called when dismissed
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.showIcon - Whether to show error icon
 */
export default function ErrorMessage({ 
  message, 
  type = 'danger', 
  dismissible = false, 
  onDismiss, 
  className = '', 
  showIcon = true 
}) {
  const alertClass = `alert alert-${type} ${dismissible ? 'alert-dismissible' : ''} ${className}`;
  
  const icon = {
    danger: 'bi-exclamation-triangle-fill',
    warning: 'bi-exclamation-triangle',
    info: 'bi-info-circle-fill'
  }[type];

  return (
    <div className={alertClass} role="alert">
      <div className="d-flex align-items-center">
        {showIcon && (
          <i className={`bi ${icon} me-2`}></i>
        )}
        <span className="flex-grow-1">{message}</span>
        {dismissible && onDismiss && (
          <button 
            type="button" 
            className="btn-close" 
            onClick={onDismiss}
            aria-label="Close"
          ></button>
        )}
      </div>
    </div>
  );
}

// Preset components for common error types
export const DangerMessage = ({ message, ...props }) => (
  <ErrorMessage message={message} type="danger" {...props} />
);

export const WarningMessage = ({ message, ...props }) => (
  <ErrorMessage message={message} type="warning" {...props} />
);

export const InfoMessage = ({ message, ...props }) => (
  <ErrorMessage message={message} type="info" {...props} />
);

// Inline error for form fields
export const FieldError = ({ error, className = '' }) => {
  if (!error) return null;
  
  return (
    <div className={`text-danger small mt-1 ${className}`}>
      <i className="bi bi-exclamation-circle me-1"></i>
      {error}
    </div>
  );
};
