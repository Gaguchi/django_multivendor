import React from 'react'
import { useProducts } from '../hooks/useProducts'
import ProductGrid from './ProductGrid'

export default function PopularProducts() {
  // Safety check for React hooks
  if (!React || !React.useState) {
    console.error('🚨 PopularProducts: React not properly initialized')
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

  const { data, isLoading, error } = useProducts()

  // Extract products array from paginated response
  const products = data?.pages?.[0]?.results || []

  return (
    <div>
      <h2 className="section-title">Most Popular Products</h2>
      <p className="section-info font2">
        All our new arrivals in a exclusive brand selection
      </p>
      <div className="products-container product-slider-tab rounded">
        <ProductGrid 
          products={products.map(p => ({
            id: p.id,
            thumbnail: p.thumbnail,
            name: p.name,
            category: p.category_name || p.vendor_name || 'Category', // Fallback to 'Category' if both are missing
            price: parseFloat(p.price),
            old_price: p.old_price ? parseFloat(p.old_price) : null,
            stock: p.stock,
            rating: p.rating || 0
          }))}
          loading={isLoading}
          error={error}
          defaultColumns={{
            xs: 2,
            sm: 2, 
            md: 3,
            lg: 4,
            xl: 6
          }}
          defaultLimit={{
            xs: 4,  // Show 4 products on mobile (2 rows)
            sm: 6,  // Show 6 products on small tablets (3 rows)
            md: 6,  // Show 6 products on tablets (2 rows)
            lg: 8,  // Show 8 products on desktop (2 rows)
            xl: 12  // Show 12 products on large desktop (2 rows)
          }}
          className="popular-products-grid"
        />
      </div>
    </div>
  )
}