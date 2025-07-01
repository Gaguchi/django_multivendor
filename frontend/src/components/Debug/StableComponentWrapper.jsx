import { memo, useRef, useEffect } from 'react'

/**
 * A wrapper component that prevents unnecessary remounts and provides debugging
 * Use this to wrap components that should only re-render, not remount
 */
const StableComponentWrapper = memo(function StableComponentWrapper({ 
  children, 
  componentName = 'Component',
  debugMode = true 
}) {
  const mountTimeRef = useRef(Date.now())
  const renderCountRef = useRef(0)
  const isMountedRef = useRef(false)

  renderCountRef.current++

  useEffect(() => {
    if (!isMountedRef.current) {
      if (debugMode) {
        console.log(`🏗️ ${componentName} MOUNTED at:`, new Date().toISOString())
      }
      isMountedRef.current = true
    } else {
      if (debugMode) {
        console.warn(`⚠️ ${componentName} REMOUNTED - This might indicate a performance issue!`)
      }
    }
  }, []) // Add empty dependency array to run only on mount

  useEffect(() => {
    if (debugMode) {
      // Use setTimeout to avoid logging during render phase
      setTimeout(() => {
        console.log(`🔄 ${componentName} rendered #${renderCountRef.current} (${Date.now() - mountTimeRef.current}ms since mount)`)
      }, 0)
    }
  }) // This can run on every render but uses setTimeout to defer logging

  return children
})

export default StableComponentWrapper
