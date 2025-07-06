import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useOrder } from '../contexts/OrderContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { OrderSkeleton } from '../components/Skeleton';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Orders() {
  const { orders, loading, error, fetchOrders, cancelOrder, getStatusColor } = useOrder();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  // Format date helper using native JavaScript
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

  const handleCancelOrder = async (orderNumber) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      const success = await cancelOrder(orderNumber);
      if (success) {
        showSuccess('Order cancelled successfully');
      } else {
        showError('Failed to cancel order. Please try again.');
      }
    }
  };

  if (!user) {
    return (
      <div className="container py-5 text-center">
        <h2>Please log in to view your orders</h2>
        <Link to="/login" className="btn btn-primary mt-3">Login</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container py-5">
        <div className="row">
          <div className="col-12">
            <h2 className="mb-4">My Orders</h2>
            {Array.from({ length: 4 }, (_, index) => (
              <OrderSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <button className="btn btn-primary" onClick={fetchOrders}>
          Try Again
        </button>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="container py-5">
        <div className="card">
          <div className="card-body text-center">
            <h2>You don't have any orders yet</h2>
            <p className="mb-4">Start shopping to place your first order!</p>
            <Link to="/shop" className="btn btn-primary">Browse Products</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>My Orders</h1>
        <Link to="/shop" className="btn btn-outline-primary">
          Continue Shopping
        </Link>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="thead-light">
            <tr>
              <th>Order #</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.order_number}</td>
                <td>{formatDate(order.created_at)}</td>
                <td>${parseFloat(order.total_amount).toFixed(2)}</td>
                <td>
                  <span className={`badge badge-${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <Link 
                    to={`/account/orders/${order.order_number}`} 
                    className="btn btn-sm btn-info mr-2"
                  >
                    View
                  </Link>
                  {order.status === 'Delivered' && (
                    <Link 
                      to="/account/reviews"
                      className="btn btn-sm btn-success mr-2"
                    >
                      Reviews
                    </Link>
                  )}
                  {order.status === 'Pending' && (
                    <button 
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleCancelOrder(order.order_number)}
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .badge {
          padding: 0.5em 0.75em;
          font-size: 0.85em;
        }
        
        .badge-warning {
          background-color: #ffc107;
          color: #212529;
        }
        
        .badge-info {
          background-color: #17a2b8;
          color: #fff;
        }
        
        .badge-primary {
          background-color: #007bff;
          color: #fff;
        }
        
        .badge-success {
          background-color: #28a745;
          color: #fff;
        }
        
        .badge-danger {
          background-color: #dc3545;
          color: #fff;
        }
        
        .badge-secondary {
          background-color: #6c757d;
          color: #fff;
        }
      `}</style>
    </div>
  );
}
