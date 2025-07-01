import { useState, useEffect, useRef } from 'react'

/**
 * Comprehensive render tracking dashboard for debugging Shop page optimization
 */
export function RenderDashboard() {
  const [renderCounts, setRenderCounts] = useState({
    Shop: 0,
    ShopHeader: 0,
    ProductGridSection: 0,
    ProductGrid: 0,
    ActiveFilters: 0,
    Sidebar: 0
  })
  
  const [lastFilterChange, setLastFilterChange] = useState(null)
  const [status, setStatus] = useState('✅ Optimization Working')
  
  useEffect(() => {
    // Listen for console logs to track renders
    const originalLog = console.log
    console.log = (...args) => {
      originalLog(...args)
      
      const message = args[0]
      if (typeof message === 'string') {
        // Track Shop page renders
        if (message.includes('🛍️ Shop Page render')) {
          setRenderCounts(prev => {
            const newCount = prev.Shop + 1
            if (newCount > 1) setStatus('❌ Shop Page Re-rendering!')
            return { ...prev, Shop: newCount }
          })
        }
        
        // Track ShopHeader renders
        if (message.includes('🏪 ShopHeader render')) {
          setRenderCounts(prev => {
            const newCount = prev.ShopHeader + 1
            if (newCount > 1) setStatus('❌ ShopHeader Re-rendering!')
            return { ...prev, ShopHeader: newCount }
          })
        }
        
        // Track ProductGridSection renders
        if (message.includes('🎨 ProductGridSection render')) {
          setRenderCounts(prev => ({ ...prev, ProductGridSection: prev.ProductGridSection + 1 }))
        }
        
        // Track ProductGrid renders
        if (message.includes('🎨 ProductGrid render')) {
          setRenderCounts(prev => ({ ...prev, ProductGrid: prev.ProductGrid + 1 }))
        }
        
        // Track ActiveFilters renders
        if (message.includes('🏷️ ActiveFilters render')) {
          setRenderCounts(prev => ({ ...prev, ActiveFilters: prev.ActiveFilters + 1 }))
        }
        
        // Track Sidebar renders
        if (message.includes('📂 Sidebar render')) {
          setRenderCounts(prev => {
            const newCount = prev.Sidebar + 1
            if (newCount > 2) setStatus('⚠️ Sidebar Re-rendering Too Much!')
            return { ...prev, Sidebar: newCount }
          })
        }
        
        // Track filter changes
        if (message.includes('🔄 Shop handleFiltersChange called')) {
          setLastFilterChange(new Date().toISOString())
        }
      }
    }
    
    return () => {
      console.log = originalLog
    }
  }, [])
  
  const getStatusColor = (component, count) => {
    if (component === 'Shop' || component === 'ShopHeader') {
      return count > 1 ? '#ff4444' : '#44ff44'
    }
    if (component === 'Sidebar') {
      return count > 2 ? '#ff4444' : '#44ff44'
    }
    return '#44ff44' // ProductGrid components should re-render on filter changes
  }
  
  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      left: '10px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      fontFamily: 'monospace',
      fontSize: '12px',
      zIndex: 10000,
      minWidth: '300px'
    }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#fff' }}>🎯 Render Optimization Status</h4>
      
      <div style={{ marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}>
        {status}
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Render Counts:</strong>
      </div>
      
      {Object.entries(renderCounts).map(([component, count]) => (
        <div key={component} style={{ 
          marginBottom: '5px',
          color: getStatusColor(component, count)
        }}>
          {component}: {count}
          {(component === 'Shop' || component === 'ShopHeader') && count > 1 && ' ⚠️'}
          {component === 'Sidebar' && count > 2 && ' ⚠️'}
        </div>
      ))}
      
      {lastFilterChange && (
        <div style={{ marginTop: '10px', fontSize: '11px', color: '#ccc' }}>
          Last filter change: {lastFilterChange}
        </div>
      )}
      
      <div style={{ marginTop: '15px', fontSize: '11px', color: '#ccc' }}>
        Expected behavior:<br/>
        • Shop, ShopHeader: 1 render only<br/>
        • ProductGrid*: Re-render on filter changes<br/>
        • Sidebar: Max 2-3 renders
      </div>
    </div>
  )
}

export default RenderDashboard
