import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { useWishlist } from '../contexts/WishlistContext'

export default function ProductCard({ 
  product, 
  isHot = false,
  showQuickView = false 
}) {
  const { cart, addToCart, updateCartItem } = useCart()
  const { user } = useAuth()
  const { isInWishlist, toggleWishlistItem } = useWishlist()
  const [loading, setLoading] = useState(false)
  const [inWishlist, setInWishlist] = useState(false)
  
  useEffect(() => {
    if (product && product.id) {
      setInWishlist(isInWishlist(product.id))
    }
  }, [product, isInWishlist])

  // Get current quantity from cart context instead of making a separate request
  const cartItem = cart?.items?.find(item => item.product.id === product.id)
  const cartQuantity = cartItem?.quantity || 0

  const handleAddToCart = async (e) => {
    e.preventDefault()
    if (!user) return
    try {
      setLoading(true)
      await addToCart(product.id, 1)
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateQuantity = async (newQuantity) => {
    if (newQuantity < 0) return
    try {
      setLoading(true)
      await updateCartItem(product.id, newQuantity)
    } catch (error) {
      console.error('Error updating cart:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleToggleWishlist = async (e) => {
    e.preventDefault()
    if (!user) return
    
    try {
      setLoading(true)
      await toggleWishlistItem(product.id)
      setInWishlist(!inWishlist)
    } catch (error) {
      console.error('Error toggling wishlist:', error)
    } finally {
      setLoading(false)
    }
  }

  const {
    id,
    thumbnail,
    name,
    category,
    price,
    old_price,
    is_hot = false 
  } = product;

  // Convert rating to number or default to 0
  const rating = Number(product.rating) || 0

  // Calculate sale percentage if old_price exists
  const salePercentage = old_price ? 
    Math.round(((old_price - price) / old_price) * 100) : null;

  // Handle image URL format
  const imageUrl = thumbnail?.startsWith('http') 
    ? thumbnail 
    : `${import.meta.env.VITE_API_BASE_URL}/${thumbnail}`;

  return (
    <div className="uniform-product-card">
      <div className="product-card-inner">
        {/* Image section */}
        <div className="uniform-product-image-container">
          <Link to={`/product/${id}`}>
            <div 
              className="uniform-product-image"
              style={{ backgroundImage: `url(${imageUrl})` }}
            ></div>
            
            {/* Labels for hot items and sales */}
            <div className="uniform-product-labels">
              {(isHot || is_hot) && <span className="product-label uniform-hot-label">HOT</span>}
              {salePercentage && <span className="product-label uniform-sale-label">-{salePercentage}%</span>}
            </div>
          </Link>
          
          {/* Quick action buttons */}
                <div className="uniform-btn-group">
                <button 
                  className={`uniform-btn uniform-wishlist-btn`}
                  onClick={handleToggleWishlist}
                  disabled={loading}
                  title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  {inWishlist ? (
                  <img src="src/assets/images/svgs/heart-filled.svg" alt="Remove from Wishlist" />
                  ) : (
                  <img src="src/assets/images/svgs/heart.svg" alt="Add to Wishlist" />
                  )}
                </button>
                {showQuickView && (
                  <button 
                  className="uniform-btn uniform-quickview-btn"
                  title="Quick View"
                  >
                  <i className="fas fa-external-link-alt"></i>
                  </button>
                )}
                </div>
              </div>
              
              {/* Product details section */}
        <div className="uniform-product-details">
          {/* Category */}
          {category && (
            <div className="uniform-product-category">
              <Link to={`/category/${category}`}>{category}</Link>
            </div>
          )}
          
          {/* Product title with tooltip for full name */}
          <h3 className="uniform-product-title" title={name}>
            <Link to={`/product/${id}`}>{name}</Link>
          </h3>
          
          {/* Ratings */}
          <div className="uniform-ratings">
            <div className="uniform-stars-container">
              <div className="uniform-stars-fill" style={{ width: `${rating * 20}%` }}></div>
            </div>
          </div>
          
          {/* Price */}
          <div className="uniform-price-container">
            {old_price && (
              <span className="uniform-old-price">${parseFloat(old_price).toFixed(2)}</span>
            )}
            <span className="uniform-price">${parseFloat(price).toFixed(2)}</span>
          </div>
          
          {/* Add to cart or quantity adjustment */}
          <div className="uniform-product-action">
            {cartQuantity > 0 ? (
              <div className="uniform-quantity-adjuster">
                <button 
                  className="uniform-quantity-btn uniform-quantity-minus" 
                  onClick={() => handleUpdateQuantity(cartQuantity - 1)}
                  disabled={loading}
                >
                  -
                </button>
                <span className="uniform-quantity">{cartQuantity}</span>
                <button 
                  className="uniform-quantity-btn uniform-quantity-plus" 
                  onClick={() => handleUpdateQuantity(cartQuantity + 1)}
                  disabled={loading}
                >
                  +
                </button>
              </div>
            ) : (
              <button 
                className="uniform-add-cart-btn"
                onClick={handleAddToCart}
                disabled={loading}
              >
                {loading ? 'Adding...' : <><i className="fa fa-shopping-cart"></i> დამატება</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    thumbnail: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.string,
    price: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]).isRequired,
    old_price: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]),
    rating: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]),
    is_hot: PropTypes.bool
  }).isRequired,
  isHot: PropTypes.bool,
  showQuickView: PropTypes.bool
}
