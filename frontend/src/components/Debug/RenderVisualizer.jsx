import { useRef, useEffect } from 'react'

/**
 * Visual component that shows render count and flashes on re-render
 * Add this to any component to visually see when it re-renders
 */
export function RenderVisualizer({ componentName, style = {} }) {
  const renderCountRef = useRef(0)
  const elementRef = useRef(null)
  
  renderCountRef.current++
  
  useEffect(() => {
    // Flash effect on re-render
    if (elementRef.current && renderCountRef.current > 1) {
      elementRef.current.style.backgroundColor = '#00ff0080'
      setTimeout(() => {
        if (elementRef.current) {
          elementRef.current.style.backgroundColor = 'transparent'
        }
      }, 200)
    }
  })
  
  return (
    <div 
      ref={elementRef}
      style={{
        position: 'fixed',
        top: '10px',
        right: `${10 + (componentName.length * 15)}px`,
        backgroundColor: renderCountRef.current === 1 ? '#00ff0020' : '#ff000020',
        padding: '5px 10px',
        border: '1px solid #333',
        borderRadius: '4px',
        fontSize: '12px',
        fontFamily: 'monospace',
        zIndex: 9999,
        transition: 'background-color 0.2s',
        ...style
      }}
    >
      {componentName}: {renderCountRef.current}
    </div>
  )
}

export default RenderVisualizer
