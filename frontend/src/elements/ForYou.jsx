import React from 'react'
import { useProducts } from '../hooks/useProducts'
import ProductGrid from './ProductGrid'

export default function ForYou() {
  // Safety check for React hooks
  if (!React || !React.useState) {
    console.error('🚨 ForYou: React not properly initialized')
    return (
      <div>
        <h2 className="section-title">For You</h2>
        <p className="section-info font2">Loading...</p>
        <div className="products-container product-slider-tab rounded">
          <div>React is loading...</div>
        </div>
      </div>
    )
  }

  const { data, isLoading, error } = useProducts({
    pageSize: 8 // Limit to 8 products
  })

  // Extract products array from paginated response
  const products = data?.pages?.[0]?.results || []

  return (
    <>
      <h2 className="section-title">For You</h2>
      <p className="section-info font2">
        All our new arrivals in a exclusive brand selection
      </p>
      <div className="row offer-products">
        <div className="col-md-4">
          {/* Keep existing countdown product section */}
          <div className="count-deal bg-white rounded mb-md-0">
            <div className="product-default">
              <figure>
                <a href="demo35-product.html">
                  <img
                    src="src/assets/images/demoes/demo35/products/product-16.jpg"
                    alt="product"
                    width={1200}
                    height={1200}
                  />
                </a>
                <div className="product-countdown-container">
                  <span className="product-countdown-title">
                    offer ends in:
                  </span>
                  <div
                    className="product-countdown countdown-compact"
                    data-until="2021, 10, 5"
                    data-compact="true"
                  ></div>
                  {/* End .product-countdown */}
                </div>
                {/* End .product-countdown-container */}
              </figure>
              <div className="product-details">
                <div className="category-list">
                  <a href="demo35-shop.html" className="product-category">
                    Category
                  </a>
                </div>
                <h3 className="product-title">
                  <a href="demo35-product.html">Raw Meat</a>
                </h3>
                <div className="ratings-container">
                  <div className="product-ratings">
                    <span className="ratings" style={{ width: "80%" }} />
                    {/* End .ratings */}
                    <span className="tooltiptext tooltip-top" />
                  </div>
                  {/* End .product-ratings */}
                </div>
                {/* End .product-container */}
                <div className="price-box">
                  <del className="old-price">$59.00</del>
                  <span className="product-price">$49.00</span>
                </div>
                {/* End .price-box */}
                <div className="product-action">
                  <a
                    href="wishlist.html"
                    className="btn-icon-wish"
                    title="wishlist"
                  >
                    <i className="icon-heart" />
                  </a>
                  <a
                    href="product.html"
                    className="btn-icon btn-add-cart product-type-simple"
                  >
                    <i className="icon-shopping-cart" />
                    <span>ADD TO CART</span>
                  </a>
                  <a
                    href="ajax/product-quick-view.html"
                    className="btn-quickview"
                    title="Quick View"
                  >
                    <i className="fas fa-external-link-alt" />
                  </a>
                </div>
              </div>
              {/* End .product-details */}
            </div>
          </div>
        </div>
        
        <div className="col-md-8">
          <div className="custom-products bg-white rounded">
            <ProductGrid 
              products={products.map(p => ({
                id: p.id,
                thumbnail: p.thumbnail,
                name: p.name,
                category: p.category_name || p.vendor_name || 'Category',
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
                xl: 4
              }}
              defaultLimit={{
                xs: 4,
                sm: 6,
                md: 6,
                lg: 8,
                xl: 8
              }}
              className="mb-0"
            />
          </div>
        </div>
      </div>
    </>
  )
}