import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

export default function Product() {
  const [selectedImage, setSelectedImage] = useState(0)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { id } = useParams()

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
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!product) return <div>Product not found</div>

  // Extract image URLs from the product.images array
  const imageUrls = product.images ? product.images.map(img => img.file) : []
  
  // Combine thumbnail with additional images
  const allImages = [product.thumbnail, ...imageUrls]

  return (
    <main className="main">
      <div className="container py-4">
        <div className="row g-4">
          {/* Image Gallery */}
          <div className="col-12 col-lg-4">
            <div className="row g-3">
              {/* Only show thumbnails column if we have multiple images */}
              {allImages.length > 1 && (
                <div className="col-3 col-lg-2 order-lg-1">
                  <div className="d-flex flex-lg-column gap-2">
                    {allImages.map((img, idx) => (
                      <div 
                        key={idx}
                        className={`thumbnail-wrapper ${selectedImage === idx ? 'img-small img-small-active' : 'img-small'}`}
                        onClick={() => setSelectedImage(idx)}
                        style={{cursor: 'pointer'}}
                      >
                        <img 
                          src={img}
                          alt="" 
                          className="img-fluid rounded-percentage"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Main Image - adjust column width based on thumbnails presence */}
              <div className={`${allImages.length > 1 ? 'col-9 col-lg-10' : 'col-12'} order-lg-2`}>
                <img 
                  src={allImages[selectedImage]}
                  alt={product.name}
                  className="img-fluid rounded-percentage"
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>
            </div>
          </div>

          {/* Info + Purchase Section */}
          <div className="col-12 col-lg-8">
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
                      <button className="btn btn-primary py-2 rounded-percentage-3 d-flex align-items-center justify-content-center gap-2 card-button">
                        <i className="fa fa-shopping-cart"></i>
                        <span>Add to Cart</span>
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

        {/* Product Description Section - Always Visible */}
        <div className="row mt-5">
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
        
        {/* Specifications Section - Always Visible */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="card border">
              <div className="card-header bg-white py-3">
                <h4 className="mb-0">Full Specifications</h4>
              </div>
              <div className="card-body p-4">
                {product.attribute_values && product.attribute_values.length > 0 ? (
                  <div className="specifications-content">
                    {product.attribute_groups && product.attribute_groups.length > 0 ? (
                      // Group specifications by attribute groups if available
                      product.attribute_groups.map(group => (
                        <div key={group.id} className="mb-4">
                          <h5 className="mb-3">{group.name}</h5>
                          <div className="table-responsive">
                            <table className="table table-striped">
                              <tbody>
                                {group.attributes.map(attr => (
                                  <tr key={attr.id}>
                                    <th className="text-secondary" style={{width: '30%'}}>
                                      {attr.name}
                                    </th>
                                    <td>{attr.value || '-'}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))
                    ) : (
                      // Display all attributes if no groups are defined
                      <div className="table-responsive">
                        <table className="table table-striped">
                          <tbody>
                            {product.attribute_values.map(attr => (
                              <tr key={attr.id}>
                                <th className="text-secondary" style={{width: '30%'}}>
                                  {attr.attribute_name}
                                </th>
                                <td>
                                  {attr.display_value || attr.text_value || 
                                    (attr.boolean_value !== null ? (attr.boolean_value ? 'Yes' : 'No') : 
                                    (attr.number_value !== null ? attr.number_value : ''))}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ) : (
                  <p>No specifications available for this product.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}