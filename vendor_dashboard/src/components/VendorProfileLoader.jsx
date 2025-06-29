import { useEffect } from 'react';
import { useVendor } from '../contexts/VendorContext';
import { getToken } from '../utils/auth';

export default function VendorProfileLoader({ children }) {
  const { vendor, vendorId, loading, error, fetchVendorProfile, isVendorLoaded } = useVendor();

  useEffect(() => {
    const token = getToken();
    if (token && !isVendorLoaded && !loading) {
      fetchVendorProfile().catch(() => {
        // Error is already handled in context
      });
    }
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{width: '3rem', height: '3rem'}}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4>Loading Vendor Profile...</h4>
          <p className="text-muted">Please wait while we load your vendor information.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="alert alert-danger" role="alert" style={{maxWidth: '500px'}}>
            <h4 className="alert-heading">
              <i className="bi bi-exclamation-triangle me-2"></i>
              Vendor Profile Error
            </h4>
            <p className="mb-3">{error}</p>
            <hr />
            <button 
              className="btn btn-outline-danger me-2" 
              onClick={() => fetchVendorProfile()}
            >
              <i className="bi bi-arrow-clockwise me-1"></i>
              Retry
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

  if (!isVendorLoaded()) {
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
              onClick={() => fetchVendorProfile()}
            >
              <i className="bi bi-arrow-clockwise me-1"></i>
              Retry
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
