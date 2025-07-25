import React from 'react'
import { useProducts } from '../hooks/useProducts'
import ProductCard from '../elements/ProductCard'
import LoadingSpinner from './LoadingSpinner'
import ErrorMessage from './ErrorMessage'
import { ProductGridSkeleton } from './Skeleton'

export default function PopularProducts() {
  // Safety check for React hooks
  if (!React || !React.useState) {
    console.error('🚨 PopularProducts (components): React not properly initialized')
    return (
      <div>
        <h2 className="section-title">Most Popular Products</h2>
        <p className="section-info font2">Loading...</p>
        <div className="products-container product-slider-tab rounded">
          <div>React is loading...</div>
        </div>
      </div>
    )
  }

  const {
    data,
    isLoading, 
    isError,
    error
  } = useProducts({
    filters: {
      page_size: 8, // Limit to 8 products for popular section
      ordering: '-rating' // Order by highest rating for popular products
    }
  })

  if (isLoading) {
    return (
      <div className="products-section section-padding">
        <div className="container">
          <h2 className="section-title">Popular Products</h2>
          <ProductGridSkeleton count={8} />
        </div>
      </div>
    )
  }

  if (isError) {
    return <ErrorMessage error={error.message} />
  }

  // Extract products from paginated response
  const products = data?.pages[0]?.results || []

  return (
    <div className="products-section section-padding">
      <div className="container">
        <h2 className="section-title">Popular Products</h2>
        <div className="products-grid">
          {products.map(product => (
            <ProductCard 
              key={product.id}
              product={product} 
            />
          ))}
        </div>
      </div>
    </div>
  )
}
