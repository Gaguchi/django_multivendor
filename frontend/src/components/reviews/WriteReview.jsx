import { useState, useEffect } from 'react';
import { useReview } from '../../contexts/ReviewContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function WriteReview({ 
  productId, 
  productName, 
  productImage,
  orderId,
  onReviewSubmitted,
  existingReview = null 
}) {
  const { createReview, updateReview, loading, error, setError } = useReview();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [imageError, setImageError] = useState('');
  const [videoError, setVideoError] = useState('');

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, setError]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const maxImages = 5;
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    
    setImageError('');
    
    if (images.length + files.length > maxImages) {
      setImageError(`You can only upload up to ${maxImages} images`);
      return;
    }
    
    for (const file of files) {
      if (file.size > maxFileSize) {
        setImageError('Each image must be smaller than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setImageError('Please select only image files');
        return;
      }
    }
    
    setImages(prev => [...prev, ...files]);
  };

  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files);
    const maxVideos = 2;
    const maxFileSize = 50 * 1024 * 1024; // 50MB
    
    setVideoError('');
    
    if (videos.length + files.length > maxVideos) {
      setVideoError(`You can only upload up to ${maxVideos} videos`);
      return;
    }
    
    for (const file of files) {
      if (file.size > maxFileSize) {
        setVideoError('Each video must be smaller than 50MB');
        return;
      }
      
      if (!file.type.startsWith('video/')) {
        setVideoError('Please select only video files');
        return;
      }
    }
    
    setVideos(prev => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index) => {
    setVideos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    if (comment.trim().length < 10) {
      setError('Please write at least 10 characters in your review');
      return;
    }

    const reviewData = {
      product: productId,
      rating,
      comment: comment.trim(),
      images,
      videos
    };

    try {
      let result;
      if (existingReview) {
        result = await updateReview(existingReview.id, reviewData);
      } else {
        result = await createReview(reviewData);
      }
      
      if (onReviewSubmitted) {
        onReviewSubmitted(result);
      }
      
      // Reset form if creating new review
      if (!existingReview) {
        setRating(0);
        setComment('');
        setImages([]);
        setVideos([]);
      }
      
    } catch (err) {
      console.error('Error submitting review:', err);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starRating = index + 1;
      return (
        <button
          key={index}
          type="button"
          className={`btn btn-link p-0 star-btn ${
            starRating <= (hoveredStar || rating) ? 'text-warning' : 'text-muted'
          }`}
          onClick={() => setRating(starRating)}
          onMouseEnter={() => setHoveredStar(starRating)}
          onMouseLeave={() => setHoveredStar(0)}
        >
          <i className="fas fa-star"></i>
        </button>
      );
    });
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">
          {existingReview ? 'Edit Your Review' : 'Write a Review'}
        </h5>
      </div>
      <div className="card-body">
        {/* Product Info */}
        <div className="d-flex align-items-center mb-4">
          {productImage && (
            <img 
              src={productImage} 
              alt={productName}
              className="product-thumbnail me-3"
              style={{ width: '60px', height: '60px', objectFit: 'cover' }}
            />
          )}
          <div>
            <h6 className="mb-0">{productName}</h6>
            <small className="text-muted">Order ID: {orderId}</small>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Rating */}
          <div className="mb-3">
            <label className="form-label">
              <strong>Your Rating</strong>
            </label>
            <div className="d-flex align-items-center">
              <div className="star-rating me-3">
                {renderStars()}
              </div>
              <span className="text-muted">
                {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : 'Select rating'}
              </span>
            </div>
          </div>

          {/* Comment */}
          <div className="mb-3">
            <label htmlFor="comment" className="form-label">
              <strong>Your Review</strong>
            </label>
            <textarea
              id="comment"
              className="form-control"
              rows="4"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product..."
              required
            />
            <small className="text-muted">
              {comment.length}/500 characters (minimum 10)
            </small>
          </div>

          {/* Image Upload */}
          <div className="mb-3">
            <label className="form-label">
              <strong>Add Photos (Optional)</strong>
            </label>
            <input
              type="file"
              className="form-control"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              disabled={images.length >= 5}
            />
            <small className="text-muted">
              Upload up to 5 images (max 5MB each). Supported formats: JPG, PNG, GIF
            </small>
            {imageError && (
              <div className="text-danger mt-1">{imageError}</div>
            )}
            
            {/* Image Previews */}
            {images.length > 0 && (
              <div className="mt-2">
                <div className="row">
                  {images.map((image, index) => (
                    <div key={index} className="col-3 col-md-2 mb-2">
                      <div className="position-relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Preview ${index + 1}`}
                          className="img-thumbnail w-100"
                          style={{ height: '80px', objectFit: 'cover' }}
                        />
                        <button
                          type="button"
                          className="btn btn-sm btn-danger position-absolute top-0 end-0"
                          onClick={() => removeImage(index)}
                          style={{ transform: 'translate(25%, -25%)' }}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Video Upload */}
          <div className="mb-3">
            <label className="form-label">
              <strong>Add Videos (Optional)</strong>
            </label>
            <input
              type="file"
              className="form-control"
              multiple
              accept="video/*"
              onChange={handleVideoChange}
              disabled={videos.length >= 2}
            />
            <small className="text-muted">
              Upload up to 2 videos (max 50MB each). Supported formats: MP4, MOV, AVI
            </small>
            {videoError && (
              <div className="text-danger mt-1">{videoError}</div>
            )}
            
            {/* Video Previews */}
            {videos.length > 0 && (
              <div className="mt-2">
                <div className="row">
                  {videos.map((video, index) => (
                    <div key={index} className="col-6 col-md-4 mb-2">
                      <div className="position-relative">
                        <video
                          src={URL.createObjectURL(video)}
                          className="w-100 rounded"
                          style={{ height: '100px', objectFit: 'cover' }}
                          controls={false}
                          muted
                        />
                        <div className="position-absolute top-50 start-50 translate-middle">
                          <i className="fas fa-play-circle text-white fa-2x"></i>
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger position-absolute top-0 end-0"
                          onClick={() => removeVideo(index)}
                          style={{ transform: 'translate(25%, -25%)' }}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                      <small className="text-muted d-block mt-1">
                        {video.name}
                      </small>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="d-flex justify-content-end">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || rating === 0 || comment.trim().length < 10}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  {existingReview ? 'Updating...' : 'Submitting...'}
                </>
              ) : (
                existingReview ? 'Update Review' : 'Submit Review'
              )}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .star-btn {
          border: none !important;
          font-size: 1.5rem;
          margin-right: 0.25rem;
          transition: all 0.2s ease;
        }
        
        .star-btn:hover {
          transform: scale(1.1);
        }
        
        .star-btn:focus {
          box-shadow: none;
        }
        
        .product-thumbnail {
          border-radius: 8px;
        }
        
        .form-control:focus {
          border-color: #007bff;
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        }
        
        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
