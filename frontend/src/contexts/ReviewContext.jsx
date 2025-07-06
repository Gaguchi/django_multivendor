import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

const ReviewContext = createContext();

export const useReview = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReview must be used within a ReviewProvider');
  }
  return context;
};

export function ReviewProvider({ children }) {
  const [reviews, setReviews] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Fetch reviews for a specific product
  const fetchProductReviews = async (productId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/api/reviews/product_reviews/?product_id=${productId}`);
      return response.data;
    } catch (err) {
      setError('Failed to fetch reviews. Please try again.');
      console.error('Error fetching product reviews:', err);
      return { results: [], average_rating: 0, total_reviews: 0 };
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's own reviews
  const fetchUserReviews = async () => {
    if (!user) {
      setUserReviews([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/reviews/');
      setUserReviews(response.data.results || response.data);
    } catch (err) {
      setError('Failed to fetch your reviews. Please try again.');
      console.error('Error fetching user reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create a new review
  const createReview = async (reviewData) => {
    try {
      setLoading(true);
      setError(null);
      
      const formData = new FormData();
      
      // Add basic review data
      formData.append('product', reviewData.product);
      formData.append('rating', reviewData.rating);
      formData.append('comment', reviewData.comment);
      
      // Add images if provided
      if (reviewData.images && reviewData.images.length > 0) {
        reviewData.images.forEach((image) => {
          if (image instanceof File) {
            formData.append(`images`, image);
          }
        });
      }
      
      // Add videos if provided
      if (reviewData.videos && reviewData.videos.length > 0) {
        reviewData.videos.forEach((video) => {
          if (video instanceof File) {
            formData.append(`videos`, video);
          }
        });
      }

      const response = await api.post('/api/reviews/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Refresh user reviews
      await fetchUserReviews();
      
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.non_field_errors?.[0] || 
                         err.response?.data?.detail || 
                         'Failed to create review. Please try again.';
      setError(errorMessage);
      console.error('Error creating review:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing review
  const updateReview = async (reviewId, reviewData) => {
    try {
      setLoading(true);
      setError(null);
      
      const formData = new FormData();
      
      // Add basic review data
      if (reviewData.rating !== undefined) {
        formData.append('rating', reviewData.rating);
      }
      if (reviewData.comment !== undefined) {
        formData.append('comment', reviewData.comment);
      }
      
      // Add new images if provided
      if (reviewData.images && reviewData.images.length > 0) {
        reviewData.images.forEach((image) => {
          if (image instanceof File) {
            formData.append(`images`, image);
          }
        });
      }
      
      // Add new videos if provided
      if (reviewData.videos && reviewData.videos.length > 0) {
        reviewData.videos.forEach((video) => {
          if (video instanceof File) {
            formData.append(`videos`, video);
          }
        });
      }

      const response = await api.patch(`/api/reviews/${reviewId}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Refresh user reviews
      await fetchUserReviews();
      
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.non_field_errors?.[0] || 
                         err.response?.data?.detail || 
                         'Failed to update review. Please try again.';
      setError(errorMessage);
      console.error('Error updating review:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a review
  const deleteReview = async (reviewId) => {
    try {
      setLoading(true);
      setError(null);
      
      await api.delete(`/api/reviews/${reviewId}/`);
      
      // Refresh user reviews
      await fetchUserReviews();
      
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 
                         'Failed to delete review. Please try again.';
      setError(errorMessage);
      console.error('Error deleting review:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Check if user can review a product (has purchased and received it)
  const canReviewProduct = async (productId) => {
    try {
      const response = await api.get(`/api/reviews/can-review/${productId}/`);
      return response.data.can_review || false;
    } catch (err) {
      console.error('Error checking review eligibility:', err);
      return false;
    }
  };

  // Check if user has already reviewed a product
  const hasReviewedProduct = async (productId) => {
    try {
      const response = await api.get(`/api/reviews/has-reviewed/${productId}/`);
      return response.data.has_reviewed || false;
    } catch (err) {
      console.error('Error checking existing review:', err);
      return false;
    }
  };

  // Get deliverable items that can be reviewed
  const getReviewableItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/reviews/reviewable_items/?can_review_only=true');
      return response.data;
    } catch (err) {
      setError('Failed to fetch reviewable items. Please try again.');
      console.error('Error fetching reviewable items:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get all user's reviewable items (reviewed and unreviewed)
  const getAllUserReviewableItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/reviews/reviewable_items/');
      return response.data;
    } catch (err) {
      setError('Failed to fetch reviewable items. Please try again.');
      console.error('Error fetching reviewable items:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh user reviews when user changes
  useEffect(() => {
    if (user) {
      fetchUserReviews();
    }
  }, [user]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const value = {
    reviews,
    userReviews,
    loading,
    error,
    setError,
    fetchProductReviews,
    fetchUserReviews,
    createReview,
    updateReview,
    deleteReview,
    canReviewProduct,
    hasReviewedProduct,
    getReviewableItems,
    getAllUserReviewableItems,
  };

  return (
    <ReviewContext.Provider value={value}>
      {children}
    </ReviewContext.Provider>
  );
}
