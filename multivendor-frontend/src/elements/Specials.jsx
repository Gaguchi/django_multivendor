import { useProducts } from '../hooks/useProducts'
import ProductGrid from './ProductGrid'

export default function Specials() {
  // Get special/featured products - you may want to modify useProducts hook 
  // to add a filter parameter for specials
  const { data: products, isLoading, error } = useProducts()

  return (
    <div
      className="appear-animate"
      data-animation-name="fadeIn"
      data-animation-delay={200}
    >
      <h2 className="section-title">This Week's Specials</h2>
      <p className="section-info font2">
        All our new arrivals in a exclusive brand selection
      </p>
      <div className="products-container bg-white mb-4 rounded">
        <ProductGrid 
          products={products?.map(p => ({
            id: p.id,
            thumbnail: p.thumbnail,
            name: p.name,
            category: p.vendor.store_name,
            price: parseFloat(p.price),
            stock: p.stock,
            rating: 0
          }))}
          loading={isLoading}
          error={error}
          defaultColumns={{
            xs: 2,
            sm: 3,
            md: 4,
            lg: 6,
            xl: 6
          }}
          defaultLimit={{
            xs: 4,
            sm: 6,
            md: 8,
            lg: 6,
            xl: 6
          }}
          className="product-slider-tab"
        />
      </div>
    </div>
  )
}