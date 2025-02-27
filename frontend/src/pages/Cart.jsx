import Total from "../components/Cart/Total"

export default function Cart() {

    return (
        <main className="main">
  <div className="container">
    <ul className="checkout-progress-bar d-flex justify-content-center flex-wrap">
      <li className="active">
        <a href="/cart">Shopping Cart</a>
      </li>
      <li>
        <a href="checkout.html">Checkout</a>
      </li>
    </ul>
    <div className="row">
      <div className="col-lg-8">
        <div className="cart-table-container">
          <table className="table table-cart">
            <thead>
              <tr>
                <th className="thumbnail-col" />
                <th className="product-col">Product</th>
                <th className="price-col">Price</th>
                <th className="qty-col">Quantity</th>
                <th className="text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr className="product-row">
                <td>
                  <figure className="product-image-container">
                    <a href="product.html" className="product-image">
                      <img
                        src="src/assets/images/products/product-3.jpg"
                        alt="product"
                      />
                    </a>
                    <a
                      href="cart.html#"
                      className="btn-remove icon-cancel"
                      title="Remove Product"
                    />
                  </figure>
                </td>
                <td className="product-col">
                  <h5 className="product-title">
                    <a href="product.html">Men Watch</a>
                  </h5>
                </td>
                <td>$17.90</td>
                <td>
                  <div className="product-single-qty">
                    <div className="input-group bootstrap-touchspin bootstrap-touchspin-injected">
                      <input
                        className="horizontal-quantity form-control"
                        type="text"
                      />
                    </div>
                  </div>
                  {/* End .product-single-qty */}
                </td>
                <td className="text-right">
                  <span className="subtotal-price">$17.90</span>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={5} className="clearfix">
                  <div className="float-left">
                    <div className="cart-discount">
                      <form action="cart.html#">
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Coupon Code"
                            required=""
                          />
                          <div className="input-group-append">
                            <button className="btn btn-sm" type="submit">
                              Apply Coupon
                            </button>
                          </div>
                        </div>
                        {/* End .input-group */}
                      </form>
                    </div>
                  </div>
                  {/* End .float-left */}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        {/* End .cart-table-container */}
      </div>
      {/* End .col-lg-8 */}
      <Total />
      {/* End .col-lg-4 */}
    </div>
    {/* End .row */}
  </div>
  {/* End .container */}
  <div className="mb-6" />
  {/* margin */}
</main>

    )
}