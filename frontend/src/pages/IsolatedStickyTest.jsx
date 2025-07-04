import React from 'react'

function IsolatedStickyTest() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: 0, padding: 0 }}>
      {/* Header content */}
      <div style={{ 
        height: '100px', 
        background: '#f0f0f0', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        borderBottom: '2px solid #ddd'
      }}>
        <h1>🧪 Isolated Sticky Test Page</h1>
      </div>

      <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
        {/* Sticky Sidebar */}
        <div style={{
          width: '300px',
          position: 'sticky',
          top: '20px',
          height: 'fit-content',
          background: '#fff',
          border: '2px solid #007bff',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          // Critical CSS overrides to prevent global conflicts
          transform: 'none !important',
          overflow: 'visible !important',
          contain: 'none !important'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#007bff' }}>📌 Sticky Sidebar</h3>
          <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
            This sidebar should stick to the top when you scroll down.
          </p>
          <div style={{ background: '#f8f9fa', padding: '10px', borderRadius: '4px', marginBottom: '10px' }}>
            <strong>Test Status:</strong> 
            <span style={{ color: '#28a745' }}> ✅ Active</span>
          </div>
          <div style={{ background: '#e3f2fd', padding: '10px', borderRadius: '4px' }}>
            <strong>CSS Overrides:</strong><br/>
            • transform: none !important<br/>
            • overflow: visible !important<br/>
            • contain: none !important
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1 }}>
          <h2>📜 Scroll Content</h2>
          <p>Scroll down to test the sticky sidebar behavior...</p>
          
          {Array.from({ length: 50 }, (_, i) => (
            <div key={i} style={{
              background: i % 2 === 0 ? '#f8f9fa' : '#ffffff',
              padding: '20px',
              margin: '10px 0',
              border: '1px solid #dee2e6',
              borderRadius: '4px'
            }}>
              <h4>Content Block {i + 1}</h4>
              <p>
                This is content block number {i + 1}. Keep scrolling to see if the sidebar 
                stays sticky. The sidebar should remain visible and positioned correctly 
                as you scroll through this content.
              </p>
              {i === 10 && (
                <div style={{ background: '#fff3cd', padding: '15px', borderRadius: '4px', border: '1px solid #ffeaa7' }}>
                  <strong>🎯 Halfway Point:</strong> If you can still see the sidebar stuck to the top, 
                  the sticky positioning is working correctly!
                </div>
              )}
              {i === 25 && (
                <div style={{ background: '#d1ecf1', padding: '15px', borderRadius: '4px', border: '1px solid #bee5eb' }}>
                  <strong>🏁 Three Quarter Point:</strong> Still sticky? Great! The CSS overrides 
                  are successfully neutralizing any global CSS conflicts.
                </div>
              )}
            </div>
          ))}
          
          <div style={{
            background: '#d4edda',
            padding: '20px',
            borderRadius: '8px',
            border: '2px solid #c3e6cb',
            textAlign: 'center',
            marginTop: '20px'
          }}>
            <h3>🎉 End of Content</h3>
            <p>
              If the sidebar stayed sticky throughout your scroll, the test passed! 
              You can now scroll back up to see the sidebar behavior in reverse.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IsolatedStickyTest
