import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, isVendor } from '../utils/auth';
import { fetchProfile } from '../services/api';

const ProtectedRoute = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      if (!isAuthenticated()) {
        setIsAuthorized(false);
        setChecking(false);
        return;
      }
      
      try {
        // Verify that the token is valid by checking the user profile
        const profileData = await fetchProfile();
        
        // Ensure the user is a vendor
        const authorized = profileData && 
                           profileData.profile && 
                           profileData.profile.user_type === 'vendor';
        
        setIsAuthorized(authorized);
      } catch (error) {
        console.error('Error verifying authentication:', error);
        setIsAuthorized(false);
      } finally {
        setChecking(false);
      }
    };
    
    verifyAuth();
  }, []);
  
  if (checking) {
    // You could show a loading spinner here
    return <div className="loading-overlay"><div className="preloading"><span></span></div></div>;
  }
  
  if (!isAuthorized) {
    // Redirect them to the login page, but save where they were going
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};

export default ProtectedRoute;
