import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useReview } from '../contexts/ReviewContext';
import { useAuth } from '../contexts/AuthContext';
import WriteReview from '../components/reviews/WriteReview';
import LoadingSpinner from '../components/LoadingSpinner';
import AuthDebugger from '../components/AuthDebugger';
import AuthRecovery from '../components/AuthRecovery';

export default function Reviews() {
  const { 
    userReviews, 
    fetchUserReviews, 
    getReviewableItems, 
    deleteReview,
    loading, 
    error, 
    setError 
  } = useReview();
  
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [reviewableItems, setReviewableItems] = useState([]);
  const [activeTab, setActiveTab] = useState('reviewable');
  const [showWriteReview, setShowWriteReview] = useState(null);
  const [editingReview, setEditingReview] = useState(null);

  useEffect(() => {
    console.log('Reviews page: user state changed:', user);
    console.log('Reviews page: loading state:', authLoading);
    console.log('Reviews page: localStorage tokens:', localStorage.getItem('authTokens'));
    
    if (authLoading) {
      console.log('Reviews page: Still loading user data...');
      return;
    }
    
    if (user) {
      console.log('Reviews page: User is authenticated, loading reviews data');
      fetchUserReviews();
      loadReviewableItems();
    } else {
      console.log('Reviews page: No user found');
      // Temporarily comment out the redirect to debug
      // navigate('/login');
      
      // Instead, try to manually check if tokens exist
      const tokens = localStorage.getItem('authTokens');
      if (tokens) {
        console.log('Reviews page: Tokens exist in localStorage but user not loaded');
        // Force a page refresh to retry auth
        // window.location.reload();
      } else {
        console.log('Reviews page: No tokens found, redirecting to login');
        navigate('/login');
      }
    }
  }, [user, authLoading, navigate]);

  // Show loading spinner while checking authentication
  if (authLoading) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <LoadingSpinner text="Loading your account..." />
          </div>
        </div>
      </div>
    );
  }

  const loadReviewableItems = async () => {
    try {
      const items = await getReviewableItems();
      setReviewableItems(items);
    } catch (err) {
      console.error('Error loading reviewable items:', err);
    }
  };

  const handleWriteReview = (item) => {
    setShowWriteReview(item);
    setEditingReview(null);
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setShowWriteReview(null);
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      const success = await deleteReview(reviewId);
      if (success) {
        await loadReviewableItems(); // Refresh reviewable items
      }
    }
  };

  const onReviewSubmitted = async () => {
    setShowWriteReview(null);
    setEditingReview(null);
    await loadReviewableItems(); // Refresh reviewable items
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i 
          key={i} 
          className={`fas fa-star ${i <= rating ? 'text-warning' : 'text-muted'}`}
        ></i>
      );
    }
    return stars;
  };

  if (!user) {
    return (
      <div className="container py-5 text-center">
        <h2>Please log in to view your reviews</h2>
        <Link to="/login" className="btn btn-primary mt-3">Login</Link>
      </div>
    );
  }

  if (loading && !userReviews.length && !reviewableItems.length) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container py-5">
      <AuthDebugger />
      <AuthRecovery />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>My Reviews</h1>
        <Link to="/account/orders" className="btn btn-outline-primary">
          Back to Orders
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible" role="alert">
          {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError(null)}
          ></button>
        </div>
      )}

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'reviewable' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviewable')}
          >
            Write Reviews
            {reviewableItems.length > 0 && (
              <span className="badge bg-primary ms-2">{reviewableItems.length}</span>
            )}
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'existing' ? 'active' : ''}`}
            onClick={() => setActiveTab('existing')}
          >
            My Reviews
            {userReviews.length > 0 && (
              <span className="badge bg-secondary ms-2">{userReviews.length}</span>
            )}
          </button>
        </li>
      </ul>

      {/* Write Reviews Tab */}
      {activeTab === 'reviewable' && (
        <div className="tab-content">
          {showWriteReview ? (
            <div className="mb-4">
              <button
                className="btn btn-outline-secondary mb-3"
                onClick={() => setShowWriteReview(null)}
              >
                <i className="fas fa-arrow-left me-2"></i>
                Back to Items
              </button>
              <WriteReview
                productId={showWriteReview.product.id}
                productName={showWriteReview.product.name}
                productImage={showWriteReview.product.image}
                orderId={showWriteReview.order_number}
                onReviewSubmitted={onReviewSubmitted}
              />
            </div>
          ) : (
            <>
              {reviewableItems.length === 0 ? (
                <div className="card">
                  <div className="card-body text-center py-5">
                    <i className="fas fa-box-open fa-3x text-muted mb-3"></i>
                    <h5>No items to review</h5>
                    <p className="text-muted">
                      You can write reviews for products from orders that have been delivered.
                    </p>
                    <Link to="/account/orders" className="btn btn-primary">
                      View My Orders
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="row">
                  {reviewableItems.map((item) => (
                    <div key={`${item.order_number}-${item.product.id}`} className="col-md-6 mb-4">
                      <div className="card h-100">
                        <div className="card-body">
                          <div className="d-flex">
                            <img
                              src={item.product.image || '/placeholder-product.jpg'}
                              alt={item.product.name}
                              className="product-image me-3"
                              style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                            />
                            <div className="flex-grow-1">
                              <h6 className="card-title">{item.product.name}</h6>
                              <p className="text-muted mb-1">
                                Order: {item.order_number}
                              </p>
                              <p className="text-muted mb-2">
                                Delivered: {formatDate(item.delivered_at)}
                              </p>
                              <p className="text-success mb-2">
                                <i className="fas fa-check-circle me-1"></i>
                                Eligible for review
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="card-footer bg-transparent">
                          <button
                            className="btn btn-primary w-100"
                            onClick={() => handleWriteReview(item)}
                          >
                            <i className="fas fa-star me-2"></i>
                            Write Review
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* My Reviews Tab */}
      {activeTab === 'existing' && (
        <div className="tab-content">
          {editingReview ? (
            <div className="mb-4">
              <button
                className="btn btn-outline-secondary mb-3"
                onClick={() => setEditingReview(null)}
              >
                <i className="fas fa-arrow-left me-2"></i>
                Back to Reviews
              </button>
              <WriteReview
                productId={editingReview.product}
                productName={editingReview.product_name}
                productImage={editingReview.product_image}
                existingReview={editingReview}
                onReviewSubmitted={onReviewSubmitted}
              />
            </div>
          ) : (
            <>
              {userReviews.length === 0 ? (
                <div className="card">
                  <div className="card-body text-center py-5">
                    <i className="fas fa-comment-alt fa-3x text-muted mb-3"></i>
                    <h5>No reviews yet</h5>
                    <p className="text-muted">
                      Your product reviews will appear here once you start writing them.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="row">
                  {userReviews.map((review) => (
                    <div key={review.id} className="col-lg-6 mb-4">
                      <div className="card h-100">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div className="d-flex align-items-center">
                              <div className="review-stars me-2">
                                {renderStars(review.rating)}
                              </div>
                              <span className="badge bg-warning text-dark">
                                {review.rating}/5
                              </span>
                            </div>
                            <div className="dropdown">
                              <button
                                className="btn btn-sm btn-outline-secondary dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                              >
                                <i className="fas fa-ellipsis-v"></i>
                              </button>
                              <ul className="dropdown-menu">
                                <li>
                                  <button
                                    className="dropdown-item"
                                    onClick={() => handleEditReview(review)}
                                  >
                                    <i className="fas fa-edit me-2"></i>
                                    Edit Review
                                  </button>
                                </li>
                                <li>
                                  <button
                                    className="dropdown-item text-danger"
                                    onClick={() => handleDeleteReview(review.id)}
                                  >
                                    <i className="fas fa-trash me-2"></i>
                                    Delete Review
                                  </button>
                                </li>
                              </ul>
                            </div>
                          </div>
                          
                          <h6 className="card-title">{review.product_name}</h6>
                          <p className="card-text">{review.comment}</p>
                          
                          {/* Review Media Preview */}
                          {(review.images?.length > 0 || review.videos?.length > 0) && (
                            <div className="review-media mb-3">
                              <small className="text-muted d-block mb-2">Attachments:</small>
                              <div className="d-flex flex-wrap">
                                {review.images?.slice(0, 3).map((image, index) => (
                                  <img
                                    key={index}
                                    src={image.image || image}
                                    alt={`Review ${index + 1}`}
                                    className="me-2 mb-2"
                                    style={{ 
                                      width: '40px', 
                                      height: '40px', 
                                      objectFit: 'cover',
                                      borderRadius: '4px'
                                    }}
                                  />
                                ))}
                                {review.videos?.slice(0, 2).map((video, index) => (
                                  <div
                                    key={index}
                                    className="position-relative me-2 mb-2"
                                    style={{ 
                                      width: '40px', 
                                      height: '40px',
                                      borderRadius: '4px',
                                      overflow: 'hidden'
                                    }}
                                  >
                                    <video
                                      src={video.video || video}
                                      style={{ 
                                        width: '100%', 
                                        height: '100%', 
                                        objectFit: 'cover'
                                      }}
                                      muted
                                    />
                                    <div className="position-absolute top-50 start-50 translate-middle">
                                      <i className="fas fa-play text-white" style={{ fontSize: '0.8rem' }}></i>
                                    </div>
                                  </div>
                                ))}
                                {(review.images?.length > 3 || review.videos?.length > 2) && (
                                  <div 
                                    className="d-flex align-items-center justify-content-center bg-light text-muted"
                                    style={{ 
                                      width: '40px', 
                                      height: '40px',
                                      borderRadius: '4px',
                                      fontSize: '0.8rem'
                                    }}
                                  >
                                    +{(review.images?.length || 0) + (review.videos?.length || 0) - 3}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          
                          <small className="text-muted">
                            Posted on {formatDate(review.created_at)}
                          </small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      <style jsx>{`
        .product-image {
          border-radius: 8px;
        }
        
        .review-stars {
          gap: 2px;
        }
        
        .card {
          transition: all 0.3s ease;
        }
        
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important;
        }
        
        .nav-tabs .nav-link {
          border: none;
          color: #6c757d;
          font-weight: 500;
        }
        
        .nav-tabs .nav-link.active {
          background-color: #007bff;
          color: white;
          border-radius: 6px;
        }
        
        .badge {
          font-size: 0.75rem;
        }
        
        .dropdown-toggle::after {
          display: none;
        }
      `}</style>
    </div>
  );
}
