import { memo } from 'react'

const StaticSidebarWidgets = memo(function StaticSidebarWidgets() {
  console.log('📌 StaticSidebarWidgets render:', {
    timestamp: new Date().toISOString(),
    note: 'This should only render once unless props change'
  })

  return (
    <>
      {/* Recently Viewed Widget */}
      <div className="widget widget-recently-viewed">
        <h3 className="widget-title">Recently Viewed</h3>
        <div className="widget-body">
          <div className="recently-viewed-products">
            <div className="text-center text-muted py-3">
              <small>Recently viewed products will appear here</small>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products Widget */}
      <div className="widget widget-featured">
        <h3 className="widget-title">Featured</h3>
        <div className="widget-body">
          <div className="featured-products">
            <div className="text-center text-muted py-3">
              <small>Featured products will appear here</small>
            </div>
          </div>
        </div>
      </div>

      {/* Custom HTML Block */}
      <div className="widget widget-block">
        <h3 className="widget-title">Special Offers</h3>
        <h5>Get the best deals!</h5>
        <p>
          Subscribe to our newsletter and get exclusive offers and discounts delivered to your inbox.
        </p>
        <button 
          className="btn btn-primary btn-sm" 
          onClick={(e) => {
            e.preventDefault()
            // Add subscribe functionality here if needed
          }}
        >
          Subscribe Now
        </button>
      </div>
    </>
  )
})

export default StaticSidebarWidgets
