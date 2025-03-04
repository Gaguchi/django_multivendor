import { useState } from 'react';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';

export default function ProductReviews({ productId }) {
  const [reviewAdded, setReviewAdded] = useState(false);
  
  const handleReviewSubmitted = () => {
    // Toggle the value to trigger a re-fetch in the ReviewList component
    setReviewAdded(prev => !prev);
  };
  
  // Add a check for productId
  if (!productId) {
    return (
      <div className="alert alert-warning">
        Product ID is missing. Unable to load or submit reviews.
      </div>
    );
  }
  
  return (
    <div className="product-reviews-container">
      <div className="row">
        <div className="col-lg-7">
          <ReviewList 
            productId={productId} 
            newReviewAdded={reviewAdded} 
          />
        </div>
        
        <div className="col-lg-5">
          <ReviewForm 
            productId={productId} 
            onReviewSubmitted={handleReviewSubmitted} 
          />
        </div>
      </div>
    </div>
  );
}
