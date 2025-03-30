import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, isVendor, clearToken } from '../utils/auth';
import { fetchProfile } from '../services/api';

const ProtectedRoute = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      // First quick check with local storage data
      if (!isAuthenticated()) {
        setIsAuthorized(false);
        setChecking(false);
        return;
      }
      
      // Initial check based on local storage
      const vendorStatus = isVendor();
      
      try {
        // Verify that the token is valid by checking the user profile
        const profileData = await fetchProfile();
        
        if (profileData) {
          // Ensure the user is a vendor
          const authorized = profileData && 
                            profileData.profile && 
                            profileData.profile.user_type === 'vendor';
          
          setIsAuthorized(authorized);
          
          // If the token is valid but user is not a vendor, log them out
          if (!authorized) {
            console.warn('User is not authorized as vendor. Logging out...');
            clearToken(); // Clear token since this user isn't authorized for admin
          }
        } else {
          // If profile data is null, token might be invalid
          setIsAuthorized(false);
          clearToken();
        }
      } catch (error) {
        console.error('Error verifying authentication:', error);
        setIsAuthorized(false);
        clearToken(); // Clear tokens if verification fails
      } finally {
        setChecking(false);
      }
    };
    
    verifyAuth();
  }, []);
  
  if (checking) {
    return (
      <div className="loading-overlay">
        <div className="preloading"><span></span></div>
        <div style={{ marginTop: '20px', color: '#555' }}>
          Verifying your access...
        </div>
      </div>
    );
  }
  
  if (!isAuthorized) {
    // Redirect them to the login page, but save where they were going
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  return children;
};

export default ProtectedRoute;
