import { useState, useEffect } from 'react';
import api from '../../services/api';
import ReviewMediaModal from './ReviewMediaModal';

export default function ReviewList({ productId, newReviewAdded }) {
  const [reviews, setReviews] = useState([]);  // Initialize as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/reviews/reviews/?product=${productId}`);
        
        // Check the structure of the response
        console.log('Reviews API response:', response.data);
        
        // Handle both array and paginated responses
        if (Array.isArray(response.data)) {
          setReviews(response.data);
        } else if (response.data && Array.isArray(response.data.results)) {
          // Handle paginated response
          setReviews(response.data.results);
        } else {
          // If neither, set to empty array and log error
          console.error('Unexpected API response format:', response.data);
          setReviews([]);
          setError('Invalid response format from server');
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Failed to load reviews: " + (err.message || 'Unknown error'));
        setReviews([]); // Ensure reviews is always an array
      } finally {
        setLoading(false);
      }
    };
    
    if (productId) {
      fetchReviews();
    } else {
      console.error("No productId provided to ReviewList");
      setError("Product ID is required");
      setLoading(false);
    }
  }, [productId, newReviewAdded]);

  const handleMediaClick = (media) => {
    setSelectedMedia({
      url: media.file_url,
      type: media.media_type
    });
  };

  const closeMediaModal = () => {
    setSelectedMedia(null);
  };

  if (loading) {
    return <div className="text-center py-3">Loading reviews...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!reviews || reviews.length === 0) {
    return <div className="alert alert-info">No reviews yet. Be the first to review!</div>;
  }

  return (
    <>
      <div className="product-reviews-content">
        <h3 className="reviews-title">Customer Reviews ({reviews.length})</h3>
        
        {reviews.map(review => (
          <div key={review.id} className="review mb-4">
            <div className="row no-gutters">
              {/* User and rating info */}
              <div className="col-12">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div>
                    <h4 className="mb-1">{review.user_name || 'Anonymous'}</h4>
                    <div className="ratings-container mb-1">
                      <div className="product-ratings">
                        <span className="ratings" style={{ width: `${(review.rating || 0) * 20}%` }}></span>
                      </div>
                    </div>
                    <span className="review-date text-muted">
                      {review.created_at ? new Date(review.created_at).toLocaleDateString() : 'Unknown date'}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Review content */}
              <div className="col-12">
                <div className="review-content mb-3">
                  <p>{review.comment || 'No comment provided.'}</p>
                </div>
                
                {/* Review media */}
                {review.media && review.media.length > 0 && (
                  <div className="review-media">
                    <div className="row">
                      {review.media.map(media => (
                        <div key={media.id} className="col-4 col-md-3 mb-2">
                          {media.media_type === 'image' ? (
                            <img 
                              src={media.file_url} 
                              alt="Review media" 
                              className="img-fluid rounded"
                              onClick={() => handleMediaClick(media)}
                              style={{ cursor: 'pointer' }}
                            />
                          ) : (
                            <video 
                              src={media.file_url} 
                              className="img-fluid rounded" 
                              onClick={() => handleMediaClick(media)}
                              style={{ cursor: 'pointer' }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <ReviewMediaModal 
        isOpen={!!selectedMedia} 
        onClose={closeMediaModal} 
        media={selectedMedia} 
      />
    </>
  );
}
