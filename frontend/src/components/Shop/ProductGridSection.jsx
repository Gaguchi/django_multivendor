import { memo, useCallback, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import ProductGrid from '../../elements/ProductGrid'
import RenderVisualizer from '../Debug/RenderVisualizer'

// Custom comparison function for ProductGridSection memo
function productGridSectionPropsAreEqual(prevProps, nextProps) {
  // Compare arrays and objects that might cause unnecessary re-renders
  if (
    prevProps.isLoading !== nextProps.isLoading ||
    prevProps.sortBy !== nextProps.sortBy ||
    prevProps.showCount !== nextProps.showCount ||
    prevProps.hasNextPage !== nextProps.hasNextPage ||
    prevProps.isFetchingNextPage !== nextProps.isFetchingNextPage
  ) {
    console.log('🎨 ProductGridSection memo: Props changed (primitives)')
    return false
  }
  
  // Compare products array by length and first/last items
  if (
    prevProps.products?.length !== nextProps.products?.length ||
    prevProps.products?.[0]?.id !== nextProps.products?.[0]?.id ||
    prevProps.products?.[prevProps.products?.length - 1]?.id !== 
      nextProps.products?.[nextProps.products?.length - 1]?.id
  ) {
    console.log('🎨 ProductGridSection memo: Products changed')
    return false
  }
  
  // Compare error objects
  if (prevProps.error?.message !== nextProps.error?.message) {
    console.log('🎨 ProductGridSection memo: Error changed')
    return false
  }
  
  console.log('🎨 ProductGridSection memo: Props are equal, skipping re-render')
  return true
}

/**
 * Isolated ProductGrid section that only re-renders when products change
 * This prevents the entire shop page from re-rendering when filters update
 */
const ProductGridSection = memo(function ProductGridSection({
  products,
  isLoading,
  error,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  sortBy,
  showCount,
  onSortChange,
  onShowCountChange
}) {
  const loadMoreRef = useRef()
  const observerRef = useRef()
  
  // Track renders of ProductGridSection specifically
  const renderCountRef = useRef(0)
  renderCountRef.current++

  console.log('🎨 ProductGridSection render:', {
    productCount: products?.length || 0,
    isLoading,
    hasError: !!error,
    timestamp: new Date().toISOString(),
    renderCount: renderCountRef.current,
    reasonForRender: 'Products or loading state changed - THIS SHOULD BE THE ONLY THING RE-RENDERING ON FILTER CHANGES'
  })

  // Handle sort change
  const handleSortChange = useCallback((event) => {
    const newSort = event.target.value
    console.log('📊 ProductGridSection: Sort changed to:', newSort)
    onSortChange(newSort)
  }, [onSortChange])

  // Handle show count change
  const handleShowCountChange = useCallback((event) => {
    const newCount = parseInt(event.target.value)
    console.log('📄 ProductGridSection: Show count changed to:', newCount)
    onShowCountChange(newCount)
  }, [onShowCountChange])

  // Infinite scroll effect
  useEffect(() => {
    console.log('🔄 ProductGridSection: Setting up infinite scroll observer')
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          console.log('📥 ProductGridSection: Loading more products via infinite scroll')
          fetchNextPage()
        }
      },
      { threshold: 0.1 }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    observerRef.current = observer

    return () => {
      console.log('🧹 ProductGridSection: Cleaning up infinite scroll observer')
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  return (
    <div className="products-grid-section">
      <RenderVisualizer componentName="ProductGrid" style={{ top: '90px', right: '10px' }} />
      
      {/* Products count and loading info */}
      <div className="products-info mb-3">
        <div className="d-flex justify-content-between align-items-center">
          <span className="text-muted">
            {products?.length > 0 ? `${products.length} products found` : ''}
            {isLoading && ' (Loading...)'}
          </span>
          {error && (
            <span className="text-danger">
              <i className="icon-exclamation-triangle me-1"></i>
              {error.message}
            </span>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <nav
        className="toolbox sticky-header"
        data-sticky-options="{'mobile': true}"
      >
        <div className="toolbox-left">
          <div className="toolbox-item toolbox-sort">
            <label>Sort By:</label>
            <div className="select-custom">
              <select 
                name="orderby" 
                className="form-control" 
                value={sortBy}
                onChange={handleSortChange}
              >
                <option value="menu_order">Default sorting</option>
                <option value="popularity">Sort by popularity</option>
                <option value="rating">Sort by average rating</option>
                <option value="-created_at">Sort by newness</option>
                <option value="price">Sort by price: low to high</option>
                <option value="-price">Sort by price: high to low</option>
              </select>
            </div>
          </div>
        </div>

        <div className="toolbox-right">
          <div className="toolbox-item toolbox-show">
            <label>Show:</label>
            <div className="select-custom">
              <select 
                name="count" 
                className="form-control" 
                value={showCount}
                onChange={handleShowCountChange}
              >
                <option value={12}>12</option>
                <option value={24}>24</option>
                <option value={36}>36</option>
              </select>
            </div>
          </div>
          
          <div className="toolbox-item layout-modes">
            <button
              className="layout-btn btn-grid active"
              title="Grid"
              onClick={(e) => {
                e.preventDefault()
                console.log('🔲 Grid view selected')
              }}
            >
              <i className="icon-mode-grid" />
            </button>
            <button
              className="layout-btn btn-list"
              title="List"
              onClick={(e) => {
                e.preventDefault()
                console.log('📋 List view selected')
              }}
            >
              <i className="icon-mode-list" />
            </button>
          </div>
        </div>
      </nav>

      {/* Product Grid */}
      <ProductGrid 
        products={products}
        loading={isLoading}
        error={error}
        defaultColumns={{
          xs: 2,
          sm: 2,
          md: 3,
          lg: 4,
          xl: 4
        }}
        className="row product-ajax-grid scroll-load"
      />
      
      {/* Infinite scroll trigger */}
      <div ref={loadMoreRef} className="load-more-trigger" style={{ height: '20px', margin: '20px 0' }}>
        {isFetchingNextPage && (
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading more products...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}, productGridSectionPropsAreEqual)

ProductGridSection.propTypes = {
  products: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.object,
  hasNextPage: PropTypes.bool,
  isFetchingNextPage: PropTypes.bool,
  fetchNextPage: PropTypes.func,
  sortBy: PropTypes.string.isRequired,
  showCount: PropTypes.number.isRequired,
  onSortChange: PropTypes.func.isRequired,
  onShowCountChange: PropTypes.func.isRequired
}

export default ProductGridSection
