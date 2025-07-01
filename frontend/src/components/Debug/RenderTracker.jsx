import { useEffect, useRef } from 'react'

export default function RenderTracker({ componentName, data }) {
  const renderCount = useRef(0)
  const lastRenderTime = useRef(Date.now())
  
  useEffect(() => {
    renderCount.current += 1
    const now = Date.now()
    const timeSinceLastRender = now - lastRenderTime.current
    lastRenderTime.current = now
    
    console.log(`🔄 ${componentName} render #${renderCount.current}`, {
      timeSinceLastRender: `${timeSinceLastRender}ms`,
      data: data || 'No data provided',
      timestamp: new Date().toISOString()
    })
  })

  return null // This component doesn't render anything
}
