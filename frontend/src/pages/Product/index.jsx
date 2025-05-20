import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Images from './Images'
import { useCart } from '../../contexts/CartContext'

export default function Product() {
  const [selectedImage, setSelectedImage] = useState(0)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [addingToCart, setAddingToCart] = useState(false)
  const { addToCart } = useCart()
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
      await addToCart(product.id, 1)
      
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
        <div className="row g-4 position-relative" style={{ zIndex: 1 }}>
          {/* Pass product data and state to the Images component */}
          <Images 
            product={product} 
            selectedImage={selectedImage} 
            setSelectedImage={setSelectedImage} 
          />
          
          {/* Info + Purchase Section with lower z-index */}
          <div className="col-12 col-lg-8" style={{ position: 'relative', zIndex: 1 }}>
            <div className="row g-4">
              {/* Product Info Section */}
              <div className="col-12 col-md-6">
                <div className="card h-100 border-0">
                  <div className="card-body">
                    <h1 className="h4 mb-3">{product.name}</h1>
                    
                    <div className="d-flex align-items-center gap-2 mb-4">
                      <div className="stars" style={{color: '#ffa800'}}>
                        {'★'.repeat(product.average_rating || 0)}
                        {'☆'.repeat(5 - (product.average_rating || 0))}
                      </div>
                      <span className="text-muted small">{product.review_count || 0} reviews</span>
                    </div>

                    {/* Product Specifications */}
                    <div className="specifications">
                      <h6 className="mb-2">Key Specifications</h6>
                      <table className="table table-sm">
                        <tbody>
                          {product.attribute_values && 
                            product.attribute_values
                              .slice(0, 5) // Take only the first 5 attributes
                              .map(attr => (
                                <tr key={attr.id}>
                                  <th className="text-secondary fw-normal" style={{width: '40%'}}>
                                    {attr.attribute_name}
                                  </th>
                                  <td>
                                    {attr.display_value || attr.text_value || 
                                      (attr.boolean_value !== null ? (attr.boolean_value ? 'Yes' : 'No') : 
                                      (attr.number_value !== null ? attr.number_value : ''))}
                                  </td>
                                </tr>
                              ))
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Purchase Section */}
              <div className="col-12 col-md-6">
                <div className="card h-100 border-0 purchase-card">
                  <div className="card-body">
                    {/* Price Section */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div className="current-price h3 mb-0 fw-bold">{product.price} ₾</div>
                      {product.old_price && (
                        <div className="d-flex align-items-center gap-2">
                          <span className="text-decoration-line-through text-muted fs-5">
                            {product.old_price} ₾
                          </span>
                          {product.discount_percentage && (
                            <span className="badge text-bg-danger rounded-percentage-pill px-2">
                              -{product.discount_percentage}%
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Rest of purchase section remains unchanged */}
                    <div className="d-flex justify-content-between align-items-center p-3 bg-transparent rounded-percentage mb-1">
                      <div className="d-flex align-items-center gap-2">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-primary">
                          <path d="M11.7 7.9C11.7 11 9.2 13.5 6.1 13.5C3 13.5 0.4 11 0.4 7.9C0.4 4.7 2.9 2.2 6.1 2.2V7.9H11.7Z"/>
                          <path d="M13.6 6.1H7.9V0.5C11.1 0.5 13.6 3 13.6 6.1Z"/>
                        </svg>
                        <span>Monthly from: <strong>16₾</strong></span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <img src="https://placehold.co/32x16?text=TBC" alt="TBC" className="rounded-percentage"/>
                        <img src="https://placehold.co/32x16?text=BOG" alt="BOG" className="rounded-percentage"/>
                        <img src="https://placehold.co/32x16?text=Credo" alt="Credo" className="rounded-percentage"/>
                      </div>
                    </div>
                    
                    {/* Delivery Row */}
                    <div className="d-flex align-items-center gap-3 p-3 bg-transparent rounded-percentage mb-1">
                      <svg width="24" height="24" fill="currentColor" className="text-success flex-shrink-0">
                        <path d="M3.4 12c.4.4 1 .4 1.4 0L10 6.8V20c0 .6.4 1 1 1s1-.4 1-1V6.8l5.2 5.2c.4.4 1 .4 1.4 0 .4-.4.4-1 0-1.4l-7-7c-.4-.4-1-.4-1.4 0l-7 7c-.4.4-.4 1 0 1.4z"/>
                      </svg>
                      <div>
                        <div className="fw-bold">Free Delivery</div>
                        <small className="text-muted">in 3 hours</small>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="d-flex flex-column gap-2">
                      <button 
                        className="btn btn-primary py-2 rounded-percentage-3 d-flex align-items-center justify-content-center gap-2 card-button"
                        onClick={handleAddMainProductToCart}
                        disabled={addingToCart}
                      >
                        <i className="fa fa-shopping-cart"></i>
                        <span>{addingToCart ? 'Adding...' : 'Add to Cart'}</span>
                      </button>
                      <button className="btn btn-dark py-2 rounded-percentage-3 card-button">Buy Now</button>
                      <button className="btn btn-outline-primary py-2 rounded-percentage-3 card-button">Installment</button>
                    </div>
                  </div>
                </div>
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
                      <div className="fbt-product-item text-center me-3 mb-3">
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
                          <div className="fbt-plus fs-2 me-3 mb-3">+</div>
                          <div className="fbt-product-item text-center me-3 mb-3">
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
                    <div className="fbt-action-section p-3 bg-light rounded">
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
        
        {/* Product Description Section - Always Visible */}
        <div className="row mt-5" style={{ position: 'relative', zIndex: 1 }}>
          <div className="col-12">
            <div className="card border mb-4">
              <div className="card-header bg-white py-3">
                <h4 className="mb-0">Product Description</h4>
              </div>
              <div className="card-body p-4">
                <div className="rich-text-content">
                  <div dangerouslySetInnerHTML={{ __html: product.description_html || product.description }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global CSS for zoom elements to appear above content */}
      <style jsx>{`
        .product-zoom-container {
          position: relative;
        }
        
        .img-zoom-result {
          z-index: 10000 !important;
          position: absolute !important;
        }
        
        /* Force the zoom result above all other elements */
        body .container .img-zoom-result {
          z-index: 10000 !important;
        }
        
        /* Override any Bootstrap z-index values */
        .card, .dropdown-menu, .modal, .popover, .tooltip {
          z-index: 1 !important;
        }
        
        /* Set all rows and content to lower z-index */
        main .container .row {
          z-index: 1;
        }

        /* Frequently Bought Together styles */
        .fbt-product-item {
          flex: 0 0 auto;
        }
        
        .fbt-plus {
          color: #aaa;
          font-weight: 300;
        }
      `}</style>
    </main>
  )
}