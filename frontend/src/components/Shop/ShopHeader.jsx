import { memo, useRef } from 'react'
import RenderVisualizer from '../Debug/RenderVisualizer'

/**
 * Static shop header with banner and breadcrumbs
 * This is memoized with no props and should never re-render
 */
const ShopHeader = memo(function ShopHeader() {
  const renderCountRef = useRef(0)
  renderCountRef.current++
  
  console.log('🏪 ShopHeader render:', {
    renderCount: renderCountRef.current,
    timestamp: new Date().toISOString(),
    warning: renderCountRef.current > 1 ? '⚠️ WARNING: This should only render once!' : '✅ Good: First render'
  })

  return (
    <>
      <RenderVisualizer componentName="Header" style={{ top: '50px', right: '10px' }} />
      <div className="category-banner-container bg-gray">
        <div
          className="category-banner banner text-uppercase"
          style={{
            background:
              'no-repeat 60%/cover url("src/assets/images/banners/banner-top.jpg")'
          }}
        >
          <div className="container position-relative">
            <div className="row">
              <div className="pl-lg-5 pb-5 pb-md-0 col-md-5 col-xl-4 col-lg-4 offset-1">
                <h3>
                  Electronic
                  <br />
                  Deals
                </h3>
                <button 
                  type="button"
                  className="btn btn-dark"
                  onClick={(e) => {
                    e.preventDefault()
                    console.log('🛒 Get Yours button clicked')
                  }}
                >
                  Get Yours!
                </button>
              </div>
              <div className="pl-lg-3 col-md-4 offset-md-0 offset-1 pt-3">
                <div className="coupon-sale-content">
                  <h4 className="m-b-1 coupon-sale-text bg-white text-transform-none">
                    Exclusive COUPON
                  </h4>
                  <h5 className="mb-2 coupon-sale-text d-block ls-10 p-0">
                    <i className="ls-0">UP TO</i>
                    <b className="text-dark">$100</b> OFF
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container">
        <nav aria-label="breadcrumb" className="breadcrumb-nav">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <button 
                type="button"
                className="breadcrumb-link"
                onClick={(e) => {
                  e.preventDefault()
                  console.log('🏠 Home breadcrumb clicked')
                }}
              >
                <i className="icon-home" />
              </button>
            </li>
            <li className="breadcrumb-item">
              <button 
                type="button"
                className="breadcrumb-link"
                onClick={(e) => {
                  e.preventDefault()
                  console.log('👨 Men breadcrumb clicked')
                }}
              >
                Men
              </button>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Accessories
            </li>
          </ol>
        </nav>
      </div>
    </>
  )
})

export default ShopHeader
