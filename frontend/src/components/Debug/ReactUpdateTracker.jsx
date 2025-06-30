import { useEffect, useRef } from 'react'

/**
 * Debug component to track React updates vs page reloads
 * Add this to any component to monitor if it's updating via React or reloading the page
 */
export function ReactUpdateTracker({ componentName = 'Component' }) {
  const renderCount = useRef(0)
  const mountTime = useRef(Date.now())
  
  useEffect(() => {
    renderCount.current += 1
    const timeSinceMount = Date.now() - mountTime.current
    
    console.log(`🔄 ${componentName} React Update #${renderCount.current} (${timeSinceMount}ms since mount)`)
    
    // If this is the first render, it's a mount (could be initial load or page reload)
    if (renderCount.current === 1) {
      console.log(`🎯 ${componentName} MOUNTED - This is either initial load or page reload`)
    } else {
      console.log(`✨ ${componentName} RE-RENDERED - This is a React update, NOT a page reload`)
    }
  })

  // Check if page was reloaded by checking sessionStorage
  useEffect(() => {
    const reloadKey = `${componentName}_reload_tracker`
    const lastReload = sessionStorage.getItem(reloadKey)
    const currentTime = Date.now()
    
    if (lastReload && (currentTime - parseInt(lastReload)) < 1000) {
      console.log(`🔄 ${componentName} DETECTED PAGE RELOAD (within 1 second of last mount)`)
    } else {
      console.log(`🎯 ${componentName} CLEAN MOUNT (not a page reload)`)
    }
    
    sessionStorage.setItem(reloadKey, currentTime.toString())
  }, [componentName])

  return null // This component renders nothing
}

export default ReactUpdateTracker
