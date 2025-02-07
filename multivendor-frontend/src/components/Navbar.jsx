
export default function Navbar() {

  return (
      <>
    <header className="header">
      <div
        className="header-middle sticky-header"
        data-sticky-options="{'mobile': true}"
      >
        <div className="container">
          <div className="header-left w-lg-max">
            <button
              className="mobile-menu-toggler text-primary mr-2"
              type="button"
            >
              <i className="fas fa-bars" />
            </button>
            <a href="demo35.html" className="logo">
              <img
                src="src/assets/images/logo-black.png"
                className="w-100"
                width={111}
                height={44}
                alt="Porto Logo"
              />
            </a>
            <div className="header-icon header-search header-search-inline header-search-category d-lg-block d-none text-right mt-0">
              <a href="demo35.html#" className="search-toggle" role="button">
                <i className="icon-magnifier" />
              </a>
              <form action="demo35.html#" method="get">
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
                  <button
                    className="btn icon-magnifier p-0"
                    title="search"
                    type="submit"
                  />
                </div>
                {/* End .header-search-wrapper */}
              </form>
            </div>
            {/* End .header-search */}
          </div>
          {/* End .header-left */}
          <div className="header-right">
            <a
              href="wishlist.html"
              className="header-icon position-relative d-lg-none mr-2"
            >
              <i className="icon-wishlist-2" />
              <span className="badge-circle">0</span>
            </a>
            <div className="header-user d-lg-flex align-items-center">
              <a href="login.html" className="header-icon mr-0" title="login">
                <i className="icon-user-2 mr-2" />
              </a>
              <h6 className="font1 d-none d-lg-block mb-0">
                <span className="d-block text-body">Welcome</span>
                <a href="login.html" className="font-weight-bold">
                  Sign In / Register
                </a>
              </h6>
            </div>
            <div className="cart-dropdown-wrapper d-flex align-items-center">
              <div className="dropdown cart-dropdown">
                <a
                  href="demo35.html#"
                  title="Cart"
                  className="dropdown-toggle cart-toggle"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                  data-display="static"
                >
                  <i className="icon-cart-thick" />
                  <span className=" cart-count badge-circle">3</span>
                </a>
                <div className="cart-overlay" />
                <div className="dropdown-menu mobile-cart">
                  <a
                    href="demo35.html#"
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
                            <a href="demo35-product.html">
                              Ultimate 3D Bluetooth Speaker
                            </a>
                          </h4>
                          <span className="cart-product-info">
                            <span className="cart-product-qty">1</span> × $99.00
                          </span>
                        </div>
                        {/* End .product-details */}
                        <figure className="product-image-container">
                          <a
                            href="demo35-product.html"
                            className="product-image"
                          >
                            <img
                              src="src/assets/images/products/product-1.jpg"
                              alt="product"
                              width={80}
                              height={80}
                            />
                          </a>
                          <a
                            href="demo35.html#"
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
                            <a href="demo35-product.html">
                              Brown Women Casual HandBag
                            </a>
                          </h4>
                          <span className="cart-product-info">
                            <span className="cart-product-qty">1</span> × $35.00
                          </span>
                        </div>
                        {/* End .product-details */}
                        <figure className="product-image-container">
                          <a
                            href="demo35-product.html"
                            className="product-image"
                          >
                            <img
                              src="src/assets/images/products/product-2.jpg"
                              alt="product"
                              width={80}
                              height={80}
                            />
                          </a>
                          <a
                            href="demo35.html#"
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
                            <a href="demo35-product.html">
                              Circled Ultimate 3D Speaker
                            </a>
                          </h4>
                          <span className="cart-product-info">
                            <span className="cart-product-qty">1</span> × $35.00
                          </span>
                        </div>
                        {/* End .product-details */}
                        <figure className="product-image-container">
                          <a
                            href="demo35-product.html"
                            className="product-image"
                          >
                            <img
                              src="src/assets/images/products/product-3.jpg"
                              alt="product"
                              width={80}
                              height={80}
                            />
                          </a>
                          <a
                            href="demo35.html#"
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
                      <a
                        href="checkout.html"
                        className="btn btn-dark btn-block"
                      >
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
              <span className="cart-subtotal font2 d-none d-sm-inline">
                Shopping Cart
                <span className="cart-price d-block font2">$0.00</span>
              </span>
            </div>
          </div>
          {/* End .header-right */}
        </div>
        {/* End .container */}
      </div>
      {/* End .header-middle */}
      <div
        className="header-bottom sticky-header d-none d-lg-flex"
        data-sticky-options="{'mobile': false}"
      >
        <div className="container">
          <div className="header-center w-100 ml-0">
            <nav className="main-nav d-flex font2">
              <div className="menu-depart">
                <a href="demo35.html">
                  <i className="fa fa-bars align-middle mr-3" />
                  All Departments
                </a>
                <ul className="menu menu-vertical">
                  <li>
                    <a href="demo35.html#">
                      <i className="icon-category-fashion" />
                      Fashion
                    </a>
                    <span className="menu-btn" />
                    <div className="megamenu megamenu-fixed-width megamenu-one">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="row">
                            <div className="col-md-6 mb-1">
                              <a href="demo35.html#" className="nolink pl-0">
                                Woman
                              </a>
                              <ul className="submenu">
                                <li>
                                  <a href="demo35-shop.html">
                                    Tops &amp; Blouses
                                  </a>
                                </li>
                                <li>
                                  <a href="demo35-shop.html">Accessories</a>
                                </li>
                                <li>
                                  <a href="demo35-shop.html">
                                    Dresses &amp; Skirts
                                  </a>
                                </li>
                                <li>
                                  <a href="demo35-shop.html">
                                    Shoes &amp; Boots
                                  </a>
                                </li>
                              </ul>
                            </div>
                            <div className="col-md-6 mb-1">
                              <a href="demo35.html#" className="nolink pl-0">
                                Men
                              </a>
                              <ul className="submenu">
                                <li>
                                  <a href="demo35-shop.html">Accessories</a>
                                </li>
                                <li>
                                  <a href="demo35-shop.html">Watch Fashion</a>
                                </li>
                                <li>
                                  <a href="demo35-shop.html">
                                    Tees, Knits &amp; Polos
                                  </a>
                                </li>
                                <li>
                                  <a href="demo35-shop.html">
                                    Paints &amp; Denim
                                  </a>
                                </li>
                              </ul>
                            </div>
                            <div className="col-md-6 mb-1">
                              <a href="demo35.html#" className="nolink pl-0">
                                Jewellery
                              </a>
                              <ul className="submenu">
                                <li>
                                  <a href="demo35-shop.html">Sweaters</a>
                                </li>
                                <li>
                                  <a href="demo35-shop.html">
                                    Heels &amp; Sandals
                                  </a>
                                </li>
                                <li>
                                  <a href="demo35-shop.html">
                                    Jeans &amp; Shorts
                                  </a>
                                </li>
                              </ul>
                            </div>
                            <div className="col-md-6 mb-1">
                              <a href="demo35.html#" className="nolink pl-0">
                                Kids Fashion
                              </a>
                              <ul className="submenu">
                                <li>
                                  <a href="demo35-shop.html">Casual Shoes</a>
                                </li>
                                <li>
                                  <a href="demo35-shop.html">
                                    Spring &amp; Autumn
                                  </a>
                                </li>
                                <li>
                                  <a href="demo35-shop.html">Winter Sneakers</a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 text-right">
                          <div className="menu-banner menu-banner-2 d-inline-block position-relative h-auto">
                            <figure className="text-right">
                              <img
                                src="src/assets/images/demoes/demo35/menu-banner-1.jpg"
                                alt="Menu banner"
                                className="product-promo d-inline-block"
                                width={300}
                                height={383}
                              />
                            </figure>
                            <i>OFF</i>
                            <div className="banner-content text-left">
                              <h4>
                                <span className="text-dark">UP TO</span>
                                <br />
                                <b className="text-dark">50%</b>
                              </h4>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row px-5">
                        <div className="col-lg-12">
                          <div className="partners-container mb-2">
                            <div
                              className="owl-carousel owl-theme"
                              data-owl-options="{
                                                      'dots': false,
                                                      'items': 4,
                                                      'margin': 20,
                                                      'responsive': {
                                                          '1200': {
                                                              'items': 5
                                                          }
                                                      }
                                                  }"
                            >
                              <div className="partner">
                                <img
                                  src="https://portotheme.com/html/porto_ecommerce/assets/images/brands/small/brand1.png"
                                  alt="logo image"
                                  width={140}
                                  height={60}
                                />
                              </div>
                              <div className="partner">
                                <img
                                  src="src/assets/images/brands/small/brand2.png"
                                  alt="logo image"
                                  width={140}
                                  height={60}
                                />
                              </div>
                              <div className="partner">
                                <img
                                  src="src/assets/images/brands/small/brand3.png"
                                  alt="logo image"
                                  width={140}
                                  height={60}
                                />
                              </div>
                              <div className="partner">
                                <img
                                  src="src/assets/images/brands/small/brand4.png"
                                  alt="logo image"
                                  width={140}
                                  height={60}
                                />
                              </div>
                              <div className="partner">
                                <img
                                  src="src/assets/images/brands/small/brand5.png"
                                  alt="logo image"
                                  width={140}
                                  height={60}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* End .megamenu */}
                  </li>
                  <li>
                    <a href="demo35.html#">
                      <i className="icon-category-electronics" />
                      Electronics
                    </a>
                    <span className="menu-btn" />
                    <div className="megamenu megamenu-fixed-width megamenu-two">
                      <div className="row">
                        <div className="col-lg-3 mb-1">
                          <a href="demo35.html#" className="nolink pl-0">
                            ACCESSORIES
                          </a>
                          <ul className="submenu">
                            <li>
                              <a href="demo35-shop.html">
                                Cables &amp; Adapters
                              </a>
                            </li>
                            <li>
                              <a href="demo35-shop.html">
                                Electronic Cigarattes
                              </a>
                            </li>
                            <li>
                              <a href="demo35-shop.html">Batteries</a>
                            </li>
                            <li>
                              <a href="demo35-shop.html">Chargers</a>
                            </li>
                            <li>
                              <a href="demo35-shop.html">Home Electronic</a>
                            </li>
                            <li>
                              <a href="demo35-shop.html">Bags &amp; Cases</a>
                            </li>
                          </ul>
                        </div>
                        {/* End .col-lg-4 */}
                        <div className="col-lg-3 mb-1">
                          <a href="demo35.html#" className="nolink pl-0">
                            AUDIO &amp; VIDEO
                          </a>
                          <ul className="submenu">
                            <li>
                              <a href="demo35-shop.html">Televisions</a>
                            </li>
                            <li>
                              <a href="demo35-shop.html">TV Receivers</a>
                            </li>
                            <li>
                              <a href="demo35-shop.html">Projectors</a>
                            </li>
                            <li>
                              <a href="demo35-shop.html">Audio Amplifier</a>
                            </li>
                            <li>
                              <a href="demo35-shop.html">TV SticksAmplifier</a>
                            </li>
                          </ul>
                        </div>
                        {/* End .col-lg-4 */}
                        <div className="col-lg-3 mb-1">
                          <a href="demo35.html#" className="nolink pl-0">
                            CAMERA &amp; PHOTO
                          </a>
                          <ul className="submenu">
                            <li>
                              <a href="demo35-shop.html">Digital Cameras</a>
                            </li>
                            <li>
                              <a href="demo35-shop.html">Camcorders</a>
                            </li>
                            <li>
                              <a href="demo35-shop.html">Camera Drones</a>
                            </li>
                            <li>
                              <a href="demo35-shop.html">Action Cameras</a>
                            </li>
                            <li>
                              <a href="demo35-shop.html">Photo Supplies</a>
                            </li>
                            <li>
                              <a href="demo35-shop.html">Camera &amp; Photo</a>
                            </li>
                          </ul>
                        </div>
                        {/* End .col-lg-4 */}
                        <div className="col-lg-3 mb-1">
                          <a href="demo35.html#" className="nolink pl-0">
                            LAPTOPS
                          </a>
                          <ul className="submenu">
                            <li>
                              <a href="demo35-shop.html">Gaming Laptops</a>
                            </li>
                            <li>
                              <a href="demo35-shop.html">Utraslim Laptops</a>
                            </li>
                            <li>
                              <a href="demo35-shop.html">Tablets</a>
                            </li>
                            <li>
                              <a href="demo35-shop.html">Laptop Accessories</a>
                            </li>
                            <li>
                              <a href="demo35-shop.html">Tablet Accessories</a>
                            </li>
                            <li>
                              <a href="demo35-shop.html">
                                Laptop Bag &amp; Cases
                              </a>
                            </li>
                          </ul>
                        </div>
                        {/* End .col-lg-4 */}
                      </div>
                      {/* End .row */}
                      <div className="row px-5">
                        <div className="col-md-6">
                          <div className="banner menu-banner-3 banner-md-vw text-transform-none">
                            <figure>
                              <img
                                src="src/assets/images/demoes/demo35/menu-banner-2.jpg"
                                alt="banner"
                              />
                            </figure>
                            <div className="banner-layer banner-layer-middle d-flex align-items-center justify-content-end pt-0">
                              <div className="content-left">
                                <h4 className="banner-layer-circle-item mb-0 ls-0">
                                  40
                                  <sup>
                                    %<small className="ls-0">OFF</small>
                                  </sup>
                                </h4>
                              </div>
                              <div className="content-right text-right">
                                <h5 className=" ls-0">
                                  <del className="d-block m-b-2 text-secondary">
                                    $450
                                  </del>
                                  $270
                                </h5>
                                <h4 className="m-b-1 ls-n-25">Watches</h4>
                                <h3 className="mb-0">HURRY UP!</h3>
                              </div>
                            </div>
                          </div>
                          {/* End .banner */}
                        </div>
                        <div className="col-md-6">
                          <div className="banner menu-banner-4 banner-md-vw">
                            <figure>
                              <img
                                src="src/assets/images/demoes/demo35/menu-banner-3.jpg"
                                alt="banner"
                              />
                            </figure>
                            <div className="banner-layer banner-layer-middle d-flex align-items-end flex-column">
                              <h3 className="text-dark text-right">
                                Electronic
                                <br />
                                Deals
                              </h3>
                              <div className="coupon-sale-content">
                                <h4 className="custom-coupon-sale-text bg-dark text-white d-block font1 text-transform-none">
                                  Exclusive COUPON
                                </h4>
                                <h5 className="custom-coupon-sale-text font1 text-dark ls-n-10 p-0">
                                  <b className="text-dark">$100</b> OFF
                                </h5>
                              </div>
                            </div>
                          </div>
                          {/* End .banner */}
                        </div>
                      </div>
                    </div>
                    {/* End .megamenu */}
                  </li>
                  <li>
                    <a href="demo35.html#">
                      <i className="icon-category-gifts" />
                      Gifts
                    </a>
                    <span className="menu-btn" />
                    <div className="megamenu megamenu-fixed-width megamenu-three">
                      <div className="row">
                        <div className="col-lg-3 mb-1">
                          <div className="image-wrapper">
                            <img
                              src="src/assets/images/demoes/demo35/icons/boy.png"
                              alt="icon"
                              width={50}
                              height={68}
                            />
                          </div>
                          <a href="demo35.html#" className="nolink">
                            FOR HIM
                          </a>
                          <ul className="submenu pb-0">
                            <li>
                              <a href="demo35-shop.html">Gifts for Boyfriend</a>
                            </li>
                            <li>
                              <a href="demo35-shop.html">Gifts for Husband</a>
                            </li>
                            <li>
                              <a href="demo35-shop.html">Gifts for Dad</a>
                            </li>
                            <li>
                              <a href="demo35-shop.html">Gifts for Grandpa</a>
                            </li>
                          </ul>
                        </div>
                        {/* End .col-lg-4 */}
                        <div className="col-lg-3 mb-1">
                          <div className="image-wrapper">
                            <img
                              src="src/assets/images/demoes/demo35/icons/girl.png"
                              alt="icon"
                              width={50}
                              height={68}
                            />
                          </div>
                          <a href="demo35.html#" className="nolink">
                            FOR HER
                          </a>
                          <ul className="submenu pb-0">
                            <li>
                              <a href="demo35-shop.html">
                                Gifts for Girlfriend
                              </a>
                            </li>
                            <li>
                              <a href="demo35-shop.html">Gifts for Wife</a>
                            </li>
                            <li>
                              <a href="demo35-shop.html">Gifts for Mom</a>
                            </li>
                            <li>
                              <a href="demo35-shop.html">Gifts for Grandma</a>
                            </li>
                          </ul>
                        </div>
                        {/* End .col-lg-4 */}
                        <div className="col-lg-3 mb-1">
                          <div className="image-wrapper">
                            <img
                              src="src/assets/images/demoes/demo35/icons/kid.png"
                              alt="icon"
                              width={50}
                              height={68}
                            />
                          </div>
                          <a href="demo35.html#" className="nolink">
                            FOR KIDS
                          </a>
                          <ul className="submenu pb-0">
                            <li>
                              <a href="demo35-shop.html">Gifts for Boys</a>
                            </li>
                            <li>
                              <a href="demo35-shop.html">Gifts for Girls</a>
                            </li>
                            <li>
                              <a href="demo35-shop.html">Gifts for Twin Boys</a>
                            </li>
                            <li>
                              <a href="demo35-shop.html">
                                Gifts for Twin Girls
                              </a>
                            </li>
                          </ul>
                        </div>
                        {/* End .col-lg-4 */}
                        <div className="col-lg-3 mb-1">
                          <div className="image-wrapper">
                            <img
                              src="src/assets/images/demoes/demo35/icons/supermarket.png"
                              alt="icon"
                              width={50}
                              height={68}
                            />
                          </div>
                          <a href="demo35.html#" className="nolink">
                            BIRTHDAY
                          </a>
                          <ul className="submenu pb-0">
                            <li>
                              <a href="demo35-shop.html">Birthday for Him</a>
                            </li>
                            <li>
                              <a href="demo35-shop.html">Birthday for Her</a>
                            </li>
                            <li>
                              <a href="demo35-shop.html">Boyfriend Gifts</a>
                            </li>
                            <li>
                              <a href="demo35-shop.html">Girlfriend Gifts</a>
                            </li>
                          </ul>
                        </div>
                        {/* End .col-lg-4 */}
                      </div>
                      {/* End .row */}
                    </div>
                    {/* End .megamenu */}
                  </li>
                  <li>
                    <a href="demo35-shop.html">
                      <i className="icon-category-garden" />
                      Home &amp; Garden
                    </a>
                    <span className="menu-btn" />
                    <div className="megamenu megamenu-fixed-width megamenu-four">
                      <div className="row p-0">
                        <div className="col-md-8">
                          <div className="row">
                            <div className="col-md-6 mb-1 pb-2">
                              <a
                                href="demo35.html#"
                                className="nolink pl-0 d-lg-none d-block"
                              >
                                VARIATION 1
                              </a>
                              <a href="demo35.html#" className="nolink pl-0">
                                FURNITURE
                              </a>
                              <ul className="submenu m-b-4">
                                <li>
                                  <a href="demo35-shop.html">
                                    Sofas &amp; Couches
                                  </a>
                                </li>
                                <li>
                                  <a href="demo35-shop.html">Armchairs</a>
                                </li>
                                <li>
                                  <a href="demo35-shop.html">Bed Frames</a>
                                </li>
                                <li>
                                  <a href="demo35-shop.html">Beside Tables</a>
                                </li>
                                <li>
                                  <a href="demo35-shop.html">Dressing Tables</a>
                                </li>
                                <li>
                                  <a href="demo35-shop.html">
                                    Chest of Drawers
                                  </a>
                                </li>
                              </ul>
                              <a href="demo35.html#" className="nolink pl-0">
                                HOME ACCESSORIES
                              </a>
                              <ul className="submenu m-b-4">
                                <li>
                                  <a href="demo35-shop.html">
                                    Decorative Accessories
                                  </a>
                                </li>
                                <li>
                                  <a href="demo35-shop.html">
                                    Candles &amp; Holders
                                  </a>
                                </li>
                                <li>
                                  <a href="demo35-shop.html">Home Fragrance</a>
                                </li>
                                <li>
                                  <a href="demo35-shop.html">Mirrors</a>
                                </li>
                                <li>
                                  <a href="demo35-shop.html">Clocks</a>
                                </li>
                              </ul>
                            </div>
                            <div className="col-md-6">
                              <a
                                href="demo35.html#"
                                className="nolink pl-0 d-lg-none d-block"
                              >
                                VARIATION 2
                              </a>
                              <a href="demo35.html#" className="nolink pl-0">
                                LIGHTING
                              </a>
                              <ul className="submenu m-b-4">
                                <li>
                                  <a href="demo35-shop.html">Light Bulbs</a>
                                </li>
                                <li>
                                  <a href="demo35-shop.html">Lamps</a>
                                </li>
                                <li>
                                  <a href="demo35-shop.html">Celling Lights</a>
                                </li>
                                <li>
                                  <a href="demo35-shop.html">Wall Lights</a>
                                </li>
                                <li>
                                  <a href="demo35-shop.html">
                                    Bathroom Lighting
                                  </a>
                                </li>
                                <li>
                                  <a href="demo35-shop.html">
                                    Outdoor Lighting
                                  </a>
                                </li>
                              </ul>
                              <a href="demo35.html#" className="nolink pl-0">
                                GARDEN &amp; OUTDOORS
                              </a>
                              <ul className="submenu m-b-4">
                                <li>
                                  <a href="demo35-shop.html">
                                    Garden Furniture
                                  </a>
                                </li>
                                <li>
                                  <a href="demo35-shop.html">Lawn Mowers</a>
                                </li>
                                <li>
                                  <a href="demo35-shop.html">
                                    Pressure Washers
                                  </a>
                                </li>
                                <li>
                                  <a href="demo35-shop.html">
                                    All Garden Tools &amp; Equipment
                                  </a>
                                </li>
                                <li>
                                  <a href="demo35-shop.html">
                                    Barbecue &amp; Outdoor Dining
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4 bg-gray">
                          <div className="product-widgets-container">
                            <div className="product-default left-details product-widget">
                              <figure>
                                <a href="demo35-product.html">
                                  <img
                                    src="src/assets/images/demoes/demo35/products/small/product-1.jpg"
                                    width={84}
                                    height={84}
                                    alt="product"
                                  />
                                </a>
                              </figure>
                              <div className="product-details">
                                <h3 className="product-title">
                                  {" "}
                                  <a href="demo35-product.html">
                                    Temperos
                                  </a>{" "}
                                </h3>
                                <div className="ratings-container">
                                  <div className="product-ratings">
                                    <span
                                      className="ratings"
                                      style={{ width: "0%" }}
                                    />
                                    {/* End .ratings */}
                                    <span className="tooltiptext tooltip-top" />
                                  </div>
                                  {/* End .product-ratings */}
                                </div>
                                {/* End .product-container */}
                                <div className="price-box">
                                  <span className="product-price">$39.00</span>
                                </div>
                                {/* End .price-box */}
                              </div>
                              {/* End .product-details */}
                            </div>
                            <div className="product-default left-details product-widget">
                              <figure>
                                <a href="demo35-product.html">
                                  <img
                                    src="src/assets/images/demoes/demo35/products/small/product-2.jpg"
                                    width={84}
                                    height={84}
                                    alt="product"
                                  />
                                </a>
                              </figure>
                              <div className="product-details">
                                <h3 className="product-title">
                                  {" "}
                                  <a href="demo35-product.html">Clasico</a>{" "}
                                </h3>
                                <div className="ratings-container">
                                  <div className="product-ratings">
                                    <span
                                      className="ratings"
                                      style={{ width: "0%" }}
                                    />
                                    {/* End .ratings */}
                                    <span className="tooltiptext tooltip-top">
                                      5.00
                                    </span>
                                  </div>
                                  {/* End .product-ratings */}
                                </div>
                                {/* End .product-container */}
                                <div className="price-box">
                                  <span className="product-price">$119.00</span>
                                </div>
                                {/* End .price-box */}
                              </div>
                              {/* End .product-details */}
                            </div>
                            <div className="product-default left-details product-widget">
                              <figure>
                                <a href="demo35-product.html">
                                  <img
                                    src="src/assets/images/demoes/demo35/products/small/product-3.jpg"
                                    width={84}
                                    height={84}
                                    alt="product"
                                  />
                                </a>
                              </figure>
                              <div className="product-details">
                                <h3 className="product-title">
                                  {" "}
                                  <a href="demo35-product.html">Coffee</a>{" "}
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
                                  <span className="product-price">$34.00</span>
                                </div>
                                {/* End .price-box */}
                              </div>
                              {/* End .product-details */}
                            </div>
                            <div className="product-default left-details product-widget">
                              <figure>
                                <a href="demo35-product.html">
                                  <img
                                    src="src/assets/images/demoes/demo35/products/small/product-4.jpg"
                                    width={84}
                                    height={84}
                                    alt="product"
                                  />
                                </a>
                              </figure>
                              <div className="product-details">
                                <h3 className="product-title">
                                  {" "}
                                  <a href="demo35-product.html">Grape</a>{" "}
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
                                  <span className="product-price">$29.00</span>
                                </div>
                                {/* End .price-box */}
                              </div>
                              {/* End .product-details */}
                            </div>
                            <div className="product-default left-details product-widget">
                              <figure>
                                <a href="demo35-product.html">
                                  <img
                                    src="src/assets/images/demoes/demo35/products/small/product-5.jpg"
                                    width={84}
                                    height={84}
                                    alt="product"
                                  />
                                </a>
                              </figure>
                              <div className="product-details">
                                <h3 className="product-title">
                                  {" "}
                                  <a href="demo35-product.html">
                                    Magic Toast
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
                                  <span className="old-price">$29.00</span>
                                  <span className="product-price">$18.00</span>
                                </div>
                                {/* End .price-box */}
                              </div>
                              {/* End .product-details */}
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* End .row */}
                    </div>
                    {/* End .megamenu */}
                  </li>
                  <li>
                    <a href="demo35-shop.html">
                      <i className="icon-category-music" />
                      Music
                    </a>
                    <span className="menu-btn" />
                    <div
                      className="megamenu megamenu-fixed-width megamenu-five text-transform-none p-0"
                      style={{
                        backgroundImage:
                          "url(assets/images/demoes/demo35/menu-banner-4.jpg)"
                      }}
                    >
                      <div className="row m-0">
                        <div className="col-lg-4 pt-0">
                          <a
                            href="demo35.html#"
                            className="nolink text-white pl-0"
                          >
                            INSTRUMENTS
                          </a>
                          <ul className="submenu bg-transparent">
                            <li>
                              <a href="demo35-shop.html">Guitar</a>
                            </li>
                            <li>
                              <a href="demo35-shop.html">Drums Sets</a>
                            </li>
                            <li>
                              <a href="demo35-shop.html">Percussions</a>
                            </li>
                            <li>
                              <a href="demo35-shop.html">
                                Pedals &amp; Effects
                              </a>
                            </li>
                            <li>
                              <a href="demo35-shop.html">Sound Cards</a>
                            </li>
                            <li>
                              <a href="demo35-shop.html">Studio Equipments</a>
                            </li>
                            <li>
                              <a href="demo35-shop.html">
                                Piano &amp; Keyboards
                              </a>
                            </li>
                          </ul>
                          <a
                            href="demo35.html#"
                            className="nolink text-white pl-0"
                          >
                            EXTRA
                          </a>
                          <ul className="submenu bg-transparent pb-0">
                            <li>
                              <a href="demo35-shop.html">Strings</a>
                            </li>
                            <li>
                              <a href="demo35-shop.html">Recorders</a>
                            </li>
                            <li>
                              <a href="demo35-shop.html">Amplifiers</a>
                            </li>
                            <li>
                              <a href="demo35-shop.html">Accessories</a>
                            </li>
                          </ul>
                        </div>
                        <div className="col-lg-8 pt-0 d-lg-block d-none">
                          <div className="banner menu-banner-5 d-flex align-items-center">
                            <div className="banner-layer text-right pt-0">
                              <h6 className="text-transform-none font1 mb-1">
                                CHECK NEW ARRIVALS
                              </h6>
                              <h3 className="font1 text-white">PROFESSIONAL</h3>
                              <h2 className="font1 text-transform-none text-white">
                                HEADPHONES
                              </h2>
                              <a
                                href="demo35-shop.html"
                                className="btn btn-dark font1"
                              >
                                VIEW ALL NOW
                              </a>
                            </div>
                            {/* End .banner-layer */}
                          </div>
                          {/* End .home-slide */}
                        </div>
                      </div>
                      {/* End .row */}
                    </div>
                    {/* End .megamenu */}
                  </li>
                  <li>
                    <a href="demo35-shop.html">
                      <i className="icon-cat-sport" />
                      Sports
                    </a>
                    <span className="menu-btn" />
                    <div className="megamenu megamenu-fixed-width megamenu-six text-transform-none">
                      <div className="row">
                        <div className="col-md-6 pt-0">
                          <div className="row">
                            <div className="col-md-6">
                              <a href="demo35.html#" className="nolink pl-0">
                                SPORTS
                              </a>
                              <ul className="submenu bg-transparent">
                                <li>
                                  <a href="demo35-shop.html">
                                    Sports &amp; Fitness
                                  </a>
                                </li>
                                <li>
                                  <a href="demo35-shop.html">
                                    Boating &amp; Sailing
                                  </a>
                                </li>
                                <li>
                                  <a href="demo35-shop.html">Clothing</a>
                                </li>
                                <li>
                                  <a href="demo35-shop.html">
                                    Exercise &amp; Fitness
                                  </a>
                                </li>
                                <li>
                                  <a href="demo35-shop.html">Golf</a>
                                </li>
                                <li>
                                  <a href="demo35-shop.html">
                                    Hunting &amp; Fishing
                                  </a>
                                </li>
                                <li>
                                  <a href="demo35-shop.html">Leisure Sports</a>
                                </li>
                                <li>
                                  <a href="demo35-shop.html">Running</a>
                                </li>
                                <li>
                                  <a href="demo35-shop.html">Swimming</a>
                                </li>
                                <li>
                                  <a href="demo35-shop.html">Team Sports</a>
                                </li>
                                <li>
                                  <a href="demo35-shop.html">Tennis</a>
                                </li>
                                <li>
                                  <a href="demo35-shop.html">Other Sports</a>
                                </li>
                              </ul>
                            </div>
                            <div className="col-md-6">
                              <a href="demo35.html#" className="nolink pl-0">
                                SHOP BY PRICE
                              </a>
                              <ul className="submenu bg-transparent pb-0 m-b-3">
                                <li>
                                  <a href="demo35-shop.html">Under $25</a>
                                </li>
                                <li>
                                  <a href="demo35-shop.html">$25 to $50</a>
                                </li>
                                <li>
                                  <a href="demo35-shop.html">$50 to $100</a>
                                </li>
                                <li>
                                  <a href="demo35-shop.html">$100 to $200</a>
                                </li>
                                <li>
                                  <a href="demo35-shop.html">
                                    $200 &amp; Above
                                  </a>
                                </li>
                              </ul>
                              <a href="demo35.html#" className="nolink pl-0">
                                SHOP BY BRAND
                              </a>
                              <ul className="submenu bg-transparent pb-0">
                                <li>
                                  <a href="demo35-shop.html">Books</a>
                                </li>
                                <li>
                                  <a href="demo35-shop.html">Adidas</a>
                                </li>
                                <li>
                                  <a href="demo35-shop.html">Nike</a>
                                </li>
                                <li>
                                  <a href="demo35-shop.html">Asics</a>
                                </li>
                                <li>
                                  <a href="demo35-shop.html">Puma</a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6 d-lg-block d-none">
                          <div className="featured-deal bg-white mb-3">
                            <div className="product-default mb-0">
                              <h2 className="heading ls-n-10 text-uppercase mb-0">
                                Flash Deals
                              </h2>
                              <figure>
                                <a href="demo35-product.html">
                                  <img
                                    src="src/assets/images/demoes/demo35/products/product-16.jpg"
                                    alt="product"
                                    width={1200}
                                    height={1200}
                                  />
                                </a>
                                <div className="product-countdown-container">
                                  <span className="product-countdown-title">
                                    offer ends in:
                                  </span>
                                  <div
                                    className="product-countdown countdown-compact"
                                    data-until="2021, 10, 5"
                                    data-compact="true"
                                  ></div>
                                  {/* End .product-countdown */}
                                </div>
                                {/* End .product-countdown-container */}
                              </figure>
                              <div className="product-details">
                                <h3 className="product-title">
                                  <a href="demo35-product.html">Raw Meat</a>
                                </h3>
                                <div className="ratings-container">
                                  <div className="product-ratings">
                                    <span
                                      className="ratings"
                                      style={{ width: "80%" }}
                                    />
                                    {/* End .ratings */}
                                    <span className="tooltiptext tooltip-top" />
                                  </div>
                                  {/* End .product-ratings */}
                                </div>
                                {/* End .product-container */}
                                <div className="price-box">
                                  <del className="old-price">$59.00</del>
                                  <span className="product-price">$49.00</span>
                                </div>
                                {/* End .price-box */}
                              </div>
                              {/* End .product-details */}
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* End .row */}
                    </div>
                    {/* End .megamenu */}
                  </li>
                </ul>
              </div>
            </nav>
            <div className="info-boxes font2 align-items-center ml-auto">
              <div className="info-item">
                <a href="demo35.html#">
                  <i className="icon-percent-shape" />
                  Special Offers
                </a>
              </div>
              <div className="info-item">
                <a href="demo35.html#">
                  <i className="icon-business-book" />
                  Recipes
                </a>
              </div>
            </div>
          </div>
          <div className="header-right" />
        </div>
      </div>
    </header>
    {/* End .header */}
    <main className="main bg-gray">
      <section className="intro-section">
        <div
          className="home-slider owl-carousel owl-theme loaded slide-animate mb-4"
          data-owl-options="{
              'nav': false,
              'lazyLoad': false
          }"
        >
          <div
            className="home-slide home-slide-1 banner"
            style={{ backgroundColor: "#d9e2e1" }}
          >
            <figure>
              <img
                src="src/assets/images/demoes/demo35/slider/slide-1.jpg"
                alt="slide"
                width={1903}
                height={520}
              />
            </figure>
            <div className="banner-layer banner-layer-middle banner-layer-left">
              <h4
                className="font-weight-normal text-body m-b-2 appear-animate"
                data-animation-name="fadeInDownShorter"
                data-animation-delay={100}
              >
                Exclusive Product New Arrival
              </h4>
              <h2
                className="appear-animate"
                data-animation-name="fadeInUpShorter"
                data-animation-delay={600}
              >
                Organic Coffee
              </h2>
              <div
                className="position-relative appear-animate"
                data-animation-name="fadeInRightShorter"
                data-animation-delay={1100}
              >
                <h3 className="text-uppercase mb-4">Special Blend</h3>
                <h5 className="rotate-text font-weight-normal text-primary">
                  Fresh!
                </h5>
              </div>
              <p
                className="font2 text-right text-uppercase appear-animate"
                data-animation-name="fadeInUpShorter"
                data-animation-delay={1400}
              >
                Breakfast products on sale
              </p>
              <div
                className="coupon-sale-text m-b-2 appear-animate"
                data-animation-name="fadeInRightShorter"
                data-animation-delay={1800}
              >
                <h6 className="text-uppercase text-right mb-0">
                  <sup>up to</sup>
                  <strong className=" text-white">50%</strong>
                </h6>
              </div>
            </div>
          </div>
          <div
            className="home-slide home-slide-2 banner"
            style={{ backgroundColor: "#f7eeef" }}
          >
            <figure>
              <img
                src="src/assets/images/demoes/demo35/slider/slide-2.jpg"
                alt="slide"
                width={1903}
                height={520}
              />
            </figure>
            <div className="banner-layer banner-layer-middle banner-layer-right">
              <h4
                className="font-weight-normal text-body m-b-2 appear-animate"
                data-animation-name="fadeInDownShorter"
                data-animation-delay={100}
              >
                Exclusive Product New Arrival
              </h4>
              <h2
                className="appear-animate"
                data-animation-name="fadeInRightShorter"
                data-animation-delay={600}
              >
                Fit Low Carb
              </h2>
              <div
                className="position-relative appear-animate"
                data-animation-name="fadeInRightShorter"
                data-animation-delay={1100}
              >
                <h3 className="text-uppercase">Candy Bar</h3>
                <h5 className="rotate-text font-weight-normal text-secondary">
                  Sugar-Free
                </h5>
              </div>
              <p
                className="font2 text-right text-uppercase appear-animate"
                data-animation-name="fadeInUpShorter"
                data-animation-delay={1400}
              >
                Breakfast products on sale
              </p>
              <div
                className="coupon-sale-text pb-0 appear-animate"
                data-animation-name="fadeInRightShorter"
                data-animation-delay={1800}
              >
                <h6 className="text-uppercase text-right mb-0">
                  <sup>up to</sup>
                  <strong className=" text-white">70%</strong>
                </h6>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="popular-section">
        <div className="container">
          <div
            className="info-boxes-slider owl-carousel"
            data-owl-options="{
                  'items': 1,
                  'margin': 0,
                  'dots': false,
                  'loop': false,
                  'autoHeight': true,
                  'responsive': {
                      '576': {
                          'items': 2
                      },
                      '768': {
                          'items': 3
                      },
                      '1200': {
                          'items': 4
                      }
                  }
              }"
          >
            <div className="info-box info-box-icon-left">
              <i className="icon-shipping text-primary" />
              <div className="info-content">
                <h4 className="ls-n-25">Free Shipping &amp; Return</h4>
                <p className="font2 font-weight-light text-body ls-10">
                  Free shipping on all orders over $99.
                </p>
              </div>
            </div>
            <div className="info-box info-box-icon-left">
              <i className="icon-money text-primary" />
              <div className="info-content">
                <h4 className="ls-n-25">Money Back Guarantee</h4>
                <p className="font2 font-weight-light text-body ls-10">
                  100% money back guarantee
                </p>
              </div>
            </div>
            <div className="info-box info-box-icon-left">
              <i className="icon-support text-primary" />
              <div className="info-content">
                <h4 className="ls-n-25">Online Support 24/7</h4>
                <p className="font2 font-weight-light text-body ls-10">
                  Lorem ipsum dolor sit amet.
                </p>
              </div>
            </div>
            <div className="info-box info-box-icon-left">
              <i className="icon-secure-payment text-primary" />
              <div className="info-content">
                <h4 className="ls-n-25">Secure Payment</h4>
                <p className="font2 font-weight-light text-body ls-10">
                  Lorem ipsum dolor sit amet.
                </p>
              </div>
            </div>
          </div>
          <h2 className="section-title">Popular Departments</h2>
          <p className="section-info font2">
            Products From These Categories Often Buy
          </p>
          <div
            className="categories-slider owl-carousel owl-theme mb-4 appear-animate"
            data-owl-options="{
                  'items': 1,
                  'responsive': {
                      '576': {
                          'items': 2
                      },
                      '768': {
                          'items': 3
                      },
                      '992': {
                          'items': 4
                      }
                  }
              }"
            data-animation-name="fadeInUpShorter"
            data-animation-delay={200}
          >
            <div className="product-category bg-white">
              <a href="category.html">
                <figure>
                  <img
                    src="src/assets/images/demoes/demo35/products/cats/cat-3.png"
                    alt="cat"
                    width={341}
                    height={200}
                  />
                </figure>
                <div className="category-content">
                  <h3 className="font2 ls-n-25">Cooking</h3>
                  <span className="font2 ls-n-20">4 Products</span>
                </div>
              </a>
            </div>
            <div className="product-category bg-white">
              <a href="category.html">
                <figure>
                  <img
                    src="src/assets/images/demoes/demo35/products/cats/cat-2.png"
                    alt="cat"
                    width={341}
                    height={200}
                  />
                </figure>
                <div className="category-content">
                  <h3 className="font2 ls-n-25">Fruits</h3>
                  <span className="font2 ls-n-20">10 Products</span>
                </div>
              </a>
            </div>
            <div className="product-category bg-white">
              <a href="category.html">
                <figure>
                  <img
                    src="src/assets/images/demoes/demo35/products/cats/cat-1.png"
                    alt="cat"
                    width={341}
                    height={200}
                  />
                </figure>
                <div className="category-content">
                  <h3 className="font2 ls-n-25">Vegetables</h3>
                  <span className="font2 ls-n-20">1 Products</span>
                </div>
              </a>
            </div>
            <div className="product-category bg-white">
              <a href="category.html">
                <figure>
                  <img
                    src="src/assets/images/demoes/demo35/products/cats/cat-4.png"
                    alt="cat"
                    width={341}
                    height={200}
                  />
                </figure>
                <div className="category-content">
                  <h3 className="font2 ls-n-25">Breakfast</h3>
                  <span className="font2 ls-n-20">8 Products</span>
                </div>
              </a>
            </div>
          </div>
          <div
            className="appear-animate"
            data-animation-name="fadeIn"
            data-animation-delay={200}
          >
            <h2 className="section-title">Most Popular</h2>
            <p className="section-info font2">
              All our new arrivals in a exclusive brand selection
            </p>
            <div className="products-container product-slider-tab rounded">
              <ul className="nav nav-tabs border-0 px-4 pb-0 m-b-3">
                <li className="nav-item">
                  <a
                    className="nav-link active"
                    data-toggle="tab"
                    href="demo35.html#all"
                  >
                    View All
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    data-toggle="tab"
                    href="demo35.html#breakfast"
                  >
                    Breakfast
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    data-toggle="tab"
                    href="demo35.html#cooking"
                  >
                    Cooking
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    data-toggle="tab"
                    href="demo35.html#frozen"
                  >
                    Frozen
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    data-toggle="tab"
                    href="demo35.html#fruits"
                  >
                    Fruits
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    data-toggle="tab"
                    href="demo35.html#vegetables"
                  >
                    Vegetables
                  </a>
                </li>
              </ul>
              <div className="tab-content">
                <div className="tab-pane fade show active" id="all">
                  <div
                    className="products-slider owl-carousel owl-theme nav-outer"
                    data-owl-options="{
                                      'dots': false,
                                      'nav': true,
                                      'margin': 0,
                                      'responsive': {
                                          '576': {
                                              'items': 3
                                          },
                                          '768': {
                                              'items': 4
                                          },
                                          '1200': {
                                              'items': 6
                                          }
                                      }
                                  }"
                  >
                    <div className="product-default inner-quickview inner-icon">
                      <figure>
                        <a href="demo35-product.html">
                          <img
                            src="src/assets/images/demoes/demo35/products/product-1.jpg"
                            width={217}
                            height={217}
                            alt="product"
                          />
                        </a>
                        <div className="label-group">
                          <div className="product-label label-hot">HOT</div>
                        </div>
                        <div className="btn-icon-group">
                          <a
                            href="demo35-product.html"
                            className="btn-icon btn-add-cart"
                          >
                            <i className="fa fa-arrow-right" />
                          </a>
                        </div>
                        <a
                          href="ajax/product-quick-view.html"
                          className="btn-quickview"
                          title="Quick View"
                        >
                          Quick View
                        </a>
                      </figure>
                      <div className="product-details">
                        <div className="category-wrap">
                          <div className="category-list">
                            <a
                              href="demo35-shop.html"
                              className="product-category"
                            >
                              category
                            </a>
                          </div>
                          <a href="wishlist.html" className="btn-icon-wish">
                            <i className="icon-heart" />
                          </a>
                        </div>
                        <h3 className="product-title">
                          <a href="demo35-product.html">Trafilati al Bronzo</a>
                        </h3>
                        <div className="ratings-container">
                          <div className="product-ratings">
                            <span className="ratings" style={{ width: "0%" }} />
                            {/* End .ratings */}
                            <span className="tooltiptext tooltip-top" />
                          </div>
                          {/* End .product-ratings */}
                        </div>
                        {/* End .product-container */}
                        <div className="price-box">
                          <span className="product-price">$69.00 – $89.00</span>
                        </div>
                        {/* End .price-box */}
                      </div>
                      {/* End .product-details */}
                    </div>
                    <div className="product-default inner-quickview inner-icon">
                      <figure>
                        <a href="demo35-product.html">
                          <img
                            src="src/assets/images/demoes/demo35/products/product-2.jpg"
                            width={217}
                            height={217}
                            alt="product"
                          />
                        </a>
                        <div className="label-group">
                          <div className="product-label label-hot">HOT</div>
                        </div>
                        <div className="btn-icon-group">
                          <a
                            href="demo35-product.html"
                            className="btn-icon btn-add-cart product-type-simple"
                          >
                            <i className="icon-shopping-cart" />
                          </a>
                        </div>
                        <a
                          href="ajax/product-quick-view.html"
                          className="btn-quickview"
                          title="Quick View"
                        >
                          Quick View
                        </a>
                      </figure>
                      <div className="product-details">
                        <div className="category-wrap">
                          <div className="category-list">
                            <a
                              href="demo35-shop.html"
                              className="product-category"
                            >
                              category
                            </a>
                          </div>
                          <a href="wishlist.html" className="btn-icon-wish">
                            <i className="icon-heart" />
                          </a>
                        </div>
                        <h3 className="product-title">
                          <a href="demo35-product.html">Pineapple</a>
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
                          <span className="product-price">$19.00</span>
                        </div>
                        {/* End .price-box */}
                      </div>
                      {/* End .product-details */}
                    </div>
                    <div className="product-default inner-quickview inner-icon">
                      <figure>
                        <a href="demo35-product.html">
                          <img
                            src="src/assets/images/demoes/demo35/products/product-3.jpg"
                            width={217}
                            height={217}
                            alt="product"
                          />
                        </a>
                        <div className="label-group">
                          <div className="product-label label-hot">HOT</div>
                          <div className="product-label label-sale">-16%</div>
                        </div>
                        <div className="btn-icon-group">
                          <a
                            href="demo35-product.html"
                            className="btn-icon btn-add-cart product-type-simple"
                          >
                            <i className="icon-shopping-cart" />
                          </a>
                        </div>
                        <a
                          href="ajax/product-quick-view.html"
                          className="btn-quickview"
                          title="Quick View"
                        >
                          Quick View
                        </a>
                      </figure>
                      <div className="product-details">
                        <div className="category-wrap">
                          <div className="category-list">
                            <a
                              href="demo35-shop.html"
                              className="product-category"
                            >
                              category
                            </a>
                          </div>
                          <a href="wishlist.html" className="btn-icon-wish">
                            <i className="icon-heart" />
                          </a>
                        </div>
                        <h3 className="product-title">
                          <a href="demo35-product.html">Banana</a>
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
                          <span className="old-price">$129.00</span>
                          <span className="product-price">$108.00</span>
                        </div>
                        {/* End .price-box */}
                      </div>
                      {/* End .product-details */}
                    </div>
                    <div className="product-default inner-quickview inner-icon">
                      <figure>
                        <a href="demo35-product.html">
                          <img
                            src="src/assets/images/demoes/demo35/products/product-4.jpg"
                            width={217}
                            height={217}
                            alt="product"
                          />
                        </a>
                        <div className="label-group">
                          <div className="product-label label-hot">HOT</div>
                        </div>
                        <div className="btn-icon-group">
                          <a
                            href="demo35-product.html"
                            className="btn-icon btn-add-cart product-type-simple"
                          >
                            <i className="icon-shopping-cart" />
                          </a>
                        </div>
                        <a
                          href="ajax/product-quick-view.html"
                          className="btn-quickview"
                          title="Quick View"
                        >
                          Quick View
                        </a>
                      </figure>
                      <div className="product-details">
                        <div className="category-wrap">
                          <div className="category-list">
                            <a
                              href="demo35-shop.html"
                              className="product-category"
                            >
                              category
                            </a>
                          </div>
                          <a href="wishlist.html" className="btn-icon-wish">
                            <i className="icon-heart" />
                          </a>
                        </div>
                        <h3 className="product-title">
                          <a href="demo35-product.html">Leon Bayer</a>
                        </h3>
                        <div className="ratings-container">
                          <div className="product-ratings">
                            <span className="ratings" style={{ width: "0%" }} />
                            {/* End .ratings */}
                            <span className="tooltiptext tooltip-top" />
                          </div>
                          {/* End .product-ratings */}
                        </div>
                        {/* End .product-container */}
                        <div className="price-box">
                          <span className="product-price">$39.00</span>
                        </div>
                        {/* End .price-box */}
                      </div>
                      {/* End .product-details */}
                    </div>
                    <div className="product-default inner-quickview inner-icon">
                      <figure>
                        <a href="demo35-product.html">
                          <img
                            src="src/assets/images/demoes/demo35/products/product-5.jpg"
                            width={217}
                            height={217}
                            alt="product"
                          />
                        </a>
                        <div className="label-group">
                          <div className="product-label label-sale">-17%</div>
                        </div>
                        <div className="btn-icon-group">
                          <a
                            href="demo35-product.html"
                            className="btn-icon btn-add-cart product-type-simple"
                          >
                            <i className="icon-shopping-cart" />
                          </a>
                        </div>
                        <a
                          href="ajax/product-quick-view.html"
                          className="btn-quickview"
                          title="Quick View"
                        >
                          Quick View
                        </a>
                      </figure>
                      <div className="product-details">
                        <div className="category-wrap">
                          <div className="category-list">
                            <a
                              href="demo35-shop.html"
                              className="product-category"
                            >
                              category
                            </a>
                          </div>
                          <a href="wishlist.html" className="btn-icon-wish">
                            <i className="icon-heart" />
                          </a>
                        </div>
                        <h3 className="product-title">
                          <a href="demo35-product.html">
                            Azeite de oliva extra Vergem
                          </a>
                        </h3>
                        <div className="ratings-container">
                          <div className="product-ratings">
                            <span className="ratings" style={{ width: "0%" }} />
                            {/* End .ratings */}
                            <span className="tooltiptext tooltip-top" />
                          </div>
                          {/* End .product-ratings */}
                        </div>
                        {/* End .product-container */}
                        <div className="price-box">
                          <span className="old-price">$59.00</span>
                          <span className="product-price">$49.00</span>
                        </div>
                        {/* End .price-box */}
                      </div>
                      {/* End .product-details */}
                    </div>
                    <div className="product-default inner-quickview inner-icon">
                      <figure>
                        <a href="demo35-product.html">
                          <img
                            src="src/assets/images/demoes/demo35/products/product-6.jpg"
                            width={217}
                            height={217}
                            alt="product"
                          />
                        </a>
                        <div className="btn-icon-group">
                          <a
                            href="demo35-product.html"
                            className="btn-icon btn-add-cart product-type-simple"
                          >
                            <i className="icon-shopping-cart" />
                          </a>
                        </div>
                        <a
                          href="ajax/product-quick-view.html"
                          className="btn-quickview"
                          title="Quick View"
                        >
                          Quick View
                        </a>
                      </figure>
                      <div className="product-details">
                        <div className="category-wrap">
                          <div className="category-list">
                            <a
                              href="demo35-shop.html"
                              className="product-category"
                            >
                              category
                            </a>
                          </div>
                          <a href="wishlist.html" className="btn-icon-wish">
                            <i className="icon-heart" />
                          </a>
                        </div>
                        <h3 className="product-title">
                          <a href="demo35-product.html">Fonte de fibras</a>
                        </h3>
                        <div className="ratings-container">
                          <div className="product-ratings">
                            <span className="ratings" style={{ width: "0%" }} />
                            {/* End .ratings */}
                            <span className="tooltiptext tooltip-top" />
                          </div>
                          {/* End .product-ratings */}
                        </div>
                        {/* End .product-container */}
                        <div className="price-box">
                          <span className="product-price">$129.00</span>
                        </div>
                        {/* End .price-box */}
                      </div>
                      {/* End .product-details */}
                    </div>
                    <div className="product-default inner-quickview inner-icon">
                      <figure>
                        <a href="demo35-product.html">
                          <img
                            src="src/assets/images/demoes/demo35/products/product-7.jpg"
                            width={217}
                            height={217}
                            alt="product"
                          />
                        </a>
                        <div className="label-group">
                          <div className="product-label label-hot">HOT</div>
                        </div>
                        <div className="btn-icon-group">
                          <a
                            href="demo35-product.html"
                            className="btn-icon btn-add-cart product-type-simple"
                          >
                            <i className="icon-shopping-cart" />
                          </a>
                        </div>
                        <a
                          href="ajax/product-quick-view.html"
                          className="btn-quickview"
                          title="Quick View"
                        >
                          Quick View
                        </a>
                      </figure>
                      <div className="product-details">
                        <div className="category-wrap">
                          <div className="category-list">
                            <a
                              href="demo35-shop.html"
                              className="product-category"
                            >
                              category
                            </a>
                          </div>
                          <a href="wishlist.html" className="btn-icon-wish">
                            <i className="icon-heart" />
                          </a>
                        </div>
                        <h3 className="product-title">
                          <a href="demo35-product.html">Meat</a>
                        </h3>
                        <div className="ratings-container">
                          <div className="product-ratings">
                            <span className="ratings" style={{ width: "0%" }} />
                            {/* End .ratings */}
                            <span className="tooltiptext tooltip-top" />
                          </div>
                          {/* End .product-ratings */}
                        </div>
                        {/* End .product-container */}
                        <div className="price-box">
                          <span className="product-price">$19.00</span>
                        </div>
                        {/* End .price-box */}
                      </div>
                      {/* End .product-details */}
                    </div>
                    <div className="product-default inner-quickview inner-icon">
                      <figure>
                        <a href="demo35-product.html">
                          <img
                            src="src/assets/images/demoes/demo35/products/product-8.jpg"
                            width={217}
                            height={217}
                            alt="product"
                          />
                        </a>
                        <div className="label-group">
                          <div className="product-label label-hot">HOT</div>
                        </div>
                        <div className="btn-icon-group">
                          <a
                            href="demo35-product.html"
                            className="btn-icon btn-add-cart product-type-simple"
                          >
                            <i className="icon-shopping-cart" />
                          </a>
                        </div>
                        <a
                          href="ajax/product-quick-view.html"
                          className="btn-quickview"
                          title="Quick View"
                        >
                          Quick View
                        </a>
                      </figure>
                      <div className="product-details">
                        <div className="category-wrap">
                          <div className="category-list">
                            <a
                              href="demo35-shop.html"
                              className="product-category"
                            >
                              category
                            </a>
                          </div>
                          <a href="wishlist.html" className="btn-icon-wish">
                            <i className="icon-heart" />
                          </a>
                        </div>
                        <h3 className="product-title">
                          <a href="demo35-product.html">Coconut</a>
                        </h3>
                        <div className="ratings-container">
                          <div className="product-ratings">
                            <span className="ratings" style={{ width: "0%" }} />
                            {/* End .ratings */}
                            <span className="tooltiptext tooltip-top" />
                          </div>
                          {/* End .product-ratings */}
                        </div>
                        {/* End .product-container */}
                        <div className="price-box">
                          <span className="product-price">$25.00</span>
                        </div>
                        {/* End .price-box */}
                      </div>
                      {/* End .product-details */}
                    </div>
                  </div>
                </div>
                <div className="tab-pane fade" id="breakfast">
                  <div
                    className="products-slider owl-carousel owl-theme nav-outer"
                    data-owl-options="{
                                      'dots': false,
                                      'nav': true,
                                      'margin': 0,
                                      'responsive': {
                                          '576': {
                                              'items': 3
                                          },
                                          '768': {
                                              'items': 4
                                          },
                                          '1200': {
                                              'items': 6
                                          }
                                      }
                                  }"
                  >
                    <div className="product-default inner-quickview inner-icon">
                      <figure>
                        <a href="demo35-product.html">
                          <img
                            src="src/assets/images/demoes/demo35/products/product-1.jpg"
                            width={217}
                            height={217}
                            alt="product"
                          />
                        </a>
                        <div className="label-group">
                          <div className="product-label label-hot">HOT</div>
                        </div>
                        <div className="btn-icon-group">
                          <a
                            href="demo35-product.html"
                            className="btn-icon btn-add-cart"
                          >
                            <i className="fa fa-arrow-right" />
                          </a>
                        </div>
                        <a
                          href="ajax/product-quick-view.html"
                          className="btn-quickview"
                          title="Quick View"
                        >
                          Quick View
                        </a>
                      </figure>
                      <div className="product-details">
                        <div className="category-wrap">
                          <div className="category-list">
                            <a
                              href="demo35-shop.html"
                              className="product-category"
                            >
                              category
                            </a>
                          </div>
                          <a href="wishlist.html" className="btn-icon-wish">
                            <i className="icon-heart" />
                          </a>
                        </div>
                        <h3 className="product-title">
                          <a href="demo35-product.html">Trafilati al Bronzo</a>
                        </h3>
                        <div className="ratings-container">
                          <div className="product-ratings">
                            <span className="ratings" style={{ width: "0%" }} />
                            {/* End .ratings */}
                            <span className="tooltiptext tooltip-top" />
                          </div>
                          {/* End .product-ratings */}
                        </div>
                        {/* End .product-container */}
                        <div className="price-box">
                          <span className="product-price">$69.00 – $89.00</span>
                        </div>
                        {/* End .price-box */}
                      </div>
                      {/* End .product-details */}
                    </div>
                    <div className="product-default inner-quickview inner-icon">
                      <figure>
                        <a href="demo35-product.html">
                          <img
                            src="src/assets/images/demoes/demo35/products/product-3.jpg"
                            width={217}
                            height={217}
                            alt="product"
                          />
                        </a>
                        <div className="label-group">
                          <div className="product-label label-hot">HOT</div>
                          <div className="product-label label-sale">-16%</div>
                        </div>
                        <div className="btn-icon-group">
                          <a
                            href="demo35-product.html"
                            className="btn-icon btn-add-cart product-type-simple"
                          >
                            <i className="icon-shopping-cart" />
                          </a>
                        </div>
                        <a
                          href="ajax/product-quick-view.html"
                          className="btn-quickview"
                          title="Quick View"
                        >
                          Quick View
                        </a>
                      </figure>
                      <div className="product-details">
                        <div className="category-wrap">
                          <div className="category-list">
                            <a
                              href="demo35-shop.html"
                              className="product-category"
                            >
                              category
                            </a>
                          </div>
                          <a href="wishlist.html" className="btn-icon-wish">
                            <i className="icon-heart" />
                          </a>
                        </div>
                        <h3 className="product-title">
                          <a href="demo35-product.html">Banana</a>
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
                          <span className="old-price">$129.00</span>
                          <span className="product-price">$108.00</span>
                        </div>
                        {/* End .price-box */}
                      </div>
                      {/* End .product-details */}
                    </div>
                    <div className="product-default inner-quickview inner-icon">
                      <figure>
                        <a href="demo35-product.html">
                          <img
                            src="src/assets/images/demoes/demo35/products/product-4.jpg"
                            width={217}
                            height={217}
                            alt="product"
                          />
                        </a>
                        <div className="label-group">
                          <div className="product-label label-hot">HOT</div>
                        </div>
                        <div className="btn-icon-group">
                          <a
                            href="demo35-product.html"
                            className="btn-icon btn-add-cart product-type-simple"
                          >
                            <i className="icon-shopping-cart" />
                          </a>
                        </div>
                        <a
                          href="ajax/product-quick-view.html"
                          className="btn-quickview"
                          title="Quick View"
                        >
                          Quick View
                        </a>
                      </figure>
                      <div className="product-details">
                        <div className="category-wrap">
                          <div className="category-list">
                            <a
                              href="demo35-shop.html"
                              className="product-category"
                            >
                              category
                            </a>
                          </div>
                          <a href="wishlist.html" className="btn-icon-wish">
                            <i className="icon-heart" />
                          </a>
                        </div>
                        <h3 className="product-title">
                          <a href="demo35-product.html">Leon Bayer</a>
                        </h3>
                        <div className="ratings-container">
                          <div className="product-ratings">
                            <span className="ratings" style={{ width: "0%" }} />
                            {/* End .ratings */}
                            <span className="tooltiptext tooltip-top" />
                          </div>
                          {/* End .product-ratings */}
                        </div>
                        {/* End .product-container */}
                        <div className="price-box">
                          <span className="product-price">$39.00</span>
                        </div>
                        {/* End .price-box */}
                      </div>
                      {/* End .product-details */}
                    </div>
                    <div className="product-default inner-quickview inner-icon">
                      <figure>
                        <a href="demo35-product.html">
                          <img
                            src="src/assets/images/demoes/demo35/products/product-5.jpg"
                            width={217}
                            height={217}
                            alt="product"
                          />
                        </a>
                        <div className="label-group">
                          <div className="product-label label-sale">-17%</div>
                        </div>
                        <div className="btn-icon-group">
                          <a
                            href="demo35-product.html"
                            className="btn-icon btn-add-cart product-type-simple"
                          >
                            <i className="icon-shopping-cart" />
                          </a>
                        </div>
                        <a
                          href="ajax/product-quick-view.html"
                          className="btn-quickview"
                          title="Quick View"
                        >
                          Quick View
                        </a>
                      </figure>
                      <div className="product-details">
                        <div className="category-wrap">
                          <div className="category-list">
                            <a
                              href="demo35-shop.html"
                              className="product-category"
                            >
                              category
                            </a>
                          </div>
                          <a href="wishlist.html" className="btn-icon-wish">
                            <i className="icon-heart" />
                          </a>
                        </div>
                        <h3 className="product-title">
                          <a href="demo35-product.html">
                            Azeite de oliva extra Vergem
                          </a>
                        </h3>
                        <div className="ratings-container">
                          <div className="product-ratings">
                            <span className="ratings" style={{ width: "0%" }} />
                            {/* End .ratings */}
                            <span className="tooltiptext tooltip-top" />
                          </div>
                          {/* End .product-ratings */}
                        </div>
                        {/* End .product-container */}
                        <div className="price-box">
                          <span className="old-price">$59.00</span>
                          <span className="product-price">$49.00</span>
                        </div>
                        {/* End .price-box */}
                      </div>
                      {/* End .product-details */}
                    </div>
                    <div className="product-default inner-quickview inner-icon">
                      <figure>
                        <a href="demo35-product.html">
                          <img
                            src="src/assets/images/demoes/demo35/products/product-6.jpg"
                            width={217}
                            height={217}
                            alt="product"
                          />
                        </a>
                        <div className="btn-icon-group">
                          <a
                            href="demo35-product.html"
                            className="btn-icon btn-add-cart product-type-simple"
                          >
                            <i className="icon-shopping-cart" />
                          </a>
                        </div>
                        <a
                          href="ajax/product-quick-view.html"
                          className="btn-quickview"
                          title="Quick View"
                        >
                          Quick View
                        </a>
                      </figure>
                      <div className="product-details">
                        <div className="category-wrap">
                          <div className="category-list">
                            <a
                              href="demo35-shop.html"
                              className="product-category"
                            >
                              category
                            </a>
                          </div>
                          <a href="wishlist.html" className="btn-icon-wish">
                            <i className="icon-heart" />
                          </a>
                        </div>
                        <h3 className="product-title">
                          <a href="demo35-product.html">Fonte de fibras</a>
                        </h3>
                        <div className="ratings-container">
                          <div className="product-ratings">
                            <span className="ratings" style={{ width: "0%" }} />
                            {/* End .ratings */}
                            <span className="tooltiptext tooltip-top" />
                          </div>
                          {/* End .product-ratings */}
                        </div>
                        {/* End .product-container */}
                        <div className="price-box">
                          <span className="product-price">$129.00</span>
                        </div>
                        {/* End .price-box */}
                      </div>
                      {/* End .product-details */}
                    </div>
                    <div className="product-default inner-quickview inner-icon">
                      <figure>
                        <a href="demo35-product.html">
                          <img
                            src="src/assets/images/demoes/demo35/products/product-7.jpg"
                            width={217}
                            height={217}
                            alt="product"
                          />
                        </a>
                        <div className="label-group">
                          <div className="product-label label-hot">HOT</div>
                        </div>
                        <div className="btn-icon-group">
                          <a
                            href="demo35-product.html"
                            className="btn-icon btn-add-cart product-type-simple"
                          >
                            <i className="icon-shopping-cart" />
                          </a>
                        </div>
                        <a
                          href="ajax/product-quick-view.html"
                          className="btn-quickview"
                          title="Quick View"
                        >
                          Quick View
                        </a>
                      </figure>
                      <div className="product-details">
                        <div className="category-wrap">
                          <div className="category-list">
                            <a
                              href="demo35-shop.html"
                              className="product-category"
                            >
                              category
                            </a>
                          </div>
                          <a href="wishlist.html" className="btn-icon-wish">
                            <i className="icon-heart" />
                          </a>
                        </div>
                        <h3 className="product-title">
                          <a href="demo35-product.html">Meat</a>
                        </h3>
                        <div className="ratings-container">
                          <div className="product-ratings">
                            <span className="ratings" style={{ width: "0%" }} />
                            {/* End .ratings */}
                            <span className="tooltiptext tooltip-top" />
                          </div>
                          {/* End .product-ratings */}
                        </div>
                        {/* End .product-container */}
                        <div className="price-box">
                          <span className="product-price">$19.00</span>
                        </div>
                        {/* End .price-box */}
                      </div>
                      {/* End .product-details */}
                    </div>
                  </div>
                </div>
                <div className="tab-pane fade" id="cooking">
                  <div
                    className="products-slider owl-carousel owl-theme nav-outer"
                    data-owl-options="{
                                      'dots': false,
                                      'nav': true,
                                      'margin': 0,
                                      'responsive': {
                                          '576': {
                                              'items': 3
                                          },
                                          '768': {
                                              'items': 4
                                          },
                                          '1200': {
                                              'items': 6
                                          }
                                      }
                                  }"
                  >
                    <div className="product-default inner-quickview inner-icon">
                      <figure>
                        <a href="demo35-product.html">
                          <img
                            src="src/assets/images/demoes/demo35/products/product-3.jpg"
                            width={217}
                            height={217}
                            alt="product"
                          />
                        </a>
                        <div className="label-group">
                          <div className="product-label label-hot">HOT</div>
                          <div className="product-label label-sale">-16%</div>
                        </div>
                        <div className="btn-icon-group">
                          <a
                            href="demo35-product.html"
                            className="btn-icon btn-add-cart product-type-simple"
                          >
                            <i className="icon-shopping-cart" />
                          </a>
                        </div>
                        <a
                          href="ajax/product-quick-view.html"
                          className="btn-quickview"
                          title="Quick View"
                        >
                          Quick View
                        </a>
                      </figure>
                      <div className="product-details">
                        <div className="category-wrap">
                          <div className="category-list">
                            <a
                              href="demo35-shop.html"
                              className="product-category"
                            >
                              category
                            </a>
                          </div>
                          <a href="wishlist.html" className="btn-icon-wish">
                            <i className="icon-heart" />
                          </a>
                        </div>
                        <h3 className="product-title">
                          <a href="demo35-product.html">Banana</a>
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
                          <span className="old-price">$129.00</span>
                          <span className="product-price">$108.00</span>
                        </div>
                        {/* End .price-box */}
                      </div>
                      {/* End .product-details */}
                    </div>
                    <div className="product-default inner-quickview inner-icon">
                      <figure>
                        <a href="demo35-product.html">
                          <img
                            src="src/assets/images/demoes/demo35/products/product-4.jpg"
                            width={217}
                            height={217}
                            alt="product"
                          />
                        </a>
                        <div className="label-group">
                          <div className="product-label label-hot">HOT</div>
                        </div>
                        <div className="btn-icon-group">
                          <a
                            href="demo35-product.html"
                            className="btn-icon btn-add-cart product-type-simple"
                          >
                            <i className="icon-shopping-cart" />
                          </a>
                        </div>
                        <a
                          href="ajax/product-quick-view.html"
                          className="btn-quickview"
                          title="Quick View"
                        >
                          Quick View
                        </a>
                      </figure>
                      <div className="product-details">
                        <div className="category-wrap">
                          <div className="category-list">
                            <a
                              href="demo35-shop.html"
                              className="product-category"
                            >
                              category
                            </a>
                          </div>
                          <a href="wishlist.html" className="btn-icon-wish">
                            <i className="icon-heart" />
                          </a>
                        </div>
                        <h3 className="product-title">
                          <a href="demo35-product.html">Leon Bayer</a>
                        </h3>
                        <div className="ratings-container">
                          <div className="product-ratings">
                            <span className="ratings" style={{ width: "0%" }} />
                            {/* End .ratings */}
                            <span className="tooltiptext tooltip-top" />
                          </div>
                          {/* End .product-ratings */}
                        </div>
                        {/* End .product-container */}
                        <div className="price-box">
                          <span className="product-price">$39.00</span>
                        </div>
                        {/* End .price-box */}
                      </div>
                      {/* End .product-details */}
                    </div>
                    <div className="product-default inner-quickview inner-icon">
                      <figure>
                        <a href="demo35-product.html">
                          <img
                            src="src/assets/images/demoes/demo35/products/product-7.jpg"
                            width={217}
                            height={217}
                            alt="product"
                          />
                        </a>
                        <div className="label-group">
                          <div className="product-label label-hot">HOT</div>
                        </div>
                        <div className="btn-icon-group">
                          <a
                            href="demo35-product.html"
                            className="btn-icon btn-add-cart product-type-simple"
                          >
                            <i className="icon-shopping-cart" />
                          </a>
                        </div>
                        <a
                          href="ajax/product-quick-view.html"
                          className="btn-quickview"
                          title="Quick View"
                        >
                          Quick View
                        </a>
                      </figure>
                      <div className="product-details">
                        <div className="category-wrap">
                          <div className="category-list">
                            <a
                              href="demo35-shop.html"
                              className="product-category"
                            >
                              category
                            </a>
                          </div>
                          <a href="wishlist.html" className="btn-icon-wish">
                            <i className="icon-heart" />
                          </a>
                        </div>
                        <h3 className="product-title">
                          <a href="demo35-product.html">Meat</a>
                        </h3>
                        <div className="ratings-container">
                          <div className="product-ratings">
                            <span className="ratings" style={{ width: "0%" }} />
                            {/* End .ratings */}
                            <span className="tooltiptext tooltip-top" />
                          </div>
                          {/* End .product-ratings */}
                        </div>
                        {/* End .product-container */}
                        <div className="price-box">
                          <span className="product-price">$19.00</span>
                        </div>
                        {/* End .price-box */}
                      </div>
                      {/* End .product-details */}
                    </div>
                    <div className="product-default inner-quickview inner-icon">
                      <figure>
                        <a href="demo35-product.html">
                          <img
                            src="src/assets/images/demoes/demo35/products/product-9.jpg"
                            width={217}
                            height={217}
                            alt="product"
                          />
                        </a>
                        <div className="btn-icon-group">
                          <a
                            href="demo35-product.html"
                            className="btn-icon btn-add-cart product-type-simple"
                          >
                            <i className="icon-shopping-cart" />
                          </a>
                        </div>
                        <a
                          href="ajax/product-quick-view.html"
                          className="btn-quickview"
                          title="Quick View"
                        >
                          Quick View
                        </a>
                      </figure>
                      <div className="product-details">
                        <div className="category-wrap">
                          <div className="category-list">
                            <a
                              href="demo35-shop.html"
                              className="product-category"
                            >
                              category
                            </a>
                          </div>
                          <a href="wishlist.html" className="btn-icon-wish">
                            <i className="icon-heart" />
                          </a>
                        </div>
                        <h3 className="product-title">
                          <a href="demo35-product.html">Temperos</a>
                        </h3>
                        <div className="ratings-container">
                          <div className="product-ratings">
                            <span className="ratings" style={{ width: "0%" }} />
                            {/* End .ratings */}
                            <span className="tooltiptext tooltip-top" />
                          </div>
                          {/* End .product-ratings */}
                        </div>
                        {/* End .product-container */}
                        <div className="price-box">
                          <span className="product-price">$39.00</span>
                        </div>
                        {/* End .price-box */}
                      </div>
                      {/* End .product-details */}
                    </div>
                  </div>
                </div>
                <div className="tab-pane fade" id="frozen">
                  <div
                    className="products-slider owl-carousel owl-theme nav-outer"
                    data-owl-options="{
                                      'dots': false,
                                      'nav': true,
                                      'margin': 0,
                                      'responsive': {
                                          '576': {
                                              'items': 3
                                          },
                                          '768': {
                                              'items': 4
                                          },
                                          '1200': {
                                              'items': 6
                                          }
                                      }
                                  }"
                  >
                    <div className="product-default inner-quickview inner-icon">
                      <figure>
                        <a href="demo35-product.html">
                          <img
                            src="src/assets/images/demoes/demo35/products/product-1.jpg"
                            width={217}
                            height={217}
                            alt="product"
                          />
                        </a>
                        <div className="label-group">
                          <div className="product-label label-hot">HOT</div>
                        </div>
                        <div className="btn-icon-group">
                          <a
                            href="demo35-product.html"
                            className="btn-icon btn-add-cart"
                          >
                            <i className="fa fa-arrow-right" />
                          </a>
                        </div>
                        <a
                          href="ajax/product-quick-view.html"
                          className="btn-quickview"
                          title="Quick View"
                        >
                          Quick View
                        </a>
                      </figure>
                      <div className="product-details">
                        <div className="category-wrap">
                          <div className="category-list">
                            <a
                              href="demo35-shop.html"
                              className="product-category"
                            >
                              category
                            </a>
                          </div>
                          <a href="wishlist.html" className="btn-icon-wish">
                            <i className="icon-heart" />
                          </a>
                        </div>
                        <h3 className="product-title">
                          <a href="demo35-product.html">Trafilati al Bronzo</a>
                        </h3>
                        <div className="ratings-container">
                          <div className="product-ratings">
                            <span className="ratings" style={{ width: "0%" }} />
                            {/* End .ratings */}
                            <span className="tooltiptext tooltip-top" />
                          </div>
                          {/* End .product-ratings */}
                        </div>
                        {/* End .product-container */}
                        <div className="price-box">
                          <span className="product-price">$69.00 – $89.00</span>
                        </div>
                        {/* End .price-box */}
                      </div>
                      {/* End .product-details */}
                    </div>
                    <div className="product-default inner-quickview inner-icon">
                      <figure>
                        <a href="demo35-product.html">
                          <img
                            src="src/assets/images/demoes/demo35/products/product-2.jpg"
                            width={217}
                            height={217}
                            alt="product"
                          />
                        </a>
                        <div className="label-group">
                          <div className="product-label label-hot">HOT</div>
                        </div>
                        <div className="btn-icon-group">
                          <a
                            href="demo35-product.html"
                            className="btn-icon btn-add-cart product-type-simple"
                          >
                            <i className="icon-shopping-cart" />
                          </a>
                        </div>
                        <a
                          href="ajax/product-quick-view.html"
                          className="btn-quickview"
                          title="Quick View"
                        >
                          Quick View
                        </a>
                      </figure>
                      <div className="product-details">
                        <div className="category-wrap">
                          <div className="category-list">
                            <a
                              href="demo35-shop.html"
                              className="product-category"
                            >
                              category
                            </a>
                          </div>
                          <a href="wishlist.html" className="btn-icon-wish">
                            <i className="icon-heart" />
                          </a>
                        </div>
                        <h3 className="product-title">
                          <a href="demo35-product.html">Pineapple</a>
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
                          <span className="product-price">$19.00</span>
                        </div>
                        {/* End .price-box */}
                      </div>
                      {/* End .product-details */}
                    </div>
                  </div>
                </div>
                <div className="tab-pane fade" id="fruits">
                  <div
                    className="products-slider owl-carousel owl-theme nav-outer"
                    data-owl-options="{
                                      'dots': false,
                                      'nav': true,
                                      'margin': 0,
                                      'responsive': {
                                          '576': {
                                              'items': 3
                                          },
                                          '768': {
                                              'items': 4
                                          },
                                          '1200': {
                                              'items': 6
                                          }
                                      }
                                  }"
                  >
                    <div className="product-default inner-quickview inner-icon">
                      <figure>
                        <a href="demo35-product.html">
                          <img
                            src="src/assets/images/demoes/demo35/products/product-1.jpg"
                            width={217}
                            height={217}
                            alt="product"
                          />
                        </a>
                        <div className="label-group">
                          <div className="product-label label-hot">HOT</div>
                        </div>
                        <div className="btn-icon-group">
                          <a
                            href="demo35-product.html"
                            className="btn-icon btn-add-cart"
                          >
                            <i className="fa fa-arrow-right" />
                          </a>
                        </div>
                        <a
                          href="ajax/product-quick-view.html"
                          className="btn-quickview"
                          title="Quick View"
                        >
                          Quick View
                        </a>
                      </figure>
                      <div className="product-details">
                        <div className="category-wrap">
                          <div className="category-list">
                            <a
                              href="demo35-shop.html"
                              className="product-category"
                            >
                              category
                            </a>
                          </div>
                          <a href="wishlist.html" className="btn-icon-wish">
                            <i className="icon-heart" />
                          </a>
                        </div>
                        <h3 className="product-title">
                          <a href="demo35-product.html">Trafilati al Bronzo</a>
                        </h3>
                        <div className="ratings-container">
                          <div className="product-ratings">
                            <span className="ratings" style={{ width: "0%" }} />
                            {/* End .ratings */}
                            <span className="tooltiptext tooltip-top" />
                          </div>
                          {/* End .product-ratings */}
                        </div>
                        {/* End .product-container */}
                        <div className="price-box">
                          <span className="product-price">$69.00 – $89.00</span>
                        </div>
                        {/* End .price-box */}
                      </div>
                      {/* End .product-details */}
                    </div>
                    <div className="product-default inner-quickview inner-icon">
                      <figure>
                        <a href="demo35-product.html">
                          <img
                            src="src/assets/images/demoes/demo35/products/product-2.jpg"
                            width={217}
                            height={217}
                            alt="product"
                          />
                        </a>
                        <div className="label-group">
                          <div className="product-label label-hot">HOT</div>
                        </div>
                        <div className="btn-icon-group">
                          <a
                            href="demo35-product.html"
                            className="btn-icon btn-add-cart product-type-simple"
                          >
                            <i className="icon-shopping-cart" />
                          </a>
                        </div>
                        <a
                          href="ajax/product-quick-view.html"
                          className="btn-quickview"
                          title="Quick View"
                        >
                          Quick View
                        </a>
                      </figure>
                      <div className="product-details">
                        <div className="category-wrap">
                          <div className="category-list">
                            <a
                              href="demo35-shop.html"
                              className="product-category"
                            >
                              category
                            </a>
                          </div>
                          <a href="wishlist.html" className="btn-icon-wish">
                            <i className="icon-heart" />
                          </a>
                        </div>
                        <h3 className="product-title">
                          <a href="demo35-product.html">Pineapple</a>
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
                          <span className="product-price">$19.00</span>
                        </div>
                        {/* End .price-box */}
                      </div>
                      {/* End .product-details */}
                    </div>
                    <div className="product-default inner-quickview inner-icon">
                      <figure>
                        <a href="demo35-product.html">
                          <img
                            src="src/assets/images/demoes/demo35/products/product-4.jpg"
                            width={217}
                            height={217}
                            alt="product"
                          />
                        </a>
                        <div className="label-group">
                          <div className="product-label label-hot">HOT</div>
                        </div>
                        <div className="btn-icon-group">
                          <a
                            href="demo35-product.html"
                            className="btn-icon btn-add-cart product-type-simple"
                          >
                            <i className="icon-shopping-cart" />
                          </a>
                        </div>
                        <a
                          href="ajax/product-quick-view.html"
                          className="btn-quickview"
                          title="Quick View"
                        >
                          Quick View
                        </a>
                      </figure>
                      <div className="product-details">
                        <div className="category-wrap">
                          <div className="category-list">
                            <a
                              href="demo35-shop.html"
                              className="product-category"
                            >
                              category
                            </a>
                          </div>
                          <a href="wishlist.html" className="btn-icon-wish">
                            <i className="icon-heart" />
                          </a>
                        </div>
                        <h3 className="product-title">
                          <a href="demo35-product.html">Leon Bayer</a>
                        </h3>
                        <div className="ratings-container">
                          <div className="product-ratings">
                            <span className="ratings" style={{ width: "0%" }} />
                            {/* End .ratings */}
                            <span className="tooltiptext tooltip-top" />
                          </div>
                          {/* End .product-ratings */}
                        </div>
                        {/* End .product-container */}
                        <div className="price-box">
                          <span className="product-price">$39.00</span>
                        </div>
                        {/* End .price-box */}
                      </div>
                      {/* End .product-details */}
                    </div>
                    <div className="product-default inner-quickview inner-icon">
                      <figure>
                        <a href="demo35-product.html">
                          <img
                            src="src/assets/images/demoes/demo35/products/product-6.jpg"
                            width={217}
                            height={217}
                            alt="product"
                          />
                        </a>
                        <div className="btn-icon-group">
                          <a
                            href="demo35-product.html"
                            className="btn-icon btn-add-cart product-type-simple"
                          >
                            <i className="icon-shopping-cart" />
                          </a>
                        </div>
                        <a
                          href="ajax/product-quick-view.html"
                          className="btn-quickview"
                          title="Quick View"
                        >
                          Quick View
                        </a>
                      </figure>
                      <div className="product-details">
                        <div className="category-wrap">
                          <div className="category-list">
                            <a
                              href="demo35-shop.html"
                              className="product-category"
                            >
                              category
                            </a>
                          </div>
                          <a href="wishlist.html" className="btn-icon-wish">
                            <i className="icon-heart" />
                          </a>
                        </div>
                        <h3 className="product-title">
                          <a href="demo35-product.html">Fonte de fibras</a>
                        </h3>
                        <div className="ratings-container">
                          <div className="product-ratings">
                            <span className="ratings" style={{ width: "0%" }} />
                            {/* End .ratings */}
                            <span className="tooltiptext tooltip-top" />
                          </div>
                          {/* End .product-ratings */}
                        </div>
                        {/* End .product-container */}
                        <div className="price-box">
                          <span className="product-price">$129.00</span>
                        </div>
                        {/* End .price-box */}
                      </div>
                      {/* End .product-details */}
                    </div>
                    <div className="product-default inner-quickview inner-icon">
                      <figure>
                        <a href="demo35-product.html">
                          <img
                            src="src/assets/images/demoes/demo35/products/product-7.jpg"
                            width={217}
                            height={217}
                            alt="product"
                          />
                        </a>
                        <div className="label-group">
                          <div className="product-label label-hot">HOT</div>
                        </div>
                        <div className="btn-icon-group">
                          <a
                            href="demo35-product.html"
                            className="btn-icon btn-add-cart product-type-simple"
                          >
                            <i className="icon-shopping-cart" />
                          </a>
                        </div>
                        <a
                          href="ajax/product-quick-view.html"
                          className="btn-quickview"
                          title="Quick View"
                        >
                          Quick View
                        </a>
                      </figure>
                      <div className="product-details">
                        <div className="category-wrap">
                          <div className="category-list">
                            <a
                              href="demo35-shop.html"
                              className="product-category"
                            >
                              category
                            </a>
                          </div>
                          <a href="wishlist.html" className="btn-icon-wish">
                            <i className="icon-heart" />
                          </a>
                        </div>
                        <h3 className="product-title">
                          <a href="demo35-product.html">Meat</a>
                        </h3>
                        <div className="ratings-container">
                          <div className="product-ratings">
                            <span className="ratings" style={{ width: "0%" }} />
                            {/* End .ratings */}
                            <span className="tooltiptext tooltip-top" />
                          </div>
                          {/* End .product-ratings */}
                        </div>
                        {/* End .product-container */}
                        <div className="price-box">
                          <span className="product-price">$19.00</span>
                        </div>
                        {/* End .price-box */}
                      </div>
                      {/* End .product-details */}
                    </div>
                  </div>
                </div>
                <div className="tab-pane fade" id="vegetables">
                  <div
                    className="products-slider owl-carousel owl-theme nav-outer"
                    data-owl-options="{
                                      'dots': false,
                                      'nav': true,
                                      'margin': 0,
                                      'responsive': {
                                          '576': {
                                              'items': 3
                                          },
                                          '768': {
                                              'items': 4
                                          },
                                          '1200': {
                                              'items': 6
                                          }
                                      }
                                  }"
                  >
                    <div className="product-default inner-quickview inner-icon">
                      <figure>
                        <a href="demo35-product.html">
                          <img
                            src="src/assets/images/demoes/demo35/products/product-7.jpg"
                            width={217}
                            height={217}
                            alt="product"
                          />
                        </a>
                        <div className="label-group">
                          <div className="product-label label-hot">HOT</div>
                        </div>
                        <div className="btn-icon-group">
                          <a
                            href="demo35-product.html"
                            className="btn-icon btn-add-cart product-type-simple"
                          >
                            <i className="icon-shopping-cart" />
                          </a>
                        </div>
                        <a
                          href="ajax/product-quick-view.html"
                          className="btn-quickview"
                          title="Quick View"
                        >
                          Quick View
                        </a>
                      </figure>
                      <div className="product-details">
                        <div className="category-wrap">
                          <div className="category-list">
                            <a
                              href="demo35-shop.html"
                              className="product-category"
                            >
                              category
                            </a>
                          </div>
                          <a href="wishlist.html" className="btn-icon-wish">
                            <i className="icon-heart" />
                          </a>
                        </div>
                        <h3 className="product-title">
                          <a href="demo35-product.html">Meat</a>
                        </h3>
                        <div className="ratings-container">
                          <div className="product-ratings">
                            <span className="ratings" style={{ width: "0%" }} />
                            {/* End .ratings */}
                            <span className="tooltiptext tooltip-top" />
                          </div>
                          {/* End .product-ratings */}
                        </div>
                        {/* End .product-container */}
                        <div className="price-box">
                          <span className="product-price">$19.00</span>
                        </div>
                        {/* End .price-box */}
                      </div>
                      {/* End .product-details */}
                    </div>
                    <div className="product-default inner-quickview inner-icon">
                      <figure>
                        <a href="demo35-product.html">
                          <img
                            src="src/assets/images/demoes/demo35/products/product-9.jpg"
                            width={217}
                            height={217}
                            alt="product"
                          />
                        </a>
                        <div className="btn-icon-group">
                          <a
                            href="demo35-product.html"
                            className="btn-icon btn-add-cart product-type-simple"
                          >
                            <i className="icon-shopping-cart" />
                          </a>
                        </div>
                        <a
                          href="ajax/product-quick-view.html"
                          className="btn-quickview"
                          title="Quick View"
                        >
                          Quick View
                        </a>
                      </figure>
                      <div className="product-details">
                        <div className="category-wrap">
                          <div className="category-list">
                            <a
                              href="demo35-shop.html"
                              className="product-category"
                            >
                              category
                            </a>
                          </div>
                          <a href="wishlist.html" className="btn-icon-wish">
                            <i className="icon-heart" />
                          </a>
                        </div>
                        <h3 className="product-title">
                          <a href="demo35-product.html">Temperos</a>
                        </h3>
                        <div className="ratings-container">
                          <div className="product-ratings">
                            <span className="ratings" style={{ width: "0%" }} />
                            {/* End .ratings */}
                            <span className="tooltiptext tooltip-top" />
                          </div>
                          {/* End .product-ratings */}
                        </div>
                        {/* End .product-container */}
                        <div className="price-box">
                          <span className="product-price">$39.00</span>
                        </div>
                        {/* End .price-box */}
                      </div>
                      {/* End .product-details */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="special-section">
        <div className="container">
          <div
            className="appear-animate"
            data-animation-name="fadeIn"
            data-animation-delay={200}
          >
            <h2 className="section-title">This Week's Specials</h2>
            <p className="section-info font2">
              All our new arrivals in a exclusive brand selection
            </p>
            <div className="products-container bg-white mb-4 rounded">
              <div className="row">
                <div
                  className="products-slider owl-carousel owl-theme nav-outer"
                  data-owl-options="{
                              'dots': false,
                              'nav': true,
                              'margin': 0,
                              'responsive': {
                                  '576': {
                                      'items': 3
                                  },
                                  '768': {
                                      'items': 4
                                  },
                                  '1200': {
                                      'items': 6
                                  }
                              }
                          }"
                >
                  <div className="product-default inner-quickview inner-icon">
                    <figure>
                      <a href="demo35-product.html">
                        <img
                          src="src/assets/images/demoes/demo35/products/product-9.jpg"
                          width={217}
                          height={217}
                          alt="product"
                        />
                      </a>
                      <div className="btn-icon-group">
                        <a
                          href="demo35-product.html"
                          className="btn-icon btn-add-cart product-type-simple"
                        >
                          <i className="icon-shopping-cart" />
                        </a>
                      </div>
                      <a
                        href="ajax/product-quick-view.html"
                        className="btn-quickview"
                        title="Quick View"
                      >
                        Quick View
                      </a>
                    </figure>
                    <div className="product-details">
                      <div className="category-wrap">
                        <div className="category-list">
                          <a
                            href="demo35-shop.html"
                            className="product-category"
                          >
                            category
                          </a>
                        </div>
                        <a href="wishlist.html" className="btn-icon-wish">
                          <i className="icon-heart" />
                        </a>
                      </div>
                      <h3 className="product-title">
                        <a href="demo35-product.html">Temperos</a>
                      </h3>
                      <div className="ratings-container">
                        <div className="product-ratings">
                          <span className="ratings" style={{ width: "0%" }} />
                          {/* End .ratings */}
                          <span className="tooltiptext tooltip-top" />
                        </div>
                        {/* End .product-ratings */}
                      </div>
                      {/* End .product-container */}
                      <div className="price-box">
                        <span className="product-price">$39.00</span>
                      </div>
                      {/* End .price-box */}
                    </div>
                    {/* End .product-details */}
                  </div>
                  <div className="product-default inner-quickview inner-icon">
                    <figure>
                      <a href="demo35-product.html">
                        <img
                          src="src/assets/images/demoes/demo35/products/product-10.jpg"
                          width={217}
                          height={217}
                          alt="product"
                        />
                      </a>
                      <div className="label-group">
                        <div className="product-label label-hot">HOT</div>
                      </div>
                      <div className="btn-icon-group">
                        <a
                          href="demo35-product.html"
                          className="btn-icon btn-add-cart product-type-simple"
                        >
                          <i className="icon-shopping-cart" />
                        </a>
                      </div>
                      <a
                        href="ajax/product-quick-view.html"
                        className="btn-quickview"
                        title="Quick View"
                      >
                        Quick View
                      </a>
                    </figure>
                    <div className="product-details">
                      <div className="category-wrap">
                        <div className="category-list">
                          <a
                            href="demo35-shop.html"
                            className="product-category"
                          >
                            category
                          </a>
                        </div>
                        <a href="wishlist.html" className="btn-icon-wish">
                          <i className="icon-heart" />
                        </a>
                      </div>
                      <h3 className="product-title">
                        <a href="demo35-product.html">Clasico</a>
                      </h3>
                      <div className="ratings-container">
                        <div className="product-ratings">
                          <span className="ratings" style={{ width: "0%" }} />
                          {/* End .ratings */}
                          <span className="tooltiptext tooltip-top" />
                        </div>
                        {/* End .product-ratings */}
                      </div>
                      {/* End .product-container */}
                      <div className="price-box">
                        <span className="product-price">$119.00</span>
                      </div>
                      {/* End .price-box */}
                    </div>
                    {/* End .product-details */}
                  </div>
                  <div className="product-default inner-quickview inner-icon">
                    <figure>
                      <a href="demo35-product.html">
                        <img
                          src="src/assets/images/demoes/demo35/products/product-11.jpg"
                          width={217}
                          height={217}
                          alt="product"
                        />
                      </a>
                      <div className="btn-icon-group">
                        <a
                          href="demo35-product.html"
                          className="btn-icon btn-add-cart"
                        >
                          <i className="fa fa-arrow-right" />
                        </a>
                      </div>
                      <a
                        href="ajax/product-quick-view.html"
                        className="btn-quickview"
                        title="Quick View"
                      >
                        Quick View
                      </a>
                    </figure>
                    <div className="product-details">
                      <div className="category-wrap">
                        <div className="category-list">
                          <a
                            href="demo35-shop.html"
                            className="product-category"
                          >
                            category
                          </a>
                        </div>
                        <a href="wishlist.html" className="btn-icon-wish">
                          <i className="icon-heart" />
                        </a>
                      </div>
                      <h3 className="product-title">
                        <a href="demo35-product.html">Coffee</a>
                      </h3>
                      <div className="ratings-container">
                        <div className="product-ratings">
                          <span className="ratings" style={{ width: "0%" }} />
                          {/* End .ratings */}
                          <span className="tooltiptext tooltip-top" />
                        </div>
                        {/* End .product-ratings */}
                      </div>
                      {/* End .product-container */}
                      <div className="price-box">
                        <span className="product-price">$34.00</span>
                      </div>
                      {/* End .price-box */}
                    </div>
                    {/* End .product-details */}
                  </div>
                  <div className="product-default inner-quickview inner-icon">
                    <figure>
                      <a href="demo35-product.html">
                        <img
                          src="src/assets/images/demoes/demo35/products/product-12.jpg"
                          width={217}
                          height={217}
                          alt="product"
                        />
                      </a>
                      <div className="btn-icon-group">
                        <a
                          href="demo35-product.html"
                          className="btn-icon btn-add-cart product-type-simple"
                        >
                          <i className="icon-shopping-cart" />
                        </a>
                      </div>
                      <a
                        href="ajax/product-quick-view.html"
                        className="btn-quickview"
                        title="Quick View"
                      >
                        Quick View
                      </a>
                    </figure>
                    <div className="product-details">
                      <div className="category-wrap">
                        <div className="category-list">
                          <a
                            href="demo35-shop.html"
                            className="product-category"
                          >
                            category
                          </a>
                        </div>
                        <a href="wishlist.html" className="btn-icon-wish">
                          <i className="icon-heart" />
                        </a>
                      </div>
                      <h3 className="product-title">
                        <a href="demo35-product.html">Grape</a>
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
                        <span className="product-price">$29.00</span>
                      </div>
                      {/* End .price-box */}
                    </div>
                    {/* End .product-details */}
                  </div>
                  <div className="product-default inner-quickview inner-icon">
                    <figure>
                      <a href="demo35-product.html">
                        <img
                          src="src/assets/images/demoes/demo35/products/product-13.jpg"
                          width={217}
                          height={217}
                          alt="product"
                        />
                      </a>
                      <div className="label-group">
                        <div className="product-label label-hot">HOT</div>
                      </div>
                      <div className="btn-icon-group">
                        <a
                          href="demo35-product.html"
                          className="btn-icon btn-add-cart product-type-simple"
                        >
                          <i className="icon-shopping-cart" />
                        </a>
                      </div>
                      <a
                        href="ajax/product-quick-view.html"
                        className="btn-quickview"
                        title="Quick View"
                      >
                        Quick View
                      </a>
                    </figure>
                    <div className="product-details">
                      <div className="category-wrap">
                        <div className="category-list">
                          <a
                            href="demo35-shop.html"
                            className="product-category"
                          >
                            category
                          </a>
                        </div>
                        <a href="wishlist.html" className="btn-icon-wish">
                          <i className="icon-heart" />
                        </a>
                      </div>
                      <h3 className="product-title">
                        <a href="demo35-product.html">Magic Toast</a>
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
                        <span className="old-price">$29.00</span>
                        <span className="product-price">$18.00</span>
                      </div>
                      {/* End .price-box */}
                    </div>
                    {/* End .product-details */}
                  </div>
                  <div className="product-default inner-quickview inner-icon">
                    <figure>
                      <a href="demo35-product.html">
                        <img
                          src="src/assets/images/demoes/demo35/products/product-14.jpg"
                          width={217}
                          height={217}
                          alt="product"
                        />
                      </a>
                      <div className="btn-icon-group">
                        <a
                          href="demo35-product.html"
                          className="btn-icon btn-add-cart product-type-simple"
                        >
                          <i className="icon-shopping-cart" />
                        </a>
                      </div>
                      <a
                        href="ajax/product-quick-view.html"
                        className="btn-quickview"
                        title="Quick View"
                      >
                        Quick View
                      </a>
                    </figure>
                    <div className="product-details">
                      <div className="category-wrap">
                        <div className="category-list">
                          <a
                            href="demo35-shop.html"
                            className="product-category"
                          >
                            category
                          </a>
                        </div>
                        <a href="wishlist.html" className="btn-icon-wish">
                          <i className="icon-heart" />
                        </a>
                      </div>
                      <h3 className="product-title">
                        <a href="demo35-product.html">Water Melon</a>
                      </h3>
                      <div className="ratings-container">
                        <div className="product-ratings">
                          <span className="ratings" style={{ width: "80%" }} />
                          {/* End .ratings */}
                          <span className="tooltiptext tooltip-top" />
                        </div>
                        {/* End .product-ratings */}
                      </div>
                      {/* End .product-container */}
                      <div className="price-box">
                        <span className="product-price">$12.00</span>
                      </div>
                      {/* End .price-box */}
                    </div>
                    {/* End .product-details */}
                  </div>
                  <div className="product-default inner-quickview inner-icon">
                    <figure>
                      <a href="demo35-product.html">
                        <img
                          src="src/assets/images/demoes/demo35/products/product-15.jpg"
                          width={217}
                          height={217}
                          alt="product"
                        />
                      </a>
                      <div className="label-group">
                        <div className="product-label label-sale">-17%</div>
                      </div>
                      <div className="btn-icon-group">
                        <a
                          href="demo35-product.html"
                          className="btn-icon btn-add-cart product-type-simple"
                        >
                          <i className="icon-shopping-cart" />
                        </a>
                      </div>
                      <a
                        href="ajax/product-quick-view.html"
                        className="btn-quickview"
                        title="Quick View"
                      >
                        Quick View
                      </a>
                    </figure>
                    <div className="product-details">
                      <div className="category-wrap">
                        <div className="category-list">
                          <a
                            href="demo35-shop.html"
                            className="product-category"
                          >
                            category
                          </a>
                        </div>
                        <a href="wishlist.html" className="btn-icon-wish">
                          <i className="icon-heart" />
                        </a>
                      </div>
                      <h3 className="product-title">
                        <a href="demo35-product.html">Melon</a>
                      </h3>
                      <div className="ratings-container">
                        <div className="product-ratings">
                          <span className="ratings" style={{ width: "0%" }} />
                          {/* End .ratings */}
                          <span className="tooltiptext tooltip-top" />
                        </div>
                        {/* End .product-ratings */}
                      </div>
                      {/* End .product-container */}
                      <div className="price-box">
                        <span className="old-price">$129.00</span>
                        <span className="product-price">$109.00</span>
                      </div>
                      {/* End .price-box */}
                    </div>
                    {/* End .product-details */}
                  </div>
                  <div className="product-default inner-quickview inner-icon">
                    <figure>
                      <a href="demo35-product.html">
                        <img
                          src="src/assets/images/demoes/demo35/products/product-16.jpg"
                          width={217}
                          height={217}
                          alt="product"
                        />
                      </a>
                      <div className="label-group">
                        <div className="product-label label-sale">-17%</div>
                      </div>
                      <div className="btn-icon-group">
                        <a
                          href="demo35-product.html"
                          className="btn-icon btn-add-cart product-type-simple"
                        >
                          <i className="icon-shopping-cart" />
                        </a>
                      </div>
                      <a
                        href="ajax/product-quick-view.html"
                        className="btn-quickview"
                        title="Quick View"
                      >
                        Quick View
                      </a>
                    </figure>
                    <div className="product-details">
                      <div className="category-wrap">
                        <div className="category-list">
                          <a
                            href="demo35-shop.html"
                            className="product-category"
                          >
                            category
                          </a>
                        </div>
                        <a href="wishlist.html" className="btn-icon-wish">
                          <i className="icon-heart" />
                        </a>
                      </div>
                      <h3 className="product-title">
                        <a href="demo35-product.html">Raw Meat</a>
                      </h3>
                      <div className="ratings-container">
                        <div className="product-ratings">
                          <span className="ratings" style={{ width: "0%" }} />
                          {/* End .ratings */}
                          <span className="tooltiptext tooltip-top" />
                        </div>
                        {/* End .product-ratings */}
                      </div>
                      {/* End .product-container */}
                      <div className="price-box">
                        <span className="old-price">$59.00</span>
                        <span className="product-price">$49.00</span>
                      </div>
                      {/* End .price-box */}
                    </div>
                    {/* End .product-details */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-8">
              <div
                className="banner banner1 rounded m-b-4"
                style={{ backgroundColor: "#d9e1e1" }}
              >
                <figure>
                  <img
                    src="src/assets/images/demoes/demo35/banners/banner-1.png"
                    alt="banner"
                    width={939}
                    height={235}
                  />
                </figure>
                <div className="banner-layer banner-layer-middle banner-layer-right">
                  <h4
                    className="font-weight-normal text-body appear-animate"
                    data-animation-name="fadeInDownShorter"
                    data-animation-delay={100}
                  >
                    Exclusive Product New Arrival
                  </h4>
                  <h2
                    className="m-l-n-1 p-r-5 m-r-2 appear-animate"
                    data-animation-name="fadeInUpShorter"
                    data-animation-delay={600}
                  >
                    Organic Coffee
                  </h2>
                  <div
                    className="position-relative appear-animate"
                    data-animation-name="fadeInRightShorter"
                    data-animation-delay={1100}
                  >
                    <h3 className="text-uppercase">Special Blend</h3>
                    <h5 className="rotate-text font-weight-normal text-primary">
                      Fresh!
                    </h5>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div
                className="banner banner2 rounded mb-3"
                style={{ backgroundColor: "#b28475" }}
              >
                <figure>
                  <img
                    src="src/assets/images/demoes/demo35/banners/banner-2.png"
                    alt="banner"
                    width={460}
                    height={235}
                  />
                </figure>
                <div className="banner-layer banner-layer-middle banner-layer-right">
                  <h4
                    className="font-weight-normal appear-animiate"
                    data-animation-name="fadeInUpShorter"
                    data-animation-delay={200}
                  >
                    Stay Healthy
                  </h4>
                  <h2
                    className="text-white appear-animate"
                    data-animation-name="fadeInUpShorter"
                    data-animation-delay={400}
                  >
                    Low Carb
                  </h2>
                  <h3
                    className="text-white text-uppercase mb-2 appear-animate"
                    data-animation-name="fadeInUpShorter"
                    data-animation-delay={600}
                  >
                    Strawberry
                  </h3>
                  <h5
                    className="font-weight-normal text-white mb-0 appear-animate"
                    data-animation-name="fadeInUpShorter"
                    data-animation-delay={800}
                  >
                    Sugar-Free
                  </h5>
                </div>
              </div>
            </div>
          </div>
          <h2 className="section-title">Special Offers</h2>
          <p className="section-info font2">
            All our new arrivals in a exclusive brand selection
          </p>
          <div className="row offer-products">
            <div
              className="col-md-4 appear-animate"
              data-animation-name="fadeInRightShorter"
              data-animation-delay={100}
            >
              <div className="count-deal bg-white rounded mb-md-0">
                <div className="product-default">
                  <figure>
                    <a href="demo35-product.html">
                      <img
                        src="src/assets/images/demoes/demo35/products/product-16.jpg"
                        alt="product"
                        width={1200}
                        height={1200}
                      />
                    </a>
                    <div className="product-countdown-container">
                      <span className="product-countdown-title">
                        offer ends in:
                      </span>
                      <div
                        className="product-countdown countdown-compact"
                        data-until="2021, 10, 5"
                        data-compact="true"
                      ></div>
                      {/* End .product-countdown */}
                    </div>
                    {/* End .product-countdown-container */}
                  </figure>
                  <div className="product-details">
                    <div className="category-list">
                      <a href="demo35-shop.html" className="product-category">
                        Category
                      </a>
                    </div>
                    <h3 className="product-title">
                      <a href="demo35-product.html">Raw Meat</a>
                    </h3>
                    <div className="ratings-container">
                      <div className="product-ratings">
                        <span className="ratings" style={{ width: "80%" }} />
                        {/* End .ratings */}
                        <span className="tooltiptext tooltip-top" />
                      </div>
                      {/* End .product-ratings */}
                    </div>
                    {/* End .product-container */}
                    <div className="price-box">
                      <del className="old-price">$59.00</del>
                      <span className="product-price">$49.00</span>
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
                        href="product.html"
                        className="btn-icon btn-add-cart product-type-simple"
                      >
                        <i className="icon-shopping-cart" />
                        <span>ADD TO CART</span>
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
            </div>
            <div
              className="col-md-8 appear-animate"
              data-animation-name="fadeInLeftShorter"
              data-animation-delay={300}
            >
              <div className="custom-products bg-white rounded">
                <div className="row">
                  <div className="col-6 col-sm-4 col-xl-3">
                    <div className="product-default inner-quickview inner-icon">
                      <figure>
                        <a href="demo35-product.html">
                          <img
                            src="src/assets/images/demoes/demo35/products/product-6.jpg"
                            width={217}
                            height={217}
                            alt="product"
                          />
                        </a>
                        <div className="btn-icon-group">
                          <a
                            href="demo35-product.html"
                            className="btn-icon btn-add-cart product-type-simple"
                          >
                            <i className="icon-shopping-cart" />
                          </a>
                        </div>
                        <a
                          href="ajax/product-quick-view.html"
                          className="btn-quickview"
                          title="Quick View"
                        >
                          Quick View
                        </a>
                      </figure>
                      <div className="product-details">
                        <div className="category-wrap">
                          <div className="category-list">
                            <a
                              href="demo35-shop.html"
                              className="product-category"
                            >
                              category
                            </a>
                          </div>
                          <a href="wishlist.html" className="btn-icon-wish">
                            <i className="icon-heart" />
                          </a>
                        </div>
                        <h3 className="product-title">
                          <a href="demo35-product.html">Fonte de fibras</a>
                        </h3>
                        <div className="ratings-container">
                          <div className="product-ratings">
                            <span className="ratings" style={{ width: "0%" }} />
                            {/* End .ratings */}
                            <span className="tooltiptext tooltip-top" />
                          </div>
                          {/* End .product-ratings */}
                        </div>
                        {/* End .product-container */}
                        <div className="price-box">
                          <span className="product-price">$129.00</span>
                        </div>
                        {/* End .price-box */}
                      </div>
                      {/* End .product-details */}
                    </div>
                  </div>
                  <div className="col-6 col-sm-4 col-xl-3">
                    <div className="product-default inner-quickview inner-icon">
                      <figure>
                        <a href="demo35-product.html">
                          <img
                            src="src/assets/images/demoes/demo35/products/product-7.jpg"
                            width={217}
                            height={217}
                            alt="product"
                          />
                        </a>
                        <div className="label-group">
                          <div className="product-label label-hot">HOT</div>
                        </div>
                        <div className="btn-icon-group">
                          <a
                            href="demo35-product.html"
                            className="btn-icon btn-add-cart product-type-simple"
                          >
                            <i className="icon-shopping-cart" />
                          </a>
                        </div>
                        <a
                          href="ajax/product-quick-view.html"
                          className="btn-quickview"
                          title="Quick View"
                        >
                          Quick View
                        </a>
                      </figure>
                      <div className="product-details">
                        <div className="category-wrap">
                          <div className="category-list">
                            <a
                              href="demo35-shop.html"
                              className="product-category"
                            >
                              category
                            </a>
                          </div>
                          <a href="wishlist.html" className="btn-icon-wish">
                            <i className="icon-heart" />
                          </a>
                        </div>
                        <h3 className="product-title">
                          <a href="demo35-product.html">Meat</a>
                        </h3>
                        <div className="ratings-container">
                          <div className="product-ratings">
                            <span className="ratings" style={{ width: "0%" }} />
                            {/* End .ratings */}
                            <span className="tooltiptext tooltip-top" />
                          </div>
                          {/* End .product-ratings */}
                        </div>
                        {/* End .product-container */}
                        <div className="price-box">
                          <span className="product-price">$19.00</span>
                        </div>
                        {/* End .price-box */}
                      </div>
                      {/* End .product-details */}
                    </div>
                  </div>
                  <div className="col-6 col-sm-4 col-xl-3">
                    <div className="product-default inner-quickview inner-icon">
                      <figure>
                        <a href="demo35-product.html">
                          <img
                            src="src/assets/images/demoes/demo35/products/product-8.jpg"
                            width={217}
                            height={217}
                            alt="product"
                          />
                        </a>
                        <div className="label-group">
                          <div className="product-label label-hot">HOT</div>
                        </div>
                        <div className="btn-icon-group">
                          <a
                            href="demo35-product.html"
                            className="btn-icon btn-add-cart product-type-simple"
                          >
                            <i className="icon-shopping-cart" />
                          </a>
                        </div>
                        <a
                          href="ajax/product-quick-view.html"
                          className="btn-quickview"
                          title="Quick View"
                        >
                          Quick View
                        </a>
                      </figure>
                      <div className="product-details">
                        <div className="category-wrap">
                          <div className="category-list">
                            <a
                              href="demo35-shop.html"
                              className="product-category"
                            >
                              category
                            </a>
                          </div>
                          <a href="wishlist.html" className="btn-icon-wish">
                            <i className="icon-heart" />
                          </a>
                        </div>
                        <h3 className="product-title">
                          <a href="demo35-product.html">Coconut</a>
                        </h3>
                        <div className="ratings-container">
                          <div className="product-ratings">
                            <span className="ratings" style={{ width: "0%" }} />
                            {/* End .ratings */}
                            <span className="tooltiptext tooltip-top" />
                          </div>
                          {/* End .product-ratings */}
                        </div>
                        {/* End .product-container */}
                        <div className="price-box">
                          <span className="product-price">$25.00</span>
                        </div>
                        {/* End .price-box */}
                      </div>
                      {/* End .product-details */}
                    </div>
                  </div>
                  <div className="col-6 col-sm-4 col-xl-3">
                    <div className="product-default inner-quickview inner-icon">
                      <figure>
                        <a href="demo35-product.html">
                          <img
                            src="src/assets/images/demoes/demo35/products/product-1.jpg"
                            width={217}
                            height={217}
                            alt="product"
                          />
                        </a>
                        <div className="label-group">
                          <div className="product-label label-hot">HOT</div>
                        </div>
                        <div className="btn-icon-group">
                          <a
                            href="demo35-product.html"
                            className="btn-icon btn-add-cart"
                          >
                            <i className="fa fa-arrow-right" />
                          </a>
                        </div>
                        <a
                          href="ajax/product-quick-view.html"
                          className="btn-quickview"
                          title="Quick View"
                        >
                          Quick View
                        </a>
                      </figure>
                      <div className="product-details">
                        <div className="category-wrap">
                          <div className="category-list">
                            <a
                              href="demo35-shop.html"
                              className="product-category"
                            >
                              category
                            </a>
                          </div>
                          <a href="wishlist.html" className="btn-icon-wish">
                            <i className="icon-heart" />
                          </a>
                        </div>
                        <h3 className="product-title">
                          <a href="demo35-product.html">Trafilati al Bronzo</a>
                        </h3>
                        <div className="ratings-container">
                          <div className="product-ratings">
                            <span className="ratings" style={{ width: "0%" }} />
                            {/* End .ratings */}
                            <span className="tooltiptext tooltip-top" />
                          </div>
                          {/* End .product-ratings */}
                        </div>
                        {/* End .product-container */}
                        <div className="price-box">
                          <span className="product-price">$69.00 – $89.00</span>
                        </div>
                        {/* End .price-box */}
                      </div>
                      {/* End .product-details */}
                    </div>
                  </div>
                  <div className="col-6 col-sm-4 col-xl-3">
                    <div className="product-default inner-quickview inner-icon">
                      <figure>
                        <a href="demo35-product.html">
                          <img
                            src="src/assets/images/demoes/demo35/products/product-2.jpg"
                            width={217}
                            height={217}
                            alt="product"
                          />
                        </a>
                        <div className="label-group">
                          <div className="product-label label-hot">HOT</div>
                        </div>
                        <div className="btn-icon-group">
                          <a
                            href="demo35-product.html"
                            className="btn-icon btn-add-cart product-type-simple"
                          >
                            <i className="icon-shopping-cart" />
                          </a>
                        </div>
                        <a
                          href="ajax/product-quick-view.html"
                          className="btn-quickview"
                          title="Quick View"
                        >
                          Quick View
                        </a>
                      </figure>
                      <div className="product-details">
                        <div className="category-wrap">
                          <div className="category-list">
                            <a
                              href="demo35-shop.html"
                              className="product-category"
                            >
                              category
                            </a>
                          </div>
                          <a href="wishlist.html" className="btn-icon-wish">
                            <i className="icon-heart" />
                          </a>
                        </div>
                        <h3 className="product-title">
                          <a href="demo35-product.html">Pineapple</a>
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
                          <span className="product-price">$19.00</span>
                        </div>
                        {/* End .price-box */}
                      </div>
                      {/* End .product-details */}
                    </div>
                  </div>
                  <div className="col-6 col-sm-4 col-xl-3">
                    <div className="product-default inner-quickview inner-icon">
                      <figure>
                        <a href="demo35-product.html">
                          <img
                            src="src/assets/images/demoes/demo35/products/product-3.jpg"
                            width={217}
                            height={217}
                            alt="product"
                          />
                        </a>
                        <div className="label-group">
                          <div className="product-label label-hot">HOT</div>
                          <div className="product-label label-sale">-16%</div>
                        </div>
                        <div className="btn-icon-group">
                          <a
                            href="demo35-product.html"
                            className="btn-icon btn-add-cart product-type-simple"
                          >
                            <i className="icon-shopping-cart" />
                          </a>
                        </div>
                        <a
                          href="ajax/product-quick-view.html"
                          className="btn-quickview"
                          title="Quick View"
                        >
                          Quick View
                        </a>
                      </figure>
                      <div className="product-details">
                        <div className="category-wrap">
                          <div className="category-list">
                            <a
                              href="demo35-shop.html"
                              className="product-category"
                            >
                              category
                            </a>
                          </div>
                          <a href="wishlist.html" className="btn-icon-wish">
                            <i className="icon-heart" />
                          </a>
                        </div>
                        <h3 className="product-title">
                          <a href="demo35-product.html">Banana</a>
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
                          <span className="old-price">$129.00</span>
                          <span className="product-price">$108.00</span>
                        </div>
                        {/* End .price-box */}
                      </div>
                      {/* End .product-details */}
                    </div>
                  </div>
                  <div className="col-6 col-sm-4 col-xl-3">
                    <div className="product-default inner-quickview inner-icon">
                      <figure>
                        <a href="demo35-product.html">
                          <img
                            src="src/assets/images/demoes/demo35/products/product-4.jpg"
                            width={217}
                            height={217}
                            alt="product"
                          />
                        </a>
                        <div className="label-group">
                          <div className="product-label label-hot">HOT</div>
                        </div>
                        <div className="btn-icon-group">
                          <a
                            href="demo35-product.html"
                            className="btn-icon btn-add-cart product-type-simple"
                          >
                            <i className="icon-shopping-cart" />
                          </a>
                        </div>
                        <a
                          href="ajax/product-quick-view.html"
                          className="btn-quickview"
                          title="Quick View"
                        >
                          Quick View
                        </a>
                      </figure>
                      <div className="product-details">
                        <div className="category-wrap">
                          <div className="category-list">
                            <a
                              href="demo35-shop.html"
                              className="product-category"
                            >
                              category
                            </a>
                          </div>
                          <a href="wishlist.html" className="btn-icon-wish">
                            <i className="icon-heart" />
                          </a>
                        </div>
                        <h3 className="product-title">
                          <a href="demo35-product.html">Leon Bayer</a>
                        </h3>
                        <div className="ratings-container">
                          <div className="product-ratings">
                            <span className="ratings" style={{ width: "0%" }} />
                            {/* End .ratings */}
                            <span className="tooltiptext tooltip-top" />
                          </div>
                          {/* End .product-ratings */}
                        </div>
                        {/* End .product-container */}
                        <div className="price-box">
                          <span className="product-price">$39.00</span>
                        </div>
                        {/* End .price-box */}
                      </div>
                      {/* End .product-details */}
                    </div>
                  </div>
                  <div className="col-6 col-sm-4 col-xl-3">
                    <div className="product-default inner-quickview inner-icon">
                      <figure>
                        <a href="demo35-product.html">
                          <img
                            src="src/assets/images/demoes/demo35/products/product-5.jpg"
                            width={217}
                            height={217}
                            alt="product"
                          />
                        </a>
                        <div className="label-group">
                          <div className="product-label label-sale">-17%</div>
                        </div>
                        <div className="btn-icon-group">
                          <a
                            href="demo35-product.html"
                            className="btn-icon btn-add-cart product-type-simple"
                          >
                            <i className="icon-shopping-cart" />
                          </a>
                        </div>
                        <a
                          href="ajax/product-quick-view.html"
                          className="btn-quickview"
                          title="Quick View"
                        >
                          Quick View
                        </a>
                      </figure>
                      <div className="product-details">
                        <div className="category-wrap">
                          <div className="category-list">
                            <a
                              href="demo35-shop.html"
                              className="product-category"
                            >
                              category
                            </a>
                          </div>
                          <a href="wishlist.html" className="btn-icon-wish">
                            <i className="icon-heart" />
                          </a>
                        </div>
                        <h3 className="product-title">
                          <a href="demo35-product.html">
                            Azeite de oliva extra Vergem
                          </a>
                        </h3>
                        <div className="ratings-container">
                          <div className="product-ratings">
                            <span className="ratings" style={{ width: "0%" }} />
                            {/* End .ratings */}
                            <span className="tooltiptext tooltip-top" />
                          </div>
                          {/* End .product-ratings */}
                        </div>
                        {/* End .product-container */}
                        <div className="price-box">
                          <span className="old-price">$59.00</span>
                          <span className="product-price">$49.00</span>
                        </div>
                        {/* End .price-box */}
                      </div>
                      {/* End .product-details */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="brands-section">
        <div className="container">
          <div
            className="appear-animate"
            data-animation-name="fadeInUpShorter"
            data-animation-delay={100}
          >
            <h2 className="section-title">Featured Brands</h2>
            <p className="section-info font2">
              All our new arrivals in a exclusive brand selection
            </p>
          </div>
          <div
            className="slider-wrapper bg-white rounded appear-animate"
            data-animation-name="fadeInUpShorter"
            data-animation-delay={300}
          >
            <div
              className="brands-slider owl-carousel owl-theme nav-outer"
              data-owl-options="{
                      'navText': ['<i class=icon-angle-left>', '<i class=icon-angle-right>'],
                      'center': true,
                      'loop': true,
                      'nav': true,
                      'responsive': {
                          '992': {
                              'items': 6
                          },
                          '1200': {
                              'items': 8
                          }
                      }
                  }"
            >
              <div className="d-inline-block">
                <img
                  src="https://portotheme.com/html/porto_ecommerce/assets/images/brands/small/brand1.png"
                  alt="brand"
                  width={140}
                  height={40}
                />
              </div>
              <div className="d-inline-block">
                <img
                  src="https://portotheme.com/html/porto_ecommerce/assets/images/brands/small/brand1.png"
                  alt="brand"
                  width={140}
                  height={40}
                />
              </div>
              <div className="d-inline-block">
                <img
                  src="src/assets/images/brands/small/brand6.png"
                  alt="brand"
                  width={140}
                  height={40}
                />
              </div>
              <div className="d-inline-block">
                <img
                  src="src/assets/images/brands/small/brand3.png"
                  alt="brand"
                  width={140}
                  height={40}
                />
              </div>
              <div className="d-inline-block">
                <img
                  src="src/assets/images/brands/small/brand3.png"
                  alt="brand"
                  width={140}
                  height={40}
                />
              </div>
              <div className="d-inline-block">
                <img
                  src="src/assets/images/brands/small/brand2.png"
                  alt="brand"
                  width={140}
                  height={40}
                />
              </div>
              <div className="d-inline-block">
                <img
                  src="src/assets/images/brands/small/brand3.png"
                  alt="brand"
                  width={140}
                  height={40}
                />
              </div>
              <div className="d-inline-block">
                <img
                  src="src/assets/images/brands/small/brand5.png"
                  alt="brand"
                  width={140}
                  height={40}
                />
              </div>
              <div className="d-inline-block">
                <img
                  src="src/assets/images/brands/small/brand6.png"
                  alt="brand"
                  width={140}
                  height={40}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="post-section">
        <div className="container">
          <div
            className="appear-animate"
            data-animation-name="fadeInUpShorter"
            data-animation-delay={300}
          >
            <h2 className="section-title">Recipes For This Week</h2>
            <p className="section-info font2">
              All our new arrivals in a exclusive brand selection
            </p>
          </div>
          <div
            className="post-date-in-media media-with-zoom bg-white rounded appear-animate"
            data-animation-name="fadeInUpShorter"
            data-animation-delay={300}
          >
            <div
              className="owl-carousel owl-theme mb-2 appear-animate"
              data-owl-options="{
                      'loop': false,
                      'nav': false,
                      'dots': false,
                      'margin': 20,
                      'items': 1,
                      'responsive': {
                          '576': {
                              'items': 2
                          }
                      }
                  }"
            >
              <article className="post">
                <div className="post-media">
                  <a href="single.html">
                    <img
                      src="src/assets/images/demoes/demo35/blogs/blog-2.png"
                      data-zoom-image="src/assets/images/demoes/demo35/blogs/blog-2.png"
                      alt="Post"
                      width={400}
                      height={185}
                    />
                  </a>
                  <span className="prod-full-screen">
                    <i className="fas fa-search" />
                  </span>
                </div>
                {/* End .post-media */}
                <div className="post-body">
                  <div className="category-list">Fresh Vegetables</div>
                  <h2 className="post-title">
                    <a href="single.html">Pasta With Pesto</a>
                  </h2>
                  <div className="post-content">
                    <p>
                      A tasty way to incorporate more veggies into your diet!
                    </p>
                  </div>
                  {/* End .post-content */}
                </div>
                {/* End .post-body */}
              </article>
              {/* End .post */}
              <article className="post">
                <div className="post-media">
                  <a href="single.html">
                    <img
                      src="src/assets/images/demoes/demo35/blogs/blog-1.png"
                      data-zoom-image="src/assets/images/demoes/demo35/blogs/blog-1.png"
                      alt="Post"
                      width={400}
                      height={185}
                    />
                  </a>
                  <span className="prod-full-screen">
                    <i className="fas fa-search" />
                  </span>
                </div>
                {/* End .post-media */}
                <div className="post-body">
                  <div className="category-list">Fresh Vegetables</div>
                  <h2 className="post-title">
                    <a href="single.html">Strawberry Waffles</a>
                  </h2>
                  <div className="post-content">
                    <p>
                      A tasty way to incorporate more veggies into your diet!
                    </p>
                  </div>
                  {/* End .post-content */}
                </div>
                {/* End .post-body */}
              </article>
              {/* End .post */}
            </div>
          </div>
        </div>
      </section>
      <section
        className="newsletter-section appear-animate"
        data-animation-name="fadeInUpShorter"
        data-animation-delay={200}
      >
        <div className="container">
          <div className="row no-gutters m-0 align-items-center">
            <div className="col-lg-6 col-xl-4 mb-2 mb-lg-0">
              <div className="info-box d-block d-sm-flex text-center text-sm-left">
                <i className="icon-envolope text-dark mr-4" />
                <div className="widget-newsletter-info">
                  <h4 className="font-weight-bold line-height-1">
                    Subscribe To Our Newsletter
                  </h4>
                  <p className="font2">
                    Get all the latest information on Events, Sales and Offers.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-xl-8">
              <form action="demo35.html#" className="mb-0">
                <div className="footer-submit-wrapper d-flex">
                  <input
                    type="email"
                    className="form-control rounded mb-0"
                    placeholder="Your E-mail Address"
                    size={40}
                    required=""
                  />
                  <button type="submit" className="btn btn-primary">
                    Subscribe Now!
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
    {/* End .main */}
</>

  )
}