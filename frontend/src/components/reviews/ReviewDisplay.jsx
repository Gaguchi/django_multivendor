import { useState, useEffect } from 'react';
import { useReview } from '../../contexts/ReviewContext';

export default function ReviewDisplay({ productId, showWriteReview = false }) {
  const { fetchProductReviews, loading } = useReview();
  const [reviews, setReviews] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null);

  useEffect(() => {
    const loadReviews = async () => {
      if (productId) {
        const productReviews = await fetchProductReviews(productId);
        setReviews(productReviews);
      }
    };
    
    loadReviews();
  }, [productId, fetchProductReviews]);

  // Handle escape key for modal
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && selectedMedia) {
        closeMediaModal();
      }
    };

    if (selectedMedia) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [selectedMedia]);

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
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="fas fa-star text-warning"></i>);
    }
    
    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt text-warning"></i>);
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star text-muted"></i>);
    }
    
    return stars;
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingBreakdown = () => {
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      breakdown[review.rating]++;
    });
    return breakdown;
  };

  const openMediaModal = (mediaUrl, type) => {
    setSelectedMedia(mediaUrl);
    setMediaType(type);
  };

  const closeMediaModal = () => {
    setSelectedMedia(null);
    setMediaType(null);
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading reviews...</span>
        </div>
      </div>
    );
  }

  const averageRating = getAverageRating();
  const ratingBreakdown = getRatingBreakdown();

  return (
    <div className="reviews-section">
      {/* Reviews Summary */}
      <div className="reviews-summary mb-4">
        <div className="row">
          <div className="col-md-4">
            <div className="text-center">
              <h3 className="mb-1">{averageRating}</h3>
              <div className="mb-2">
                {renderStars(parseFloat(averageRating))}
              </div>
              <p className="text-muted mb-0">
                {reviews.length} review{reviews.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="col-md-8">
            <div className="rating-breakdown">
              {[5, 4, 3, 2, 1].map(star => {
                const count = ratingBreakdown[star];
                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                
                return (
                  <div key={star} className="d-flex align-items-center mb-1">
                    <span className="me-2" style={{ minWidth: '60px' }}>
                      {star} star{star > 1 ? 's' : ''}
                    </span>
                    <div className="progress flex-grow-1 me-2" style={{ height: '8px' }}>
                      <div
                        className="progress-bar bg-warning"
                        role="progressbar"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-muted" style={{ minWidth: '40px' }}>
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Individual Reviews */}
      <div className="reviews-list">
        {reviews.length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-comment-alt fa-3x text-muted mb-3"></i>
            <h5>No reviews yet</h5>
            <p className="text-muted">Be the first to review this product!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="review-card card mb-3">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="d-flex align-items-center">
                    <div className="reviewer-avatar me-3">
                      <div className="avatar-circle bg-primary text-white d-flex align-items-center justify-content-center">
                        {review.user_name ? review.user_name.charAt(0).toUpperCase() : 'U'}
                      </div>
                    </div>
                    <div>
                      <h6 className="mb-0">{review.user_name || 'Anonymous User'}</h6>
                      <div className="d-flex align-items-center">
                        <div className="review-stars me-2">
                          {renderStars(review.rating)}
                        </div>
                        <small className="text-muted">
                          {formatDate(review.created_at)}
                        </small>
                      </div>
                    </div>
                  </div>
                  <div className="review-rating">
                    <span className="badge bg-warning text-dark">
                      {review.rating}/5
                    </span>
                  </div>
                </div>

                {/* Review Comment */}
                <p className="review-comment mb-3">{review.comment}</p>

                {/* Review Media */}
                {(review.images?.length > 0 || review.videos?.length > 0) && (
                  <div className="review-media mb-3">
                    <div className="row">
                      {/* Images */}
                      {review.images?.map((image, index) => (
                        <div key={`img-${index}`} className="col-3 col-md-2 mb-2">
                          <img
                            src={image.image || image}
                            alt={`Review image ${index + 1}`}
                            className="img-thumbnail w-100 review-media-item"
                            style={{ 
                              height: '80px', 
                              objectFit: 'cover',
                              cursor: 'pointer'
                            }}
                            onClick={() => openMediaModal(image.image || image, 'image')}
                          />
                        </div>
                      ))}
                      
                      {/* Videos */}
                      {review.videos?.map((video, index) => (
                        <div key={`vid-${index}`} className="col-3 col-md-2 mb-2">
                          <div 
                            className="position-relative review-media-item"
                            style={{ cursor: 'pointer' }}
                            onClick={() => openMediaModal(video.video || video, 'video')}
                          >
                            <video
                              src={video.video || video}
                              className="img-thumbnail w-100"
                              style={{ 
                                height: '80px', 
                                objectFit: 'cover'
                              }}
                              muted
                            />
                            <div className="position-absolute top-50 start-50 translate-middle">
                              <i className="fas fa-play-circle text-white fa-lg"></i>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Helpful Actions */}
                <div className="review-actions">
                  <small className="text-muted">
                    Was this review helpful?
                  </small>
                  <button className="btn btn-sm btn-outline-primary ms-2">
                    <i className="fas fa-thumbs-up me-1"></i>
                    Yes
                  </button>
                  <button className="btn btn-sm btn-outline-secondary ms-1">
                    <i className="fas fa-thumbs-down me-1"></i>
                    No
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Media Modal */}
      {selectedMedia && (
        <div 
          className="modal fade show d-block" 
          tabIndex="-1" 
          style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
          onClick={closeMediaModal}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h5 className="modal-title">Review Media</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={closeMediaModal}
                ></button>
              </div>
              <div className="modal-body text-center">
                {mediaType === 'image' ? (
                  <img 
                    src={selectedMedia} 
                    alt="Review" 
                    className="img-fluid" 
                    style={{ maxHeight: '500px' }}
                  />
                ) : (
                  <video 
                    src={selectedMedia} 
                    controls 
                    className="w-100"
                    style={{ maxHeight: '500px' }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .reviewer-avatar .avatar-circle {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          font-size: 1.2rem;
          font-weight: 600;
        }

        .review-stars {
          gap: 2px;
        }

        .review-card {
          transition: all 0.3s ease;
        }

        .review-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important;
        }

        .review-media-item {
          transition: transform 0.2s ease;
        }

        .review-media-item:hover {
          transform: scale(1.05);
        }

        .rating-breakdown .progress {
          border-radius: 6px;
          background: #f1f3f4;
        }

        .rating-breakdown .progress-bar {
          border-radius: 6px;
        }

        .review-comment {
          line-height: 1.6;
        }

        .review-actions .btn {
          font-size: 0.875rem;
        }

        .modal.show {
          display: block !important;
        }
      `}</style>
    </div>
  );
}
