import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

export default function ReviewForm({ productId, onReviewSubmitted }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [files, setFiles] = useState([]);
  const [mediaPreview, setMediaPreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRatingChange = (newRating, e) => {
    if (e) e.preventDefault();
    setRating(newRating);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Validate file types and sizes
    const validFiles = selectedFiles.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      
      if (!isImage && !isVideo) {
        return false; // Invalid file type
      }
      
      // Check file size (5MB for images, 50MB for videos)
      const maxSize = isImage ? 5 * 1024 * 1024 : 50 * 1024 * 1024;
      if (file.size > maxSize) {
        return false; // File too large
      }
      
      return true;
    });

    // Update file list
    setFiles([...files, ...validFiles]);
    
    // Generate previews
    const newPreviews = validFiles.map(file => {
      const isImage = file.type.startsWith('image/');
      return {
        file,
        type: isImage ? 'image' : 'video',
        url: URL.createObjectURL(file)
      };
    });
    
    setMediaPreview([...mediaPreview, ...newPreviews]);
  };
  
  const removeMedia = (index) => {
    // Remove file and preview
    const newFiles = [...files];
    const newPreview = [...mediaPreview];
    
    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(newPreview[index].url);
    
    newFiles.splice(index, 1);
    newPreview.splice(index, 1);
    
    setFiles(newFiles);
    setMediaPreview(newPreview);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError("Please log in to submit a review");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Create FormData object to handle file uploads
      const formData = new FormData();
      formData.append('product', productId);
      formData.append('rating', rating);
      formData.append('comment', comment);
      
      // Add files and file types
      files.forEach((file, index) => {
        formData.append('media_files', file);
        formData.append('media_types', file.type.startsWith('image/') ? 'image' : 'video');
      });
      
      // Submit the review
      await api.post('/api/reviews/reviews/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Reset form and notify parent
      setRating(5);
      setComment('');
      setFiles([]);
      setMediaPreview([]);
      
      // Notify parent component
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
      
    } catch (error) {
      console.error("Error submitting review:", error);
      setError(error.response?.data?.detail || "Failed to submit review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="alert alert-info">
        Please <a href="/login">log in</a> to leave a review.
      </div>
    );
  }

  return (
    <div className="add-product-review">
      <h3 className="title">Add a Review</h3>
      
      {error && (
        <div className="alert alert-danger">{error}</div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="rating-form">
          <label htmlFor="rating">Your Rating <span className="required">*</span></label>
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <a 
                key={star}
                className={star <= rating ? "active" : ""}
                href="#"
                onClick={(e) => handleRatingChange(star, e)}
              >
                <i className="fa fa-star"></i>
              </a>
            ))}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="review">Your Review <span className="required">*</span></label>
          <textarea 
            id="review" 
            className="form-control" 
            required
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
        </div>
        
        {/* Media preview section */}
        {mediaPreview.length > 0 && (
          <div className="review-media-preview mb-3">
            <div className="row">
              {mediaPreview.map((media, idx) => (
                <div key={idx} className="col-4 col-md-3 mb-2 position-relative">
                  {media.type === 'image' ? (
                    <img 
                      src={media.url} 
                      className="img-thumbnail" 
                      alt={`Preview ${idx}`}
                    />
                  ) : (
                    <video 
                      src={media.url} 
                      className="img-thumbnail" 
                      controls
                    />
                  )}
                  <button 
                    type="button" 
                    className="btn btn-danger btn-sm position-absolute" 
                    style={{ top: '5px', right: '20px' }}
                    onClick={() => removeMedia(idx)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Media upload section */}
        <div className="form-group">
          <label htmlFor="review-media">Add Photos/Videos</label>
          <div className="custom-file">
            <input 
              type="file" 
              className="custom-file-input" 
              id="review-media"
              accept="image/*,video/*" 
              onChange={handleFileChange}
              multiple
            />
            <label className="custom-file-label" htmlFor="review-media">
              Choose files
            </label>
          </div>
          <small className="form-text text-muted">
            You can upload images (up to 5MB) and videos (up to 50MB)
          </small>
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}
