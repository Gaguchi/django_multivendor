import { useEffect, useState, memo, useMemo, useCallback, useRef } from 'react'
import PropTypes from 'prop-types'
import ProductCard from './ProductCard'
import { ProductGridSkeleton } from '../components/Skeleton'
import ReactUpdateTracker from '../components/Debug/ReactUpdateTracker'
import DebugErrorBoundary from '../components/Debug/DebugErrorBoundary'
import RenderTracker from '../components/Debug/RenderTracker'
import '../assets/css/uniform-product-card.css'

const ProductGrid = memo(function ProductGrid({ 
  products, 
  loading,
  error,
  className = '',
  defaultColumns = {
    xs: 2, // mobile
    sm: 2, // tablet small
    md: 3, // tablet
    lg: 4, // desktop
    xl: 4  // desktop large
  },
  defaultLimit = null // Optional limit for number of products to show per breakpoint
}) {
  const [gridTemplateColumns, setGridTemplateColumns] = useState('')
  const [currentLimit, setCurrentLimit] = useState(null)
  
  // Memoized resize handler to prevent unnecessary re-renders
  const handleResize = useCallback(() => {
    const width = window.innerWidth
    let columns, limit
    
    if (width >= 1200) {
      columns = defaultColumns.xl
      limit = defaultLimit?.xl
    } else if (width >= 992) {
      columns = defaultColumns.lg 
      limit = defaultLimit?.lg
    } else if (width >= 768) {
      columns = defaultColumns.md
      limit = defaultLimit?.md
    } else if (width >= 576) {
      columns = defaultColumns.sm
      limit = defaultLimit?.sm
    } else {
      columns = defaultColumns.xs
      limit = defaultLimit?.xs
    }
    
    setGridTemplateColumns(`repeat(${columns}, 1fr)`)
    setCurrentLimit(limit)
  }, [defaultColumns, defaultLimit])
  
  useEffect(() => {
    handleResize() // Initialize on component mount
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      console.log('🧹 ProductGrid cleanup: removed resize listener')
    }
  }, [handleResize])

  // Memoized skeleton count calculation - ALWAYS call this hook
  const skeletonCount = useMemo(() => {
    const width = window.innerWidth
    
    if (width >= 1200) {
      return defaultColumns.xl * 2 // Show 2 rows
    } else if (width >= 992) {
      return defaultColumns.lg * 2
    } else if (width >= 768) {
      return defaultColumns.md * 2
    } else if (width >= 576) {
      return defaultColumns.sm * 3
    } else {
      return defaultColumns.xs * 4
    }
  }, [defaultColumns])

  // Memoized product list - ALWAYS call this hook, even if products is empty
  const productItems = useMemo(() => {
    if (!products || products.length === 0) return []
    
    // Apply current limit if specified
    const limitedProducts = currentLimit && currentLimit > 0 
      ? products.slice(0, currentLimit) 
      : products
    
    return limitedProducts.map(product => (
      <div className="uniform-product-cell" key={product.id}>
        <ProductCard 
          product={product}
          isHot={product.stock < 50}
        />
      </div>
    ))
  }, [products, currentLimit])

  // Debug log with more details
  const renderCountRef = useRef(0)
  renderCountRef.current++
  
  console.log('🎨 ProductGrid render:', { 
    productsCount: products?.length, 
    loading, 
    error: error?.message,
    timestamp: new Date().toISOString(),
    renderCount: renderCountRef.current,
    renderTrigger: loading ? 'Loading state change' : (error ? 'Error state' : 'Products data change'),
    componentReasonForRender: 'Products, loading, or error changed'
  })

  // Log when ProductGrid receives new products
  useEffect(() => {
    if (products?.length > 0) {
      console.log('📦 ProductGrid received new products:', {
        count: products.length,
        firstProduct: products[0]?.name,
        timestamp: new Date().toISOString()
      })
    }
  }, [products])

  // Log loading state changes
  useEffect(() => {
    console.log('⏳ ProductGrid loading state changed:', loading)
  }, [loading])

  // Show loading skeleton with memoized count
  if (loading) {
    return (
      <div className={`uniform-product-grid ${className}`}>
        <ProductGridSkeleton count={skeletonCount} />
      </div>
    )
  }
  
  // Show error state
  if (error) {
    return (
      <div className="uniform-product-grid-error">
        <div className="alert alert-danger">
          <i className="fas fa-exclamation-triangle me-2"></i>
          Error loading products: {error.message || 'Please try again later'}
          <button 
            className="btn btn-sm btn-outline-danger ms-2"
            onClick={(e) => {
              e.preventDefault()
              window.location.reload() // Only on manual retry
            }}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }
  
  // Show empty state
  if (!products?.length) {
    return (
      <div className="uniform-product-grid-empty">
        <div className="text-center py-5">
          <i className="fas fa-box-open fa-3x text-muted mb-3"></i>
          <h4 className="text-muted">No products found</h4>
          <p className="text-muted">Try adjusting your filters or search criteria</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`uniform-product-grid ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: gridTemplateColumns,
        gap: '20px',
        transition: 'all 0.3s ease', // Smooth transition for layout changes
      }}
    >
      <RenderTracker componentName="ProductGrid" data={{ productCount: products?.length, loading }} />
      {/* Debug components - ENABLED to track re-renders */}
      <DebugErrorBoundary>
        <ReactUpdateTracker componentName="ProductGrid" />
      </DebugErrorBoundary>
      {productItems}
    </div>
  )
})

ProductGrid.propTypes = {
  products: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    thumbnail: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    stock: PropTypes.number,
  })).isRequired,
  loading: PropTypes.bool,
  error: PropTypes.object,
  className: PropTypes.string,
  defaultColumns: PropTypes.shape({
    xs: PropTypes.number,
    sm: PropTypes.number,
    md: PropTypes.number,
    lg: PropTypes.number,
    xl: PropTypes.number
  }),
  defaultLimit: PropTypes.shape({
    xs: PropTypes.number,
    sm: PropTypes.number,
    md: PropTypes.number,
    lg: PropTypes.number,
    xl: PropTypes.number
  })
}

export default ProductGrid