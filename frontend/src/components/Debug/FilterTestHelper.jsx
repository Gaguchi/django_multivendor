import { useState, useEffect, useRef } from 'react'

/**
 * Simple component to test that filters update the ProductGrid without page reloads
 * This component tracks filter changes specifically, not all renders
 */
export function FilterTestHelper({ filters = {}, products = [] }) {
  const [filterChangeCount, setFilterChangeCount] = useState(0)
  const [productChangeCount, setProductChangeCount] = useState(0)
  const [lastFilterChange, setLastFilterChange] = useState(null)
  const [lastProductChange, setLastProductChange] = useState(null)
  const mountTime = useRef(Date.now())
  const prevFilters = useRef(JSON.stringify(filters))
  const prevProductCount = useRef(products.length)

  // Track filter changes only
  useEffect(() => {
    const currentFilters = JSON.stringify(filters)
    if (currentFilters !== prevFilters.current) {
      setFilterChangeCount(prev => prev + 1)
      setLastFilterChange(new Date().toISOString())
      prevFilters.current = currentFilters
      
      console.log('🧪 FilterTestHelper: Filter change detected', {
        filterChangeCount: filterChangeCount + 1,
        filters,
        timestamp: new Date().toISOString()
      })
    }
  }, [filters])

  // Track product changes only
  useEffect(() => {
    if (products.length !== prevProductCount.current) {
      setProductChangeCount(prev => prev + 1)
      setLastProductChange(new Date().toISOString())
      prevProductCount.current = products.length
      
      console.log('🧪 FilterTestHelper: Product count change detected', {
        productChangeCount: productChangeCount + 1,
        productCount: products.length,
        timestamp: new Date().toISOString()
      })
    }
  }, [products.length])

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: 10, 
      left: 10, 
      background: 'rgba(0,0,0,0.8)', 
      color: 'white', 
      padding: '8px 12px', 
      borderRadius: '4px', 
      fontSize: '11px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <div>🧪 Filter Test Helper</div>
      <div>Filter Changes: {filterChangeCount}</div>
      <div>Product Changes: {productChangeCount}</div>
      <div>Last Filter: {lastFilterChange?.substring(11, 19) || 'None'}</div>
      <div>Last Product: {lastProductChange?.substring(11, 19) || 'None'}</div>
      <div>Products: {products.length}</div>
    </div>
  )
}

export default FilterTestHelper
