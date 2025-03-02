import { useEffect } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

export default function OrderConfirmation() {
  const { clearCart } = useCart();
  const location = useLocation();
  
  // Check if we have order data
  const orderData = location.state;
  
  // Clear cart on page load (will only run once)
  useEffect(() => {
    if (orderData) {
      clearCart().catch(error => {
        console.error("Error clearing cart:", error);
      });
    }
  }, []);

  // If no order data was passed, redirect to home
  if (!orderData) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container order-confirmation py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card border-0 shadow">
            <div className="card-body p-5 text-center">
              <div className="mb-4">
                <i className="fas fa-check-circle text-success" style={{ fontSize: '4rem' }}></i>
              </div>
              
              <h2 className="mb-4">Thank You for Your Order!</h2>
              
              <p className="lead mb-5">
                Your order #{orderData.orderNumber} has been placed successfully.
                We've sent a confirmation email with your order details.
              </p>
              
              <div className="order-details mb-5">
                <div className="row mb-3">
                  <div className="col-6 text-left">Order Number:</div>
                  <div className="col-6 text-right font-weight-bold">{orderData.orderNumber}</div>
                </div>
                
                <div className="row mb-3">
                  <div className="col-6 text-left">Total Amount:</div>
                  <div className="col-6 text-right font-weight-bold">${parseFloat(orderData.orderTotal).toFixed(2)}</div>
                </div>
                
                {orderData.cartClearError && (
                  <div className="alert alert-warning mt-3">
                    Note: There was an issue clearing your cart, but your order has been placed.
                  </div>
                )}
              </div>
              
              <div className="d-flex justify-content-center flex-wrap">
                <Link to="/account/orders" className="btn btn-primary mr-2 mb-2">
                  View My Orders
                </Link>
                <Link to="/" className="btn btn-outline-primary mb-2">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
