import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useVendorOrders } from '../../contexts/VendorOrderContext';

export default function OrderList() {
  const {
    orders,
    loading,
    error,
    vendor,
    vendorId,
    isVendorLoaded,
    fetchOrders,
    updateStatus,
    getStatusColor,
    getStatusIcon,
    formatDate,
    formatCurrency,
    clearError
  } = useVendorOrders();

  const [filter, setFilter] = useState('all');
  const [updating, setUpdating] = useState({});

  useEffect(() => {
    // Only fetch orders if vendor profile is loaded
    if (isVendorLoaded) {
      if (filter === 'all') {
        fetchOrders();
      } else {
        fetchOrders({ status: filter });
      }
    }
  }, [filter, isVendorLoaded]);

  const handleStatusUpdate = async (orderNumber, newStatus) => {
    if (!window.confirm(`Are you sure you want to mark this order as ${newStatus.toLowerCase()}?`)) {
      return;
    }

    setUpdating(prev => ({ ...prev, [orderNumber]: true }));
    
    try {
      const result = await updateStatus(orderNumber, newStatus);
      if (result.success) {
        // Show success message (you could use a toast here)
        alert(result.message);
      } else {
        alert(result.error);
      }
    } catch (err) {
      alert('Failed to update order status');
    } finally {
      setUpdating(prev => ({ ...prev, [orderNumber]: false }));
    }
  };

  const getActionButtons = (order) => {
    const buttons = [];
    
    // View details button
    buttons.push(
      <Link
        key="view"
        to={`/orders/${order.order_number}`}
        className="btn btn-sm btn-outline-primary me-2"
      >
        <i className="bi bi-eye"></i> View
      </Link>
    );

    // Status update buttons based on current status
    if (order.can_update_status) {
      if (order.status === 'Paid') {
        buttons.push(
          <button
            key="ship"
            className="btn btn-sm btn-success me-2"
            onClick={() => handleStatusUpdate(order.order_number, 'Shipped')}
            disabled={updating[order.order_number]}
          >
            {updating[order.order_number] ? (
              <span className="spinner-border spinner-border-sm me-1"></span>
            ) : (
              <i className="bi bi-truck me-1"></i>
            )}
            Mark as Shipped
          </button>
        );
      } else if (order.status === 'Shipped') {
        buttons.push(
          <button
            key="deliver"
            className="btn btn-sm btn-success me-2"
            onClick={() => handleStatusUpdate(order.order_number, 'Delivered')}
            disabled={updating[order.order_number]}
          >
            {updating[order.order_number] ? (
              <span className="spinner-border spinner-border-sm me-1"></span>
            ) : (
              <i className="bi bi-check-circle me-1"></i>
            )}
            Mark as Delivered
          </button>
        );
      }
    }

    return buttons;
  };

  if (!isVendorLoaded()) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading vendor information...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <div className="d-flex justify-content-between align-items-center">
          <span>{error}</span>
          <button className="btn btn-outline-danger btn-sm" onClick={clearError}>
            <i className="bi bi-x"></i>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-list">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>
          <i className="bi bi-box-seam me-2"></i>
          Orders Management
        </h1>
        
        {/* Filter buttons */}
        <div className="btn-group" role="group">
          <button
            type="button"
            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilter('all')}
          >
            All Orders
          </button>
          <button
            type="button"
            className={`btn ${filter === 'Paid' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilter('Paid')}
          >
            Ready to Ship
          </button>
          <button
            type="button"
            className={`btn ${filter === 'Shipped' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilter('Shipped')}
          >
            Shipped
          </button>
          <button
            type="button"
            className={`btn ${filter === 'Delivered' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilter('Delivered')}
          >
            Delivered
          </button>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-inbox display-1 text-muted"></i>
          <h3 className="mt-3">No orders found</h3>
          <p className="text-muted">
            {filter === 'all' 
              ? "You haven't received any orders yet." 
              : `No orders with status "${filter}" found.`}
          </p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Status</th>
                <th>Your Items</th>
                <th>Your Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <Link 
                      to={`/orders/${order.order_number}`}
                      className="text-decoration-none fw-bold"
                    >
                      {order.order_number}
                    </Link>
                  </td>
                  <td>
                    <div>
                      <div className="fw-medium">{order.customer_name}</div>
                      <small className="text-muted">{order.customer_email}</small>
                    </div>
                  </td>
                  <td>
                    <small>{formatDate(order.created_at)}</small>
                  </td>
                  <td>
                    <span className={`badge bg-${getStatusColor(order.status)}`}>
                      <i className={`bi bi-${getStatusIcon(order.status)} me-1`}></i>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <span className="badge bg-secondary">
                      {order.vendor_items?.length || 0} items
                    </span>
                  </td>
                  <td>
                    <strong>{formatCurrency(order.vendor_total)}</strong>
                  </td>
                  <td>
                    <div className="d-flex flex-wrap gap-1">
                      {getActionButtons(order)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        .order-list {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          padding: 2rem;
        }

        .table th {
          font-weight: 600;
          color: #374151;
          border-bottom: 2px solid #e5e7eb;
        }

        .table td {
          vertical-align: middle;
          border-color: #f3f4f6;
        }

        .table-hover tbody tr:hover {
          background-color: #f8fafc;
        }

        .btn-group .btn {
          border-radius: 0;
        }

        .btn-group .btn:first-child {
          border-top-left-radius: 0.375rem;
          border-bottom-left-radius: 0.375rem;
        }

        .btn-group .btn:last-child {
          border-top-right-radius: 0.375rem;
          border-bottom-right-radius: 0.375rem;
        }

        .badge {
          font-size: 0.75rem;
        }

        @media (max-width: 768px) {
          .order-list {
            padding: 1rem;
          }
          
          .d-flex.justify-content-between {
            flex-direction: column;
            gap: 1rem;
          }
          
          .btn-group {
            width: 100%;
          }
          
          .btn-group .btn {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
}
