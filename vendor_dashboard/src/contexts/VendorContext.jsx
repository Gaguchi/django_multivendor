import { createContext, useContext, useState, useEffect } from 'react';
import { getVendorProfile } from '../services/api';
import { setVendorId, getVendorId, clearVendorId, getToken, isAuthenticated } from '../utils/auth';

const VendorContext = createContext();

export const useVendor = () => {
  const context = useContext(VendorContext);
  if (!context) {
    throw new Error('useVendor must be used within a VendorProvider');
  }
  return context;
};

export function VendorProvider({ children }) {
  const [vendor, setVendor] = useState(null);
  const [vendorId, setVendorIdState] = useState(getVendorId());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  // Fetch vendor profile information
  const fetchVendorProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching vendor profile...');
      const data = await getVendorProfile();
      console.log('Vendor profile response:', data);
      
      setVendor(data);
      
      // Store vendor ID for API requests
      if (data.vendor_id) {
        console.log('Setting vendor ID:', data.vendor_id);
        setVendorId(data.vendor_id);
        setVendorIdState(data.vendor_id);
      } else {
        console.warn('No vendor_id found in profile response');
      }
      
      setInitialized(true);
      return data;
    } catch (err) {
      setError('Failed to fetch vendor profile');
      console.error('Error fetching vendor profile:', err);
      setInitialized(true); // Mark as initialized even on error
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Initialize vendor profile with better race condition handling
  useEffect(() => {
    let timeoutId;
    
    const initializeProfile = async () => {
      const token = getToken();
      const authenticated = isAuthenticated();
      
      // If not authenticated, mark as initialized immediately
      if (!token || !authenticated) {
        setInitialized(true);
        return;
      }
      
      // If already have vendor data, mark as initialized
      if (vendor && !initialized) {
        setInitialized(true);
        return;
      }
      
      // If already loading or initialized, don't start another fetch
      if (loading || initialized) {
        return;
      }
      
      // Only fetch if we have authentication and don't have vendor data
      if (token && authenticated && !vendor) {
        try {
          await fetchVendorProfile();
        } catch (error) {
          console.warn('Initial vendor profile fetch failed:', error);
          // Don't prevent the app from loading, just mark as initialized
          setInitialized(true);
        }
      }
    };

    // Use a timeout to ensure authentication system is ready
    // But also listen for authentication changes
    timeoutId = setTimeout(initializeProfile, 100);
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []); // Only run on mount
  
  // Watch for authentication state changes
  useEffect(() => {
    const token = getToken();
    const authenticated = isAuthenticated();
    
    // If we lose authentication, clear vendor data and mark as initialized
    if (!token || !authenticated) {
      if (vendor || vendorId) {
        setVendor(null);
        setVendorIdState(null);
        clearVendorId();
      }
      if (!initialized) {
        setInitialized(true);
      }
    }
  }, [vendor, vendorId, initialized]);

  // Clear vendor data
  const clearVendor = () => {
    setVendor(null);
    setVendorIdState(null);
    clearVendorId();
  };

  // Check if vendor is loaded
  const isVendorLoaded = () => {
    return vendor && vendorId;
  };

  const value = {
    vendor,
    vendorId,
    loading,
    error,
    initialized,
    fetchVendorProfile,
    clearVendor,
    isVendorLoaded,
    setError
  };

  return (
    <VendorContext.Provider value={value}>
      {children}
    </VendorContext.Provider>
  );
}
