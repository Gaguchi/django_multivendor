import { createContext, useContext, useState, useEffect } from 'react';
import { getVendorProfile } from '../services/api';
import { setVendorId, getVendorId, clearVendorId, getToken } from '../utils/auth';

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
      
      return data;
    } catch (err) {
      setError('Failed to fetch vendor profile');
      console.error('Error fetching vendor profile:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Initialize vendor profile on mount if user is authenticated
  useEffect(() => {
    const token = getToken();
    if (token && !vendor && !vendorId) {
      fetchVendorProfile().catch(() => {
        // Silently handle error - it will be shown in UI if needed
      });
    }
  }, []);

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
