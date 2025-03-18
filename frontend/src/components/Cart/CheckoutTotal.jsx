import { useState, useEffect } from "react";
import { useCart } from "../../contexts/CartContext";

export default function CheckoutTotal({ selectedAddress, onPlaceOrder, loading, orderError }) {
    const { cart } = useCart();
    const [paymentMethod, setPaymentMethod] = useState('credit-card');
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    
    // Update screen width on resize
    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    if (!cart || !cart.items) {
        return (
            <div className="col-lg-4">
                <div className="order-summary">
                    <h3>YOUR ORDER</h3>
                    <div className="p-3 text-center">Loading order summary...</div>
                </div>
            </div>
        );
    }

    // Function to truncate product name based on screen size
    const truncateName = (name) => {
        if (!name) return '';
        
        // Set max length based on screen width and checkout needs
        let maxLength = 10; // Default max length for checkout
        
        if (screenWidth < 576) {
            maxLength = 18; // Mobile
        } else if (screenWidth < 768) {
            maxLength = 20; // Small tablets
        } else if (screenWidth < 992) {
            maxLength = 20; // Tablets
        } else if (screenWidth < 1200) {
            maxLength = 12; // Small desktop
        } else {
            maxLength = 20; // Desktop
        }
        
        return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
    };
    
    // Calculate cart totals
    const itemsTotal = cart.items.reduce((sum, item) => sum + (item.quantity * parseFloat(item.unit_price)), 0);
    const discount = parseFloat(cart.discount || 0);
    const shipping = parseFloat(cart.shipping_cost || 0);
    const totalAmount = parseFloat(cart.total || itemsTotal - discount + shipping);
    
    const handlePaymentChange = (e) => {
        setPaymentMethod(e.target.value);
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
                                    <h3 className="product-title" title={item.product.name}>
                                        {truncateName(item.product.name)} ×
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
                        <tr className="order-shipping">
                            <td colSpan="2">
                                <h4 className="mb-3">Shipping</h4>
                                <div className="form-group form-group-custom-control mb-0">
                                    <div className="custom-control custom-radio d-flex mb-0">
                                        <input
                                            type="radio"
                                            name="shipping-method"
                                            className="custom-control-input"
                                            id="free-shipping"
                                            defaultChecked={true}
                                        />
                                        <label className="custom-control-label" htmlFor="free-shipping">
                                            Free Shipping - $0.00
                                        </label>
                                    </div>
                                </div>
                            </td>
                        </tr>
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
                
                <div className="payment-methods">
                    <h4>Payment methods</h4>
                    <div className="form-group form-group-custom-control mb-0">
                        <div className="custom-control custom-radio d-flex mb-3">
                            <input
                                type="radio"
                                name="payment-method"
                                className="custom-control-input"
                                id="payment-credit-card"
                                value="credit-card"
                                checked={paymentMethod === 'credit-card'}
                                onChange={handlePaymentChange}
                            />
                            <label className="custom-control-label" htmlFor="payment-credit-card">
                                Credit Card (Stripe)
                            </label>
                        </div>
                        <div className="custom-control custom-radio d-flex mb-0">
                            <input
                                type="radio"
                                name="payment-method"
                                className="custom-control-input"
                                id="payment-paypal"
                                value="paypal"
                                checked={paymentMethod === 'paypal'}
                                onChange={handlePaymentChange}
                            />
                            <label className="custom-control-label" htmlFor="payment-paypal">
                                PayPal
                            </label>
                        </div>
                    </div>
                </div>

                {orderError && (
                    <div className="alert alert-danger mt-3">
                        {orderError}
                    </div>
                )}
                
                <button
                    type="button"
                    className="btn btn-dark btn-place-order w-100 mt-3"
                    onClick={() => onPlaceOrder(paymentMethod)}
                    disabled={!selectedAddress || loading}
                >
                    {loading ? 'Processing...' : 'Place Order'}
                </button>
                
                <div className="mt-3 text-center small text-muted">
                    By placing your order, you agree to our <a href="#">terms and conditions</a> and <a href="#">privacy policy</a>.
                </div>
            </div>
        </div>
    );
}
