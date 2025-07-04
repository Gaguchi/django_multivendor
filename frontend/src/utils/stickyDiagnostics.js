/**
 * Sticky Positioning Diagnostics Utility
 * Use this to debug sticky positioning issues in the Shop page
 */

export const runStickyDiagnostics = () => {
  console.log('🔍 Running Sticky Positioning Diagnostics...')
  
  // Check HTML/Body overflow settings
  const htmlStyle = window.getComputedStyle(document.documentElement)
  const bodyStyle = window.getComputedStyle(document.body)
  
  console.log('📋 CSS Analysis:', {
    htmlOverflowX: htmlStyle.overflowX,
    htmlOverflowY: htmlStyle.overflowY,
    htmlPosition: htmlStyle.position,
    bodyOverflowX: bodyStyle.overflowX,
    bodyOverflowY: bodyStyle.overflowY,
    bodyPosition: bodyStyle.position,
    htmlClasses: document.documentElement.className,
    bodyClasses: document.body.className
  })
  
  // Find StickyBox elements
  const stickyElements = document.querySelectorAll('[class*="sticky"]')
  console.log('📌 Sticky Elements Found:', stickyElements.length)
  
  stickyElements.forEach((el, index) => {
    const style = window.getComputedStyle(el)
    const rect = el.getBoundingClientRect()
    
    console.log(`📌 Sticky Element ${index + 1}:`, {
      className: el.className,
      position: style.position,
      top: style.top,
      transform: style.transform,
      overflow: style.overflow,
      overflowX: style.overflowX,
      overflowY: style.overflowY,
      zIndex: style.zIndex,
      contain: style.contain,
      rect: {
        top: Math.round(rect.top),
        left: Math.round(rect.left),
        width: Math.round(rect.width),
        height: Math.round(rect.height)
      }
    })
  })
  
  // Check if react-sticky-box is working
  const stickyBoxElements = document.querySelectorAll('[data-react-sticky-box]')
  console.log('📦 React StickyBox Elements:', stickyBoxElements.length)
  
  // Test sticky positioning support
  const testDiv = document.createElement('div')
  testDiv.style.position = 'sticky'
  testDiv.style.top = '0'
  document.body.appendChild(testDiv)
  
  const stickySupported = window.getComputedStyle(testDiv).position === 'sticky'
  document.body.removeChild(testDiv)
  
  console.log('✅ Browser Support:', {
    stickyPositionSupported: stickySupported,
    userAgent: navigator.userAgent.split(' ').slice(0, 3).join(' ')
  })
  
  return {
    htmlOverflowX: htmlStyle.overflowX,
    bodyOverflowX: bodyStyle.overflowX,
    stickyElementsFound: stickyElements.length,
    stickyBoxElementsFound: stickyBoxElements.length,
    stickySupported
  }
}

// Auto-run diagnostics in development
if (process.env.NODE_ENV === 'development') {
  // Run diagnostics after page load
  if (typeof window !== 'undefined') {
    window.runStickyDiagnostics = runStickyDiagnostics
    console.log('🔧 Sticky diagnostics available: window.runStickyDiagnostics()')
  }
}
