import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

const OrderContext = createContext();

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Fetch all orders for the current user
  const fetchOrders = async () => {
    if (!user) {
      setOrders([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/orders/');
      setOrders(response.data.results || response.data);
    } catch (err) {
      setError('Failed to fetch orders. Please try again.');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch a specific order by order number
  const fetchOrderById = async (orderNumber) => {
    if (!user || !orderNumber) {
      setCurrentOrder(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/api/orders/${orderNumber}/`);
      setCurrentOrder(response.data);
    } catch (err) {
      setError('Failed to fetch order details. Please try again.');
      console.error(`Error fetching order ${orderNumber}:`, err);
    } finally {
      setLoading(false);
    }
  };

  // Cancel an order by order number
  const cancelOrder = async (orderNumber) => {
    try {
      setLoading(true);
      setError(null);
      await api.post(`/api/orders/${orderNumber}/cancel/`);
      
      // Refresh orders list and current order if needed
      await fetchOrders();
      if (currentOrder && currentOrder.order_number === orderNumber) {
        await fetchOrderById(orderNumber);
      }
      
      return true;
    } catch (err) {
      setError('Failed to cancel order. Only pending orders can be cancelled.');
      console.error(`Error cancelling order ${orderNumber}:`, err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Create a new order
  const createOrder = async (orderData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post('/api/orders/', orderData);
      
      // Refresh orders list
      await fetchOrders();
      
      return response.data;
    } catch (err) {
      setError('Failed to create order. Please check your information.');
      console.error('Error creating order:', err);
      throw err;
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

  // Reset current order
  const clearCurrentOrder = () => {
    setCurrentOrder(null);
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setOrders([]);
      setCurrentOrder(null);
    }
  }, [user]);

  const value = {
    orders,
    currentOrder,
    loading,
    error,
    fetchOrders,
    fetchOrderById,
    cancelOrder,
    createOrder,
    getStatusColor,
    clearCurrentOrder
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
}
