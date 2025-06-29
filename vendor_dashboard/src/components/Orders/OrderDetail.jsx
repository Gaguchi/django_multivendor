import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useVendorOrders } from '../../contexts/VendorOrderContext';

export default function OrderDetail() {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const {
    currentOrder,
    loading,
    error,
    vendor,
    vendorId,
    isVendorLoaded,
    fetchOrderDetail,
    updateStatus,
    getStatusColor,
    getStatusIcon,
    formatDate,
    formatCurrency,
    clearError,
    clearCurrentOrder
  } = useVendorOrders();

  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    // Only fetch order detail if vendor profile is loaded
    if (orderNumber && isVendorLoaded()) {
      fetchOrderDetail(orderNumber);
    }
    
    return () => {
      clearCurrentOrder();
    };
  }, [orderNumber, isVendorLoaded]);

  const handleStatusUpdate = async (newStatus) => {
    if (!window.confirm(`Are you sure you want to mark this order as ${newStatus.toLowerCase()}?`)) {
      return;
    }

    setUpdating(true);
    
    try {
      const result = await updateStatus(orderNumber, newStatus);
      if (result.success) {
        alert(result.message);
      } else {
        alert(result.error);
      }
    } catch (err) {
      alert('Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusTimeline = () => {
    const statuses = ['Pending', 'Paid', 'Shipped', 'Delivered'];
    const currentIndex = statuses.indexOf(currentOrder?.status);
    
    return statuses.map((status, index) => ({
      status,
      isCompleted: index <= currentIndex,
      isCurrent: index === currentIndex
    }));
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
      <div className="container py-4">
        <div className="alert alert-danger" role="alert">
          <div className="d-flex justify-content-between align-items-center">
            <span>{error}</span>
            <button className="btn btn-outline-danger btn-sm" onClick={clearError}>
              <i className="bi bi-x"></i>
            </button>
          </div>
        </div>
        <Link to="/orders" className="btn btn-primary">
          <i className="bi bi-arrow-left me-2"></i>
          Back to Orders
        </Link>
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div className="container py-4">
        <div className="alert alert-warning" role="alert">
          Order not found or you don't have access to this order.
        </div>
        <Link to="/orders" className="btn btn-primary">
          <i className="bi bi-arrow-left me-2"></i>
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="order-detail">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>
            <i className="bi bi-box-seam me-2"></i>
            Order {currentOrder.order_number}
          </h1>
          <p className="text-muted mb-0">
            Placed on {formatDate(currentOrder.created_at)}
          </p>
        </div>
        
        <div className="d-flex gap-2">
          {/* Status update buttons */}
          {currentOrder.can_update_status && (
            <>
              {currentOrder.status === 'Paid' && (
                <button
                  className="btn btn-success"
                  onClick={() => handleStatusUpdate('Shipped')}
                  disabled={updating}
                >
                  {updating ? (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  ) : (
                    <i className="bi bi-truck me-2"></i>
                  )}
                  Mark as Shipped
                </button>
              )}
              
              {currentOrder.status === 'Shipped' && (
                <button
                  className="btn btn-success"
                  onClick={() => handleStatusUpdate('Delivered')}
                  disabled={updating}
                >
                  {updating ? (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  ) : (
                    <i className="bi bi-check-circle me-2"></i>
                  )}
                  Mark as Delivered
                </button>
              )}
            </>
          )}
          
          <Link to="/orders" className="btn btn-outline-secondary">
            <i className="bi bi-arrow-left me-2"></i>
            Back to Orders
          </Link>
        </div>
      </div>

      <div className="row">
        {/* Order Information */}
        <div className="col-lg-8">
          {/* Status Timeline */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-clock-history me-2"></i>
                Order Status
              </h5>
            </div>
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <span className={`badge bg-${getStatusColor(currentOrder.status)} me-2`}>
                  <i className={`bi bi-${getStatusIcon(currentOrder.status)} me-1`}></i>
                  {currentOrder.status}
                </span>
                <small className="text-muted">
                  Last updated: {formatDate(currentOrder.updated_at)}
                </small>
              </div>
              
              {/* Timeline */}
              <div className="timeline">
                {getStatusTimeline().map((item, index) => (
                  <div key={item.status} className={`timeline-item ${item.isCompleted ? 'completed' : ''} ${item.isCurrent ? 'current' : ''}`}>
                    <div className="timeline-marker">
                      {item.isCompleted ? (
                        <i className="bi bi-check-circle-fill"></i>
                      ) : (
                        <i className="bi bi-circle"></i>
                      )}
                    </div>
                    <div className="timeline-content">
                      <strong>{item.status}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Your Items */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-bag me-2"></i>
                Your Items ({currentOrder.vendor_items?.length || 0})
              </h5>
            </div>
            <div className="card-body">
              {currentOrder.vendor_items && currentOrder.vendor_items.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentOrder.vendor_items.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              {item.product.thumbnail && (
                                <img
                                  src={item.product.thumbnail}
                                  alt={item.product.name}
                                  className="product-thumbnail me-3"
                                />
                              )}
                              <div>
                                <div className="fw-medium">{item.product.name}</div>
                                <small className="text-muted">SKU: {item.product.sku}</small>
                              </div>
                            </div>
                          </td>
                          <td>{item.quantity}</td>
                          <td>{formatCurrency(item.unit_price)}</td>
                          <td><strong>{formatCurrency(item.total_price)}</strong></td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="table-warning">
                        <th colSpan="3">Your Total:</th>
                        <th>{formatCurrency(currentOrder.vendor_total)}</th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              ) : (
                <p className="text-muted">No items found for your store in this order.</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-lg-4">
          {/* Customer Information */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-person me-2"></i>
                Customer Information
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <strong>Name:</strong><br />
                {currentOrder.customer_name}
              </div>
              <div className="mb-3">
                <strong>Email:</strong><br />
                {currentOrder.customer_email}
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-geo-alt me-2"></i>
                Shipping Address
              </h5>
            </div>
            <div className="card-body">
              <address className="mb-0">
                {currentOrder.shipping_address}
              </address>
            </div>
          </div>

          {/* Order Summary */}
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-receipt me-2"></i>
                Order Summary
              </h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Order Total:</span>
                <strong>{formatCurrency(currentOrder.total_amount)}</strong>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <span><strong>Your Earning:</strong></span>
                <strong className="text-success">{formatCurrency(currentOrder.vendor_total)}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .order-detail {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          padding: 2rem;
        }

        .product-thumbnail {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 8px;
        }

        .timeline {
          display: flex;
          align-items: center;
          gap: 2rem;
          margin: 1rem 0;
        }

        .timeline-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          position: relative;
        }

        .timeline-item:not(:last-child)::after {
          content: '';
          position: absolute;
          top: 12px;
          left: 100%;
          width: 100%;
          height: 2px;
          background: #e5e7eb;
          z-index: 1;
        }

        .timeline-item.completed:not(:last-child)::after {
          background: #10b981;
        }

        .timeline-marker {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          border: 2px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 2;
          font-size: 12px;
        }

        .timeline-item.completed .timeline-marker {
          border-color: #10b981;
          color: #10b981;
        }

        .timeline-item.current .timeline-marker {
          border-color: #3b82f6;
          color: #3b82f6;
          background: #dbeafe;
        }

        .timeline-content {
          margin-top: 0.5rem;
          text-align: center;
          font-size: 0.9rem;
        }

        .timeline-item.completed .timeline-content {
          color: #10b981;
        }

        .timeline-item.current .timeline-content {
          color: #3b82f6;
          font-weight: 600;
        }

        address {
          font-style: normal;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .order-detail {
            padding: 1rem;
          }
          
          .d-flex.justify-content-between.align-items-center {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 1rem;
          }
          
          .timeline {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }
          
          .timeline-item {
            flex-direction: row;
            align-items: center;
            width: 100%;
          }
          
          .timeline-item:not(:last-child)::after {
            display: none;
          }
          
          .timeline-content {
            margin-top: 0;
            margin-left: 1rem;
            text-align: left;
          }
        }
      `}</style>
    </div>
  );
}
