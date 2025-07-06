import { useProducts } from '../hooks/useProducts'
import ProductGrid from './ProductGrid'

export default function Specials() {
  const { data, isLoading, error } = useProducts({
    pageSize: 6 // Limit to 6 special products
  })

  // Extract products array from paginated response
  const products = data?.pages?.[0]?.results || []

  if (isLoading) {
    return <div className="loading">Loading...</div>
  }

  if (error) {
    return <div className="error">Error: {error.message}</div>
  }

  return (
    <div className="specials-section">
      <div className="container">
        <h2 className="section-title">This Week's Specials</h2>
        <p className="section-info font2">
          All our new arrivals in a exclusive brand selection
        </p>
        <div className="products-container bg-white mb-4 rounded">
          <ProductGrid 
            products={products.map(p => ({
              id: p.id,
              thumbnail: p.thumbnail,
              name: p.name,
              category: p.category_name || p.vendor_name || 'Category',  // Ensure we're using a consistent prop name
              price: parseFloat(p.price),
              old_price: p.old_price ? parseFloat(p.old_price) : null,
              stock: p.stock,
              rating: p.rating || 0
            }))}
            defaultColumns={{
              xs: 2,
              sm: 3,
              md: 4,
              lg: 5,
              xl: 6
            }}
            defaultLimit={{
              xs: 4,
              sm: 6,
              md: 4,
              lg: 5,
              xl: 6
            }}
            className="product-grid"
          />
        </div>
      </div>
    </div>
  )
}