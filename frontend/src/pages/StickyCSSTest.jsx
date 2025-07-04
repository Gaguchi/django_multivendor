import React, { useEffect } from 'react'
import '../assets/css/sticky-fixes.css'

function StickyCSSTest() {
  
  useEffect(() => {
    // Apply our CSS fixes
    document.documentElement.classList.add('sticky-page-fix')
    document.body.classList.add('sticky-page-fix')
    
    return () => {
      document.documentElement.classList.remove('sticky-page-fix')
      document.body.classList.remove('sticky-page-fix')
    }
  }, [])

  return (
    <div className="sticky-environment" style={{ fontFamily: 'Arial, sans-serif', margin: 0, padding: 0 }}>
      <div style={{ padding: '20px' }}>
        <h1>Sticky CSS Test - WITH Global CSS Files Enabled</h1>
        <p>This test page validates that our CSS fixes work even with style.min.css and demo35.min.css enabled.</p>
        
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
          {/* Fixed content that will cause the page to scroll */}
          <div style={{ flex: 1 }}>
            <h2>Main Content</h2>
            <div style={{ height: '200vh', background: 'linear-gradient(to bottom, #f0f0f0, #d0d0d0)' }}>
              <p>Scroll down to test sticky behavior...</p>
              <div style={{ height: '100px', margin: '20px 0', background: '#e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Content Block 1
              </div>
              <div style={{ height: '100px', margin: '20px 0', background: '#d8d8d8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Content Block 2
              </div>
              <div style={{ height: '100px', margin: '20px 0', background: '#c8c8c8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Content Block 3
              </div>
              <div style={{ height: '100px', margin: '20px 0', background: '#b8b8b8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Content Block 4
              </div>
              <div style={{ height: '100px', margin: '20px 0', background: '#a8a8a8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Content Block 5
              </div>
              <div style={{ height: '200px', margin: '20px 0', background: '#999', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                Final Content Block - Scroll to bottom
              </div>
            </div>
          </div>
          
          {/* Sticky sidebar with our CSS fixes */}
          <div className="sticky-fix-container" style={{ width: '300px' }}>
            <div 
              className="sticky-content sticky-debug"
              style={{
                width: '300px',
                background: 'white',
                border: '2px solid #007bff',
                borderRadius: '8px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              <h3>Sticky Sidebar ✅</h3>
              <p><strong>CSS Fixes Applied:</strong></p>
              <ul style={{ fontSize: '14px', lineHeight: '1.4' }}>
                <li>✅ overflow-x: visible on html/body</li>
                <li>✅ transform: none on containers</li>
                <li>✅ contain: none</li>
                <li>✅ Owl carousel transforms neutralized</li>
              </ul>
              
              <div style={{ marginTop: '20px', padding: '10px', background: '#f8f9fa', borderRadius: '4px' }}>
                <strong>Debug Info:</strong><br/>
                <small>Position: sticky<br/>
                Top: 20px<br/>
                Z-index: 999</small>
              </div>
              
              <div style={{ marginTop: '20px' }}>
                <button 
                  style={{
                    background: '#007bff',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    const computedStyle = window.getComputedStyle(document.querySelector('.sticky-content'))
                    console.log('🔍 Sticky Element Computed Styles:', {
                      position: computedStyle.position,
                      top: computedStyle.top,
                      transform: computedStyle.transform,
                      overflow: computedStyle.overflow,
                      contain: computedStyle.contain,
                      zIndex: computedStyle.zIndex
                    })
                    alert('Check console for computed styles')
                  }}
                >
                  Debug Styles
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StickyCSSTest
