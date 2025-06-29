import React from 'react';
import './skeleton.css';

/**
 * Skeleton Component - Provides loading placeholders
 * @param {Object} props
 * @param {string} props.variant - Type of skeleton: 'text', 'circular', 'rectangular', 'card'
 * @param {string} props.width - Width of skeleton
 * @param {string} props.height - Height of skeleton
 * @param {number} props.lines - Number of text lines (for text variant)
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.animate - Whether to show animation (default: true)
 */
export default function Skeleton({ 
  variant = 'text', 
  width, 
  height, 
  lines = 1, 
  className = '', 
  animate = true 
}) {
  const baseClass = `skeleton ${animate ? 'skeleton-animate' : ''} skeleton-${variant} ${className}`;
  
  const style = {
    width: width || (variant === 'text' ? '100%' : undefined),
    height: height || (variant === 'text' ? '1rem' : undefined),
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className="skeleton-text-lines">
        {Array.from({ length: lines }, (_, index) => (
          <div
            key={index}
            className={baseClass}
            style={{
              ...style,
              width: index === lines - 1 ? '75%' : '100%', // Last line shorter
            }}
          />
        ))}
      </div>
    );
  }

  return <div className={baseClass} style={style} />;
}

// Pre-built skeleton components for common use cases
export const ProductCardSkeleton = () => (
  <div className="skeleton-card">
    <Skeleton variant="rectangular" height="200px" className="mb-3" />
    <Skeleton variant="text" width="80%" className="mb-2" />
    <Skeleton variant="text" width="60%" className="mb-2" />
    <Skeleton variant="text" width="40%" />
  </div>
);

export const OrderRowSkeleton = () => (
  <tr className="skeleton-row">
    <td><Skeleton variant="text" width="120px" /></td>
    <td><Skeleton variant="text" width="150px" /></td>
    <td><Skeleton variant="text" width="100px" /></td>
    <td><Skeleton variant="text" width="80px" /></td>
    <td><Skeleton variant="text" width="90px" /></td>
    <td><Skeleton variant="rectangular" width="80px" height="32px" /></td>
  </tr>
);

export const OrderDetailSkeleton = () => (
  <div className="skeleton-order-detail">
    <div className="row mb-4">
      <div className="col-md-8">
        <Skeleton variant="text" width="300px" height="2rem" className="mb-2" />
        <Skeleton variant="text" width="200px" />
      </div>
      <div className="col-md-4 text-end">
        <Skeleton variant="rectangular" width="120px" height="40px" />
      </div>
    </div>
    
    <div className="row">
      <div className="col-md-6">
        <div className="skeleton-section mb-4">
          <Skeleton variant="text" width="150px" height="1.5rem" className="mb-3" />
          <Skeleton variant="text" lines={3} />
        </div>
      </div>
      <div className="col-md-6">
        <div className="skeleton-section">
          <Skeleton variant="text" width="150px" height="1.5rem" className="mb-3" />
          <Skeleton variant="text" lines={3} />
        </div>
      </div>
    </div>

    <div className="skeleton-section mt-4">
      <Skeleton variant="text" width="200px" height="1.5rem" className="mb-3" />
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th><Skeleton variant="text" width="100px" /></th>
              <th><Skeleton variant="text" width="80px" /></th>
              <th><Skeleton variant="text" width="80px" /></th>
              <th><Skeleton variant="text" width="100px" /></th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 3 }, (_, index) => (
              <tr key={index}>
                <td>
                  <div className="d-flex align-items-center">
                    <Skeleton variant="rectangular" width="60px" height="60px" className="me-3" />
                    <div>
                      <Skeleton variant="text" width="150px" className="mb-1" />
                      <Skeleton variant="text" width="100px" />
                    </div>
                  </div>
                </td>
                <td><Skeleton variant="text" width="40px" /></td>
                <td><Skeleton variant="text" width="60px" /></td>
                <td><Skeleton variant="text" width="80px" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export const DashboardCardSkeleton = () => (
  <div className="skeleton-dashboard-card">
    <div className="d-flex justify-content-between align-items-start mb-3">
      <div>
        <Skeleton variant="text" width="120px" className="mb-2" />
        <Skeleton variant="text" width="80px" height="2rem" />
      </div>
      <Skeleton variant="circular" width="48px" height="48px" />
    </div>
    <div className="d-flex justify-content-between align-items-center">
      <Skeleton variant="text" width="60px" />
      <Skeleton variant="text" width="80px" />
    </div>
  </div>
);

export const ProductFormSkeleton = () => (
  <div className="skeleton-product-form">
    <div className="row">
      <div className="col-md-8">
        <div className="skeleton-section mb-4">
          <Skeleton variant="text" width="150px" height="1.5rem" className="mb-3" />
          <Skeleton variant="rectangular" height="45px" className="mb-3" />
          <Skeleton variant="rectangular" height="120px" className="mb-3" />
          <Skeleton variant="rectangular" height="45px" />
        </div>
        
        <div className="skeleton-section mb-4">
          <Skeleton variant="text" width="120px" height="1.5rem" className="mb-3" />
          <div className="row">
            <div className="col-md-6">
              <Skeleton variant="rectangular" height="45px" className="mb-3" />
            </div>
            <div className="col-md-6">
              <Skeleton variant="rectangular" height="45px" className="mb-3" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="col-md-4">
        <div className="skeleton-section">
          <Skeleton variant="text" width="100px" height="1.5rem" className="mb-3" />
          <div className="skeleton-image-upload mb-3">
            <Skeleton variant="rectangular" height="200px" />
          </div>
          <div className="d-flex gap-2 mb-3">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} variant="rectangular" width="60px" height="60px" />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Navigation/Menu skeleton
export const NavigationSkeleton = () => (
  <div className="skeleton-navigation">
    <div className="d-flex align-items-center mb-4">
      <Skeleton variant="circular" width="40px" height="40px" className="me-3" />
      <Skeleton variant="text" width="120px" height="1.5rem" />
    </div>
    <div className="skeleton-menu-items">
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="d-flex align-items-center mb-3">
          <Skeleton variant="rectangular" width="20px" height="20px" className="me-3" />
          <Skeleton variant="text" width="100px" />
        </div>
      ))}
    </div>
  </div>
);

// Header skeleton
export const HeaderSkeleton = () => (
  <div className="skeleton-header">
    <div className="d-flex justify-content-between align-items-center p-3">
      <div className="d-flex align-items-center">
        <Skeleton variant="rectangular" width="30px" height="30px" className="me-3" />
        <Skeleton variant="text" width="150px" />
      </div>
      <div className="d-flex align-items-center gap-3">
        <Skeleton variant="circular" width="32px" height="32px" />
        <Skeleton variant="circular" width="32px" height="32px" />
        <Skeleton variant="circular" width="40px" height="40px" />
      </div>
    </div>
  </div>
);

// Product list skeleton
export const ProductListSkeleton = () => (
  <div className="skeleton-product-list">
    <div className="d-flex justify-content-between align-items-center mb-4">
      <Skeleton variant="text" width="200px" height="2rem" />
      <Skeleton variant="rectangular" width="120px" height="40px" />
    </div>
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th><Skeleton variant="text" width="100px" /></th>
            <th><Skeleton variant="text" width="80px" /></th>
            <th><Skeleton variant="text" width="70px" /></th>
            <th><Skeleton variant="text" width="80px" /></th>
            <th><Skeleton variant="text" width="60px" /></th>
            <th><Skeleton variant="text" width="80px" /></th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 8 }, (_, index) => (
            <tr key={index}>
              <td>
                <div className="d-flex align-items-center">
                  <Skeleton variant="rectangular" width="50px" height="50px" className="me-3" />
                  <div>
                    <Skeleton variant="text" width="150px" className="mb-1" />
                    <Skeleton variant="text" width="100px" />
                  </div>
                </div>
              </td>
              <td><Skeleton variant="text" width="80px" /></td>
              <td><Skeleton variant="text" width="60px" /></td>
              <td><Skeleton variant="text" width="70px" /></td>
              <td><Skeleton variant="text" width="50px" /></td>
              <td><Skeleton variant="rectangular" width="80px" height="32px" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Order list enhanced skeleton
export const OrderListSkeleton = () => (
  <div className="skeleton-order-list">
    <div className="d-flex justify-content-between align-items-center mb-4">
      <Skeleton variant="text" width="150px" height="2rem" />
      <div className="d-flex gap-2">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} variant="rectangular" width="80px" height="40px" />
        ))}
      </div>
    </div>
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th><Skeleton variant="text" width="100px" /></th>
            <th><Skeleton variant="text" width="120px" /></th>
            <th><Skeleton variant="text" width="80px" /></th>
            <th><Skeleton variant="text" width="80px" /></th>
            <th><Skeleton variant="text" width="60px" /></th>
            <th><Skeleton variant="text" width="80px" /></th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }, (_, index) => (
            <OrderRowSkeleton key={index} />
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Image upload skeleton
export const ImageUploadSkeleton = () => (
  <div className="skeleton-image-upload">
    <Skeleton variant="text" width="120px" height="1.5rem" className="mb-3" />
    <div className="skeleton-image-grid">
      <div className="skeleton-main-image mb-3">
        <Skeleton variant="rectangular" height="250px" />
      </div>
      <div className="d-flex gap-2">
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton key={index} variant="rectangular" width="60px" height="60px" />
        ))}
      </div>
    </div>
  </div>
);

// Statistics/Analytics skeleton
export const StatsSkeleton = () => (
  <div className="skeleton-stats">
    <div className="row">
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="col-md-3 mb-4">
          <div className="skeleton-stat-card">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <Skeleton variant="text" width="80px" className="mb-2" />
                <Skeleton variant="text" width="60px" height="2rem" />
              </div>
              <Skeleton variant="circular" width="48px" height="48px" />
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <Skeleton variant="text" width="40px" />
              <Skeleton variant="text" width="60px" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Profile skeleton
export const ProfileSkeleton = () => (
  <div className="skeleton-profile">
    <div className="row">
      <div className="col-md-4">
        <div className="text-center mb-4">
          <Skeleton variant="circular" width="120px" height="120px" className="mx-auto mb-3" />
          <Skeleton variant="text" width="150px" height="1.5rem" className="mb-2" />
          <Skeleton variant="text" width="100px" />
        </div>
      </div>
      <div className="col-md-8">
        <div className="skeleton-profile-details">
          <Skeleton variant="text" width="200px" height="2rem" className="mb-4" />
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="mb-3">
              <Skeleton variant="text" width="100px" className="mb-1" />
              <Skeleton variant="rectangular" height="40px" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Loading page skeleton
export const PageLoadingSkeleton = ({ title = "Loading..." }) => (
  <div className="skeleton-page">
    <div className="container-fluid">
      {/* Header skeleton */}
      <HeaderSkeleton />
      
      {/* Main content skeleton */}
      <div className="row mt-4">
        <div className="col-md-2">
          <NavigationSkeleton />
        </div>
        <div className="col-md-10">
          <div className="skeleton-page-content">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <Skeleton variant="text" width="200px" height="2rem" />
              <Skeleton variant="rectangular" width="120px" height="40px" />
            </div>
            
            {/* Dashboard cards */}
            <StatsSkeleton />
            
            {/* Content area */}
            <div className="skeleton-content-area mt-4">
              <Skeleton variant="text" width="150px" height="1.5rem" className="mb-3" />
              <Skeleton variant="rectangular" height="400px" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
