import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
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
    category,  // Changed from category_name to match what we're passing
    price,
    old_price,
    vendor_name,
    is_hot = false // Use the server-provided is_hot value if available
  } = product;

  // Convert rating to number or default to 0
  const rating = Number(product.rating) || 0

  // Calculate sale percentage if old_price exists
  const salePercentage = old_price ? 
    Math.round(((old_price - price) / old_price) * 100) : null;

  return (
    <div className="product-default inner-btn inner-icon inner-icon-inline left-details">
      <figure>
        <Link to={`/product/${id}`}>
          <img
            src={thumbnail}
            width={280}
            height={280}
            alt={name}
            className='rounded'
          />
        </Link>
        <div className="label-group">
          {(isHot || is_hot) && <div className="product-label label-hot">HOT</div>}
          {salePercentage && (
            <div className="product-label label-sale">-{salePercentage}%</div>
          )}
        </div>
        <div className="btn-icon-group">
          <a
            href="#"
            className="btn-icon btn-add-cart product-type-simple"
            onClick={handleAddToCart}
            role="button"
            aria-disabled={loading}
          >
            <i className="icon-shopping-cart" />
          </a>
          <a
            href="#"
            className={`btn-icon btn-icon-wish product-type-simple ${inWishlist ? 'added-wishlist' : ''}`}
            title={inWishlist ? "Go to Wishlist" : "Add to Wishlist"}
            onClick={handleToggleWishlist}
            aria-disabled={loading}
          >
            <i className="icon-heart" />
          </a>
          {showQuickView && (
            <a
              href="#"
              className="btn-icon btn-quickview"
              title="Quick View"
              onClick={(e) => {
                e.preventDefault();
                // Handle quick view logic here
              }}
            >
              <i className="fas fa-external-link-alt" />
            </a>
          )}
        </div>
      </figure>
      <div className="product-details">
        <div className="category-wrap">
          <div className="category-list">
            <Link
              to={`/category/${category}`}
              className="product-category"
            >
              {category}  {/* Using the category prop directly */}
            </Link>
          </div>
        </div>
        <h3 className="product-title">
          <Link to={`/product/${id}`}>{name}</Link>
        </h3>
        <div className="ratings-container">
          <div className="product-ratings">
            <span 
              className="ratings" 
              style={{ width: `${rating * 20}%` }} 
            />
            <span className="tooltiptext tooltip-top" />
          </div>
        </div>
        <div className="price-box">
          {old_price && (
            <span className="old-price">${parseFloat(old_price).toFixed(2)}</span>
          )}
          <span className="product-price">${parseFloat(price).toFixed(2)}</span>
        </div>
        <div className="product-action">
          {cartQuantity > 0 ? (
            <div className="product-single-qty">
              <div className="input-group bootstrap-touchspin bootstrap-touchspin-injected">
                <span className="input-group-btn input-group-prepend">
                  <button
                    className="btn btn-outline btn-down-icon bootstrap-touchspin-down"
                    type="button"
                    onClick={() => handleUpdateQuantity(cartQuantity - 1)}
                    disabled={loading}
                  />
                </span>
                <input 
                  className="horizontal-quantity form-control" 
                  type="text"
                  value={cartQuantity}
                  readOnly
                />
                <span className="input-group-btn input-group-append">
                  <button
                    className="btn btn-outline btn-up-icon bootstrap-touchspin-up"
                    type="button"
                    onClick={() => handleUpdateQuantity(cartQuantity + 1)}
                    disabled={loading}
                  />
                </span>
              </div>
            </div>
          ) : (
            <a 
              href="#"
              className="btn-icon btn-add-cart product-type-simple"
              onClick={handleAddToCart}
              role="button"
              aria-disabled={loading}
            >
              <i className="icon-shopping-cart" />
              <span>{loading ? 'ADDING...' : 'ADD TO CART'}</span>
            </a>
          )}
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
    category: PropTypes.string,  // Changed from category_name to match what we're passing
    vendor_name: PropTypes.string,
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
      PropTypes.string // Allow string since it gets converted
    ]),
    is_hot: PropTypes.bool
  }).isRequired,
  isHot: PropTypes.bool,
  showQuickView: PropTypes.bool
}
