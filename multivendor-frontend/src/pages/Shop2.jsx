export default function Shop2() {

    return (
        <>
  <meta charSet="UTF-8" />
  <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1, shrink-to-fit=no"
  />
  <title>Porto - Bootstrap eCommerce Template</title>
  <meta name="keywords" content="HTML5 Template" />
  <meta name="description" content="Porto - Bootstrap eCommerce Template" />
  <meta name="author" content="SW-THEMES" />
  {/* Favicon */}
  <link rel="icon" type="image/x-icon" href="src/assets/images/icons/favicon.png" />
  {/* Plugins CSS File */}
  <link rel="stylesheet" href="src/assets/css/bootstrap.min.css" />
  {/* Main CSS File */}
  <link rel="stylesheet" href="src/assets/css/style.min.css" />
  <link
    rel="stylesheet"
    type="text/css"
    href="src/assets/vendor/fontawesome-free/css/all.min.css"
  />
  <div className="page-wrapper">
    <header className="header">
      <div className="header-top">
        <div className="container">
          <div className="header-left d-none d-sm-block">
            <p className="top-message text-uppercase">
              FREE Returns. Standard Shipping Orders $99+
            </p>
          </div>
          {/* End .header-left */}
          <div className="header-right header-dropdowns ml-0 ml-sm-auto w-sm-100">
            <div className="header-dropdown dropdown-expanded d-none d-lg-block">
              <a href="category-infinite-scroll.html#">Links</a>
              <div className="header-menu">
                <ul>
                  <li>
                    <a href="dashboard.html">My Account</a>
                  </li>
                  <li>
                    <a href="about.html">About Us</a>
                  </li>
                  <li>
                    <a href="blog.html">Blog</a>
                  </li>
                  <li>
                    <a href="wishlist.html">My Wishlist</a>
                  </li>
                  <li>
                    <a href="cart.html">Cart</a>
                  </li>
                  <li>
                    <a href="login.html" className="login-link">
                      Log In
                    </a>
                  </li>
                </ul>
              </div>
              {/* End .header-menu */}
            </div>
            {/* End .header-dropown */}
            <span className="separator" />
            <div className="header-dropdown">
              <a href="category-infinite-scroll.html#">
                <i className="flag-us flag" />
                ENG
              </a>
              <div className="header-menu">
                <ul>
                  <li>
                    <a href="category-infinite-scroll.html#">
                      <i className="flag-us flag mr-2" />
                      ENG
                    </a>
                  </li>
                  <li>
                    <a href="category-infinite-scroll.html#">
                      <i className="flag-fr flag mr-2" />
                      FRA
                    </a>
                  </li>
                </ul>
              </div>
              {/* End .header-menu */}
            </div>
            {/* End .header-dropown */}
            <div className="header-dropdown mr-auto mr-sm-3 mr-md-0">
              <a href="category-infinite-scroll.html#">USD</a>
              <div className="header-menu">
                <ul>
                  <li>
                    <a href="category-infinite-scroll.html#">EUR</a>
                  </li>
                  <li>
                    <a href="category-infinite-scroll.html#">USD</a>
                  </li>
                </ul>
              </div>
              {/* End .header-menu */}
            </div>
            {/* End .header-dropown */}
            <span className="separator" />
            <div className="social-icons">
              <a
                href="category-infinite-scroll.html#"
                className="social-icon social-facebook icon-facebook"
                target="_blank"
              />
              <a
                href="category-infinite-scroll.html#"
                className="social-icon social-twitter icon-twitter"
                target="_blank"
              />
              <a
                href="category-infinite-scroll.html#"
                className="social-icon social-instagram icon-instagram"
                target="_blank"
              />
            </div>
            {/* End .social-icons */}
          </div>
          {/* End .header-right */}
        </div>
        {/* End .container */}
      </div>
      {/* End .header-top */}
      <div
        className="header-middle sticky-header"
        data-sticky-options="{'mobile': true}"
      >
        <div className="container">
          <div className="header-left col-lg-2 w-auto pl-0">
            <button
              className="mobile-menu-toggler text-primary mr-2"
              type="button"
            >
              <i className="fas fa-bars" />
            </button>
            <a href="demo4.html" className="logo">
              <img
                src="src/assets/images/logo.png"
                width={111}
                height={44}
                alt="Porto Logo"
              />
            </a>
          </div>
          {/* End .header-left */}
          <div className="header-right w-lg-max">
            <div className="header-icon header-search header-search-inline header-search-category w-lg-max text-right mt-0">
              <a
                href="category-infinite-scroll.html#"
                className="search-toggle"
                role="button"
              >
                <i className="icon-search-3" />
              </a>
              <form action="category-infinite-scroll.html#" method="get">
                <div className="header-search-wrapper">
                  <input
                    type="search"
                    className="form-control"
                    name="q"
                    id="q"
                    placeholder="Search..."
                    required=""
                  />
                  <div className="select-custom">
                    <select id="cat" name="cat">
                      <option value="">All Categories</option>
                      <option value={4}>Fashion</option>
                      <option value={12}>- Women</option>
                      <option value={13}>- Men</option>
                      <option value={66}>- Jewellery</option>
                      <option value={67}>- Kids Fashion</option>
                      <option value={5}>Electronics</option>
                      <option value={21}>- Smart TVs</option>
                      <option value={22}>- Cameras</option>
                      <option value={63}>- Games</option>
                      <option value={7}>Home &amp; Garden</option>
                      <option value={11}>Motors</option>
                      <option value={31}>- Cars and Trucks</option>
                      <option value={32}>
                        - Motorcycles &amp; Powersports
                      </option>
                      <option value={33}>- Parts &amp; Accessories</option>
                      <option value={34}>- Boats</option>
                      <option value={57}>- Auto Tools &amp; Supplies</option>
                    </select>
                  </div>
                  {/* End .select-custom */}
                  <button className="btn icon-magnifier p-0" type="submit" />
                </div>
                {/* End .header-search-wrapper */}
              </form>
            </div>
            {/* End .header-search */}
            <div className="header-contact d-none d-lg-flex pl-4 pr-4">
              <img
                alt="phone"
                src="src/assets/images/phone.png"
                width={30}
                height={30}
                className="pb-1"
              />
              <h6>
                Call us now
                <a href="tel:#" className="text-dark font1">
                  +123 5678 890
                </a>
              </h6>
            </div>
            <a href="login.html" className="header-icon" title="login">
              <i className="icon-user-2" />
            </a>
            <a href="wishlist.html" className="header-icon" title="wishlist">
              <i className="icon-wishlist-2" />
            </a>
            <div className="dropdown cart-dropdown">
              <a
                href="category-infinite-scroll.html#"
                title="Cart"
                className="dropdown-toggle dropdown-arrow cart-toggle"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                data-display="static"
              >
                <i className="minicart-icon" />
                <span className="cart-count badge-circle">3</span>
              </a>
              <div className="cart-overlay" />
              <div className="dropdown-menu mobile-cart">
                <a
                  href="category-infinite-scroll.html#"
                  title="Close (Esc)"
                  className="btn-close"
                >
                  ×
                </a>
                <div className="dropdownmenu-wrapper custom-scrollbar">
                  <div className="dropdown-cart-header">Shopping Cart</div>
                  {/* End .dropdown-cart-header */}
                  <div className="dropdown-cart-products">
                    <div className="product">
                      <div className="product-details">
                        <h4 className="product-title">
                          <a href="product.html">
                            Ultimate 3D Bluetooth Speaker
                          </a>
                        </h4>
                        <span className="cart-product-info">
                          <span className="cart-product-qty">1</span> × $99.00
                        </span>
                      </div>
                      {/* End .product-details */}
                      <figure className="product-image-container">
                        <a href="product.html" className="product-image">
                          <img
                            src="src/assets/images/products/product-1.jpg"
                            alt="product"
                            width={80}
                            height={80}
                          />
                        </a>
                        <a
                          href="category-infinite-scroll.html#"
                          className="btn-remove"
                          title="Remove Product"
                        >
                          <span>×</span>
                        </a>
                      </figure>
                    </div>
                    {/* End .product */}
                    <div className="product">
                      <div className="product-details">
                        <h4 className="product-title">
                          <a href="product.html">Brown Women Casual HandBag</a>
                        </h4>
                        <span className="cart-product-info">
                          <span className="cart-product-qty">1</span> × $35.00
                        </span>
                      </div>
                      {/* End .product-details */}
                      <figure className="product-image-container">
                        <a href="product.html" className="product-image">
                          <img
                            src="src/assets/images/products/product-2.jpg"
                            alt="product"
                            width={80}
                            height={80}
                          />
                        </a>
                        <a
                          href="category-infinite-scroll.html#"
                          className="btn-remove"
                          title="Remove Product"
                        >
                          <span>×</span>
                        </a>
                      </figure>
                    </div>
                    {/* End .product */}
                    <div className="product">
                      <div className="product-details">
                        <h4 className="product-title">
                          <a href="product.html">Circled Ultimate 3D Speaker</a>
                        </h4>
                        <span className="cart-product-info">
                          <span className="cart-product-qty">1</span> × $35.00
                        </span>
                      </div>
                      {/* End .product-details */}
                      <figure className="product-image-container">
                        <a href="product.html" className="product-image">
                          <img
                            src="src/assets/images/products/product-3.jpg"
                            alt="product"
                            width={80}
                            height={80}
                          />
                        </a>
                        <a
                          href="category-infinite-scroll.html#"
                          className="btn-remove"
                          title="Remove Product"
                        >
                          <span>×</span>
                        </a>
                      </figure>
                    </div>
                    {/* End .product */}
                  </div>
                  {/* End .cart-product */}
                  <div className="dropdown-cart-total">
                    <span>SUBTOTAL:</span>
                    <span className="cart-total-price float-right">
                      $134.00
                    </span>
                  </div>
                  {/* End .dropdown-cart-total */}
                  <div className="dropdown-cart-action">
                    <a
                      href="cart.html"
                      className="btn btn-gray btn-block view-cart"
                    >
                      View Cart
                    </a>
                    <a href="checkout.html" className="btn btn-dark btn-block">
                      Checkout
                    </a>
                  </div>
                  {/* End .dropdown-cart-total */}
                </div>
                {/* End .dropdownmenu-wrapper */}
              </div>
              {/* End .dropdown-menu */}
            </div>
            {/* End .dropdown */}
          </div>
          {/* End .header-right */}
        </div>
        {/* End .container */}
      </div>
      {/* End .header-middle */}
      <div
        className="header-bottom sticky-header d-none d-lg-block"
        data-sticky-options="{'mobile': false}"
      >
        <div className="container">
          <nav className="main-nav w-100">
            <ul className="menu">
              <li>
                <a href="demo4.html">Home</a>
              </li>
              <li className="active">
                <a href="category.html">Categories</a>
                <div className="megamenu megamenu-fixed-width megamenu-3cols">
                  <div className="row">
                    <div className="col-lg-4">
                      <a
                        href="category-infinite-scroll.html#"
                        className="nolink"
                      >
                        VARIATION 1
                      </a>
                      <ul className="submenu">
                        <li>
                          <a href="category.html">Fullwidth Banner</a>
                        </li>
                        <li>
                          <a href="category-banner-boxed-slider.html">
                            Boxed Slider Banner
                          </a>
                        </li>
                        <li>
                          <a href="category-banner-boxed-image.html">
                            Boxed Image Banner
                          </a>
                        </li>
                        <li>
                          <a href="category.html">Left Sidebar</a>
                        </li>
                        <li>
                          <a href="category-sidebar-right.html">
                            Right Sidebar
                          </a>
                        </li>
                        <li>
                          <a href="category-off-canvas.html">
                            Off Canvas Filter
                          </a>
                        </li>
                        <li>
                          <a href="category-horizontal-filter1.html">
                            Horizontal Filter1
                          </a>
                        </li>
                        <li>
                          <a href="category-horizontal-filter2.html">
                            Horizontal Filter2
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div className="col-lg-4">
                      <a
                        href="category-infinite-scroll.html#"
                        className="nolink"
                      >
                        VARIATION 2
                      </a>
                      <ul className="submenu">
                        <li>
                          <a href="category-list.html">List Types</a>
                        </li>
                        <li>
                          <a href="category-infinite-scroll.html">
                            Ajax Infinite Scroll
                          </a>
                        </li>
                        <li>
                          <a href="category.html">3 Columns Products</a>
                        </li>
                        <li>
                          <a href="category-4col.html">4 Columns Products</a>
                        </li>
                        <li>
                          <a href="category-5col.html">5 Columns Products</a>
                        </li>
                        <li>
                          <a href="category-6col.html">6 Columns Products</a>
                        </li>
                        <li>
                          <a href="category-7col.html">7 Columns Products</a>
                        </li>
                        <li>
                          <a href="category-8col.html">8 Columns Products</a>
                        </li>
                      </ul>
                    </div>
                    <div className="col-lg-4 p-0">
                      <div className="menu-banner">
                        <figure>
                          <img
                            src="src/assets/images/menu-banner.jpg"
                            width={192}
                            height={313}
                            alt="Menu banner"
                          />
                        </figure>
                        <div className="banner-content">
                          <h4>
                            <span className="">UP TO</span>
                            <br />
                            <b className="">50%</b>
                            <i>OFF</i>
                          </h4>
                          <a
                            href="category.html"
                            className="btn btn-sm btn-dark"
                          >
                            SHOP NOW
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* End .megamenu */}
              </li>
              <li>
                <a href="product.html">Products</a>
                <div className="megamenu megamenu-fixed-width">
                  <div className="row">
                    <div className="col-lg-4">
                      <a
                        href="category-infinite-scroll.html#"
                        className="nolink"
                      >
                        PRODUCT PAGES
                      </a>
                      <ul className="submenu">
                        <li>
                          <a href="product.html">SIMPLE PRODUCT</a>
                        </li>
                        <li>
                          <a href="product-variable.html">VARIABLE PRODUCT</a>
                        </li>
                        <li>
                          <a href="product.html">SALE PRODUCT</a>
                        </li>
                        <li>
                          <a href="product.html">FEATURED &amp; ON SALE</a>
                        </li>
                        <li>
                          <a href="product-custom-tab.html">WITH CUSTOM TAB</a>
                        </li>
                        <li>
                          <a href="product-sidebar-left.html">
                            WITH LEFT SIDEBAR
                          </a>
                        </li>
                        <li>
                          <a href="product-sidebar-right.html">
                            WITH RIGHT SIDEBAR
                          </a>
                        </li>
                        <li>
                          <a href="product-addcart-sticky.html">
                            ADD CART STICKY
                          </a>
                        </li>
                      </ul>
                    </div>
                    {/* End .col-lg-4 */}
                    <div className="col-lg-4">
                      <a
                        href="category-infinite-scroll.html#"
                        className="nolink"
                      >
                        PRODUCT LAYOUTS
                      </a>
                      <ul className="submenu">
                        <li>
                          <a href="product-extended-layout.html">
                            EXTENDED LAYOUT
                          </a>
                        </li>
                        <li>
                          <a href="product-grid-layout.html">GRID IMAGE</a>
                        </li>
                        <li>
                          <a href="product-full-width.html">
                            FULL WIDTH LAYOUT
                          </a>
                        </li>
                        <li>
                          <a href="product-sticky-info.html">STICKY INFO</a>
                        </li>
                        <li>
                          <a href="product-sticky-both.html">
                            LEFT &amp; RIGHT STICKY
                          </a>
                        </li>
                        <li>
                          <a href="product-transparent-image.html">
                            TRANSPARENT IMAGE
                          </a>
                        </li>
                        <li>
                          <a href="product-center-vertical.html">
                            CENTER VERTICAL
                          </a>
                        </li>
                        <li>
                          <a href="category-infinite-scroll.html#">
                            BUILD YOUR OWN
                          </a>
                        </li>
                      </ul>
                    </div>
                    {/* End .col-lg-4 */}
                    <div className="col-lg-4 p-0">
                      <div className="menu-banner menu-banner-2">
                        <figure>
                          <img
                            src="src/assets/images/menu-banner-1.jpg"
                            width={182}
                            height={317}
                            alt="Menu banner"
                            className="product-promo"
                          />
                        </figure>
                        <i>OFF</i>
                        <div className="banner-content">
                          <h4>
                            <span className="">UP TO</span>
                            <br />
                            <b className="">50%</b>
                          </h4>
                        </div>
                        <a href="category.html" className="btn btn-sm btn-dark">
                          SHOP NOW
                        </a>
                      </div>
                    </div>
                    {/* End .col-lg-4 */}
                  </div>
                  {/* End .row */}
                </div>
                {/* End .megamenu */}
              </li>
              <li>
                <a href="category-infinite-scroll.html#">Pages</a>
                <ul>
                  <li>
                    <a href="wishlist.html">Wishlist</a>
                  </li>
                  <li>
                    <a href="cart.html">Shopping Cart</a>
                  </li>
                  <li>
                    <a href="checkout.html">Checkout</a>
                  </li>
                  <li>
                    <a href="dashboard.html">Dashboard</a>
                  </li>
                  <li>
                    <a href="about.html">About Us</a>
                  </li>
                  <li>
                    <a href="category-infinite-scroll.html#">Blog</a>
                    <ul>
                      <li>
                        <a href="blog.html">Blog</a>
                      </li>
                      <li>
                        <a href="single.html">Blog Post</a>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <a href="contact.html">Contact Us</a>
                  </li>
                  <li>
                    <a href="login.html">Login</a>
                  </li>
                  <li>
                    <a href="forgot-password.html">Forgot Password</a>
                  </li>
                </ul>
              </li>
              <li>
                <a href="blog.html">Blog</a>
              </li>
              <li>
                <a href="category-infinite-scroll.html#">Elements</a>
                <ul className="custom-scrollbar">
                  <li>
                    <a href="element-accordions.html">Accordion</a>
                  </li>
                  <li>
                    <a href="element-alerts.html">Alerts</a>
                  </li>
                  <li>
                    <a href="element-animations.html">Animations</a>
                  </li>
                  <li>
                    <a href="element-banners.html">Banners</a>
                  </li>
                  <li>
                    <a href="element-buttons.html">Buttons</a>
                  </li>
                  <li>
                    <a href="element-call-to-action.html">Call to Action</a>
                  </li>
                  <li>
                    <a href="element-countdown.html">Count Down</a>
                  </li>
                  <li>
                    <a href="element-counters.html">Counters</a>
                  </li>
                  <li>
                    <a href="element-headings.html">Headings</a>
                  </li>
                  <li>
                    <a href="element-icons.html">Icons</a>
                  </li>
                  <li>
                    <a href="element-info-box.html">Info box</a>
                  </li>
                  <li>
                    <a href="element-posts.html">Posts</a>
                  </li>
                  <li>
                    <a href="element-products.html">Products</a>
                  </li>
                  <li>
                    <a href="element-product-categories.html">
                      Product Categories
                    </a>
                  </li>
                  <li>
                    <a href="element-tabs.html">Tabs</a>
                  </li>
                  <li>
                    <a href="element-testimonial.html">Testimonials</a>
                  </li>
                </ul>
              </li>
              <li>
                <a href="contact.html">Contact Us</a>
              </li>
              <li className="float-right">
                <a
                  href="https://1.envato.market/DdLk5"
                  className="pl-5"
                  target="_blank"
                >
                  Buy Porto!
                </a>
              </li>
              <li className="float-right">
                <a href="category-infinite-scroll.html#" className="pl-5">
                  Special Offer!
                </a>
              </li>
            </ul>
          </nav>
        </div>
        {/* End .container */}
      </div>
      {/* End .header-bottom */}
    </header>
    {/* End .header */}
    <main className="main">
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
                    <select name="orderby" className="form-control">
                      <option value="menu_order" selected="selected">
                        Default sorting
                      </option>
                      <option value="popularity">Sort by popularity</option>
                      <option value="rating">Sort by average rating</option>
                      <option value="date">Sort by newness</option>
                      <option value="price">Sort by price: low to high</option>
                      <option value="price-desc">
                        Sort by price: high to low
                      </option>
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
                    <select name="count" className="form-control">
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
            <div className="row product-ajax-grid scroll-load">
              <div className="col-6 col-sm-4">
                <div className="product-default">
                  <figure>
                    <a href="product.html">
                      <img
                        src="src/assets/images/products/product-1.jpg"
                        width={280}
                        height={280}
                        alt="product"
                      />
                      <img
                        src="src/assets/images/products/product-1-2.jpg"
                        width={280}
                        height={280}
                        alt="product"
                      />
                    </a>
                    <div className="label-group">
                      <div className="product-label label-hot">HOT</div>
                      <div className="product-label label-sale">-20%</div>
                    </div>
                  </figure>
                  <div className="product-details">
                    <div className="category-wrap">
                      <div className="category-list">
                        <a href="category.html" className="product-category">
                          category
                        </a>
                      </div>
                    </div>
                    <h3 className="product-title">
                      {" "}
                      <a href="product.html">
                        Ultimate 3D Bluetooth Speaker
                      </a>{" "}
                    </h3>
                    <div className="ratings-container">
                      <div className="product-ratings">
                        <span className="ratings" style={{ width: "100%" }} />
                        {/* End .ratings */}
                        <span className="tooltiptext tooltip-top" />
                      </div>
                      {/* End .product-ratings */}
                    </div>
                    {/* End .product-container */}
                    <div className="price-box">
                      <span className="old-price">$90.00</span>
                      <span className="product-price">$70.00</span>
                    </div>
                    {/* End .price-box */}
                    <div className="product-action">
                      <a
                        href="wishlist.html"
                        className="btn-icon-wish"
                        title="wishlist"
                      >
                        <i className="icon-heart" />
                      </a>
                      <a href="product.html" className="btn-icon btn-add-cart">
                        <i className="fa fa-arrow-right" />
                        <span>SELECT OPTIONS</span>
                      </a>
                      <a
                        href="ajax/product-quick-view.html"
                        className="btn-quickview"
                        title="Quick View"
                      >
                        <i className="fas fa-external-link-alt" />
                      </a>
                    </div>
                  </div>
                  {/* End .product-details */}
                </div>
              </div>
              {/* End .col-sm-4 */}
              <div className="col-6 col-sm-4">
                <div className="product-default">
                  <figure>
                    <a href="product.html">
                      <img
                        src="src/assets/images/products/product-2.jpg"
                        width={280}
                        height={280}
                        alt="product"
                      />
                      <img
                        src="src/assets/images/products/product-2-2.jpg"
                        width={280}
                        height={280}
                        alt="product"
                      />
                    </a>
                  </figure>
                  <div className="product-details">
                    <div className="category-wrap">
                      <div className="category-list">
                        <a href="category.html" className="product-category">
                          category
                        </a>
                      </div>
                    </div>
                    <h3 className="product-title">
                      {" "}
                      <a href="product.html">Brown Women Casual HandBag</a>
                    </h3>
                    <div className="ratings-container">
                      <div className="product-ratings">
                        <span className="ratings" style={{ width: "100%" }} />
                        {/* End .ratings */}
                        <span className="tooltiptext tooltip-top" />
                      </div>
                      {/* End .product-ratings */}
                    </div>
                    {/* End .product-container */}
                    <div className="price-box">
                      <span className="product-price">$33.00</span>
                    </div>
                    {/* End .price-box */}
                    <div className="product-action">
                      <a
                        href="wishlist.html"
                        className="btn-icon-wish"
                        title="wishlist"
                      >
                        <i className="icon-heart" />
                      </a>
                      <a href="product.html" className="btn-icon btn-add-cart">
                        <i className="fa fa-arrow-right" />
                        <span>SELECT OPTIONS</span>
                      </a>
                      <a
                        href="ajax/product-quick-view.html"
                        className="btn-quickview"
                        title="Quick View"
                      >
                        <i className="fas fa-external-link-alt" />
                      </a>
                    </div>
                  </div>
                  {/* End .product-details */}
                </div>
              </div>
              {/* End .col-sm-4 */}
              <div className="col-6 col-sm-4">
                <div className="product-default">
                  <figure>
                    <a href="product.html">
                      <img
                        src="src/assets/images/products/product-3.jpg"
                        width={280}
                        height={280}
                        alt="product"
                      />
                      <img
                        src="src/assets/images/products/product-3-2.jpg"
                        width={280}
                        height={280}
                        alt="product"
                      />
                    </a>
                    <div className="label-group">
                      <div className="product-label label-sale">-20%</div>
                    </div>
                  </figure>
                  <div className="product-details">
                    <div className="category-wrap">
                      <div className="category-list">
                        <a href="category.html" className="product-category">
                          category
                        </a>
                      </div>
                    </div>
                    <h3 className="product-title">
                      {" "}
                      <a href="product.html">
                        Circled Ultimate 3D Speaker
                      </a>{" "}
                    </h3>
                    <div className="ratings-container">
                      <div className="product-ratings">
                        <span className="ratings" style={{ width: "100%" }} />
                        {/* End .ratings */}
                        <span className="tooltiptext tooltip-top" />
                      </div>
                      {/* End .product-ratings */}
                    </div>
                    {/* End .product-container */}
                    <div className="price-box">
                      <span className="old-price">$90.00</span>
                      <span className="product-price">$70.00</span>
                    </div>
                    {/* End .price-box */}
                    <div className="product-action">
                      <a
                        href="wishlist.html"
                        className="btn-icon-wish"
                        title="wishlist"
                      >
                        <i className="icon-heart" />
                      </a>
                      <a
                        href="category-infinite-scroll.html#"
                        className="btn-icon btn-add-cart product-type-simple"
                      >
                        <i className="icon-shopping-cart" />
                        ADD TO CART
                      </a>
                      <a
                        href="ajax/product-quick-view.html"
                        className="btn-quickview"
                        title="Quick View"
                      >
                        <i className="fas fa-external-link-alt" />
                      </a>
                    </div>
                  </div>
                  {/* End .product-details */}
                </div>
              </div>
              {/* End .col-sm-4 */}
              <div className="col-6 col-sm-4">
                <div className="product-default">
                  <figure>
                    <a href="product.html">
                      <img
                        src="src/assets/images/products/product-4.jpg"
                        width={280}
                        height={280}
                        alt="product"
                      />
                      <img
                        src="src/assets/images/products/product-4-2.jpg"
                        width={280}
                        height={280}
                        alt="product"
                      />
                    </a>
                    <div className="label-group">
                      <div className="product-label label-sale">-30%</div>
                    </div>
                  </figure>
                  <div className="product-details">
                    <div className="category-wrap">
                      <div className="category-list">
                        <a href="category.html" className="product-category">
                          category
                        </a>
                      </div>
                    </div>
                    <h3 className="product-title">
                      {" "}
                      <a href="product.html">
                        Blue Backpack for the Young - S
                      </a>{" "}
                    </h3>
                    <div className="ratings-container">
                      <div className="product-ratings">
                        <span className="ratings" style={{ width: "100%" }} />
                        {/* End .ratings */}
                        <span className="tooltiptext tooltip-top" />
                      </div>
                      {/* End .product-ratings */}
                    </div>
                    {/* End .product-container */}
                    <div className="price-box">
                      <span className="old-price">$90.00</span>
                      <span className="product-price">$70.00</span>
                    </div>
                    {/* End .price-box */}
                    <div className="product-action">
                      <a
                        href="wishlist.html"
                        className="btn-icon-wish"
                        title="wishlist"
                      >
                        <i className="icon-heart" />
                      </a>
                      <a href="product.html" className="btn-icon btn-add-cart">
                        <i className="fa fa-arrow-right" />
                        <span>SELECT OPTIONS</span>
                      </a>
                      <a
                        href="ajax/product-quick-view.html"
                        className="btn-quickview"
                        title="Quick View"
                      >
                        <i className="fas fa-external-link-alt" />
                      </a>
                    </div>
                  </div>
                  {/* End .product-details */}
                </div>
              </div>
              {/* End .col-sm-4 */}
              <div className="col-6 col-sm-4">
                <div className="product-default">
                  <figure>
                    <a href="product.html">
                      <img
                        src="src/assets/images/products/product-5.jpg"
                        width={280}
                        height={280}
                        alt="product"
                      />
                      <img
                        src="src/assets/images/products/product-5-2.jpg"
                        width={280}
                        height={280}
                        alt="product"
                      />
                    </a>
                    <div className="label-group">
                      <div className="product-label label-hot">HOT</div>
                    </div>
                  </figure>
                  <div className="product-details">
                    <div className="category-wrap">
                      <div className="category-list">
                        <a href="category.html" className="product-category">
                          category
                        </a>
                      </div>
                    </div>
                    <h3 className="product-title">
                      {" "}
                      <a href="product.html">Casual Spring Blue Shoes</a>
                    </h3>
                    <div className="ratings-container">
                      <div className="product-ratings">
                        <span className="ratings" style={{ width: "100%" }} />
                        {/* End .ratings */}
                        <span className="tooltiptext tooltip-top" />
                      </div>
                      {/* End .product-ratings */}
                    </div>
                    {/* End .product-container */}
                    <div className="price-box">
                      <span className="old-price">$90.00</span>
                      <span className="product-price">$70.00</span>
                    </div>
                    {/* End .price-box */}
                    <div className="product-action">
                      <a
                        href="wishlist.html"
                        className="btn-icon-wish"
                        title="wishlist"
                      >
                        <i className="icon-heart" />
                      </a>
                      <a
                        href="category-infinite-scroll.html#"
                        className="btn-icon btn-add-cart product-type-simple"
                      >
                        <i className="icon-shopping-cart" />
                        ADD TO CART
                      </a>
                      <a
                        href="ajax/product-quick-view.html"
                        className="btn-quickview"
                        title="Quick View"
                      >
                        <i className="fas fa-external-link-alt" />
                      </a>
                    </div>
                  </div>
                  {/* End .product-details */}
                </div>
              </div>
              {/* End .col-sm-4 */}
              <div className="col-6 col-sm-4">
                <div className="product-default">
                  <figure>
                    <a href="product.html">
                      <img
                        src="src/assets/images/products/product-6.jpg"
                        width={280}
                        height={280}
                        alt="product"
                      />
                      <img
                        src="src/assets/images/products/product-6-2.jpg"
                        width={280}
                        height={280}
                        alt="product"
                      />
                    </a>
                    <div className="label-group">
                      <div className="product-label label-sale">-8%</div>
                    </div>
                  </figure>
                  <div className="product-details">
                    <div className="category-wrap">
                      <div className="category-list">
                        <a href="category.html" className="product-category">
                          category
                        </a>
                      </div>
                    </div>
                    <h3 className="product-title">
                      {" "}
                      <a href="product.html">Men Black Gentle Belt</a>
                    </h3>
                    <div className="ratings-container">
                      <div className="product-ratings">
                        <span className="ratings" style={{ width: "100%" }} />
                        {/* End .ratings */}
                        <span className="tooltiptext tooltip-top" />
                      </div>
                      {/* End .product-ratings */}
                    </div>
                    {/* End .product-container */}
                    <div className="price-box">
                      <span className="old-price">$90.00</span>
                      <span className="product-price">$70.00</span>
                    </div>
                    {/* End .price-box */}
                    <div className="product-action">
                      <a
                        href="wishlist.html"
                        className="btn-icon-wish"
                        title="wishlist"
                      >
                        <i className="icon-heart" />
                      </a>
                      <a
                        href="category-infinite-scroll.html#"
                        className="btn-icon btn-add-cart product-type-simple"
                      >
                        <i className="icon-shopping-cart" />
                        ADD TO CART
                      </a>
                      <a
                        href="ajax/product-quick-view.html"
                        className="btn-quickview"
                        title="Quick View"
                      >
                        <i className="fas fa-external-link-alt" />
                      </a>
                    </div>
                  </div>
                  {/* End .product-details */}
                </div>
              </div>
              {/* End .col-sm-4 */}
              <div className="col-6 col-sm-4">
                <div className="product-default">
                  <figure>
                    <a href="product.html">
                      <img
                        src="src/assets/images/products/product-7.jpg"
                        width={280}
                        height={280}
                        alt="product"
                      />
                      <img
                        src="src/assets/images/products/product-7-2.jpg"
                        width={280}
                        height={280}
                        alt="product"
                      />
                    </a>
                    <div className="label-group">
                      <div className="product-label label-sale">-8%</div>
                    </div>
                  </figure>
                  <div className="product-details">
                    <div className="category-wrap">
                      <div className="category-list">
                        <a href="category.html" className="product-category">
                          category
                        </a>
                      </div>
                    </div>
                    <h3 className="product-title">
                      {" "}
                      <a href="product.html">
                        Brown-Black Men Casual Glasses
                      </a>{" "}
                    </h3>
                    <div className="ratings-container">
                      <div className="product-ratings">
                        <span className="ratings" style={{ width: "100%" }} />
                        {/* End .ratings */}
                        <span className="tooltiptext tooltip-top" />
                      </div>
                      {/* End .product-ratings */}
                    </div>
                    {/* End .product-container */}
                    <div className="price-box">
                      <span className="old-price">$90.00</span>
                      <span className="product-price">$70.00</span>
                    </div>
                    {/* End .price-box */}
                    <div className="product-action">
                      <a
                        href="wishlist.html"
                        className="btn-icon-wish"
                        title="wishlist"
                      >
                        <i className="icon-heart" />
                      </a>
                      <a
                        href="category-infinite-scroll.html#"
                        className="btn-icon btn-add-cart product-type-simple"
                      >
                        <i className="icon-shopping-cart" />
                        ADD TO CART
                      </a>
                      <a
                        href="ajax/product-quick-view.html"
                        className="btn-quickview"
                        title="Quick View"
                      >
                        <i className="fas fa-external-link-alt" />
                      </a>
                    </div>
                  </div>
                  {/* End .product-details */}
                </div>
              </div>
              {/* End .col-sm-4 */}
              <div className="col-6 col-sm-4">
                <div className="product-default">
                  <figure>
                    <a href="product.html">
                      <img
                        src="src/assets/images/products/product-8.jpg"
                        width={280}
                        height={280}
                        alt="product"
                      />
                      <img
                        src="src/assets/images/products/product-8-2.jpg"
                        width={280}
                        height={280}
                        alt="product"
                      />
                    </a>
                    <div className="label-group">
                      <div className="product-label label-sale">-40%</div>
                    </div>
                  </figure>
                  <div className="product-details">
                    <div className="category-wrap">
                      <div className="category-list">
                        <a href="category.html" className="product-category">
                          category
                        </a>
                      </div>
                    </div>
                    <h3 className="product-title">
                      {" "}
                      <a href="product.html">
                        Brown-Black Men Casual Glasses
                      </a>{" "}
                    </h3>
                    <div className="ratings-container">
                      <div className="product-ratings">
                        <span className="ratings" style={{ width: "100%" }} />
                        {/* End .ratings */}
                        <span className="tooltiptext tooltip-top" />
                      </div>
                      {/* End .product-ratings */}
                    </div>
                    {/* End .product-container */}
                    <div className="price-box">
                      <span className="old-price">$90.00</span>
                      <span className="product-price">$70.00</span>
                    </div>
                    {/* End .price-box */}
                    <div className="product-action">
                      <a
                        href="wishlist.html"
                        className="btn-icon-wish"
                        title="wishlist"
                      >
                        <i className="icon-heart" />
                      </a>
                      <a
                        href="category-infinite-scroll.html#"
                        className="btn-icon btn-add-cart product-type-simple"
                      >
                        <i className="icon-shopping-cart" />
                        ADD TO CART
                      </a>
                      <a
                        href="ajax/product-quick-view.html"
                        className="btn-quickview"
                        title="Quick View"
                      >
                        <i className="fas fa-external-link-alt" />
                      </a>
                    </div>
                  </div>
                  {/* End .product-details */}
                </div>
              </div>
              {/* End .col-sm-4 */}
              <div className="col-6 col-sm-4">
                <div className="product-default">
                  <figure>
                    <a href="product.html">
                      <img
                        src="src/assets/images/products/product-9.jpg"
                        width={280}
                        height={280}
                        alt="product"
                      />
                      <img
                        src="src/assets/images/products/product-9-2.jpg"
                        width={280}
                        height={280}
                        alt="product"
                      />
                    </a>
                  </figure>
                  <div className="product-details">
                    <div className="category-wrap">
                      <div className="category-list">
                        <a href="category.html" className="product-category">
                          category
                        </a>
                      </div>
                    </div>
                    <h3 className="product-title">
                      {" "}
                      <a href="product.html">Black Men Casual Glasses</a>
                    </h3>
                    <div className="ratings-container">
                      <div className="product-ratings">
                        <span className="ratings" style={{ width: "100%" }} />
                        {/* End .ratings */}
                        <span className="tooltiptext tooltip-top" />
                      </div>
                      {/* End .product-ratings */}
                    </div>
                    {/* End .product-container */}
                    <div className="price-box">
                      <span className="old-price">$90.00</span>
                      <span className="product-price">$70.00</span>
                    </div>
                    {/* End .price-box */}
                    <div className="product-action">
                      <a
                        href="wishlist.html"
                        className="btn-icon-wish"
                        title="wishlist"
                      >
                        <i className="icon-heart" />
                      </a>
                      <a href="product.html" className="btn-icon btn-add-cart">
                        <i className="fa fa-arrow-right" />
                        <span>SELECT OPTIONS</span>
                      </a>
                      <a
                        href="ajax/product-quick-view.html"
                        className="btn-quickview"
                        title="Quick View"
                      >
                        <i className="fas fa-external-link-alt" />
                      </a>
                    </div>
                  </div>
                  {/* End .product-details */}
                </div>
              </div>
              {/* End .col-sm-4 */}
              <div className="col-6 col-sm-4">
                <div className="product-default">
                  <figure>
                    <a href="product.html">
                      <img
                        src="src/assets/images/products/product-10.jpg"
                        width={280}
                        height={280}
                        alt="product"
                      />
                      <img
                        src="src/assets/images/products/product-10-2.jpg"
                        width={280}
                        height={280}
                        alt="product"
                      />
                    </a>
                    <div className="label-group">
                      <div className="product-label label-sale">-30%</div>
                    </div>
                  </figure>
                  <div className="product-details">
                    <div className="category-wrap">
                      <div className="category-list">
                        <a href="category.html" className="product-category">
                          category
                        </a>
                      </div>
                    </div>
                    <h3 className="product-title">
                      {" "}
                      <a href="product.html">
                        Basketball Sports Blue Shoes
                      </a>{" "}
                    </h3>
                    <div className="ratings-container">
                      <div className="product-ratings">
                        <span className="ratings" style={{ width: "100%" }} />
                        {/* End .ratings */}
                        <span className="tooltiptext tooltip-top" />
                      </div>
                      {/* End .product-ratings */}
                    </div>
                    {/* End .product-container */}
                    <div className="price-box">
                      <span className="old-price">$90.00</span>
                      <span className="product-price">$70.00</span>
                    </div>
                    {/* End .price-box */}
                    <div className="product-action">
                      <a
                        href="wishlist.html"
                        className="btn-icon-wish"
                        title="wishlist"
                      >
                        <i className="icon-heart" />
                      </a>
                      <a
                        href="category-infinite-scroll.html#"
                        className="btn-icon btn-add-cart product-type-simple"
                      >
                        <i className="icon-shopping-cart" />
                        ADD TO CART
                      </a>
                      <a
                        href="ajax/product-quick-view.html"
                        className="btn-quickview"
                        title="Quick View"
                      >
                        <i className="fas fa-external-link-alt" />
                      </a>
                    </div>
                  </div>
                  {/* End .product-details */}
                </div>
              </div>
              {/* End .col-sm-4 */}
              <div className="col-6 col-sm-4">
                <div className="product-default">
                  <figure>
                    <a href="product.html">
                      <img
                        src="src/assets/images/products/product-11.jpg"
                        width={280}
                        height={280}
                        alt="product"
                      />
                      <img
                        src="src/assets/images/products/product-11-2.jpg"
                        width={280}
                        height={280}
                        alt="product"
                      />
                    </a>
                  </figure>
                  <div className="product-details">
                    <div className="category-wrap">
                      <div className="category-list">
                        <a href="category.html" className="product-category">
                          category
                        </a>
                      </div>
                    </div>
                    <h3 className="product-title">
                      {" "}
                      <a href="product.html">Men Sports Travel Bag</a>
                    </h3>
                    <div className="ratings-container">
                      <div className="product-ratings">
                        <span className="ratings" style={{ width: "100%" }} />
                        {/* End .ratings */}
                        <span className="tooltiptext tooltip-top" />
                      </div>
                      {/* End .product-ratings */}
                    </div>
                    {/* End .product-container */}
                    <div className="price-box">
                      <span className="old-price">$90.00</span>
                      <span className="product-price">$70.00</span>
                    </div>
                    {/* End .price-box */}
                    <div className="product-action">
                      <a
                        href="wishlist.html"
                        className="btn-icon-wish"
                        title="wishlist"
                      >
                        <i className="icon-heart" />
                      </a>
                      <a
                        href="category-infinite-scroll.html#"
                        className="btn-icon btn-add-cart product-type-simple"
                      >
                        <i className="icon-shopping-cart" />
                        ADD TO CART
                      </a>
                      <a
                        href="ajax/product-quick-view.html"
                        className="btn-quickview"
                        title="Quick View"
                      >
                        <i className="fas fa-external-link-alt" />
                      </a>
                    </div>
                  </div>
                  {/* End .product-details */}
                </div>
              </div>
              {/* End .col-sm-4 */}
              <div className="col-6 col-sm-4">
                <div className="product-default">
                  <figure>
                    <a href="product.html">
                      <img
                        src="src/assets/images/products/product-12.jpg"
                        width={280}
                        height={280}
                        alt="product"
                      />
                      <img
                        src="src/assets/images/products/product-12-2.jpg"
                        width={280}
                        height={280}
                        alt="product"
                      />
                    </a>
                    <div className="label-group">
                      <div className="product-label label-hot">HOT</div>
                    </div>
                  </figure>
                  <div className="product-details">
                    <div className="category-wrap">
                      <div className="category-list">
                        <a href="category.html" className="product-category">
                          category
                        </a>
                      </div>
                    </div>
                    <h3 className="product-title">
                      {" "}
                      <a href="product.html">Brown HandBag</a>{" "}
                    </h3>
                    <div className="ratings-container">
                      <div className="product-ratings">
                        <span className="ratings" style={{ width: "100%" }} />
                        {/* End .ratings */}
                        <span className="tooltiptext tooltip-top" />
                      </div>
                      {/* End .product-ratings */}
                    </div>
                    {/* End .product-container */}
                    <div className="price-box">
                      <span className="old-price">$90.00</span>
                      <span className="product-price">$70.00</span>
                    </div>
                    {/* End .price-box */}
                    <div className="product-action">
                      <a
                        href="wishlist.html"
                        className="btn-icon-wish"
                        title="wishlist"
                      >
                        <i className="icon-heart" />
                      </a>
                      <a
                        href="category-infinite-scroll.html#"
                        className="btn-icon btn-add-cart product-type-simple"
                      >
                        <i className="icon-shopping-cart" />
                        ADD TO CART
                      </a>
                      <a
                        href="ajax/product-quick-view.html"
                        className="btn-quickview"
                        title="Quick View"
                      >
                        <i className="fas fa-external-link-alt" />
                      </a>
                    </div>
                  </div>
                  {/* End .product-details */}
                </div>
              </div>
              {/* End .col-sm-4 */}
            </div>
            {/* End .row */}
          </div>
          {/* End .col-lg-9 */}
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
    </main>
    {/* End .main */}
    <footer className="footer bg-dark">
      <div className="footer-middle">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-sm-6">
              <div className="widget">
                <h4 className="widget-title">Contact Info</h4>
                <ul className="contact-info">
                  <li>
                    <span className="contact-info-label">Address:</span>123
                    Street Name, City, England
                  </li>
                  <li>
                    <span className="contact-info-label">Phone:</span>
                    <a href="tel:">(123) 456-7890</a>
                  </li>
                  <li>
                    <span className="contact-info-label">Email:</span>{" "}
                    <a href="../../cdn-cgi/l/email-protection.html#4e232f27220e2b362f233e222b602d2123">
                      <span
                        className="__cf_email__"
                        data-cfemail="4429252d2804213c25293428216a272b29"
                      >
                        [email&nbsp;protected]
                      </span>
                    </a>
                  </li>
                  <li>
                    <span className="contact-info-label">
                      Working Days/Hours:
                    </span>{" "}
                    Mon - Sun / 9:00 AM - 8:00 PM
                  </li>
                </ul>
                <div className="social-icons">
                  <a
                    href="category-infinite-scroll.html#"
                    className="social-icon social-facebook icon-facebook"
                    target="_blank"
                    title="Facebook"
                  />
                  <a
                    href="category-infinite-scroll.html#"
                    className="social-icon social-twitter icon-twitter"
                    target="_blank"
                    title="Twitter"
                  />
                  <a
                    href="category-infinite-scroll.html#"
                    className="social-icon social-instagram icon-instagram"
                    target="_blank"
                    title="Instagram"
                  />
                </div>
                {/* End .social-icons */}
              </div>
              {/* End .widget */}
            </div>
            {/* End .col-lg-3 */}
            <div className="col-lg-3 col-sm-6">
              <div className="widget">
                <h4 className="widget-title">Customer Service</h4>
                <ul className="links">
                  <li>
                    <a href="category-infinite-scroll.html#">Help &amp; FAQs</a>
                  </li>
                  <li>
                    <a href="category-infinite-scroll.html#">Order Tracking</a>
                  </li>
                  <li>
                    <a href="category-infinite-scroll.html#">
                      Shipping &amp; Delivery
                    </a>
                  </li>
                  <li>
                    <a href="category-infinite-scroll.html#">Orders History</a>
                  </li>
                  <li>
                    <a href="category-infinite-scroll.html#">Advanced Search</a>
                  </li>
                  <li>
                    <a href="dashboard.html">My Account</a>
                  </li>
                  <li>
                    <a href="category-infinite-scroll.html#">Careers</a>
                  </li>
                  <li>
                    <a href="about.html">About Us</a>
                  </li>
                  <li>
                    <a href="category-infinite-scroll.html#">Corporate Sales</a>
                  </li>
                  <li>
                    <a href="category-infinite-scroll.html#">Privacy</a>
                  </li>
                </ul>
              </div>
              {/* End .widget */}
            </div>
            {/* End .col-lg-3 */}
            <div className="col-lg-3 col-sm-6">
              <div className="widget">
                <h4 className="widget-title">Popular Tags</h4>
                <div className="tagcloud">
                  <a href="category-infinite-scroll.html#">Bag</a>
                  <a href="category-infinite-scroll.html#">Black</a>
                  <a href="category-infinite-scroll.html#">Blue</a>
                  <a href="category-infinite-scroll.html#">Clothes</a>
                  <a href="category-infinite-scroll.html#">Fashion</a>
                  <a href="category-infinite-scroll.html#">Hub</a>
                  <a href="category-infinite-scroll.html#">Shirt</a>
                  <a href="category-infinite-scroll.html#">Shoes</a>
                  <a href="category-infinite-scroll.html#">Skirt</a>
                  <a href="category-infinite-scroll.html#">Sports</a>
                  <a href="category-infinite-scroll.html#">Sweater</a>
                </div>
              </div>
              {/* End .widget */}
            </div>
            {/* End .col-lg-3 */}
            <div className="col-lg-3 col-sm-6">
              <div className="widget widget-newsletter">
                <h4 className="widget-title">Subscribe newsletter</h4>
                <p>
                  Get all the latest information on events, sales and offers.
                  Sign up for newsletter:
                </p>
                <form action="category-infinite-scroll.html#" className="mb-0">
                  <input
                    type="email"
                    className="form-control m-b-3"
                    placeholder="Email address"
                    required=""
                  />
                  <input
                    type="submit"
                    className="btn btn-primary shadow-none"
                    defaultValue="Subscribe"
                  />
                </form>
              </div>
              {/* End .widget */}
            </div>
            {/* End .col-lg-3 */}
          </div>
          {/* End .row */}
        </div>
        {/* End .container */}
      </div>
      {/* End .footer-middle */}
      <div className="container">
        <div className="footer-bottom">
          <div className="container d-sm-flex align-items-center">
            <div className="footer-left">
              <span className="footer-copyright">
                © Porto eCommerce. 2021. All Rights Reserved
              </span>
            </div>
            <div className="footer-right ml-auto mt-1 mt-sm-0">
              <div className="payment-icons">
                <span
                  className="payment-icon visa"
                  style={{
                    backgroundImage:
                      "url(assets/images/payments/payment-visa.svg)"
                  }}
                />
                <span
                  className="payment-icon paypal"
                  style={{
                    backgroundImage:
                      "url(assets/images/payments/payment-paypal.svg)"
                  }}
                />
                <span
                  className="payment-icon stripe"
                  style={{
                    backgroundImage:
                      "url(assets/images/payments/payment-stripe.png)"
                  }}
                />
                <span
                  className="payment-icon verisign"
                  style={{
                    backgroundImage:
                      "url(assets/images/payments/payment-verisign.svg)"
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        {/* End .footer-bottom */}
      </div>
      {/* End .container */}
    </footer>
    {/* End .footer */}
  </div>
  {/* End .page-wrapper */}
  <div className="loading-overlay">
    <div className="bounce-loader">
      <div className="bounce1" />
      <div className="bounce2" />
      <div className="bounce3" />
    </div>
  </div>
  <div className="mobile-menu-overlay" />
  {/* End .mobil-menu-overlay */}
  <div className="mobile-menu-container">
    <div className="mobile-menu-wrapper">
      <span className="mobile-menu-close">
        <i className="fa fa-times" />
      </span>
      <nav className="mobile-nav">
        <ul className="mobile-menu">
          <li>
            <a href="demo4.html">Home</a>
          </li>
          <li>
            <a href="category.html">Categories</a>
            <ul>
              <li>
                <a href="category.html">Full Width Banner</a>
              </li>
              <li>
                <a href="category-banner-boxed-slider.html">
                  Boxed Slider Banner
                </a>
              </li>
              <li>
                <a href="category-banner-boxed-image.html">
                  Boxed Image Banner
                </a>
              </li>
              <li>
                <a href="https://portotheme.com/html/porto_ecommerce/category-sidebar-left.html">
                  Left Sidebar
                </a>
              </li>
              <li>
                <a href="category-sidebar-right.html">Right Sidebar</a>
              </li>
              <li>
                <a href="category-off-canvas.html">Off Canvas Filter</a>
              </li>
              <li>
                <a href="category-horizontal-filter1.html">
                  Horizontal Filter 1
                </a>
              </li>
              <li>
                <a href="category-horizontal-filter2.html">
                  Horizontal Filter 2
                </a>
              </li>
              <li>
                <a href="category-infinite-scroll.html#">List Types</a>
              </li>
              <li>
                <a href="category-infinite-scroll.html">
                  Ajax Infinite Scroll<span className="tip tip-new">New</span>
                </a>
              </li>
              <li>
                <a href="category.html">3 Columns Products</a>
              </li>
              <li>
                <a href="category-4col.html">4 Columns Products</a>
              </li>
              <li>
                <a href="category-5col.html">5 Columns Products</a>
              </li>
              <li>
                <a href="category-6col.html">6 Columns Products</a>
              </li>
              <li>
                <a href="category-7col.html">7 Columns Products</a>
              </li>
              <li>
                <a href="category-8col.html">8 Columns Products</a>
              </li>
            </ul>
          </li>
          <li>
            <a href="product.html">Products</a>
            <ul>
              <li>
                <a href="category-infinite-scroll.html#" className="nolink">
                  PRODUCT PAGES
                </a>
                <ul>
                  <li>
                    <a href="product.html">SIMPLE PRODUCT</a>
                  </li>
                  <li>
                    <a href="product-variable.html">VARIABLE PRODUCT</a>
                  </li>
                  <li>
                    <a href="product.html">SALE PRODUCT</a>
                  </li>
                  <li>
                    <a href="product.html">FEATURED &amp; ON SALE</a>
                  </li>
                  <li>
                    <a href="product-sticky-info.html">WIDTH CUSTOM TAB</a>
                  </li>
                  <li>
                    <a href="product-sidebar-left.html">WITH LEFT SIDEBAR</a>
                  </li>
                  <li>
                    <a href="product-sidebar-right.html">WITH RIGHT SIDEBAR</a>
                  </li>
                  <li>
                    <a href="product-addcart-sticky.html">ADD CART STICKY</a>
                  </li>
                </ul>
              </li>
              <li>
                <a href="category-infinite-scroll.html#" className="nolink">
                  PRODUCT LAYOUTS
                </a>
                <ul>
                  <li>
                    <a href="product-extended-layout.html">EXTENDED LAYOUT</a>
                  </li>
                  <li>
                    <a href="product-grid-layout.html">GRID IMAGE</a>
                  </li>
                  <li>
                    <a href="product-full-width.html">FULL WIDTH LAYOUT</a>
                  </li>
                  <li>
                    <a href="product-sticky-info.html">STICKY INFO</a>
                  </li>
                  <li>
                    <a href="product-sticky-both.html">
                      LEFT &amp; RIGHT STICKY
                    </a>
                  </li>
                  <li>
                    <a href="product-transparent-image.html">
                      TRANSPARENT IMAGE
                    </a>
                  </li>
                  <li>
                    <a href="product-center-vertical.html">CENTER VERTICAL</a>
                  </li>
                  <li>
                    <a href="category-infinite-scroll.html#">BUILD YOUR OWN</a>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
          <li>
            <a href="category-infinite-scroll.html#">
              Pages<span className="tip tip-hot">Hot!</span>
            </a>
            <ul>
              <li>
                <a href="wishlist.html">Wishlist</a>
              </li>
              <li>
                <a href="cart.html">Shopping Cart</a>
              </li>
              <li>
                <a href="checkout.html">Checkout</a>
              </li>
              <li>
                <a href="dashboard.html">Dashboard</a>
              </li>
              <li>
                <a href="login.html">Login</a>
              </li>
              <li>
                <a href="forgot-password.html">Forgot Password</a>
              </li>
            </ul>
          </li>
          <li>
            <a href="blog.html">Blog</a>
          </li>
          <li>
            <a href="category-infinite-scroll.html#">Elements</a>
            <ul className="custom-scrollbar">
              <li>
                <a href="element-accordions.html">Accordion</a>
              </li>
              <li>
                <a href="element-alerts.html">Alerts</a>
              </li>
              <li>
                <a href="element-animations.html">Animations</a>
              </li>
              <li>
                <a href="element-banners.html">Banners</a>
              </li>
              <li>
                <a href="element-buttons.html">Buttons</a>
              </li>
              <li>
                <a href="element-call-to-action.html">Call to Action</a>
              </li>
              <li>
                <a href="element-countdown.html">Count Down</a>
              </li>
              <li>
                <a href="element-counters.html">Counters</a>
              </li>
              <li>
                <a href="element-headings.html">Headings</a>
              </li>
              <li>
                <a href="element-icons.html">Icons</a>
              </li>
              <li>
                <a href="element-info-box.html">Info box</a>
              </li>
              <li>
                <a href="element-posts.html">Posts</a>
              </li>
              <li>
                <a href="element-products.html">Products</a>
              </li>
              <li>
                <a href="element-product-categories.html">Product Categories</a>
              </li>
              <li>
                <a href="element-tabs.html">Tabs</a>
              </li>
              <li>
                <a href="element-testimonial.html">Testimonials</a>
              </li>
            </ul>
          </li>
        </ul>
        <ul className="mobile-menu mt-2 mb-2">
          <li className="border-0">
            <a href="category-infinite-scroll.html#">Special Offer!</a>
          </li>
          <li className="border-0">
            <a href="category-infinite-scroll.html#" target="_blank">
              Buy Porto!
              <span className="tip tip-hot">Hot</span>
            </a>
          </li>
        </ul>
        <ul className="mobile-menu">
          <li>
            <a href="login.html">My Account</a>
          </li>
          <li>
            <a href="contact.html">Contact Us</a>
          </li>
          <li>
            <a href="blog.html">Blog</a>
          </li>
          <li>
            <a href="wishlist.html">My Wishlist</a>
          </li>
          <li>
            <a href="cart.html">Cart</a>
          </li>
          <li>
            <a href="login.html" className="login-link">
              Log In
            </a>
          </li>
        </ul>
      </nav>
      {/* End .mobile-nav */}
      <form
        className="search-wrapper mb-2"
        action="category-infinite-scroll.html#"
      >
        <input
          type="text"
          className="form-control mb-0"
          placeholder="Search..."
          required=""
        />
        <button
          className="btn icon-search text-white bg-transparent p-0"
          type="submit"
        />
      </form>
      <div className="social-icons">
        <a
          href="category-infinite-scroll.html#"
          className="social-icon social-facebook icon-facebook"
          target="_blank"
        ></a>
        <a
          href="category-infinite-scroll.html#"
          className="social-icon social-twitter icon-twitter"
          target="_blank"
        ></a>
        <a
          href="category-infinite-scroll.html#"
          className="social-icon social-instagram icon-instagram"
          target="_blank"
        ></a>
      </div>
    </div>
    {/* End .mobile-menu-wrapper */}
  </div>
  {/* End .mobile-menu-container */}
  <div className="sticky-navbar">
    <div className="sticky-info">
      <a href="demo4.html">
        <i className="icon-home" />
        Home
      </a>
    </div>
    <div className="sticky-info">
      <a href="category.html" className="">
        <i className="icon-bars" />
        Categories
      </a>
    </div>
    <div className="sticky-info">
      <a href="wishlist.html" className="">
        <i className="icon-wishlist-2" />
        Wishlist
      </a>
    </div>
    <div className="sticky-info">
      <a href="login.html" className="">
        <i className="icon-user-2" />
        Account
      </a>
    </div>
    <div className="sticky-info">
      <a href="cart.html" className="">
        <i className="icon-shopping-cart position-relative">
          <span className="cart-count badge-circle">3</span>
        </i>
        Cart
      </a>
    </div>
  </div>
  <a
    id="scroll-top"
    href="category-infinite-scroll.html#top"
    title="Top"
    role="button"
  >
    <i className="icon-angle-up" />
  </a>
  {/* Plugins JS File */}
  {/* Main JS File */}
</>

    )
}