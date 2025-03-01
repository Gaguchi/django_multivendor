import { useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { Link } from "react-router-dom";

export default function Total() {
    const { cart, loading } = useCart();
    const navigate = useNavigate();
    
    if (loading || !cart) {
        return (
            <div className="col-lg-4">
                <div className="order-summary">
                    <h3>YOUR ORDER</h3>
                    <div className="p-3 text-center">Loading cart summary...</div>
                </div>
            </div>
        );
    }
    
    // Calculate totals from cart items directly
    const itemsTotal = cart.items.reduce((sum, item) => sum + (item.quantity * parseFloat(item.unit_price)), 0);
    const discount = parseFloat(cart.discount || 0);
    const totalAmount = parseFloat(cart.total || itemsTotal - discount);
    
    const handleCheckout = () => {
        navigate('/checkout');
    };
    
    return (
        <div className="col-lg-4">
            <div className="order-summary">
                <h3>YOUR ORDER</h3>
                <table className="table table-mini-cart">
                    <thead>
                        <tr>
                            <th colSpan={2}>Product</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.items.map(item => (
                            <tr key={item.id}>
                                <td className="product-col">
                                    <h3 className="product-title">
                                        {item.product.name} ×
                                        <span className="product-qty">{item.quantity}</span>
                                    </h3>
                                </td>
                                <td className="price-col">
                                    <span>${(parseFloat(item.unit_price) * item.quantity).toFixed(2)}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="cart-subtotal">
                            <td>
                                <h4>Subtotal</h4>
                            </td>
                            <td className="price-col">
                                <span>${itemsTotal.toFixed(2)}</span>
                            </td>
                        </tr>
                        
                        {discount > 0 && (
                            <tr className="cart-discount">
                                <td>
                                    <h4>Discount</h4>
                                </td>
                                <td className="price-col">
                                    <span className="text-danger">-${discount.toFixed(2)}</span>
                                </td>
                            </tr>
                        )}
                        
                        {cart.shipping_cost > 0 && (
                            <tr className="order-shipping">
                                <td>
                                    <h4>Shipping</h4>
                                </td>
                                <td className="price-col">
                                    <span>${parseFloat(cart.shipping_cost).toFixed(2)}</span>
                                </td>
                            </tr>
                        )}
                        
                        <tr className="order-total">
                            <td>
                                <h4>Total</h4>
                            </td>
                            <td>
                                <b className="total-price">
                                    <span>${totalAmount.toFixed(2)}</span>
                                </b>
                            </td>
                        </tr>
                    </tfoot>
                </table>
                
                {cart.coupon_applied && (
                    <div className="coupon-applied mb-3">
                        <div className="d-flex justify-content-between">
                            <span>Coupon: <strong>{cart.coupon_code}</strong></span>
                            <a href="#" className="text-danger small">Remove</a>
                        </div>
                    </div>
                )}
                <button
                    type="button"
                    className="btn btn-dark btn-place-order w-100"
                    onClick={handleCheckout}
                >
                    Proceed to Checkout
                </button>
                
                <div className="shipping-info mt-3 small text-muted text-center">
                    <p>Shipping methods and delivery times can be selected during checkout</p>
                </div>
            </div>
        </div>
    );
}