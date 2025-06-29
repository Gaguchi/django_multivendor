import React from 'react';
import './skeleton.css';

/**
 * Skeleton Component - Provides loading placeholders for frontend
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

// Pre-built skeleton components for frontend use cases
export const ProductCardSkeleton = () => (
  <div className="product-skeleton">
    <div className="product-skeleton-image">
      <Skeleton variant="rectangular" height="250px" />
    </div>
    <div className="product-skeleton-content">
      <Skeleton variant="text" width="85%" className="mb-2" />
      <Skeleton variant="text" width="60%" className="mb-2" />
      <div className="product-skeleton-price">
        <Skeleton variant="text" width="40%" height="1.2rem" />
      </div>
      <div className="product-skeleton-actions mt-3">
        <Skeleton variant="rectangular" height="40px" className="mb-2" />
        <div className="d-flex gap-2">
          <Skeleton variant="rectangular" width="40px" height="40px" />
          <Skeleton variant="rectangular" width="40px" height="40px" />
        </div>
      </div>
    </div>
  </div>
);

export const ProductGridSkeleton = ({ count = 12 }) => (
  <div className="product-grid-skeleton">
    {Array.from({ length: count }, (_, index) => (
      <ProductCardSkeleton key={index} />
    ))}
  </div>
);

export const ProductDetailSkeleton = () => (
  <div className="product-detail-skeleton">
    <div className="row">
      <div className="col-md-6">
        <div className="product-detail-image-skeleton">
          <Skeleton variant="rectangular" height="400px" className="mb-3" />
          <div className="d-flex gap-2">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} variant="rectangular" width="80px" height="80px" />
            ))}
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div className="product-detail-info-skeleton">
          <Skeleton variant="text" width="70%" height="2rem" className="mb-3" />
          <Skeleton variant="text" width="50%" height="1.5rem" className="mb-3" />
          <Skeleton variant="text" lines={3} className="mb-4" />
          
          <div className="price-skeleton mb-4">
            <Skeleton variant="text" width="30%" height="2.5rem" />
          </div>
          
          <div className="actions-skeleton">
            <div className="row mb-3">
              <div className="col-6">
                <Skeleton variant="rectangular" height="45px" />
              </div>
              <div className="col-6">
                <Skeleton variant="rectangular" height="45px" />
              </div>
            </div>
            <Skeleton variant="rectangular" height="50px" className="mb-2" />
            <div className="d-flex gap-2">
              <Skeleton variant="rectangular" width="50px" height="50px" />
              <Skeleton variant="rectangular" width="50px" height="50px" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const CategoryCardSkeleton = () => (
  <div className="category-skeleton">
    <Skeleton variant="circular" width="80px" height="80px" className="mb-3" />
    <Skeleton variant="text" width="70%" />
  </div>
);

export const BannerSkeleton = () => (
  <div className="banner-skeleton">
    <Skeleton variant="rectangular" height="300px" />
  </div>
);

export const SearchResultsSkeleton = () => (
  <div className="search-results-skeleton">
    {/* Search header skeleton */}
    <div className="search-header-skeleton mb-4">
      <div className="row align-items-center">
        <div className="col-md-8">
          <Skeleton variant="text" width="200px" height="2rem" className="mb-2" />
          <Skeleton variant="text" width="300px" />
        </div>
        <div className="col-md-4 text-end">
          <Skeleton variant="rectangular" width="120px" height="40px" />
        </div>
      </div>
    </div>

    <div className="row">
      {/* Filters sidebar skeleton */}
      <div className="col-lg-3 col-md-4 mb-4">
        <div className="filters-skeleton">
          <Skeleton variant="text" width="80px" height="1.5rem" className="mb-3" />
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="filter-group-skeleton mb-4">
              <Skeleton variant="text" width="100px" className="mb-2" />
              <Skeleton variant="rectangular" height="40px" />
            </div>
          ))}
        </div>
      </div>

      {/* Products grid skeleton */}
      <div className="col-lg-9 col-md-8">
        <div className="results-header-skeleton mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <Skeleton variant="text" width="200px" />
            <Skeleton variant="rectangular" width="80px" height="40px" />
          </div>
        </div>
        <ProductGridSkeleton />
      </div>
    </div>
  </div>
);

export const OrderSkeleton = () => (
  <div className="order-skeleton">
    <div className="order-header-skeleton mb-3">
      <div className="d-flex justify-content-between align-items-center">
        <Skeleton variant="text" width="200px" height="1.5rem" />
        <Skeleton variant="rectangular" width="100px" height="30px" />
      </div>
    </div>
    <div className="order-items-skeleton">
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className="d-flex align-items-center mb-3">
          <Skeleton variant="rectangular" width="80px" height="80px" className="me-3" />
          <div className="flex-grow-1">
            <Skeleton variant="text" width="70%" className="mb-1" />
            <Skeleton variant="text" width="50%" className="mb-1" />
            <Skeleton variant="text" width="30%" />
          </div>
          <Skeleton variant="text" width="60px" />
        </div>
      ))}
    </div>
    <div className="order-total-skeleton">
      <Skeleton variant="text" width="150px" height="1.5rem" />
    </div>
  </div>
);

export const CartItemSkeleton = () => (
  <div className="cart-item-skeleton">
    <div className="row align-items-center">
      <div className="col-2">
        <Skeleton variant="rectangular" width="80px" height="80px" />
      </div>
      <div className="col-4">
        <Skeleton variant="text" width="90%" className="mb-1" />
        <Skeleton variant="text" width="70%" />
      </div>
      <div className="col-2">
        <Skeleton variant="rectangular" width="100px" height="40px" />
      </div>
      <div className="col-2">
        <Skeleton variant="text" width="60px" />
      </div>
      <div className="col-2">
        <Skeleton variant="text" width="40px" />
      </div>
    </div>
  </div>
);

export const HeroSkeleton = () => (
  <div className="hero-skeleton">
    <Skeleton variant="rectangular" height="400px" />
  </div>
);

export const ReviewSkeleton = () => (
  <div className="review-skeleton">
    <div className="d-flex align-items-center mb-2">
      <Skeleton variant="circular" width="40px" height="40px" className="me-3" />
      <div className="flex-grow-1">
        <Skeleton variant="text" width="40%" className="mb-1" />
        <Skeleton variant="text" width="60%" />
      </div>
    </div>
    <Skeleton variant="text" lines={3} />
  </div>
);

export const AccountSidebarSkeleton = () => (
  <div className="account-sidebar-skeleton">
    <div className="account-nav-skeleton">
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="nav-item-skeleton mb-2">
          <div className="d-flex align-items-center p-3">
            <Skeleton variant="rectangular" width="20px" height="20px" className="me-3" />
            <Skeleton variant="text" width="120px" />
          </div>
        </div>
      ))}
    </div>
  </div>
);
