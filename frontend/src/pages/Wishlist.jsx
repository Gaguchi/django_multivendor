import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../contexts/WishlistContext";
import { useCart } from "../contexts/CartContext";

export default function Wishlist() {
  const { wishlist, loading, removeFromWishlist, refreshWishlist } = useWishlist();
  const { cart, addToCart } = useCart();
  const [processingItems, setProcessingItems] = useState({});

  useEffect(() => {
    refreshWishlist();
  }, []);

  const handleRemoveFromWishlist = async (wishlistItemId) => {
    try {
      setProcessingItems(prev => ({ ...prev, [wishlistItemId]: 'removing' }));
      await removeFromWishlist(wishlistItemId);
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
    } finally {
      setProcessingItems(prev => ({ ...prev, [wishlistItemId]: null }));
    }
  };

  const handleAddToCart = async (productId, wishlistItemId) => {
    try {
      setProcessingItems(prev => ({ ...prev, [wishlistItemId]: 'adding' }));
      await addToCart(productId, 1);
      // Optionally, you can automatically remove from wishlist after adding to cart
      // await removeFromWishlist(wishlistItemId);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setProcessingItems(prev => ({ ...prev, [wishlistItemId]: null }));
    }
  };

  // Check if item exists in cart
  const isInCart = (productId) => {
    return cart?.items?.some(item => item.product.id === productId);
  };

  if (loading) {
    return <div className="container py-5 text-center">Loading wishlist...</div>;
  }

  // Ensure wishlist is an array
  const wishlistItems = Array.isArray(wishlist) ? wishlist : [];

  if (wishlistItems.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h2>Your wishlist is empty</h2>
        <Link to="/shop" className="btn btn-primary mt-3">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4">My Wishlist</h1>
      <div className="table-responsive">
        <table className="table table-wishlist">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Status</th>
              <th>Action</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {wishlistItems.map((item) => {
              const inCart = isInCart(item.product.id);
              const isProcessing = processingItems[item.id];
              
              return (
                <tr key={item.id}>
                  <td className="product-col">
                    <figure className="product-image-container">
                      <Link to={`/product/${item.product.id}`} className="product-image">
                        <img src={`${import.meta.env.VITE_API_BASE_URL}/${item.product.thumbnail}`} alt={item.product.name} width="80" height="80" />
                      </Link>
                    </figure>
                    <h5 className="product-title">
                      <Link to={`/product/${item.product.id}`}>{item.product.name}</Link>
                    </h5>
                  </td>
                  <td className="price-col">${parseFloat(item.product.price).toFixed(2)}</td>
                  <td className="stock-col">
                    {(item.product.stock > 0) ? (
                      <span className="in-stock">In Stock</span>
                    ) : (
                      <span className="out-of-stock">Out of Stock</span>
                    )}
                  </td>
                  <td className="action-col">
                    <button
                      className={`btn ${inCart ? 'btn-success' : 'btn-outline-primary'}`}
                      onClick={() => handleAddToCart(item.product.id, item.id)}
                      disabled={item.product.stock <= 0 || inCart || isProcessing === 'adding'}
                    >
                      {isProcessing === 'adding' ? (
                        <span><i className="icon-spin5 animate-spin"></i> Adding...</span>
                      ) : inCart ? (
                        <span><i className="icon-ok"></i> Added to Cart</span>
                      ) : (
                        <span><i className="icon-cart-plus"></i> Add to Cart</span>
                      )}
                    </button>
                  </td>
                  <td className="remove-col">
                    <button
                      className="wishlist-item-delete-btn"
                      onClick={() => handleRemoveFromWishlist(item.id)}
                      disabled={isProcessing === 'removing'}
                      title="Remove from Wishlist"
                    >
                      {isProcessing === 'removing' ? (
                        <i className="icon-spin5 animate-spin"></i>
                      ) : (
                        <i className="icon-cancel"></i>
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="mb-4">
        <Link to="/shop" className="btn btn-primary">Continue Shopping</Link>
      </div>

      <style jsx>{`
        .wishlist-item-delete-btn {
          background: none;
          border: none;
          color: #ea6253;
          font-size: 1.5rem;
          padding: 0.5rem;
          transition: color 0.3s;
        }
        
        .wishlist-item-delete-btn:hover {
          color: #d04132;
        }
        
        .wishlist-item-delete-btn:disabled {
          color: #888;
          cursor: not-allowed;
        }
        
        .product-title {
          margin-bottom: 0;
          font-size: 1rem;
        }
        
        .table-wishlist .product-col {
          display: flex;
          align-items: center;
        }
        
        .table-wishlist .product-image-container {
          margin-right: 1rem;
        }
        
        .in-stock {
          color: #28a745;
          font-weight: bold;
        }
        
        .out-of-stock {
          color: #dc3545;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}
