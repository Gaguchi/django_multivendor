import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useOrder } from '../contexts/OrderContext';
import api from '../services/api';

export default function OrderTracking() {
  const { orderNumber: urlOrderNumber } = useParams();
  const navigate = useNavigate();
  const [trackingNumber, setTrackingNumber] = useState(urlOrderNumber || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const { user } = useAuth();
  const { getStatusColor } = useOrder();

  // If order number in URL, do automatic tracking
  useEffect(() => {
    if (urlOrderNumber) {
      setTrackingNumber(urlOrderNumber);
      trackOrder(urlOrderNumber);
    }
  }, [urlOrderNumber]);

  const trackOrder = async (orderNumberToTrack) => {
    if (!orderNumberToTrack) {
      setError('Please enter a tracking number');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(`/api/orders/track/${orderNumberToTrack}/`);
      
      setOrderData(response.data.data);
      setIsOwner(response.data.is_owner);
      
      // Update URL if needed
      if (!urlOrderNumber) {
        navigate(`/track/${orderNumberToTrack}`);
      }
    } catch (err) {
      console.error('Error tracking order:', err);
      if (err.response?.status === 404) {
        setError('Order not found. Please check your tracking number and try again.');
      } else {
        setError('An error occurred while tracking your order. Please try again.');
      }
      setOrderData(null);
      setIsOwner(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    trackOrder(trackingNumber);
  };

  // Format date helper
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

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="text-center mb-5">
            <h1 className="mb-3">Track Your Order</h1>
            <p className="lead">
              Enter your order number to track the current status and delivery information.
            </p>
          </div>
          
          <div className="card mb-5">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Enter order number (e.g. abc123)"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    aria-label="Tracking Number"
                  />
                  <div className="input-group-append">
                    <button 
                      className="btn btn-primary btn-lg" 
                      type="submit" 
                      disabled={loading}
                    >
                      {loading ? 'Tracking...' : 'Track'}
                    </button>
                  </div>
                </div>
                {error && (
                  <div className="alert alert-danger mt-3" role="alert">
                    {error}
                  </div>
                )}
              </form>
            </div>
          </div>
          
          {orderData && (
            <div className="card">
              <div className="card-header bg-white">
                <div className="d-flex justify-content-between align-items-center">
                  <h2 className="h5 mb-0">Order #{orderData.order_number}</h2>
                  <span className={`badge badge-${getStatusColor(orderData.status)}`}>
                    {orderData.status}
                  </span>
                </div>
              </div>
              <div className="card-body">
                <div className="row mb-4">
                  <div className="col-md-6">
                    <h6 className="text-muted">Order Date</h6>
                    <p>{formatDate(orderData.created_at)}</p>
                    
                    {isOwner && orderData.payment_method && (
                      <>
                        <h6 className="text-muted">Payment Method</h6>
                        <p>{orderData.payment_method}</p>
                      </>
                    )}
                    
                    {orderData.delivered_at && (
                      <>
                        <h6 className="text-muted">Delivered Date</h6>
                        <p>{formatDate(orderData.delivered_at)}</p>
                      </>
                    )}
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-muted">Items</h6>
                    <p>{orderData.item_count} items</p>
                    
                    {isOwner && orderData.total_amount && (
                      <>
                        <h6 className="text-muted">Total Amount</h6>
                        <p>${parseFloat(orderData.total_amount).toFixed(2)}</p>
                      </>
                    )}
                    
                    <h6 className="text-muted">Last Updated</h6>
                    <p>{formatDate(orderData.updated_at)}</p>
                  </div>
                </div>
                
                {/* Order Timeline */}
                <div className="order-timeline mb-4">
                  <h4 className="h6 mb-3">Order Progress</h4>
                  <div className="timeline">
                    {['Pending', 'Paid', 'Shipped', 'Delivered'].map((step, index) => {
                      // Determine if this step is complete based on current status
                      const statusIndex = ['Pending', 'Paid', 'Shipped', 'Delivered', 'Completed'].indexOf(orderData.status);
                      const stepIndex = ['Pending', 'Paid', 'Shipped', 'Delivered', 'Completed'].indexOf(step);
                      const isComplete = stepIndex <= statusIndex;
                      const isCurrent = stepIndex === statusIndex;
                      
                      return (
                        <div 
                          key={step} 
                          className={`timeline-step ${isComplete ? 'complete' : ''} ${isCurrent ? 'current' : ''}`}
                        >
                          <div className="timeline-icon">
                            {isComplete ? (
                              <i className="fas fa-check"></i>
                            ) : (
                              index + 1
                            )}
                          </div>
                          <div className="timeline-label">{step}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {isOwner && orderData.items && (
                  <div className="mt-4">
                    <h4 className="h6 mb-3">Order Details</h4>
                    <Link 
                      to={`/account/orders/${orderData.order_number}`}
                      className="btn btn-outline-primary"
                    >
                      View Complete Order Details
                    </Link>
                  </div>
                )}
                
                {!isOwner && (
                  <div className="alert alert-info" role="alert">
                    <i className="fas fa-info-circle mr-2"></i>
                    Sign in to see complete order details.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .badge {
          padding: 0.5em 0.75em;
          font-size: 0.85em;
        }
        
        .timeline {
          display: flex;
          justify-content: space-between;
          margin: 2rem 0;
          position: relative;
        }
        
        .timeline:before {
          content: '';
          position: absolute;
          top: 20px;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: #e5e5e5;
          z-index: 1;
        }
        
        .timeline-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 2;
          flex: 1;
        }
        
        .timeline-icon {
          width: 40px;
          height: 40px;
          background-color: #e9ecef;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.5rem;
        }
        
        .timeline-step.complete .timeline-icon {
          background-color: #28a745;
          color: white;
        }
        
        .timeline-step.current .timeline-icon {
          background-color: #007bff;
          color: white;
          box-shadow: 0 0 0 4px rgba(0, 123, 255, 0.25);
        }
        
        .timeline-label {
          font-size: 0.8rem;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
