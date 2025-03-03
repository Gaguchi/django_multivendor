import { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useOrder } from '../contexts/OrderContext';
import { useAuth } from '../contexts/AuthContext';

export default function OrderDetail() {
  const { orderNumber } = useParams();
  const { currentOrder, loading, error, fetchOrderById, cancelOrder, getStatusColor } = useOrder();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && orderNumber) {
      fetchOrderById(orderNumber);
    }
    
    // Clear current order when component unmounts
    return () => {
      // Ideally would call clearCurrentOrder, but this causes issues with the component unmounting
    };
  }, [orderNumber, user]);

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

  const handleCancelOrder = async () => {
    if (!currentOrder) return;
    
    if (window.confirm('Are you sure you want to cancel this order?')) {
      const success = await cancelOrder(currentOrder.order_number);
      if (success) {
        // Show success message (could use a toast notification here)
        alert('Order cancelled successfully');
      }
    }
  };

  if (!user) {
    return (
      <div className="container py-5 text-center">
        <h2>Please log in to view order details</h2>
        <Link to="/login" className="btn btn-primary mt-3">Login</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <p className="mt-3">Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <button className="btn btn-primary mr-2" onClick={() => fetchOrderById(orderNumber)}>
          Try Again
        </button>
        <Link to="/account/orders" className="btn btn-secondary">
          Back to Orders
        </Link>
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning" role="alert">
          Order not found. The order may have been deleted or you don't have permission to view it.
        </div>
        <Link to="/account/orders" className="btn btn-primary">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Order #{currentOrder.order_number}</h1>
        <Link to="/account/orders" className="btn btn-outline-primary">
          Back to Orders
        </Link>
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <div className="row">
            <div className="col-md-6">
              <h5 className="mb-0">Order Summary</h5>
            </div>
            <div className="col-md-6 text-md-right">
              <span className={`badge badge-${getStatusColor(currentOrder.status)}`}>
                {currentOrder.status}
              </span>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-6">
              <p className="mb-1"><strong>Order Date:</strong> {formatDate(currentOrder.created_at)}</p>
              <p className="mb-1"><strong>Payment Method:</strong> {currentOrder.payment_method}</p>
              {currentOrder.status === 'Delivered' && (
                <p className="mb-1"><strong>Delivered Date:</strong> {formatDate(currentOrder.delivered_at)}</p>
              )}
            </div>
            <div className="col-md-6">
              <p className="mb-1"><strong>Total Amount:</strong> ${parseFloat(currentOrder.total_amount).toFixed(2)}</p>
              {currentOrder.status === 'Pending' && (
                <button 
                  onClick={handleCancelOrder} 
                  className="btn btn-sm btn-outline-danger mt-2"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="mb-0">Shipping Address</h5>
            </div>
            <div className="card-body">
              <address>
                {currentOrder.shipping_address}
              </address>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="mb-0">Billing Address</h5>
            </div>
            <div className="card-body">
              <address>
                {currentOrder.billing_address}
              </address>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Order Items</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {currentOrder.items && currentOrder.items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        {item.product.thumbnail && (
                          <img 
                            src={`${import.meta.env.VITE_API_BASE_URL}/${item.product.thumbnail}`} 
                            alt={item.product.name}
                            className="product-thumbnail mr-3" 
                          />
                        )}
                        <div>
                          <h6 className="mb-0">{item.product.name}</h6>
                          {item.product.vendor && (
                            <small className="text-muted">Sold by: {item.product.vendor.store_name}</small>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>${parseFloat(item.unit_price).toFixed(2)}</td>
                    <td>{item.quantity}</td>
                    <td>${parseFloat(item.total_price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" className="text-right"><strong>Subtotal:</strong></td>
                  <td>${parseFloat(currentOrder.total_amount).toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan="3" className="text-right"><strong>Shipping:</strong></td>
                  <td>$0.00</td>
                </tr>
                <tr>
                  <td colSpan="3" className="text-right"><strong>Total:</strong></td>
                  <td><strong>${parseFloat(currentOrder.total_amount).toFixed(2)}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      <style jsx>{`
        .badge {
          padding: 0.5em 0.75em;
          font-size: 0.85em;
        }
        
        .product-thumbnail {
          width: 50px;
          height: 50px;
          object-fit: cover;
        }
        
        .card {
          box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
        }
        
        address {
          margin-bottom: 0;
          font-style: normal;
        }
      `}</style>
    </div>
  );
}
