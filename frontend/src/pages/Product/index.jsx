import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Images from './Images'
import { useCart } from '../../contexts/CartContext'
import { useWishlist } from '../../contexts/WishlistContext'
import { useAuth } from '../../contexts/AuthContext'
import styles from './Product.module.css'

export default function Product() {
  const [selectedImage, setSelectedImage] = useState(0)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [addingToCart, setAddingToCart] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [showAllAttributes, setShowAllAttributes] = useState(false)
  
  const { addToCart } = useCart()
  const { user } = useAuth()
  const { isInWishlist, toggleWishlistItem } = useWishlist()
  const { id } = useParams()
  const navigate = useNavigate()

  // Store which combo products are checked in state
  const [checkedProducts, setCheckedProducts] = useState({})
  const [totalComboPrice, setTotalComboPrice] = useState(0)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Add the master token to headers
        const config = {
          headers: {
            'X-Master-Token': 'your-super-secret-token'
          }
        }
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/vendors/products/${id}/`, config)
        setProduct(response.data)
        
        // Initialize all companion products as checked
        if (response.data.frequently_bought_together && response.data.frequently_bought_together.length > 0) {
          const initialCheckedState = {}
          // The main product is always checked
          initialCheckedState[response.data.id] = true
          
          // All companion products start as checked
          response.data.frequently_bought_together.forEach(item => {
            initialCheckedState[item.id] = true
          })
          setCheckedProducts(initialCheckedState)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  // Calculate total price whenever checked products change
  useEffect(() => {
    if (!product) return

    let total = 0
    // Add main product price if checked
    if (checkedProducts[product.id]) {
      total += parseFloat(product.price)
    }

    // Add companion product prices if checked
    if (product.frequently_bought_together) {
      product.frequently_bought_together.forEach(item => {
        if (checkedProducts[item.id]) {
          total += parseFloat(item.price)
        }
      })
    }

    setTotalComboPrice(total)
  }, [checkedProducts, product])

  const handleToggleProduct = (productId) => {
    setCheckedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }))
  }
  
  const handleAddToCart = async () => {
    try {
      setAddingToCart(true)
      // Add main product if checked
      if (checkedProducts[product.id]) {
        await addToCart(product.id, 1)
      }
      
      // Add each checked companion product
      if (product.frequently_bought_together) {
        for (const item of product.frequently_bought_together) {
          if (checkedProducts[item.id]) {
            await addToCart(item.id, 1)
          }
        }
      }
      
      // Clean up any potential zoom elements before navigation
      const zoomElements = document.querySelectorAll('.img-zoom-result');
      if (zoomElements.length > 0) {
        zoomElements.forEach(el => el.style.display = 'none');
      }
      
      // Add a small delay to ensure cleanup happens before navigation
      setTimeout(() => {
        navigate('/cart');
      }, 100);
    } catch (err) {
      console.error('Error adding products to cart:', err)
    } finally {
      setAddingToCart(false)
    }
  }

  const handleAddMainProductToCart = async () => {
    try {
      setAddingToCart(true)
      await addToCart(product.id, quantity)
      
      // Clean up any potential zoom elements before navigation
      const zoomElements = document.querySelectorAll('.img-zoom-result');
      if (zoomElements.length > 0) {
        zoomElements.forEach(el => el.style.display = 'none');
      }
      
      // Add a small delay to ensure cleanup happens before navigation
      setTimeout(() => {
        navigate('/cart');
      }, 100);
    } catch (err) {
      console.error('Error adding product to cart:', err)
    } finally {
      setAddingToCart(false)
    }
  }

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity)
    }
  }

  const handleWishlistToggle = async () => {
    if (!user) {
      navigate('/login')
      return
    }
    await toggleWishlistItem(product.id)
  }

  const calculateDiscount = () => {
    if (product.old_price && product.price) {
      const discount = ((product.old_price - product.price) / product.old_price) * 100
      return Math.round(discount)
    }
    return 0
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="fas fa-star text-warning"></i>)
    }
    
    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt text-warning"></i>)
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star text-muted"></i>)
    }
    
    return stars
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!product) return <div>Product not found</div>

  // Check if there are any frequently bought together products
  const hasFrequentlyBoughtTogether = product.frequently_bought_together && product.frequently_bought_together.length > 0

  // Count how many items are selected
  const selectedItemCount = Object.values(checkedProducts).filter(Boolean).length

  // Get the appropriate button text
  const getAddToCartText = () => {
    if (selectedItemCount === 0) return "Choose items to buy together"
    if (selectedItemCount === 1) return "Add to Cart"
    if (selectedItemCount === 2) return `Add both to Cart`
    return `Add all ${selectedItemCount} to Cart`
  }

  return (
    <main className="main">
      <div className="container py-4">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/" className="text-decoration-none">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/shop" className="text-decoration-none">Shop</Link>
            </li>
            {product.category && (
              <li className="breadcrumb-item">
                <Link to={`/category/${product.category.slug}`} className="text-decoration-none">
                  {product.category.name}
                </Link>
              </li>
            )}
            <li className="breadcrumb-item active" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="row g-4 position-relative" style={{ zIndex: 1 }}>
          {/* Product Images Section */}
          <Images 
            product={product} 
            selectedImage={selectedImage} 
            setSelectedImage={setSelectedImage} 
          />
          
          {/* Product Details Section */}
          <div className="col-12 col-lg-8">
            <div className="product-details-wrapper">
              
              {/* Product Header */}
              <div className={`${styles.productHeader} mb-4`}>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="flex-grow-1">
                    <h1 className="product-title h2 mb-2 fw-bold">{product.name}</h1>
                    <div className="product-meta d-flex align-items-center gap-3 flex-wrap">
                      <div className={`${styles.ratingSection} d-flex align-items-center gap-2`}>
                        <div className="stars d-flex">
                          {renderStars(product.average_rating || 0)}
                        </div>
                        <span className="rating-text fw-medium text-primary">
                          {(product.average_rating || 0).toFixed(1)}
                        </span>
                        <span className="text-muted">|</span>
                        <Link 
                          to="#reviews" 
                          className="text-decoration-none text-muted hover-primary"
                          onClick={() => setActiveTab('reviews')}
                        >
                          {product.review_count || 0} reviews
                        </Link>
                      </div>
                      
                      {product.brand && (
                        <>
                          <span className="text-muted">|</span>
                          <span className={styles.brandText}>
                            Brand: <strong>{product.brand}</strong>
                          </span>
                        </>
                      )}

                      <div className={styles.stockBadge}>
                        <span className={`badge ${
                          product.stock > 20 
                            ? 'bg-success' 
                            : product.stock > 5 
                              ? 'bg-warning text-dark' 
                              : product.stock > 0 
                                ? 'bg-danger' 
                                : 'bg-secondary'
                        }`}>
                          {product.stock > 20 
                            ? 'In Stock' 
                            : product.stock > 0 
                              ? `Only ${product.stock} left` 
                              : 'Out of Stock'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    className={`btn btn-outline-primary ${styles.btnWishlist} ${isInWishlist(product.id) ? 'active' : ''}`}
                    onClick={handleWishlistToggle}
                    title={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <i className={`${isInWishlist(product.id) ? 'fas' : 'far'} fa-heart`}></i>
                  </button>
                </div>
              </div>

              {/* Price Section */}
              <div className={`${styles.priceSection} p-4 bg-light rounded-3 mb-4`}>
                <div className="price-wrapper">
                  <div className="current-price-section mb-2">
                    <span className={`${styles.currentPrice} display-6 fw-bold text-primary`}>
                      ${parseFloat(product.price).toFixed(2)}
                    </span>
                    {product.old_price && (
                      <div className="price-comparison d-inline-flex align-items-center gap-3 ms-3">
                        <span className={`${styles.oldPrice} h5 text-decoration-line-through text-muted mb-0`}>
                          ${parseFloat(product.old_price).toFixed(2)}
                        </span>
                        <span className={`${styles.discountBadge} badge bg-danger fs-6 py-2 px-3`}>
                          -{calculateDiscount()}% OFF
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {product.old_price && (
                    <div className={styles.savingsText}>
                      <span className="text-success fw-semibold fs-6">
                        <i className="fas fa-tag me-2"></i>
                        You save ${(parseFloat(product.old_price) - parseFloat(product.price)).toFixed(2)}
                      </span>
                    </div>
                  )}
                  
                  <div className={`${styles.priceFeatures} mt-3`}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className={`${styles.featureItem} d-flex align-items-center gap-2`}>
                          <i className="fas fa-shield-alt text-success"></i>
                          <small className="text-muted">Price match guarantee</small>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className={`${styles.featureItem} d-flex align-items-center gap-2`}>
                          <i className="fas fa-undo-alt text-primary"></i>
                          <small className="text-muted">30-day free returns</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Purchase Section */}
              <div className="purchase-section">
                <div className="row g-4">
                  
                  {/* Quantity & Options */}
                  <div className="col-md-6">
                    <div className="quantity-section border rounded-3 p-4">
                      <h6 className="fw-bold mb-3">
                        <i className="fas fa-shopping-cart me-2"></i>
                        Purchase Options
                      </h6>
                      
                      <div className={`${styles.quantitySelector} mb-3`}>
                        <label className="form-label fw-medium mb-2">Quantity:</label>
                        <div className="quantity-controls d-flex align-items-center gap-2">
                          <button 
                            className={`btn btn-outline-secondary ${styles.quantityBtn}`}
                            onClick={() => handleQuantityChange(quantity - 1)}
                            disabled={quantity <= 1}
                          >
                            <i className="fas fa-minus"></i>
                          </button>
                          <input 
                            type="number" 
                            className={`form-control ${styles.quantityInput} text-center fw-bold`}
                            value={quantity}
                            onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                            min="1"
                            max={product.stock}
                          />
                          <button 
                            className={`btn btn-outline-secondary ${styles.quantityBtn}`}
                            onClick={() => handleQuantityChange(quantity + 1)}
                            disabled={quantity >= product.stock}
                          >
                            <i className="fas fa-plus"></i>
                          </button>
                        </div>
                        <small className="text-muted">
                          Total: <strong>${(parseFloat(product.price) * quantity).toFixed(2)}</strong>
                        </small>
                      </div>

                      {/* Action Buttons */}
                      <div className={styles.actionButtons}>
                        <button 
                          className={`btn btn-primary btn-lg w-100 mb-3 ${styles.actionBtnPrimary}`}
                          onClick={handleAddMainProductToCart}
                          disabled={addingToCart || product.stock === 0}
                        >
                          <i className="fas fa-shopping-cart me-2"></i>
                          {addingToCart ? (
                            <>
                              <span className={`${styles.spinnerBorder} spinner-border-sm me-2`} role="status"></span>
                              Adding to Cart...
                            </>
                          ) : (
                            'Add to Cart'
                          )}
                        </button>
                        
                        <div className="row g-2">
                          <div className="col-6">
                            <button className={`btn btn-dark btn-lg w-100 ${styles.actionBtnSecondary}`}>
                              <i className="fas fa-bolt me-2"></i>
                              Buy Now
                            </button>
                          </div>
                          <div className="col-6">
                            <button className={`btn btn-outline-primary btn-lg w-100 ${styles.actionBtnTertiary}`}>
                              <i className="fas fa-credit-card me-2"></i>
                              Installment
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Delivery & Services */}
                  <div className="col-md-6">
                    <div className="services-section border rounded-3 p-4">
                      <h6 className="fw-bold mb-3">
                        <i className="fas fa-truck me-2"></i>
                        Delivery & Services
                      </h6>
                      
                      {/* Delivery Options */}
                      <div className="delivery-options mb-4">
                        <div className={`${styles.deliveryOption} p-3 border rounded mb-2 ${styles.deliveryHighlight}`}>
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center gap-3">
                              <i className="fas fa-shipping-fast text-success fs-4"></i>
                              <div>
                                <div className="fw-bold text-success">Free Delivery</div>
                                <small className="text-muted">3-5 business days</small>
                              </div>
                            </div>
                            <span className="badge bg-success">FREE</span>
                          </div>
                        </div>
                        
                        <div className={`${styles.deliveryOption} p-3 border rounded`}>
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center gap-3">
                              <i className="fas fa-bolt text-warning fs-4"></i>
                              <div>
                                <div className="fw-bold">Express Delivery</div>
                                <small className="text-muted">Same day (3 hours)</small>
                              </div>
                            </div>
                            <span className="badge bg-warning text-dark">$9.99</span>
                          </div>
                        </div>
                      </div>

                      {/* Payment Options */}
                      <div className="payment-section">
                        <label className="form-label fw-medium mb-2">Payment Options:</label>
                        <div className={`${styles.paymentMethods} d-flex align-items-center gap-2 mb-2`}>
                          <img src="https://placehold.co/40x24/007bff/white?text=VISA" alt="Visa" className={styles.paymentLogo}/>
                          <img src="https://placehold.co/40x24/ff6b35/white?text=MC" alt="Mastercard" className={styles.paymentLogo}/>
                          <img src="https://placehold.co/40x24/1a73e8/white?text=PP" alt="PayPal" className={styles.paymentLogo}/>
                          <img src="https://placehold.co/40x24/28a745/white?text=GPay" alt="Google Pay" className={styles.paymentLogo}/>
                        </div>
                        <div className="installment-info">
                          <small className="text-primary">
                            <i className="fas fa-calculator me-1"></i>
                            Monthly payments from $16.67
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Specs */}
              {product.attribute_values && product.attribute_values.length > 0 && (
                <div className={`${styles.quickSpecs} mt-4`}>
                  <div className="card border-0 bg-light">
                    <div className="card-body p-4">
                      <h6 className="fw-bold mb-3">
                        <i className="fas fa-list-ul me-2"></i>
                        Key Features
                      </h6>
                      <div className="row g-3">
                        {product.attribute_values.slice(0, 6).map(attr => (
                          <div key={attr.id} className="col-md-6">
                            <div className={styles.featureItem}>
                              <strong className="text-secondary">{attr.attribute_name}:</strong>
                              <span className="ms-2">
                                {attr.display_value || attr.text_value || 
                                  (attr.boolean_value !== null ? (attr.boolean_value ? 'Yes' : 'No') : 
                                  (attr.number_value !== null ? attr.number_value : 'Not specified'))}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      {product.attribute_values.length > 6 && (
                        <div className="text-center mt-3">
                          <button 
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => setActiveTab('specifications')}
                          >
                            View All Specifications
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Tabbed Product Details Section */}
        <div className="row mt-5" style={{ position: 'relative', zIndex: 1 }}>
          <div className="col-12">
            <div className="product-tabs-container">
              {/* Modern Tab Navigation */}
              <div className={styles.tabsNavigation}>
                <div className={`nav nav-pills nav-justified ${styles.modernTabs}`} role="tablist">
                  <button 
                    className={`nav-link ${styles.tabButton} ${activeTab === 'description' ? 'active' : ''}`}
                    onClick={() => setActiveTab('description')}
                    type="button"
                  >
                    <div className={styles.tabContentWrapper}>
                      <i className={`fas fa-align-left ${styles.tabIcon}`}></i>
                      <span className={styles.tabText}>Description</span>
                    </div>
                  </button>
                  
                  <button 
                    className={`nav-link ${styles.tabButton} ${activeTab === 'specifications' ? 'active' : ''}`}
                    onClick={() => setActiveTab('specifications')}
                    type="button"
                  >
                    <div className={styles.tabContentWrapper}>
                      <i className={`fas fa-cog ${styles.tabIcon}`}></i>
                      <span className={styles.tabText}>Specifications</span>
                      {product.attribute_values && (
                        <span className={styles.tabBadge}>{product.attribute_values.length}</span>
                      )}
                    </div>
                  </button>
                  
                  <button 
                    className={`nav-link ${styles.tabButton} ${activeTab === 'reviews' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reviews')}
                    type="button"
                  >
                    <div className={styles.tabContentWrapper}>
                      <i className={`fas fa-star ${styles.tabIcon}`}></i>
                      <span className={styles.tabText}>Reviews</span>
                      <span className={styles.tabBadge}>{product.review_count || 0}</span>
                    </div>
                  </button>
                  
                  <button 
                    className={`nav-link ${styles.tabButton} ${activeTab === 'shipping' ? 'active' : ''}`}
                    onClick={() => setActiveTab('shipping')}
                    type="button"
                  >
                    <div className={styles.tabContentWrapper}>
                      <i className={`fas fa-shipping-fast ${styles.tabIcon}`}></i>
                      <span className={styles.tabText}>Shipping</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Enhanced Tab Content */}
              <div className={styles.tabContentArea}>
                
                {/* Description Tab */}
                {activeTab === 'description' && (
                  <div className={`${styles.tabPane} active`}>
                    <div className="card border-0 shadow-sm">
                      <div className={`card-header ${styles.bgGradientPrimary} text-white`}>
                        <h5 className="mb-0">
                          <i className="fas fa-info-circle me-2"></i>
                          Product Description
                        </h5>
                      </div>
                      <div className="card-body p-4">
                        <div className="rich-content">
                          {product.description_html ? (
                            <div 
                              className="formatted-description"
                              dangerouslySetInnerHTML={{ __html: product.description_html }}
                            />
                          ) : product.description ? (
                            <div className="simple-description">
                              <p className="lead text-muted mb-4">{product.description}</p>
                            </div>
                          ) : (
                            <div className={`${styles.noDescription} text-center py-5`}>
                              <i className="fas fa-file-alt fs-1 text-muted mb-3"></i>
                              <h6 className="text-muted">No description available</h6>
                              <p className="text-muted">The seller hasn't provided a detailed description for this product yet.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Specifications Tab */}
                {activeTab === 'specifications' && (
                  <div className={`${styles.tabPane} active`}>
                    <div className="card border-0 shadow-sm">
                      <div className={`card-header ${styles.bgGradientInfo} text-white`}>
                        <h5 className="mb-0">
                          <i className="fas fa-cog me-2"></i>
                          Technical Specifications
                        </h5>
                      </div>
                      <div className="card-body p-0">
                        {product.attribute_values && product.attribute_values.length > 0 ? (
                          <div className="specifications-container">
                            <div className="table-responsive">
                              <table className={`table table-hover ${styles.specificationsTable} mb-0`}>
                                <tbody>
                                  {product.attribute_values
                                    .slice(0, showAllAttributes ? product.attribute_values.length : 15)
                                    .map((attr, index) => (
                                      <tr key={attr.id} className={index % 2 === 0 ? 'table-light' : ''}>
                                        <td className={`${styles.specName} fw-semibold text-secondary`} style={{ width: '35%' }}>
                                          <i className="fas fa-dot-circle me-2 text-primary"></i>
                                          {attr.attribute_name}
                                        </td>
                                        <td className={styles.specValue}>
                                          <span className={styles.valueText}>
                                            {attr.display_value || attr.text_value || 
                                              (attr.boolean_value !== null ? (
                                                <span className={`badge ${attr.boolean_value ? 'bg-success' : 'bg-secondary'}`}>
                                                  {attr.boolean_value ? 'Yes' : 'No'}
                                                </span>
                                              ) : 
                                              (attr.number_value !== null ? (
                                                <span className="fw-bold text-primary">{attr.number_value}</span>
                                              ) : (
                                                <span className="text-muted fst-italic">Not specified</span>
                                              )))}
                                          </span>
                                        </td>
                                      </tr>
                                    ))
                                  }
                                </tbody>
                              </table>
                            </div>
                            
                            {product.attribute_values.length > 15 && (
                              <div className="text-center p-4 border-top">
                                <button 
                                  className="btn btn-outline-primary btn-lg"
                                  onClick={() => setShowAllAttributes(!showAllAttributes)}
                                >
                                  <i className={`fas fa-chevron-${showAllAttributes ? 'up' : 'down'} me-2`}></i>
                                  {showAllAttributes 
                                    ? 'Show Less' 
                                    : `Show All ${product.attribute_values.length} Specifications`
                                  }
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className={`${styles.noSpecs} text-center py-5`}>
                            <i className="fas fa-tools fs-1 text-muted mb-3"></i>
                            <h6 className="text-muted">No specifications available</h6>
                            <p className="text-muted">Technical specifications will be added soon.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div className={`${styles.tabPane} active`}>
                    <div className="reviews-section">
                      {/* Review Summary Card */}
                      <div className="card border-0 shadow-sm mb-4">
                        <div className={`card-header ${styles.bgGradientWarning} text-white`}>
                          <h5 className="mb-0">
                            <i className="fas fa-star me-2"></i>
                            Customer Reviews
                          </h5>
                        </div>
                        <div className="card-body p-4">
                          <div className="row align-items-center">
                            <div className="col-md-4">
                              <div className="rating-summary text-center">
                                <div className="display-3 fw-bold text-warning mb-2">
                                  {(product.average_rating || 0).toFixed(1)}
                                </div>
                                <div className="stars-large mb-3">
                                  {renderStars(product.average_rating || 0)}
                                </div>
                                <div className="review-count text-muted">
                                  Based on <strong>{product.review_count || 0}</strong> reviews
                                </div>
                              </div>
                            </div>
                            <div className="col-md-8">
                              <div className={styles.ratingBreakdown}>
                                <h6 className="mb-3">Rating Distribution</h6>
                                {[5, 4, 3, 2, 1].map(rating => {
                                  const percentage = Math.random() * 80; // Placeholder
                                  const count = Math.floor(Math.random() * 50); // Placeholder
                                  return (
                                    <div key={rating} className={`${styles.ratingBarItem} d-flex align-items-center mb-2`}>
                                      <div className="rating-label me-3" style={{ width: '80px' }}>
                                        <span className="fw-medium">{rating}</span>
                                        <i className="fas fa-star text-warning ms-1"></i>
                                      </div>
                                      <div className="progress flex-grow-1 me-3" style={{ height: '12px' }}>
                                        <div 
                                          className={`${styles.progressBar} bg-warning`} 
                                          style={{ width: `${percentage}%` }}
                                        ></div>
                                      </div>
                                      <span className="count-text text-muted" style={{ width: '50px' }}>
                                        ({count})
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Individual Reviews */}
                      <div className="reviews-list">
                        {product.reviews && product.reviews.length > 0 ? (
                          <div className="row g-4">
                            {product.reviews.map(review => (
                              <div key={review.id} className="col-12">
                                <div className={`${styles.reviewCard} card border-0 shadow-sm`}>
                                  <div className="card-body p-4">
                                    <div className="review-header d-flex justify-content-between align-items-start mb-3">
                                      <div className="reviewer-info">
                                        <div className="d-flex align-items-center gap-3">
                                          <div className="reviewer-avatar">
                                            <div className={`${styles.avatarCircle} bg-primary text-white d-flex align-items-center justify-content-center`}>
                                              {(review.user_name || 'A').charAt(0).toUpperCase()}
                                            </div>
                                          </div>
                                          <div>
                                            <h6 className="mb-1 fw-bold">{review.user_name || 'Anonymous'}</h6>
                                            <div className="d-flex align-items-center gap-2">
                                              <div className={styles.reviewStars}>
                                                {renderStars(review.rating)}
                                              </div>
                                              <span className="rating-value fw-bold text-primary">
                                                {review.rating}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="review-date text-muted small">
                                        <i className="fas fa-calendar-alt me-1"></i>
                                        {new Date(review.created_at).toLocaleDateString('en-US', {
                                          year: 'numeric',
                                          month: 'short',
                                          day: 'numeric'
                                        })}
                                      </div>
                                    </div>
                                    <div className="review-content">
                                      <p className="mb-0 text-dark">{review.comment}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className={styles.noReviews}>
                            <div className="card border-0 bg-light text-center py-5">
                              <div className="card-body">
                                <i className="fas fa-comments fs-1 text-muted mb-4"></i>
                                <h5 className="text-muted mb-3">No reviews yet</h5>
                                <p className="text-muted mb-4">Be the first to share your experience with this product!</p>
                                <button className="btn btn-primary btn-lg">
                                  <i className="fas fa-edit me-2"></i>
                                  Write First Review
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Shipping Tab */}
                {activeTab === 'shipping' && (
                  <div className={`${styles.tabPane} active`}>
                    <div className="card border-0 shadow-sm">
                      <div className={`card-header ${styles.bgGradientSuccess} text-white`}>
                        <h5 className="mb-0">
                          <i className="fas fa-shipping-fast me-2"></i>
                          Shipping & Delivery
                        </h5>
                      </div>
                      <div className="card-body p-4">
                        <div className="shipping-content">
                          
                          {/* Shipping Options */}
                          <div className="shipping-options mb-5">
                            <h6 className="section-title mb-4">
                              <i className="fas fa-truck me-2 text-primary"></i>
                              Available Delivery Options
                            </h6>
                            <div className="row g-4">
                              <div className="col-md-6">
                                <div className={`${styles.shippingOptionHover} p-4 border rounded-3 h-100`}>
                                  <div className="d-flex align-items-center gap-3 mb-3">
                                    <div className="shipping-icon">
                                      <i className="fas fa-shipping-fast text-success fs-2"></i>
                                    </div>
                                    <div>
                                      <h6 className="mb-1 fw-bold">Standard Delivery</h6>
                                      <span className="badge bg-success">FREE</span>
                                    </div>
                                  </div>
                                  <p className="text-muted mb-3">
                                    Get your order delivered to your doorstep within 3-5 business days at no extra cost.
                                  </p>
                                  <ul className={`list-unstyled ${styles.shippingFeatures}`}>
                                    <li><i className="fas fa-check text-success me-2"></i>Free for orders over $50</li>
                                    <li><i className="fas fa-check text-success me-2"></i>Tracking included</li>
                                    <li><i className="fas fa-check text-success me-2"></i>Secure packaging</li>
                                  </ul>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className={`${styles.shippingOptionHover} p-4 border rounded-3 h-100`}>
                                  <div className="d-flex align-items-center gap-3 mb-3">
                                    <div className="shipping-icon">
                                      <i className="fas fa-bolt text-warning fs-2"></i>
                                    </div>
                                    <div>
                                      <h6 className="mb-1 fw-bold">Express Delivery</h6>
                                      <span className="badge bg-warning text-dark">$9.99</span>
                                    </div>
                                  </div>
                                  <p className="text-muted mb-3">
                                    Need it fast? Get same-day delivery within 3 hours for urgent orders.
                                  </p>
                                  <ul className={`list-unstyled ${styles.shippingFeatures}`}>
                                    <li><i className="fas fa-check text-warning me-2"></i>Same-day delivery</li>
                                    <li><i className="fas fa-check text-warning me-2"></i>3-hour window</li>
                                    <li><i className="fas fa-check text-warning me-2"></i>Real-time tracking</li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Shipping Features */}
                          <div className="shipping-features-section">
                            <h6 className="section-title mb-4">
                              <i className="fas fa-shield-alt me-2 text-primary"></i>
                              Shipping Guarantees
                            </h6>
                            <div className="row g-4">
                              <div className="col-md-3 col-sm-6">
                                <div className={`${styles.featureItem} text-center`}>
                                  <div className={`${styles.featureIcon} mb-3`}>
                                    <i className="fas fa-box text-primary fs-2"></i>
                                  </div>
                                  <h6 className="fw-bold">Secure Packaging</h6>
                                  <p className="text-muted small mb-0">Items carefully packed to prevent damage</p>
                                </div>
                              </div>
                              <div className="col-md-3 col-sm-6">
                                <div className={`${styles.featureItem} text-center`}>
                                  <div className={`${styles.featureIcon} mb-3`}>
                                    <i className="fas fa-map-marker-alt text-success fs-2"></i>
                                  </div>
                                  <h6 className="fw-bold">Real-time Tracking</h6>
                                  <p className="text-muted small mb-0">Track your order every step of the way</p>
                                </div>
                              </div>
                              <div className="col-md-3 col-sm-6">
                                <div className={`${styles.featureItem} text-center`}>
                                  <div className={`${styles.featureIcon} mb-3`}>
                                    <i className="fas fa-undo-alt text-info fs-2"></i>
                                  </div>
                                  <h6 className="fw-bold">Easy Returns</h6>
                                  <p className="text-muted small mb-0">30-day hassle-free return policy</p>
                                </div>
                              </div>
                              <div className="col-md-3 col-sm-6">
                                <div className={`${styles.featureItem} text-center`}>
                                  <div className={`${styles.featureIcon} mb-3`}>
                                    <i className="fas fa-headset text-warning fs-2"></i>
                                  </div>
                                  <h6 className="fw-bold">24/7 Support</h6>
                                  <p className="text-muted small mb-0">Customer service available anytime</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Frequently Bought Together Section */}
        {hasFrequentlyBoughtTogether && (
          <div className="row mt-5" style={{ position: 'relative', zIndex: 1 }}>
            <div className="col-12">
              <div className="card border mb-4">
                <div className="card-header bg-white py-3">
                  <h4 className="mb-0">Frequently Bought Together</h4>
                </div>
                <div className="card-body p-4">
                  <div className="fbt-container">
                    {/* Product Images Row */}
                    <div className="d-flex align-items-center mb-4 flex-wrap">
                      {/* Main Product */}
                      <div className={`${styles.fbtProductItem} text-center me-3 mb-3`}>
                        <div className="position-relative">
                          <input 
                            type="checkbox" 
                            id={`fbt-check-${product.id}`}
                            className="position-absolute top-0 start-0 m-2"
                            checked={checkedProducts[product.id] || false}
                            onChange={() => handleToggleProduct(product.id)}
                          />
                          <img 
                            src={product.thumbnail} 
                            alt={product.name}
                            className="img-fluid" 
                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                          />
                        </div>
                        <div className="mt-2" style={{ maxWidth: '120px' }}>
                          <small className="d-block text-truncate">This item: {product.name}</small>
                          <strong className="d-block">${parseFloat(product.price).toFixed(2)}</strong>
                        </div>
                      </div>
                      
                      {/* Plus sign */}
                      {product.frequently_bought_together.map((item, index) => (
                        <React.Fragment key={item.id}>
                          <div className={`${styles.fbtPlus} fs-2 me-3 mb-3`}>+</div>
                          <div className={`${styles.fbtProductItem} text-center me-3 mb-3`}>
                            <div className="position-relative">
                              <input 
                                type="checkbox" 
                                id={`fbt-check-${item.id}`}
                                className="position-absolute top-0 start-0 m-2"
                                checked={checkedProducts[item.id] || false}
                                onChange={() => handleToggleProduct(item.id)}
                              />
                              <Link to={`/product/${item.id}`}>
                                <img 
                                  src={item.thumbnail} 
                                  alt={item.name}
                                  className="img-fluid" 
                                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                />
                              </Link>
                            </div>
                            <div className="mt-2" style={{ maxWidth: '120px' }}>
                              <Link to={`/product/${item.id}`} className="small d-block text-truncate text-decoration-none">{item.name}</Link>
                              <strong className="d-block">${parseFloat(item.price).toFixed(2)}</strong>
                            </div>
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                    
                    {/* Price and Add to Cart Section */}
                    <div className={`${styles.fbtActionSection} p-3 bg-light rounded`}>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                          <strong>Total price:</strong> ${totalComboPrice.toFixed(2)}
                        </div>
                        <button 
                          className="btn btn-primary"
                          onClick={handleAddToCart}
                          disabled={addingToCart || selectedItemCount === 0}
                        >
                          {addingToCart ? 'Adding...' : getAddToCartText()}
                        </button>
                      </div>
                      <div className="fbt-items-info small text-muted">
                        <div className="d-flex align-items-center gap-2">
                          <i className="fa fa-info-circle"></i>
                          <span>These items are shipped from and sold by different sellers.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}