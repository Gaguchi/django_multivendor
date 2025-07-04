import { useState, useEffect } from 'react';
import { useReview } from '../../contexts/ReviewContext';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../LoadingSpinner';

export default function ProductReviews({ productId }) {
  const { fetchProductReviews, canReviewProduct, hasReviewedProduct } = useReview();
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [canReview, setCanReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    if (productId) {
      loadReviews();
      if (user) {
        checkReviewEligibility();
      }
    }
  }, [productId, user]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await fetchProductReviews(productId);
      setReviews(data.results || []);
      setAverageRating(data.average_rating || 0);
      setTotalReviews(data.total_reviews || 0);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkReviewEligibility = async () => {
    try {
      const [canReviewResult, hasReviewedResult] = await Promise.all([
        canReviewProduct(productId),
        hasReviewedProduct(productId)
      ]);
      setCanReview(canReviewResult);
      setHasReviewed(hasReviewedResult);
    } catch (error) {
      console.error('Error checking review eligibility:', error);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  const renderStars = (rating, size = 'sm') => {
    return Array.from({ length: 5 }, (_, index) => (
      <i
        key={index}
        className={`fas fa-star ${index < rating ? 'text-warning' : 'text-muted'}`}
        style={{ fontSize: size === 'lg' ? '1.2rem' : '1rem' }}
      ></i>
    ));
  };

  const openReviewModal = (review) => {
    setSelectedReview(review);
    const modal = new bootstrap.Modal(document.getElementById('reviewModal'));
    modal.show();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="product-reviews">
      {/* Reviews Summary */}
      <div className="reviews-summary mb-4">
        <div className="row align-items-center">
          <div className="col-md-6">
            <h4>Customer Reviews</h4>
            <div className="d-flex align-items-center mb-2">
              <div className="me-2">
                {renderStars(Math.round(averageRating), 'lg')}
              </div>
              <span className="h5 mb-0 me-2">{averageRating.toFixed(1)}</span>
              <span className="text-muted">({totalReviews} review{totalReviews !== 1 ? 's' : ''})</span>
            </div>
          </div>
          <div className="col-md-6 text-md-end">
            {user && canReview && !hasReviewed && (
              <a href="/account/reviews" className="btn btn-primary">
                <i className="fas fa-star me-2"></i>
                Write a Review
              </a>
            )}
            {user && hasReviewed && (
              <a href="/account/reviews" className="btn btn-outline-primary">
                <i className="fas fa-edit me-2"></i>
                Edit Your Review
              </a>
            )}
            {!user && (
              <a href="/login" className="btn btn-outline-primary">
                Login to Review
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-5">
          <i className="fas fa-comment-alt fa-3x text-muted mb-3"></i>
          <h5>No reviews yet</h5>
          <p className="text-muted">Be the first to review this product!</p>
        </div>
      ) : (
        <div className="reviews-list">
          {reviews.slice(0, 3).map((review) => (
            <div key={review.id} className="review-item border-bottom pb-3 mb-3">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <div className="d-flex align-items-center mb-1">
                    <div className="me-2">{renderStars(review.rating)}</div>
                    <strong>{review.user_name || 'Anonymous User'}</strong>
                  </div>
                  <small className="text-muted">{formatDate(review.created_at)}</small>
                </div>
              </div>
              
              <p className="mb-2">{review.comment}</p>
              
              {/* Review Media */}
              {(review.images?.length > 0 || review.videos?.length > 0) && (
                <div className="review-media mb-2">
                  <div className="d-flex flex-wrap gap-2">
                    {review.images?.slice(0, 4).map((image, index) => (
                      <img
                        key={index}
                        src={image.image}
                        alt="Review"
                        className="review-thumbnail"
                        style={{ 
                          width: '60px', 
                          height: '60px', 
                          objectFit: 'cover',
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }}
                        onClick={() => openReviewModal(review)}
                      />
                    ))}
                    {review.videos?.slice(0, 2).map((video, index) => (
                      <div
                        key={index}
                        className="position-relative review-thumbnail"
                        style={{ 
                          width: '60px', 
                          height: '60px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          cursor: 'pointer'
                        }}
                        onClick={() => openReviewModal(review)}
                      >
                        <video
                          src={video.video}
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover'
                          }}
                          muted
                        />
                        <div className="position-absolute top-50 start-50 translate-middle">
                          <i className="fas fa-play text-white fa-lg"></i>
                        </div>
                      </div>
                    ))}
                    {(review.images?.length > 4 || review.videos?.length > 2) && (
                      <div 
                        className="d-flex align-items-center justify-content-center bg-light text-muted review-thumbnail"
                        style={{ 
                          width: '60px', 
                          height: '60px',
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }}
                        onClick={() => openReviewModal(review)}
                      >
                        <span className="fw-bold">
                          +{(review.images?.length || 0) + (review.videos?.length || 0) - 4}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {reviews.length > 3 && (
            <div className="text-center mt-3">
              <button className="btn btn-outline-primary">
                View All {totalReviews} Reviews
              </button>
            </div>
          )}
        </div>
      )}

      {/* Review Modal */}
      <div className="modal fade" id="reviewModal" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Review Details</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              {selectedReview && (
                <div>
                  <div className="d-flex align-items-center mb-3">
                    <div className="me-2">{renderStars(selectedReview.rating)}</div>
                    <strong className="me-2">{selectedReview.user_name || 'Anonymous User'}</strong>
                    <small className="text-muted">{formatDate(selectedReview.created_at)}</small>
                  </div>
                  
                  <p className="mb-3">{selectedReview.comment}</p>
                  
                  {/* Full Media Gallery */}
                  {(selectedReview.images?.length > 0 || selectedReview.videos?.length > 0) && (
                    <div className="review-media-gallery">
                      <h6>Media</h6>
                      <div className="row">
                        {selectedReview.images?.map((image, index) => (
                          <div key={index} className="col-md-4 mb-3">
                            <img
                              src={image.image}
                              alt="Review"
                              className="img-fluid rounded"
                              style={{ maxHeight: '200px', objectFit: 'cover', width: '100%' }}
                            />
                          </div>
                        ))}
                        {selectedReview.videos?.map((video, index) => (
                          <div key={index} className="col-md-4 mb-3">
                            <video
                              src={video.video}
                              controls
                              className="img-fluid rounded"
                              style={{ maxHeight: '200px', objectFit: 'cover', width: '100%' }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .review-thumbnail:hover {
          transform: scale(1.05);
          transition: transform 0.2s ease;
        }
        
        .review-item:last-child {
          border-bottom: none !important;
          margin-bottom: 0 !important;
          padding-bottom: 0 !important;
        }
      `}</style>
    </div>
  );
}
