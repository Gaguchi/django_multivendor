import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import ProductCard from './ProductCard'

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
    xl: 4, // desktop large
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
  const [columns, setColumns] = useState(defaultColumns.xs)

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width >= 1200) {
        setDisplayCount(defaultLimit.xl)
        setColumns(defaultColumns.xl)
      } else if (width >= 992) {
        setDisplayCount(defaultLimit.lg)
        setColumns(defaultColumns.lg) 
      } else if (width >= 768) {
        setDisplayCount(defaultLimit.md)
        setColumns(defaultColumns.md)
      } else if (width >= 576) {
        setDisplayCount(defaultLimit.sm)
        setColumns(defaultColumns.sm)
      } else {
        setDisplayCount(defaultLimit.xs)
        setColumns(defaultColumns.xs)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [defaultColumns, defaultLimit])

  if (loading) return <div>Loading products...</div>
  if (error) return <div>Error loading products: {error.message}</div>
  if (!products?.length) return <div>No products found</div>

  const displayProducts = products.slice(0, displayCount)

  return (
    <div className={`products-grid ${className}`} style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: '1rem'
    }}>
      {displayProducts.map(product => (
        <ProductCard 
          key={product.id}
          product={product}
          isHot={product.stock < 50}
        />
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
