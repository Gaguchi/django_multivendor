import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function OrdersList({ filter }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Construct query parameters based on filter
        let endpoint = '/api/orders/';
        if (filter === 'recent') {
          endpoint += '?limit=5';
        } else if (filter === 'returns') {
          endpoint += '?status=returned';
        }
        
        const response = await api.get(endpoint);
        
        // Handle different response formats
        const ordersList = Array.isArray(response.data) 
          ? response.data 
          : (response.data.results || []);
        
        setOrders(ordersList);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [filter]);

  // Helper function to get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'badge badge-success';
      case 'processing':
        return 'badge badge-primary';
      case 'pending':
        return 'badge badge-warning';
      case 'shipped':
        return 'badge badge-info';
      case 'cancelled':
        return 'badge badge-danger';
      case 'returned':
        return 'badge badge-secondary';
      default:
        return 'badge badge-light';
    }
  };

  // Format date to localized string
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading orders...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        {error}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="card">
        <div className="card-body">
          <p className="text-center my-5">You don't have any orders{filter === 'returns' ? ' returns' : ''} yet.</p>
          <div className="text-center">
            <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-list">
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Date</th>
              <th>Status</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.order_number || `#${order.id}`}</td>
                <td>{formatDate(order.created_at)}</td>
                <td>
                  <span className={getStatusBadgeClass(order.status)}>
                    {order.status}
                  </span>
                </td>
                <td>${parseFloat(order.total_amount).toFixed(2)}</td>
                <td>
                  <Link 
                    to={`/account/orders/${order.id}`} 
                    className="btn btn-sm btn-outline-primary"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
