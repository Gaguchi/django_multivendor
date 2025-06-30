import { useState, useEffect } from 'react'

/**
 * Simple component to test that filters update the ProductGrid without page reloads
 * This component tracks state changes and can be used to verify React-only updates
 */
export function FilterTestHelper({ children }) {
  const [lastFilterChange, setLastFilterChange] = useState(null)
  const [updateCount, setUpdateCount] = useState(0)

  useEffect(() => {
    setUpdateCount(prev => prev + 1)
    setLastFilterChange(new Date().toISOString())
    
    console.log('🧪 FilterTestHelper: React update detected', {
      updateCount: updateCount + 1,
      timestamp: new Date().toISOString()
    })
  })

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
      <div>Updates: {updateCount}</div>
      <div>Last: {lastFilterChange?.substring(11, 19)}</div>
      {children}
    </div>
  )
}

export default FilterTestHelper
