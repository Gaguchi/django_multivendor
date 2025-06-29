import React from 'react';

/**
 * LoadingSpinner Component - Simple loading indicator
 * @param {Object} props
 * @param {string} props.size - Size of spinner: 'sm', 'md', 'lg'
 * @param {string} props.color - Color theme: 'primary', 'secondary', 'success', 'danger', 'warning', 'info'
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.text - Optional loading text
 * @param {boolean} props.overlay - Whether to show as overlay
 */
export default function LoadingSpinner({ 
  size = 'md', 
  color = 'primary', 
  className = '', 
  text = '',
  overlay = false 
}) {
  const sizeClasses = {
    sm: 'spinner-border-sm',
    md: '',
    lg: 'spinner-border-lg'
  };

  const spinnerClasses = `spinner-border text-${color} ${sizeClasses[size]} ${className}`;
  
  const content = (
    <div className={`d-flex flex-column align-items-center ${text ? 'gap-3' : ''}`}>
      <div className={spinnerClasses} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      {text && <div className="loading-text">{text}</div>}
    </div>
  );

  if (overlay) {
    return (
      <div className="loading-overlay d-flex justify-content-center align-items-center">
        {content}
        <style jsx>{`
          .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.8);
            z-index: 9999;
          }
          
          .loading-text {
            color: #6c757d;
            font-size: 0.9rem;
          }
        `}</style>
      </div>
    );
  }

  return content;
}

// Specific loading spinners for different contexts
export const CardLoadingSpinner = ({ text = "Loading..." }) => (
  <div className="text-center py-5">
    <LoadingSpinner size="md" text={text} />
  </div>
);

export const PageLoadingSpinner = ({ text = "Loading page..." }) => (
  <div className="container py-5">
    <div className="row justify-content-center">
      <div className="col-md-6 text-center">
        <LoadingSpinner size="lg" text={text} />
      </div>
    </div>
  </div>
);

export const InlineLoadingSpinner = ({ size = "sm" }) => (
  <LoadingSpinner size={size} className="me-2" />
);
