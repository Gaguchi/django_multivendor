export default function Sidebar() {

    return (
        <>
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
        </>
    )
}