import React from 'react';

/**
 * LoadingSpinner Component - Simple loading spinner for buttons and small UI elements
 * @param {Object} props
 * @param {string} props.size - Size of spinner: 'sm', 'md', 'lg'
 * @param {string} props.color - Color class for spinner
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.overlay - Whether to show as overlay
 */
export default function LoadingSpinner({ 
  size = 'sm', 
  color = 'text-primary', 
  className = '', 
  overlay = false 
}) {
  const sizeClass = {
    sm: 'spinner-border-sm',
    md: '',
    lg: 'spinner-border-lg'
  }[size];

  const spinner = (
    <div 
      className={`spinner-border ${sizeClass} ${color} ${className}`} 
      role="status"
    >
      <span className="visually-hidden">Loading...</span>
    </div>
  );

  if (overlay) {
    return (
      <div className="d-flex justify-content-center align-items-center position-absolute top-0 start-0 w-100 h-100 bg-white bg-opacity-75">
        {spinner}
      </div>
    );
  }

  return spinner;
}

// Preset components for common use cases
export const ButtonSpinner = ({ className = '' }) => (
  <LoadingSpinner size="sm" className={`me-2 ${className}`} />
);

export const PageSpinner = ({ message = "Loading..." }) => (
  <div className="d-flex flex-column justify-content-center align-items-center py-5">
    <LoadingSpinner size="md" className="mb-3" />
    <p className="text-muted">{message}</p>
  </div>
);

export const OverlaySpinner = ({ className = '' }) => (
  <LoadingSpinner overlay className={className} />
);
