import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useOrder } from '../contexts/OrderContext';
import { useAuth } from '../contexts/AuthContext';
import { useReview } from '../contexts/ReviewContext';
import { useToast } from '../contexts/ToastContext';
import WriteReview from '../components/reviews/WriteReview';

export default function OrderDetail() {
  const { orderNumber } = useParams();
  const { currentOrder, loading, error, fetchOrderById, cancelOrder, getStatusColor } = useOrder();
  const { user } = useAuth();
  const { canReviewProduct, hasReviewedProduct } = useReview();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [showWriteReview, setShowWriteReview] = useState(null);
  const [reviewEligibility, setReviewEligibility] = useState({});

  // Update screen width on resize
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    
    if (user && orderNumber) {
      fetchOrderById(orderNumber);
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [orderNumber, user]);

  // Check review eligibility for delivered items
  useEffect(() => {
    if (currentOrder && currentOrder.status === 'Delivered' && currentOrder.items) {
      checkReviewEligibility();
    }
  }, [currentOrder]);

  const checkReviewEligibility = async () => {
    if (!currentOrder?.items) return;
    
    const eligibility = {};
    
    for (const item of currentOrder.items) {
      try {
        const canReview = await canReviewProduct(item.product.id);
        const hasReviewed = await hasReviewedProduct(item.product.id);
        
        eligibility[item.product.id] = {
          canReview: canReview && !hasReviewed,
          hasReviewed
        };
      } catch (error) {
        console.error(`Error checking review eligibility for product ${item.product.id}:`, error);
        eligibility[item.product.id] = {
          canReview: false,
          hasReviewed: false
        };
      }
    }
    
    setReviewEligibility(eligibility);
  };

  const handleWriteReview = (item) => {
    setShowWriteReview(item);
  };

  const handleReviewSubmitted = async () => {
    setShowWriteReview(null);
    showSuccess('Review submitted successfully!');
    // Refresh review eligibility
    await checkReviewEligibility();
  };

  const handleCancelOrder = async () => {
    if (!currentOrder) return;
    
    if (window.confirm('Are you sure you want to cancel this order?')) {
      const success = await cancelOrder(currentOrder.order_number);
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

  // Get font size classes based on screen width
  const getFontSizeClass = () => {
    if (screenWidth < 576) {
      return 'font-size-mobile';
    } else if (screenWidth < 992) {
      return 'font-size-tablet';
    } else {
      return 'font-size-desktop';
    }
  };

  const fontSizeClass = getFontSizeClass();

  return (
    <div className={`container py-5 ${fontSizeClass}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="page-title">Order #{currentOrder.order_number}</h1>
        <Link to="/account/orders" className="btn btn-outline-primary btn-back">
          Back to Orders
        </Link>
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <div className="row">
            <div className="col-md-6">
              <h5 className="section-title mb-0">Order Summary</h5>
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
              <p className="detail-label mb-1"><strong>Order Date:</strong> {formatDate(currentOrder.created_at)}</p>
              <p className="detail-label mb-1"><strong>Payment Method:</strong> {currentOrder.payment_method}</p>
              {currentOrder.status === 'Delivered' && (
                <p className="detail-label mb-1"><strong>Delivered Date:</strong> {formatDate(currentOrder.delivered_at)}</p>
              )}
            </div>
            <div className="col-md-6">
              <p className="detail-label mb-1"><strong>Total Amount:</strong> ${parseFloat(currentOrder.total_amount).toFixed(2)}</p>
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
              <h5 className="section-title mb-0">Shipping Address</h5>
            </div>
            <div className="card-body">
              <address className="address-text">
                {currentOrder.shipping_address}
              </address>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="section-title mb-0">Billing Address</h5>
            </div>
            <div className="card-body">
              <address className="address-text">
                {currentOrder.billing_address}
              </address>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h5 className="section-title mb-0">Order Items</h5>
        </div>
        <div className="card-body">
          <div className="order-items">
            {currentOrder.items && currentOrder.items.map((item) => (
              <div className="order-item-card" key={item.id}>
                <div className="order-item-content">
                  <div className="product-image">
                    {item.product.thumbnail && (
                      <img 
                        src={`${item.product.thumbnail}`} 
                        alt={item.product.name}
                        className="product-thumbnail" 
                      />
                    )}
                  </div>
                  <div className="product-details">
                    <h6 className="product-name" title={item.product.name}>
                      {truncateName(item.product.name)}
                    </h6>
                    {item.product.vendor && (
                      <div className="vendor-name">Sold by: {item.product.vendor.store_name}</div>
                    )}
                    <div className="product-price-mobile">
                      ${parseFloat(item.unit_price).toFixed(2)} × {item.quantity}
                    </div>
                  </div>
                  <div className="product-price-desktop">
                    ${parseFloat(item.unit_price).toFixed(2)}
                  </div>
                  <div className="product-quantity">
                    {item.quantity}
                  </div>
                  <div className="product-total">
                    ${parseFloat(item.total_price).toFixed(2)}
                  </div>
                </div>
                {currentOrder.status === 'Delivered' && reviewEligibility[item.product.id] && reviewEligibility[item.product.id].canReview && (
                  <div className="review-action">
                    <button 
                      className="btn btn-sm btn-primary"
                      onClick={() => handleWriteReview(item)}
                    >
                      {reviewEligibility[item.product.id].hasReviewed ? 'Edit Review' : 'Write Review'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="order-totals">
            <div className="order-total-row">
              <div className="order-total-label">Subtotal:</div>
              <div className="order-total-value">${parseFloat(currentOrder.total_amount).toFixed(2)}</div>
            </div>
            <div className="order-total-row">
              <div className="order-total-label">Shipping:</div>
              <div className="order-total-value">$0.00</div>
            </div>
            <div className="order-total-row grand-total">
              <div className="order-total-label">Total:</div>
              <div className="order-total-value">${parseFloat(currentOrder.total_amount).toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>

      {showWriteReview && (
        <WriteReview 
          orderItem={showWriteReview} 
          onClose={() => setShowWriteReview(null)} 
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}

      <style jsx>{`
        /* Responsive typography classes */
        .font-size-mobile {
          --page-title-size: 3rem;
          --section-title-size: 2.4rem;
          --detail-label-size: 1.5rem;
          --address-text-size: 1.5rem;
          --product-name-size: 1.6rem;
          --vendor-name-size: 1.35rem;
          --price-text-size: 1.5rem;
          --total-text-size: 1.6rem;
          --grand-total-size: 1.7rem;
        }
        
        .font-size-tablet {
          --page-title-size: 3rem;
          --section-title-size: 2.4rem;
          --detail-label-size: 1.5rem;
          --address-text-size: 1.5rem;
          --product-name-size: 1.6rem;
          --vendor-name-size: 1.35rem;
          --price-text-size: 1.5rem;
          --total-text-size: 1.6rem;
          --grand-total-size: 1.7rem;
        }
        
        .font-size-desktop {
          --page-title-size: 3rem;
          --section-title-size: 2.4rem;
          --detail-label-size: 1.5rem;
          --address-text-size: 1.5rem;
          --product-name-size: 1.6rem;
          --vendor-name-size: 1.35rem;
          --price-text-size: 1.5rem;
          --total-text-size: 1.6rem;
          --grand-total-size: 1.7rem;
        }
        
        /* Apply the responsive font sizes */
        .page-title {
          font-size: var(--page-title-size);
        }
        
        .section-title {
          font-size: var(--section-title-size);
          font-weight: 600;
        }
        
        .detail-label {
          font-size: var(--detail-label-size);
        }
        
        .address-text {
          font-size: var(--address-text-size);
        }
        
        .product-name {
          font-size: var(--product-name-size);
          margin: 0 0 0.25rem;
          font-weight: 500;
        }
        
        .vendor-name {
          font-size: var(--vendor-name-size);
          color: #6c757d;
          margin-bottom: 0.25rem;
        }
        
        .product-price-mobile,
        .product-price-desktop,
        .product-quantity {
          font-size: var(--price-text-size);
        }
        
        .product-total,
        .order-total-value,
        .order-total-label {
          font-size: var(--total-text-size);
        }
        
        .grand-total {
          font-size: var(--grand-total-size);
        }
        
        /* Adjust button size for mobile */
        .btn-back {
          font-size: var(--detail-label-size);
          padding: 0.25rem 0.5rem;
        }
        
        @media (min-width: 576px) {
          .btn-back {
            padding: 0.375rem 0.75rem;
          }
        }
        
        /* Rest of existing styles */
        .badge {
          padding: 0.5em 0.75em;
          font-size: 0.85em;
        }
        
        .card {
          box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
          margin-bottom: 1rem;
        }
        
        address {
          margin-bottom: 0;
          font-style: normal;
        }
        
        /* Responsive order items styling */
        .order-items {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .order-item-card {
          padding: 1rem;
          border: 1px solid #e9ecef;
          border-radius: 0.25rem;
          background-color: #f8f9fa;
        }
        
        .order-item-content {
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 1rem;
          align-items: center;
        }
        
        .product-image {
          width: 70px;
          height: 70px;
          flex-shrink: 0;
        }
        
        .product-thumbnail {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 0.25rem;
        }
        
        .product-details {
          min-width: 0;
        }
        
        .product-price-desktop, .product-quantity {
          display: none;
        }
        
        .product-price-mobile {
          color: #495057;
        }
        
        .product-total {
          font-weight: 600;
        }
        
        /* Order totals styling */
        .order-totals {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #dee2e6;
        }
        
        .order-total-row {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
        }
        
        .grand-total {
          font-weight: 700;
          border-top: 1px solid #dee2e6;
          margin-top: 0.5rem;
          padding-top: 0.5rem;
        }
        
        /* Responsive styles */
        @media (min-width: 768px) {
          .order-item-content {
            grid-template-columns: auto 1fr auto auto auto;
          }
          
          .product-price-mobile {
            display: none;
          }
          
          .product-price-desktop, .product-quantity {
            display: block;
          }
          
          /* Add headers for tablet and desktop view */
          .order-items::before {
            content: "";
            display: block;
            padding: 0.75rem 1rem;
            font-weight: 600;
            background-color: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 0.25rem;
            margin-bottom: 0.5rem;
            display: grid;
            grid-template-columns: auto 1fr auto auto auto;
            gap: 1rem;
          }
          
          .order-items::before {
            content: "Product Image Product Price Quantity Total";
            font-size: var(--detail-label-size);
          }
        }
      `}</style>

      {/* Write Review Modal */}
      {showWriteReview && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Write Review</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowWriteReview(null)}
                ></button>
              </div>
              <div className="modal-body">
                <WriteReview
                  productId={showWriteReview.product.id}
                  productName={showWriteReview.product.name}
                  productImage={showWriteReview.product.thumbnail}
                  orderId={currentOrder.id}
                  onReviewSubmitted={handleReviewSubmitted}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
