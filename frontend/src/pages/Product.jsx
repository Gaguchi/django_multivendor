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

  // Combine thumbnail with additional images
  const allImages = [product.thumbnail, ...(product.images || [])]

  return (
    <main className="main bg-gray">
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
                  <div className="card-body bg-gray">
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
                      <table className="table table-sm">
                        <tbody>
                          {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                            <tr key={key}>
                              <th className="text-secondary fw-normal" style={{width: '40%'}}>{key}</th>
                              <td>{value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Product Description */}
                    <div className="mt-4">
                      <h6>Description</h6>
                      <p>{product.description}</p>
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
      </div>
    </main>
  )
}