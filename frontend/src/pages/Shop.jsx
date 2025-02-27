import { useProducts } from '../hooks/useProducts'
import ProductGrid from '../elements/ProductGrid'
import Sidebar from '../components/Shop/Sidebar'

export default function Products() {
  const { data, isLoading, error } = useProducts()
  const products = data?.pages?.[0]?.results || []

  return (
    <>
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
                <a href="category.html" className="btn btn-dark">
                  Get Yours!
                </a>
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
              <a href="demo4.html">
                <i className="icon-home" />
              </a>
            </li>
            <li className="breadcrumb-item">
              <a href="category-infinite-scroll.html#">Men</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Accessories
            </li>
          </ol>
        </nav>
        <div className="row">
          <div className="col-lg-9">
            <nav
              className="toolbox sticky-header"
              data-sticky-options="{'mobile': true}"
            >
              <div className="toolbox-left">
                <a
                  href="category-infinite-scroll.html#"
                  className="sidebar-toggle"
                >
                  <svg
                    data-name="Layer 3"
                    id="Layer_3"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <line x1={15} x2={26} y1={9} y2={9} className="cls-1" />
                    <line x1={6} x2={9} y1={9} y2={9} className="cls-1" />
                    <line x1={23} x2={26} y1={16} y2={16} className="cls-1" />
                    <line x1={6} x2={17} y1={16} y2={16} className="cls-1" />
                    <line x1={17} x2={26} y1={23} y2={23} className="cls-1" />
                    <line x1={6} x2={11} y1={23} y2={23} className="cls-1" />
                    <path
                      d="M14.5,8.92A2.6,2.6,0,0,1,12,11.5,2.6,2.6,0,0,1,9.5,8.92a2.5,2.5,0,0,1,5,0Z"
                      className="cls-2"
                    />
                    <path
                      d="M22.5,15.92a2.5,2.5,0,1,1-5,0,2.5,2.5,0,0,1,5,0Z"
                      className="cls-2"
                    />
                    <path
                      d="M21,16a1,1,0,1,1-2,0,1,1,0,0,1,2,0Z"
                      className="cls-3"
                    />
                    <path
                      d="M16.5,22.92A2.6,2.6,0,0,1,14,25.5a2.6,2.6,0,0,1-2.5-2.58,2.5,2.5,0,0,1,5,0Z"
                      className="cls-2"
                    />
                  </svg>
                  <span>Filter</span>
                </a>
                <div className="toolbox-item toolbox-sort">
                  <label>Sort By:</label>
                  <div className="select-custom">
                    <select name="orderby" className="form-control" defaultValue="menu_order">
                      <option value="menu_order">Default sorting</option>
                      <option value="popularity">Sort by popularity</option>
                      <option value="rating">Sort by average rating</option>
                      <option value="date">Sort by newness</option>
                      <option value="price">Sort by price: low to high</option>
                      <option value="price-desc">Sort by price: high to low</option>
                    </select>
                  </div>
                  {/* End .select-custom */}
                </div>
                {/* End .toolbox-item */}
              </div>
              {/* End .toolbox-left */}
              <div className="toolbox-right">
                <div className="toolbox-item toolbox-show">
                  <label>Show:</label>
                  <div className="select-custom">
                    <select name="count" className="form-control" defaultValue={12}>
                      <option value={12}>12</option>
                      <option value={24}>24</option>
                      <option value={36}>36</option>
                    </select>
                  </div>
                  {/* End .select-custom */}
                </div>
                {/* End .toolbox-item */}
                <div className="toolbox-item layout-modes">
                  <a
                    href="category.html"
                    className="layout-btn btn-grid active"
                    title="Grid"
                  >
                    <i className="icon-mode-grid" />
                  </a>
                  <a
                    href="category-list.html"
                    className="layout-btn btn-list"
                    title="List"
                  >
                    <i className="icon-mode-list" />
                  </a>
                </div>
                {/* End .layout-modes */}
              </div>
              {/* End .toolbox-right */}
            </nav>

            <ProductGrid 
              products={products}
              loading={isLoading}
              error={error}
              defaultColumns={{
                xs: 2,
                sm: 2,
                md: 3,
                lg: 4,
                xl: 4
              }}
              defaultLimit={{
                xs: 6,
                sm: 6,
                md: 9,
                lg: 12,
                xl: 12
              }}
              className="row product-ajax-grid scroll-load"
            />

          </div>
          <Sidebar />
        </div>
        {/* End .row */}
      </div>
      {/* End .container */}
      <div className="mb-3" />
      {/* margin */}
    </>
  )
}