import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { getVendorOrders, getVendorOrderDetail, updateOrderStatus } from '../services/api';
import { useVendor } from './VendorContext';

const VendorOrderContext = createContext();

export const useVendorOrders = () => {
  const context = useContext(VendorOrderContext);
  if (!context) {
    throw new Error('useVendorOrders must be used within a VendorOrderProvider');
  }
  return context;
};

export function VendorOrderProvider({ children }) {
  const { vendor, vendorId, isVendorLoaded } = useVendor();
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [pollingEnabled, setPollingEnabled] = useState(true);
  const [pollingInterval, setPollingInterval] = useState(30000); // 30 seconds default
  
  const pollIntervalRef = useRef(null);
  const isPollingRef = useRef(false);
  const currentFiltersRef = useRef({});

  // Fetch all orders for the vendor
  const fetchOrders = useCallback(async (filters = {}, silent = false) => {
    if (!isVendorLoaded) {
      if (!silent) {
        setError('Vendor information not loaded. Please try again.');
      }
      return;
    }

    try {
      if (!silent) {
        setLoading(true);
        setError(null);
      }
      
      // Store current filters for polling
      currentFiltersRef.current = filters;
      
      const data = await getVendorOrders(filters);
      const newOrders = Array.isArray(data) ? data : [];
      
      // Check if orders have actually changed before updating state
      const ordersChanged = JSON.stringify(orders) !== JSON.stringify(newOrders);
      if (ordersChanged || !silent) {
        setOrders(newOrders);
        setLastUpdated(new Date());
        
        // Log updates for debugging
        if (ordersChanged && silent) {
          console.log('Orders updated via polling:', newOrders.length, 'orders');
        }
      }
    } catch (err) {
      if (!silent) {
        setError('Failed to fetch orders. Please try again.');
        console.error('Error fetching vendor orders:', err);
      } else {
        // For polling errors, just log them without disrupting the UI
        console.warn('Polling error (non-critical):', err.message);
      }
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, [isVendorLoaded, orders]);

  // Polling functions
  const startPolling = useCallback(() => {
    if (!pollingEnabled || isPollingRef.current || !isVendorLoaded) {
      return;
    }
    
    console.log('Starting order polling every', pollingInterval / 1000, 'seconds');
    isPollingRef.current = true;
    
    pollIntervalRef.current = setInterval(() => {
      if (isVendorLoaded && pollingEnabled) {
        fetchOrders(currentFiltersRef.current, true); // Silent polling
      }
    }, pollingInterval);
  }, [pollingEnabled, pollingInterval, isVendorLoaded, fetchOrders]);

  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      console.log('Stopping order polling');
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
      isPollingRef.current = false;
    }
  }, []);

  const togglePolling = useCallback(() => {
    setPollingEnabled(prev => {
      const newValue = !prev;
      if (newValue) {
        startPolling();
      } else {
        stopPolling();
      }
      return newValue;
    });
  }, [startPolling, stopPolling]);

  // Effect to handle polling lifecycle
  useEffect(() => {
    if (isVendorLoaded && pollingEnabled) {
      startPolling();
    } else {
      stopPolling();
    }

    // Cleanup on unmount
    return () => {
      stopPolling();
    };
  }, [isVendorLoaded, pollingEnabled, startPolling, stopPolling]);

  // Pause polling when tab is not visible (optimization)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopPolling();
      } else if (pollingEnabled && isVendorLoaded) {
        startPolling();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [pollingEnabled, isVendorLoaded, startPolling, stopPolling]);

  // Fetch a specific order by order number
  const fetchOrderDetail = useCallback(async (orderNumber) => {
    if (!orderNumber) {
      setCurrentOrder(null);
      return;
    }

    if (!isVendorLoaded) {
      setError('Vendor information not loaded. Please try again.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log(`[VendorOrderContext] Fetching order detail for: ${orderNumber}`);
      
      const data = await getVendorOrderDetail(orderNumber);
      setCurrentOrder(data);
      
    } catch (err) {
      setError('Failed to fetch order details. Please try again.');
      console.error(`Error fetching order ${orderNumber}:`, err);
      
      // If order not found or access denied, clear current order
      if (err.status === 404 || err.status === 403) {
        setCurrentOrder(null);
      }
      
    } finally {
      setLoading(false);
    }
  }, [isVendorLoaded]);

  // Update order status (mark as shipped/delivered) with optimistic updates
  const updateStatus = useCallback(async (orderNumber, status) => {
    if (!isVendorLoaded) {
      setError('Vendor information not loaded. Please try again.');
      return { success: false, error: 'Vendor information not loaded' };
    }

    // Optimistic update: immediately update the UI
    const previousOrders = [...orders];
    const previousCurrentOrder = currentOrder ? { ...currentOrder } : null;
    
    // Update the order in the list immediately
    const optimisticOrders = orders.map(order => {
      if (order.order_number === orderNumber) {
        return { 
          ...order, 
          status: status,
          updated_at: new Date().toISOString(),
          can_update_status: status !== 'Delivered' // Update button availability
        };
      }
      return order;
    });
    
    setOrders(optimisticOrders);
    
    // Update current order if it's the one being updated
    if (currentOrder && currentOrder.order_number === orderNumber) {
      setCurrentOrder({
        ...currentOrder,
        status: status,
        updated_at: new Date().toISOString(),
        can_update_status: status !== 'Delivered'
      });
    }

    try {
      setError(null);
      
      const result = await updateOrderStatus(orderNumber, status);
      
      // Backend update successful - refresh to get the latest data
      await fetchOrders(currentFiltersRef.current, true); // Silent refresh
      if (currentOrder && currentOrder.order_number === orderNumber) {
        await fetchOrderDetail(orderNumber);
      }
      
      return { success: true, message: result.message || 'Status updated successfully' };
    } catch (err) {
      // Rollback optimistic update on error
      setOrders(previousOrders);
      if (previousCurrentOrder) {
        setCurrentOrder(previousCurrentOrder);
      }
      
      const errorMessage = err.message || 'Failed to update order status. Please try again.';
      setError(errorMessage);
      console.error(`Error updating order ${orderNumber} status:`, err);
      return { success: false, error: errorMessage };
    }
  }, [isVendorLoaded, orders, currentOrder, fetchOrders, fetchOrderDetail]);

  // Helper function to get status badge color
  const getStatusColor = (status) => {
    const statusColors = {
      'Pending': 'warning',
      'Paid': 'info',
      'Shipped': 'primary',
      'Delivered': 'success',
      'Completed': 'success',
      'Cancelled': 'danger',
      'Disputed': 'danger'
    };
    
    return statusColors[status] || 'secondary';
  };

  // Helper function to get status icon
  const getStatusIcon = (status) => {
    const statusIcons = {
      'Pending': 'clock',
      'Paid': 'credit-card',
      'Shipped': 'truck',
      'Delivered': 'check-circle',
      'Completed': 'check-circle-fill',
      'Cancelled': 'x-circle',
      'Disputed': 'exclamation-triangle'
    };
    
    return statusIcons[status] || 'circle';
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      });
    } catch (error) {
      return dateString;
    }
  };

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  // Get recent orders (last 5)
  const fetchRecentOrders = async () => {
    await fetchOrders({ limit: 5 });
  };

  // Get orders by status
  const fetchOrdersByStatus = async (status) => {
    await fetchOrders({ status });
  };

  // Clear current order
  const clearCurrentOrder = () => {
    setCurrentOrder(null);
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  const value = {
    orders,
    currentOrder,
    loading,
    error,
    lastUpdated,
    pollingEnabled,
    pollingInterval,
    vendor,
    vendorId,
    isVendorLoaded,
    fetchOrders,
    fetchOrderDetail,
    updateStatus,
    getStatusColor,
    getStatusIcon,
    formatDate,
    formatCurrency,
    fetchRecentOrders,
    fetchOrdersByStatus,
    clearCurrentOrder,
    clearError,
    // Polling controls
    startPolling,
    stopPolling,
    togglePolling,
    setPollingInterval
  };

  return (
    <VendorOrderContext.Provider value={value}>
      {children}
    </VendorOrderContext.Provider>
  );
}
