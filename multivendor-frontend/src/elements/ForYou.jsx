export default function ForYou() {

  return (
    <>
          <h2 className="section-title">For You</h2>
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
    </>
  )
}