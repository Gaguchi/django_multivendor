import { useEffect, useState } from 'react';
import { useVendor } from '../contexts/VendorContext';
import { getToken } from '../utils/auth';
import Skeleton, { DashboardCardSkeleton } from './Skeleton';

export default function VendorProfileLoader({ children }) {
  const { vendor, vendorId, loading, error, initialized, fetchVendorProfile, isVendorLoaded } = useVendor();
  const [retryAttempts, setRetryAttempts] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    setRetryAttempts(prev => prev + 1);
    
    try {
      await fetchVendorProfile();
    } catch (error) {
      console.error('Retry failed:', error);
    } finally {
      setIsRetrying(false);
    }
  };

  // Auto retry once if initial load fails
  useEffect(() => {
    if (error && retryAttempts === 0 && initialized && !loading) {
      const timer = setTimeout(() => {
        console.log('Auto-retrying vendor profile fetch...');
        handleRetry();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [error, retryAttempts, initialized, loading]);

  // Show loading skeleton while not initialized or while loading
  if (!initialized || loading) {
    return (
      <div className="skeleton-container">
        <div className="skeleton-grid">
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
          <DashboardCardSkeleton />
        </div>
        
        <div className="skeleton-section mt-4">
          <Skeleton variant="text" width="200px" height="1.5rem" className="mb-3" />
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th><Skeleton variant="text" width="100px" /></th>
                  <th><Skeleton variant="text" width="120px" /></th>
                  <th><Skeleton variant="text" width="80px" /></th>
                  <th><Skeleton variant="text" width="100px" /></th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }, (_, index) => (
                  <tr key={index}>
                    <td><Skeleton variant="text" width="120px" /></td>
                    <td><Skeleton variant="text" width="150px" /></td>
                    <td><Skeleton variant="text" width="80px" /></td>
                    <td><Skeleton variant="rectangular" width="80px" height="32px" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (error && initialized && !loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="alert alert-danger" role="alert" style={{maxWidth: '500px'}}>
            <h4 className="alert-heading">
              <i className="bi bi-exclamation-triangle me-2"></i>
              Vendor Profile Error
            </h4>
            <p className="mb-3">{error}</p>
            {retryAttempts > 0 && (
              <p className="mb-3 text-muted">
                <small>Retry attempts: {retryAttempts}</small>
              </p>
            )}
            <hr />
            <button 
              className="btn btn-outline-danger me-2" 
              onClick={handleRetry}
              disabled={isRetrying}
            >
              {isRetrying ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Retrying...
                </>
              ) : (
                <>
                  <i className="bi bi-arrow-clockwise me-1"></i>
                  Retry
                </>
              )}
            </button>
            <button 
              className="btn btn-outline-secondary" 
              onClick={() => window.location.href = '/login'}
            >
              <i className="bi bi-box-arrow-right me-1"></i>
              Login Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show warning when initialized but no vendor profile found
  if (initialized && !error && !loading && !isVendorLoaded()) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="alert alert-warning" role="alert" style={{maxWidth: '500px'}}>
            <h4 className="alert-heading">
              <i className="bi bi-exclamation-circle me-2"></i>
              Vendor Profile Not Found
            </h4>
            <p className="mb-3">Unable to load vendor profile. This may be a temporary issue.</p>
            <hr />
            <button 
              className="btn btn-outline-warning me-2" 
              onClick={handleRetry}
              disabled={isRetrying}
            >
              {isRetrying ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Retrying...
                </>
              ) : (
                <>
                  <i className="bi bi-arrow-clockwise me-1"></i>
                  Retry
                </>
              )}
            </button>
            <button 
              className="btn btn-outline-secondary" 
              onClick={() => window.location.href = '/login'}
            >
              <i className="bi bi-box-arrow-right me-1"></i>
              Login Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Vendor profile loaded successfully
  return children;
}
