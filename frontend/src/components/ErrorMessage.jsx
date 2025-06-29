import React from 'react';

/**
 * ErrorMessage Component - Displays error messages with consistent styling
 * @param {Object} props
 * @param {string} props.error - Error message to display
 * @param {string} props.title - Optional error title
 * @param {Function} props.onRetry - Optional retry function
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.variant - Error variant: 'danger', 'warning', 'info'
 */
export default function ErrorMessage({ 
  error, 
  title = "Error", 
  onRetry,
  className = '',
  variant = 'danger'
}) {
  return (
    <div className={`alert alert-${variant} ${className}`} role="alert">
      <div className="d-flex align-items-start">
        <div className="flex-grow-1">
          <h6 className="alert-heading mb-2">
            <i className={`icon-exclamation-triangle me-2`}></i>
            {title}
          </h6>
          <p className="mb-0">{error}</p>
          {onRetry && (
            <button 
              className={`btn btn-outline-${variant} btn-sm mt-2`}
              onClick={onRetry}
            >
              <i className="icon-refresh me-1"></i>
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Specific error components for different contexts
export const PageErrorMessage = ({ error, onRetry }) => (
  <div className="container py-5">
    <div className="row justify-content-center">
      <div className="col-md-8">
        <ErrorMessage 
          error={error} 
          title="Failed to Load Page"
          onRetry={onRetry}
        />
      </div>
    </div>
  </div>
);

export const CardErrorMessage = ({ error, onRetry }) => (
  <div className="text-center py-4">
    <ErrorMessage 
      error={error} 
      title="Loading Error"
      onRetry={onRetry}
      className="text-start"
    />
  </div>
);

export const InlineErrorMessage = ({ error, small = false }) => (
  <div className={`text-danger ${small ? 'small' : ''}`}>
    <i className="icon-exclamation-circle me-1"></i>
    {error}
  </div>
);
