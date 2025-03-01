import { useEffect } from "react"
import { Link } from "react-router-dom"
import { useCart } from "../contexts/CartContext"
import Total from "../components/Cart/Total"

export default function Cart() {
  const { cart, loading, updateCartItem, removeFromCart, refreshCart } = useCart()

  useEffect(() => {
    refreshCart()
  }, [])

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return
    
    try {
      await updateCartItem(itemId, newQuantity)
    } catch (error) {
      console.error("Failed to update quantity:", error)
    }
  }

  const handleRemoveItem = async (itemId) => {
    try {
      await removeFromCart(itemId)
    } catch (error) {
      console.error("Failed to remove item:", error)
    }
  }

  if (loading) {
    return <div className="container py-5 text-center">Loading cart...</div>
  }

  if (!cart || cart.items?.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h2>Your cart is empty</h2>
        <Link to="/shop" className="btn btn-primary mt-3">Continue Shopping</Link>
      </div>
    )
  }

  return (
    <>
      <div className="container">
        <ul className="checkout-progress-bar d-flex justify-content-center flex-wrap">
          <li className="active">
            <a href="/cart">Shopping Cart</a>
          </li>
          <li>
            <a href="/checkout">Checkout</a>
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
                  {cart.items.map(item => (
                    <tr className="product-row" key={item.id}>
                      <td>
                        <figure className="product-image-container">
                          <Link to={`/product/${item.product.id}`} className="product-image">
                            <img
                              src={item.product.image || "src/assets/images/products/placeholder.jpg"}
                              alt={item.product.name}
                            />
                          </Link>
                          <a
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handleRemoveItem(item.product.id);
                            }}
                            className="btn-remove icon-cancel"
                            title="Remove Product"
                          />
                        </figure>
                      </td>
                      <td className="product-col">
                        <h5 className="product-title">
                          <Link to={`/product/${item.product.id}`}>{item.product.name}</Link>
                        </h5>
                      </td>
                      <td>${parseFloat(item.unit_price).toFixed(2)}</td>
                      <td>
                        <div className="product-single-qty">
                          <div className="input-group bootstrap-touchspin bootstrap-touchspin-injected">
                            <span className="input-group-btn input-group-prepend">
                              <button
                                className="btn btn-outline btn-down-icon bootstrap-touchspin-down"
                                type="button"
                                onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                              />
                            </span>
                            <input 
                              className="horizontal-quantity form-control" 
                              type="text"
                              value={item.quantity}
                              readOnly
                            />
                            <span className="input-group-btn input-group-append">
                              <button
                                className="btn btn-outline btn-up-icon bootstrap-touchspin-up"
                                type="button"
                                onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                              />
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="text-right">
                        <span className="subtotal-price">${(parseFloat(item.unit_price) * item.quantity).toFixed(2)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={5} className="clearfix">
                      <div className="float-left">
                        <div className="cart-discount">
                          <form action="#" onSubmit={(e) => e.preventDefault()}>
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
                          </form>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          <Total />
        </div>
      </div>
    </>
  )
}