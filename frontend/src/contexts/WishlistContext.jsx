import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch wishlist when user is available
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) {
        setWishlist([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get('/api/users/wishlist/');
        
        // Handle different response formats and ensure we always set an array
        if (response.data) {
          if (Array.isArray(response.data)) {
            setWishlist(response.data);
          } else if (response.data.results && Array.isArray(response.data.results)) {
            // If we get paginated results
            setWishlist(response.data.results);
          } else {
            // If we get an unexpected format, set empty array
            console.warn('Unexpected wishlist data format:', response.data);
            setWishlist([]);
          }
        } else {
          setWishlist([]);
        }
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        setWishlist([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user]);

  // Add to wishlist
  const addToWishlist = async (productId) => {
    try {
      const response = await api.post('/api/users/wishlist/', {
        product_id: productId
      });
      
      // Refresh wishlist after adding to ensure data consistency
      refreshWishlist();
      return response.data;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      throw error;
    }
  };

  // Remove from wishlist
  const removeFromWishlist = async (wishlistItemId) => {
    try {
      await api.delete(`/api/users/wishlist/${wishlistItemId}/`);
      
      // Update the wishlist state by removing the item
      setWishlist(current => current.filter(item => item.id !== wishlistItemId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      throw error;
    }
  };

  // Toggle wishlist item (add if not in wishlist, remove if in wishlist)
  const toggleWishlistItem = async (productId) => {
    try {
      const response = await api.post('/api/users/wishlist/toggle/', {
        product_id: productId
      });
      
      // Refresh the wishlist after toggle
      await refreshWishlist();
      
      return response.data;
    } catch (error) {
      console.error('Error toggling wishlist item:', error);
      throw error;
    }
  };

  // Check if a product is in wishlist
  const isInWishlist = (productId) => {
    return wishlist.some(item => item.product.id === productId);
  };

  // Get wishlist item id by product id
  const getWishlistItemId = (productId) => {
    const item = wishlist.find(item => item.product.id === productId);
    return item ? item.id : null;
  };

  const refreshWishlist = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/users/wishlist/');
      
      // Handle different response formats
      if (response.data) {
        if (Array.isArray(response.data)) {
          setWishlist(response.data);
        } else if (response.data.results && Array.isArray(response.data.results)) {
          setWishlist(response.data.results);
        } else {
          console.warn('Unexpected wishlist data format during refresh:', response.data);
          setWishlist([]);
        }
      } else {
        setWishlist([]);
      }
    } catch (error) {
      console.error('Error refreshing wishlist:', error);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
    toggleWishlistItem,
    isInWishlist,
    getWishlistItemId,
    refreshWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}
