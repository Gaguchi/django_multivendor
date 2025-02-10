import { useProducts } from '../hooks/useProducts'
import ProductCard from '../elements/ProductCard'
import LoadingSpinner from './LoadingSpinner'
import ErrorMessage from './ErrorMessage'

export default function PopularProducts() {
  const {
    data,
    isLoading, 
    isError,
    error
  } = useProducts({
    pageSize: 8 // Limit to 8 products for popular section
  })

  if (isLoading) {
    return <LoadingSpinner />
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
