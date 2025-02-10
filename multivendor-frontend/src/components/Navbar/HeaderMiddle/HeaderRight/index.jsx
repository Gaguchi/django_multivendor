export default function HeaderRight() {

    return (
        <>
          <div className="header-right">
            <div className="header-middle-icon -fav">
                <a href="wishlist.html" className="header-icon position-relative ">
                    <i className="icon-wishlist-2" />
                </a>
            </div>
            <div className="header-middle-icon header-middle-user">
                <a href="login.html" className="header-icon mr-0" title="login">
                <i className="icon-user-2" />
                </a>
            </div>
            <div className="header-middle-icon cart-dropdown-wrapper d-flex align-items-center">
                <div className="dropdown cart-dropdown">
                <a
                    href="#"
                    title="Cart"
                    className="header-icondropdown-toggle cart-toggle"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                    data-display="static"
                >
                    <i className="icon-cart-thick" />
                    <span className=" cart-count badge-circle badge-cart">3</span>
                </a>
                <div className="cart-overlay" />
                <div className="dropdown-menu mobile-cart">
                    <a href="#" title="Close (Esc)" className="btn-close">
                    ×
                    </a>
                    <div className="dropdownmenu-wrapper custom-scrollbar">
                    <div className="dropdown-cart-header">Shopping Cart</div>
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
                        <figure className="product-image-container">
                            <a href="demo35-product.html" className="product-image">
                            <img
                                alt="product"
                                width={80}
                                height={80}
                                src="src/assets/images/products/product-1.jpg"
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
                        <div className="product">
                        <div className="product-details">
                            <h4 className="product-title">
                            <a href="demo35-product.html">Brown Women Casual HandBag</a>
                            </h4>
                            <span className="cart-product-info">
                            <span className="cart-product-qty">1</span> × $35.00
                            </span>
                        </div>
                        <figure className="product-image-container">
                            <a href="demo35-product.html" className="product-image">
                            <img
                                alt="product"
                                width={80}
                                height={80}
                                src="src/assets/images/products/product-2.jpg"
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
                        <div className="product">
                        <div className="product-details">
                            <h4 className="product-title">
                            <a href="demo35-product.html">Circled Ultimate 3D Speaker</a>
                            </h4>
                            <span className="cart-product-info">
                            <span className="cart-product-qty">1</span> × $35.00
                            </span>
                        </div>
                        <figure className="product-image-container">
                            <a href="demo35-product.html" className="product-image">
                            <img
                                alt="product"
                                width={80}
                                height={80}
                                src="src/assets/images/products/product-3.jpg"
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
                    </div>
                    <div className="dropdown-cart-total">
                        <span>SUBTOTAL:</span>
                        <span className="cart-total-price float-right">$134.00</span>
                    </div>
                    <div className="dropdown-cart-action">
                        <a href="cart.html" className="btn btn-gray btn-block view-cart">
                        View Cart
                        </a>
                        <a href="checkout.html" className="btn btn-dark btn-block">
                        Checkout
                        </a>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>

          {/* End .header-right */}

        </>
    )
}