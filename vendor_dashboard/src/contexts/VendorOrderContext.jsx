import { createContext, useContext, useState, useEffect } from 'react';
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

  // Fetch all orders for the vendor
  const fetchOrders = async (filters = {}) => {
    if (!isVendorLoaded) {
      setError('Vendor information not loaded. Please try again.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getVendorOrders(filters);
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to fetch orders. Please try again.');
      console.error('Error fetching vendor orders:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch a specific order by order number
  const fetchOrderDetail = async (orderNumber) => {
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
      const data = await getVendorOrderDetail(orderNumber);
      setCurrentOrder(data);
    } catch (err) {
      setError('Failed to fetch order details. Please try again.');
      console.error(`Error fetching order ${orderNumber}:`, err);
    } finally {
      setLoading(false);
    }
  };

  // Update order status (mark as shipped/delivered)
  const updateStatus = async (orderNumber, status) => {
    if (!isVendorLoaded) {
      setError('Vendor information not loaded. Please try again.');
      return { success: false, error: 'Vendor information not loaded' };
    }

    try {
      setLoading(true);
      setError(null);
      
      const result = await updateOrderStatus(orderNumber, status);
      
      // Refresh orders list and current order if needed
      await fetchOrders();
      if (currentOrder && currentOrder.order_number === orderNumber) {
        await fetchOrderDetail(orderNumber);
      }
      
      return { success: true, message: result.status || 'Status updated successfully' };
    } catch (err) {
      const errorMessage = err.message || 'Failed to update order status. Please try again.';
      setError(errorMessage);
      console.error(`Error updating order ${orderNumber} status:`, err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

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
    clearError
  };

  return (
    <VendorOrderContext.Provider value={value}>
      {children}
    </VendorOrderContext.Provider>
  );
}
