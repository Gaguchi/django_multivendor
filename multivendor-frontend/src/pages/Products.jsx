import { useProducts } from '../hooks/useProducts'
import ProductGrid from '../elements/ProductGrid'

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
                lg: 3,
                xl: 3
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
          <div className="sidebar-overlay" />
          <aside className="sidebar-shop col-lg-3 order-lg-first mobile-sidebar">
            <div className="sidebar-wrapper">
              <div className="widget">
                <h3 className="widget-title">
                  <a
                    data-toggle="collapse"
                    href="category-infinite-scroll.html#widget-body-2"
                    role="button"
                    aria-expanded="true"
                    aria-controls="widget-body-2"
                  >
                    Categories
                  </a>
                </h3>
                <div className="collapse show" id="widget-body-2">
                  <div className="widget-body">
                    <ul className="cat-list">
                      <li>
                        <a
                          href="category-infinite-scroll.html#widget-category-1"
                          data-toggle="collapse"
                          role="button"
                          aria-expanded="true"
                          aria-controls="widget-category-1"
                        >
                          Accessories<span className="products-count">(3)</span>
                          <span className="toggle" />
                        </a>
                        <div className="collapse show" id="widget-category-1">
                          <ul className="cat-sublist">
                            <li>
                              Caps<span className="products-count">(1)</span>
                            </li>
                            <li>
                              Watches<span className="products-count">(2)</span>
                            </li>
                          </ul>
                        </div>
                      </li>
                      <li>
                        <a
                          href="category-infinite-scroll.html#widget-category-2"
                          className="collapsed"
                          data-toggle="collapse"
                          role="button"
                          aria-expanded="false"
                          aria-controls="widget-category-2"
                        >
                          Dress<span className="products-count">(4)</span>
                          <span className="toggle" />
                        </a>
                        <div className="collapse" id="widget-category-2">
                          <ul className="cat-sublist">
                            <li>
                              Clothing
                              <span className="products-count">(4)</span>
                            </li>
                          </ul>
                        </div>
                      </li>
                      <li>
                        <a
                          href="category-infinite-scroll.html#widget-category-3"
                          className="collapsed"
                          data-toggle="collapse"
                          role="button"
                          aria-expanded="false"
                          aria-controls="widget-category-3"
                        >
                          Electronics<span className="products-count">(2)</span>
                          <span className="toggle" />
                        </a>
                        <div className="collapse" id="widget-category-3">
                          <ul className="cat-sublist">
                            <li>
                              Headphone
                              <span className="products-count">(1)</span>
                            </li>
                            <li>
                              Watch<span className="products-count">(1)</span>
                            </li>
                          </ul>
                        </div>
                      </li>
                      <li>
                        <a
                          href="category-infinite-scroll.html#widget-category-4"
                          className="collapsed"
                          data-toggle="collapse"
                          role="button"
                          aria-expanded="false"
                          aria-controls="widget-category-4"
                        >
                          Fashion<span className="products-count">(6)</span>
                          <span className="toggle" />
                        </a>
                        <div className="collapse" id="widget-category-4">
                          <ul className="cat-sublist">
                            <li>
                              Shoes<span className="products-count">(4)</span>
                            </li>
                            <li>
                              Bag<span className="products-count">(2)</span>
                            </li>
                          </ul>
                        </div>
                      </li>
                      <li>
                        <a href="category-infinite-scroll.html#">Music</a>
                        <span className="products-count">(2)</span>
                      </li>
                    </ul>
                  </div>
                  {/* End .widget-body */}
                </div>
                {/* End .collapse */}
              </div>
              {/* End .widget */}
              <div className="widget">
                <h3 className="widget-title">
                  <a
                    data-toggle="collapse"
                    href="category-infinite-scroll.html#widget-body-3"
                    role="button"
                    aria-expanded="true"
                    aria-controls="widget-body-3"
                  >
                    Price
                  </a>
                </h3>
                <div className="collapse show" id="widget-body-3">
                  <div className="widget-body pb-0">
                    <form action="category-infinite-scroll.html#">
                      <div className="price-slider-wrapper">
                        <div id="price-slider" />
                        {/* End #price-slider */}
                      </div>
                      {/* End .price-slider-wrapper */}
                      <div className="filter-price-action d-flex align-items-center justify-content-between flex-wrap">
                        <div className="filter-price-text">
                          Price:
                          <span id="filter-price-range" />
                        </div>
                        {/* End .filter-price-text */}
                        <button type="submit" className="btn btn-primary">
                          Filter
                        </button>
                      </div>
                      {/* End .filter-price-action */}
                    </form>
                  </div>
                  {/* End .widget-body */}
                </div>
                {/* End .collapse */}
              </div>
              {/* End .widget */}
              <div className="widget widget-color">
                <h3 className="widget-title">
                  <a
                    data-toggle="collapse"
                    href="category-infinite-scroll.html#widget-body-4"
                    role="button"
                    aria-expanded="true"
                    aria-controls="widget-body-4"
                  >
                    Color
                  </a>
                </h3>
                <div className="collapse show" id="widget-body-4">
                  <div className="widget-body pb-0">
                    <ul className="config-swatch-list">
                      <li className="active">
                        <a
                          href="category-infinite-scroll.html#"
                          style={{ backgroundColor: "#000" }}
                        />
                      </li>
                      <li>
                        <a
                          href="category-infinite-scroll.html#"
                          style={{ backgroundColor: "#0188cc" }}
                        />
                      </li>
                      <li>
                        <a
                          href="category-infinite-scroll.html#"
                          style={{ backgroundColor: "#81d742" }}
                        />
                      </li>
                      <li>
                        <a
                          href="category-infinite-scroll.html#"
                          style={{ backgroundColor: "#6085a5" }}
                        />
                      </li>
                      <li>
                        <a
                          href="category-infinite-scroll.html#"
                          style={{ backgroundColor: "#ab6e6e" }}
                        />
                      </li>
                    </ul>
                  </div>
                  {/* End .widget-body */}
                </div>
                {/* End .collapse */}
              </div>
              {/* End .widget */}
              <div className="widget widget-size">
                <h3 className="widget-title">
                  <a
                    data-toggle="collapse"
                    href="category-infinite-scroll.html#widget-body-5"
                    role="button"
                    aria-expanded="true"
                    aria-controls="widget-body-5"
                  >
                    Sizes
                  </a>
                </h3>
                <div className="collapse show" id="widget-body-5">
                  <div className="widget-body pb-0">
                    <ul className="config-size-list">
                      <li className="active">
                        <a href="category-infinite-scroll.html#">XL</a>
                      </li>
                      <li>
                        <a href="category-infinite-scroll.html#">L</a>
                      </li>
                      <li>
                        <a href="category-infinite-scroll.html#">M</a>
                      </li>
                      <li>
                        <a href="category-infinite-scroll.html#">S</a>
                      </li>
                    </ul>
                  </div>
                  {/* End .widget-body */}
                </div>
                {/* End .collapse */}
              </div>
              {/* End .widget */}
              <div className="widget widget-featured">
                <h3 className="widget-title">Featured</h3>
                <div className="widget-body">
                  <div className="owl-carousel widget-featured-products">
                    <div className="featured-col">
                      <div className="product-default left-details product-widget">
                        <figure>
                          <a href="product.html">
                            <img
                              src="src/assets/images/products/small/product-4.jpg"
                              width={75}
                              height={75}
                              alt="product"
                            />
                            <img
                              src="src/assets/images/products/small/product-4-2.jpg"
                              width={75}
                              height={75}
                              alt="product"
                            />
                          </a>
                        </figure>
                        <div className="product-details">
                          <h3 className="product-title">
                            {" "}
                            <a href="product.html">
                              Blue Backpack for the Young - S
                            </a>{" "}
                          </h3>
                          <div className="ratings-container">
                            <div className="product-ratings">
                              <span
                                className="ratings"
                                style={{ width: "100%" }}
                              />
                              {/* End .ratings */}
                              <span className="tooltiptext tooltip-top" />
                            </div>
                            {/* End .product-ratings */}
                          </div>
                          {/* End .product-container */}
                          <div className="price-box">
                            <span className="product-price">$49.00</span>
                          </div>
                          {/* End .price-box */}
                        </div>
                        {/* End .product-details */}
                      </div>
                      <div className="product-default left-details product-widget">
                        <figure>
                          <a href="product.html">
                            <img
                              src="src/assets/images/products/small/product-5.jpg"
                              width={75}
                              height={75}
                              alt="product"
                            />
                            <img
                              src="src/assets/images/products/small/product-5-2.jpg"
                              width={75}
                              height={75}
                              alt="product"
                            />
                          </a>
                        </figure>
                        <div className="product-details">
                          <h3 className="product-title">
                            {" "}
                            <a href="product.html">
                              Casual Spring Blue Shoes
                            </a>{" "}
                          </h3>
                          <div className="ratings-container">
                            <div className="product-ratings">
                              <span
                                className="ratings"
                                style={{ width: "100%" }}
                              />
                              {/* End .ratings */}
                              <span className="tooltiptext tooltip-top" />
                            </div>
                            {/* End .product-ratings */}
                          </div>
                          {/* End .product-container */}
                          <div className="price-box">
                            <span className="product-price">$49.00</span>
                          </div>
                          {/* End .price-box */}
                        </div>
                        {/* End .product-details */}
                      </div>
                      <div className="product-default left-details product-widget">
                        <figure>
                          <a href="product.html">
                            <img
                              src="src/assets/images/products/small/product-6.jpg"
                              width={75}
                              height={75}
                              alt="product"
                            />
                            <img
                              src="src/assets/images/products/small/product-6-2.jpg"
                              width={75}
                              height={75}
                              alt="product"
                            />
                          </a>
                        </figure>
                        <div className="product-details">
                          <h3 className="product-title">
                            {" "}
                            <a href="product.html">
                              Men Black Gentle Belt
                            </a>{" "}
                          </h3>
                          <div className="ratings-container">
                            <div className="product-ratings">
                              <span
                                className="ratings"
                                style={{ width: "100%" }}
                              />
                              {/* End .ratings */}
                              <span className="tooltiptext tooltip-top" />
                            </div>
                            {/* End .product-ratings */}
                          </div>
                          {/* End .product-container */}
                          <div className="price-box">
                            <span className="product-price">$49.00</span>
                          </div>
                          {/* End .price-box */}
                        </div>
                        {/* End .product-details */}
                      </div>
                    </div>
                    {/* End .featured-col */}
                    <div className="featured-col">
                      <div className="product-default left-details product-widget">
                        <figure>
                          <a href="product.html">
                            <img
                              src="src/assets/images/products/small/product-1.jpg"
                              width={75}
                              height={75}
                              alt="product"
                            />
                            <img
                              src="src/assets/images/products/small/product-1-2.jpg"
                              width={75}
                              height={75}
                              alt="product"
                            />
                          </a>
                        </figure>
                        <div className="product-details">
                          <h3 className="product-title">
                            {" "}
                            <a href="product.html">
                              Ultimate 3D Bluetooth Speaker
                            </a>{" "}
                          </h3>
                          <div className="ratings-container">
                            <div className="product-ratings">
                              <span
                                className="ratings"
                                style={{ width: "100%" }}
                              />
                              {/* End .ratings */}
                              <span className="tooltiptext tooltip-top" />
                            </div>
                            {/* End .product-ratings */}
                          </div>
                          {/* End .product-container */}
                          <div className="price-box">
                            <span className="product-price">$49.00</span>
                          </div>
                          {/* End .price-box */}
                        </div>
                        {/* End .product-details */}
                      </div>
                      <div className="product-default left-details product-widget">
                        <figure>
                          <a href="product.html">
                            <img
                              src="src/assets/images/products/small/product-2.jpg"
                              width={75}
                              height={75}
                              alt="product"
                            />
                            <img
                              src="src/assets/images/products/small/product-2-2.jpg"
                              width={75}
                              height={75}
                              alt="product"
                            />
                          </a>
                        </figure>
                        <div className="product-details">
                          <h3 className="product-title">
                            {" "}
                            <a href="product.html">
                              Brown Women Casual HandBag
                            </a>{" "}
                          </h3>
                          <div className="ratings-container">
                            <div className="product-ratings">
                              <span
                                className="ratings"
                                style={{ width: "100%" }}
                              />
                              {/* End .ratings */}
                              <span className="tooltiptext tooltip-top" />
                            </div>
                            {/* End .product-ratings */}
                          </div>
                          {/* End .product-container */}
                          <div className="price-box">
                            <span className="product-price">$49.00</span>
                          </div>
                          {/* End .price-box */}
                        </div>
                        {/* End .product-details */}
                      </div>
                      <div className="product-default left-details product-widget">
                        <figure>
                          <a href="product.html">
                            <img
                              src="src/assets/images/products/small/product-3.jpg"
                              width={75}
                              height={75}
                              alt="product"
                            />
                            <img
                              src="src/assets/images/products/small/product-3-2.jpg"
                              width={75}
                              height={75}
                              alt="product"
                            />
                          </a>
                        </figure>
                        <div className="product-details">
                          <h3 className="product-title">
                            {" "}
                            <a href="product.html">
                              Circled Ultimate 3D Speaker
                            </a>{" "}
                          </h3>
                          <div className="ratings-container">
                            <div className="product-ratings">
                              <span
                                className="ratings"
                                style={{ width: "100%" }}
                              />
                              {/* End .ratings */}
                              <span className="tooltiptext tooltip-top" />
                            </div>
                            {/* End .product-ratings */}
                          </div>
                          {/* End .product-container */}
                          <div className="price-box">
                            <span className="product-price">$49.00</span>
                          </div>
                          {/* End .price-box */}
                        </div>
                        {/* End .product-details */}
                      </div>
                    </div>
                    {/* End .featured-col */}
                  </div>
                  {/* End .widget-featured-slider */}
                </div>
                {/* End .widget-body */}
              </div>
              {/* End .widget */}
              <div className="widget widget-block">
                <h3 className="widget-title">Custom HTML Block</h3>
                <h5>This is a custom sub-title.</h5>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras
                  non placerat mi. Etiam non tellus{" "}
                </p>
              </div>
              {/* End .widget */}
            </div>
            {/* End .sidebar-wrapper */}
          </aside>
          {/* End .col-lg-3 */}
        </div>
        {/* End .row */}
      </div>
      {/* End .container */}
      <div className="mb-3" />
      {/* margin */}
    </>
  )
}