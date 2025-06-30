import { useState, useEffect, useRef } from 'react'

/**
 * Visual indicator component that shows when React updates happen
 * Displays a green flash for React updates, red flash for page reloads
 */
export function UpdateIndicator({ componentName = 'Component' }) {
  const [updateCount, setUpdateCount] = useState(0)
  const [flashColor, setFlashColor] = useState('transparent')
  const [isPageReload, setIsPageReload] = useState(false)
  const mountTime = useRef(Date.now())
  const lastFlash = useRef(0)

  useEffect(() => {
    const now = Date.now()
    
    // Prevent too frequent updates (throttle to every 100ms)
    if (now - lastFlash.current < 100) {
      return
    }
    
    lastFlash.current = now
    
    // Check if this is a page reload on first render only
    if (updateCount === 0) {
      const reloadKey = `update_indicator_${componentName}`
      const lastUpdate = sessionStorage.getItem(reloadKey)
      
      if (lastUpdate && (now - parseInt(lastUpdate)) < 2000) {
        setIsPageReload(true)
        setFlashColor('#ff4444') // Red for page reload
      } else {
        setIsPageReload(false)
        setFlashColor('#44ff44') // Green for initial mount
      }
      
      sessionStorage.setItem(reloadKey, now.toString())
    } else {
      // This is a re-render
      setIsPageReload(false)
      setFlashColor('#44ff44') // Green for React update
    }
    
    setUpdateCount(prev => prev + 1)
    
    // Flash effect
    const timer = setTimeout(() => {
      setFlashColor('transparent')
    }, 600)
    
    return () => clearTimeout(timer)
  })  // No dependencies - runs on every render but throttled

  return (
    <div
      style={{
        position: 'fixed',
        top: 10,
        right: 10,
        backgroundColor: flashColor,
        color: 'white',
        padding: '8px 12px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 'bold',
        zIndex: 9999,
        transition: 'background-color 0.3s ease',
        opacity: flashColor === 'transparent' ? 0.7 : 1,
        border: '1px solid #ccc'
      }}
    >
      {componentName}: {isPageReload ? '🔄 RELOAD' : '⚡ UPDATE'} #{updateCount}
    </div>
  )
}

export default UpdateIndicator
