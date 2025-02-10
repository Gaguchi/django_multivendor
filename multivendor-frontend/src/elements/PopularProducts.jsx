import { useProducts } from '../hooks/useProducts'
import ProductGrid from './ProductGrid'

export default function PopularProducts() {
  const { data, isLoading, error } = useProducts()

  // Extract products array from paginated response
  const products = data?.pages?.[0]?.results || []

  return (
    <div
      className="appear-animate"
      data-animation-name="fadeIn"
      data-animation-delay={200}
    >
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
            stock: p.stock,
            rating: p.rating || 0
          }))}
          loading={isLoading}
          error={error}
          defaultColumns={{
            xs: 2,
            sm: 2, 
            md: 3,
            lg: 7,
            xl: 7
          }}
          defaultLimit={{
            xs: 6,
            sm: 6,
            md: 9,
            lg: 7,
            xl: 7
          }}
        />
      </div>
    </div>
  )
}