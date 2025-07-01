import { useState, useEffect, useRef } from 'react'

/**
 * Enhanced render tracking dashboard with optimization status
 */
export function OptimizedRenderDashboard() {
  const [renderCounts, setRenderCounts] = useState({
    Shop: 0,
    ShopHeader: 0,
    ProductGridSection: 0,
    ProductGrid: 0,
    ActiveFilters: 0,
    Sidebar: 0
  })
  
  const [memoSkips, setMemoSkips] = useState({
    ShopHeader: 0,
    ProductGridSection: 0,
    ActiveFilters: 0,
    Sidebar: 0
  })
  
  const [lastFilterChange, setLastFilterChange] = useState(null)
  const [optimizationScore, setOptimizationScore] = useState(100)
  const [performanceIssues, setPerformanceIssues] = useState([])
  const [apiCalls, setApiCalls] = useState(0)
  
  useEffect(() => {
    // Listen for console logs to track renders and memo skips
    const originalLog = console.log
    console.log = (...args) => {
      originalLog(...args)
      
      const message = args[0]
      if (typeof message === 'string') {
        // Use setTimeout to defer state updates and avoid setState during render
        setTimeout(() => {
          // Track render counts
          if (message.includes('🛍️ Shop Page render')) {
            setRenderCounts(prev => {
              const newCount = prev.Shop + 1
              if (newCount > 1) {
                setOptimizationScore(score => Math.max(0, score - 20))
              }
              return { ...prev, Shop: newCount }
            })
          }
          
          if (message.includes('🏪 ShopHeader render')) {
            setRenderCounts(prev => {
              const newCount = prev.ShopHeader + 1
              if (newCount > 1) {
                setOptimizationScore(score => Math.max(0, score - 25))
              }
              return { ...prev, ShopHeader: newCount }
            })
          }
          
          if (message.includes('🎨 ProductGridSection render')) {
            setRenderCounts(prev => ({ ...prev, ProductGridSection: prev.ProductGridSection + 1 }))
          }
          
          if (message.includes('🎨 ProductGrid render')) {
            setRenderCounts(prev => ({ ...prev, ProductGrid: prev.ProductGrid + 1 }))
          }
          
          if (message.includes('🏷️ ActiveFilters render')) {
            setRenderCounts(prev => ({ ...prev, ActiveFilters: prev.ActiveFilters + 1 }))
          }
          
          if (message.includes('📂 Sidebar render')) {
            setRenderCounts(prev => {
              const newCount = prev.Sidebar + 1
              if (newCount > 2) {
                setOptimizationScore(score => Math.max(0, score - 10))
              }
              return { ...prev, Sidebar: newCount }
            })
          }
          
          // Track memo skips (successful optimizations)
          if (message.includes('memo: Props are equal, skipping re-render')) {
            if (message.includes('ShopHeader')) {
              setMemoSkips(prev => ({ ...prev, ShopHeader: prev.ShopHeader + 1 }))
            } else if (message.includes('ProductGridSection')) {
              setMemoSkips(prev => ({ ...prev, ProductGridSection: prev.ProductGridSection + 1 }))
            } else if (message.includes('ActiveFilters')) {
              setMemoSkips(prev => ({ ...prev, ActiveFilters: prev.ActiveFilters + 1 }))
            } else if (message.includes('Sidebar')) {
              setMemoSkips(prev => ({ ...prev, Sidebar: prev.Sidebar + 1 }))
            }
          }
          
          // Track performance issues
          if (message.includes('REMOUNTED - This should NOT happen')) {
            setPerformanceIssues(prev => [...prev, `Component remounted at ${new Date().toISOString()}`])
            setOptimizationScore(score => Math.max(0, score - 50))
          }
          
          if (message.includes('⚠️ WARNING: Too many renders')) {
            setPerformanceIssues(prev => [...prev, `Too many renders detected at ${new Date().toISOString()}`])
            setOptimizationScore(score => Math.max(0, score - 30))
          }
          
          // Track API calls
          if (message.includes('🔄 useProducts API call')) {
            setApiCalls(prev => prev + 1)
            setOptimizationScore(score => Math.max(0, score - 5))
          }
          
          // Track successful optimizations
          if (message.includes('✨') && message.includes('RE-RENDERED')) {
            setOptimizationScore(score => Math.min(100, score + 5))
          }
          
          // Track filter changes
          if (message.includes('🔄 Shop handleFiltersChange called')) {
            setLastFilterChange(new Date().toISOString())
          }
        }, 0)
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
      return count > 3 ? '#ff4444' : count > 2 ? '#ffaa44' : '#44ff44'
    }
    return '#44ff44' // ProductGrid components should re-render on filter changes
  }
  
  const getOptimizationStatus = () => {
    if (optimizationScore >= 90) return '🟢 Excellent'
    if (optimizationScore >= 70) return '🟡 Good'
    if (optimizationScore >= 50) return '🟠 Needs Work'
    return '🔴 Poor'
  }
  
  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      left: '10px',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      fontFamily: 'monospace',
      fontSize: '11px',
      zIndex: 10000,
      minWidth: '350px',
      maxHeight: '90vh',
      overflow: 'auto'
    }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#fff' }}>🎯 Render Optimization Dashboard</h4>
      
      <div style={{ marginBottom: '15px', fontSize: '14px', fontWeight: 'bold' }}>
        {getOptimizationStatus()} (Score: {optimizationScore}/100)
      </div>
      
      <div style={{ marginBottom: '10px', fontSize: '12px', fontWeight: 'bold' }}>
        Render Counts:
      </div>
      
      {Object.entries(renderCounts).map(([component, count]) => (
        <div key={component} style={{ 
          marginBottom: '4px',
          color: getStatusColor(component, count),
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <span>{component}: {count}</span>
          {(component === 'Shop' || component === 'ShopHeader') && count > 1 && 
            <span style={{ color: '#ff4444' }}>⚠️</span>
          }
          {component === 'Sidebar' && count > 3 && 
            <span style={{ color: '#ff4444' }}>⚠️</span>
          }
        </div>
      ))}
      
      <div style={{ marginTop: '15px', marginBottom: '10px', fontSize: '12px', fontWeight: 'bold' }}>
        Memo Skips (Optimizations):
      </div>
      
      {Object.entries(memoSkips).map(([component, count]) => (
        <div key={component} style={{ 
          marginBottom: '4px',
          color: count > 0 ? '#44ff44' : '#888',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <span>{component}: {count}</span>
          {count > 0 && <span style={{ color: '#44ff44' }}>✅</span>}
        </div>
      ))}
      
      {lastFilterChange && (
        <div style={{ marginTop: '15px', fontSize: '10px', color: '#ccc' }}>
          Last filter change: {new Date(lastFilterChange).toLocaleTimeString()}
        </div>
      )}
      
      <div style={{ marginTop: '15px', fontSize: '10px', color: '#ccc', lineHeight: '1.3' }}>
        <strong>Expected behavior:</strong><br/>
        • Shop, ShopHeader: 1 render only<br/>
        • ProductGrid*: Re-render on filter changes<br/>
        • Sidebar: Max 2-3 renders<br/>
        • Memo skips: Should increase over time
      </div>
    </div>
  )
}

export default OptimizedRenderDashboard
