import { useState, useEffect } from 'react'

/**
 * Visual indicator component that shows when React updates happen
 * Displays a green flash for React updates, red flash for page reloads
 */
export function UpdateIndicator({ componentName = 'Component' }) {
  const [updateCount, setUpdateCount] = useState(0)
  const [flashColor, setFlashColor] = useState('transparent')
  const [isPageReload, setIsPageReload] = useState(false)

  useEffect(() => {
    // Check if this is a page reload
    const reloadKey = `update_indicator_${componentName}`
    const lastUpdate = sessionStorage.getItem(reloadKey)
    const now = Date.now()
    
    // Consider it a reload if within 3 seconds and this is the first render
    if (lastUpdate && (now - parseInt(lastUpdate)) < 3000 && updateCount === 0) {
      setIsPageReload(true)
      setFlashColor('#ff4444') // Red for page reload
    } else if (updateCount === 0) {
      setIsPageReload(false)
      setFlashColor('#44ff44') // Green for initial mount
    } else {
      setIsPageReload(false)
      setFlashColor('#44ff44') // Green for React update
    }
    
    sessionStorage.setItem(reloadKey, now.toString())
    
    setUpdateCount(prev => prev + 1)
    
    // Flash effect
    const timer = setTimeout(() => {
      setFlashColor('transparent')
    }, 800)
    
    return () => clearTimeout(timer)
  }, [componentName]) // Remove updateCount from dependencies to prevent loops

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
