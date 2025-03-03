import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import ProductCard from './ProductCard'
import '../assets/css/uniform-product-card.css'

export default function ProductGrid({ 
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
  defaultLimit = {
    xs: 4,
    sm: 6, 
    md: 9,
    lg: 8,
    xl: 8
  }
}) {
  const [displayCount, setDisplayCount] = useState(defaultLimit.xs)
  const [gridTemplateColumns, setGridTemplateColumns] = useState('')
  
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      let columns
      let limit
      
      if (width >= 1200) {
        columns = defaultColumns.xl
        limit = defaultLimit.xl
      } else if (width >= 992) {
        columns = defaultColumns.lg
        limit = defaultLimit.lg 
      } else if (width >= 768) {
        columns = defaultColumns.md
        limit = defaultLimit.md
      } else if (width >= 576) {
        columns = defaultColumns.sm
        limit = defaultLimit.sm
      } else {
        columns = defaultColumns.xs
        limit = defaultLimit.xs
      }
      
      setDisplayCount(limit)
      setGridTemplateColumns(`repeat(${columns}, 1fr)`)
    }

    handleResize() // Initialize on component mount
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [defaultColumns, defaultLimit])

  if (loading) {
    return (
      <div className="uniform-product-grid-loading">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="uniform-product-grid-error">
        <div className="alert alert-danger">
          Error loading products: {error.message || 'Please try again later'}
        </div>
      </div>
    )
  }
  
  if (!products?.length) {
    return (
      <div className="uniform-product-grid-empty">
        <p>No products found</p>
      </div>
    )
  }

  const displayProducts = products.slice(0, displayCount)

  return (
    <div 
      className={`uniform-product-grid ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: gridTemplateColumns,
        gap: '20px',
      }}
    >
      {displayProducts.map(product => (
        <div className="uniform-product-cell" key={product.id}>
          <ProductCard 
            product={product}
            isHot={product.stock < 50}
          />
        </div>
      ))}
    </div>
  )
}

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