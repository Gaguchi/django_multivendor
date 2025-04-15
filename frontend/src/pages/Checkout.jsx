import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import api from '../services/api';
import AddressManager from '../components/Address/AddressManager';
import CheckoutTotal from '../components/Cart/CheckoutTotal';

export default function Checkout() {
  const { user, login } = useAuth();
  const { cart, loading: cartLoading, refreshCart, isGuestCart } = useCart();
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [authError, setAuthError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeAuthTab, setActiveAuthTab] = useState('signin');

  // Authentication form state
  const [authForm, setAuthForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    rememberMe: false,
    agreePolicy: false
  });

  // Address form state
  const [addressForm, setAddressForm] = useState({
    full_name: '',
    phone_number: '',
    email: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'US',
    apartment_number: '',
    entrance_number: '',
    floor: '',
    door_code: '',
    delivery_instructions: '',
    address_type: 'shipping',
    is_default: true
  });

  // Check if guest user has items in cart and show auth modal
  useEffect(() => {
    if (isGuestCart && cart?.items?.length > 0 && !user) {
      setShowAuthModal(true);
    } else {
      setShowAuthModal(false);
    }
  }, [isGuestCart, cart, user]);

  // Fetch user addresses if logged in
  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  // Fill address form with user data if available
  useEffect(() => {
    if (user) {
      setAddressForm(prev => ({
        ...prev,
        full_name: `${user.profile?.first_name || ''} ${user.profile?.last_name || ''}`.trim(),
        email: user.email || '',
        phone_number: user.profile?.phone || ''
      }));
    }
  }, [user]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/users/addresses/');
      
      // Fix for "Expected array but got: Object" error
      const addressesData = Array.isArray(response.data) 
        ? response.data 
        : (response.data.results || []);
      
      setAddresses(addressesData);
      
      // Check if there's a default shipping address
      const defaultShipping = addressesData.find(
        address => address.is_default && ['shipping', 'both'].includes(address.address_type)
      );
      
      if (defaultShipping) {
        setSelectedAddress(defaultShipping.id);
      }
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes for authentication
  const handleAuthInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAuthForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle authentication form submission
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    
    try {
      const endpoint = activeAuthTab === 'signin'
        ? `/api/users/login/`
        : `/api/users/register/`;
        
      const payload = activeAuthTab === 'signin'
        ? { 
            username: authForm.email,
            password: authForm.password 
          }
        : {
            username: authForm.email,
            email: authForm.email,
            password: authForm.password,
            firstName: authForm.firstName,
            lastName: authForm.lastName,
            phone: authForm.phone,
            userprofile: {
              first_name: authForm.firstName,
              last_name: authForm.lastName,
              phone: authForm.phone
            }
          };

      // Password validation for registration
      if (activeAuthTab === 'register') {
        if (authForm.password !== authForm.confirmPassword) {
          setAuthError("Passwords don't match");
          return;
        }
        if (authForm.password.length < 8) {
          setAuthError("Password must be at least 8 characters");
          return;
        }
      }

      setLoading(true);
      const response = await api.post(endpoint, payload);
      
      // Login the user with the received tokens
      await login(response.data);
      
      // After successful login/register, fetch addresses
      await fetchAddresses();
      
      // Hide the auth modal
      setShowAuthModal(false);
      
    } catch (error) {
      setAuthError(error.response?.data?.detail || 
                  error.response?.data?.email?.[0] || 
                  error.response?.data?.password?.[0] ||
                  'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle Google login
  const handleGoogleLogin = () => {
    // IMPORTANT: Always use HTTPS for the redirect URI
    const redirectUri = `https://${window.location.host}/auth/callback`;
    const state = 'google-oauth2-checkout';
    
    // Ensure consistent protocol (https) is used in the OAuth flow
    const googleAuthUrl = `${baseURL}/auth/login/google-oauth2/?` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `state=${state}`;
    
    window.location.href = googleAuthUrl;
  };

  // Handle Facebook login
  const handleFacebookLogin = () => {
    // IMPORTANT: Always use HTTPS for the redirect URI
    const redirectUri = `https://${window.location.host}/auth/callback`;
    const state = 'facebook-oauth2-checkout';
    const scope = 'email,public_profile';
    
    window.location.href = `${baseURL}/auth/login/facebook/?` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `state=${state}&` +
      `scope=${encodeURIComponent(scope)}&` +
      `auth_type=reauthenticate`;
  };

  const handleAddressInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Special case for setting the entire form data when editing
    if (name === 'full_form_data') {
      setAddressForm(value);
      return;
    }
    
    setAddressForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setAddressError('');
    
    try {
      setLoading(true);
      let response;
      
      if (addressForm.id) {
        // Update existing address
        response = await api.put(`/api/users/addresses/${addressForm.id}/`, addressForm);
      } else {
        // Create new address
        response = await api.post('/api/users/addresses/', addressForm);
      }
      
      // Refresh address list
      await fetchAddresses();
      
      // Select the new/updated address
      if (response.data && response.data.id) {
        setSelectedAddress(response.data.id);
      }
      
      setShowNewAddressForm(false);
      
    } catch (error) {
      setAddressError('Failed to save address. Please check your information.');
      console.error("Address save error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSelection = (e) => {
    const addressId = parseInt(e.target.value);
    setSelectedAddress(addressId);
    
    // If "Add new address" option is selected
    if (addressId === -1) {
      // Reset form for new address
      setAddressForm({
        full_name: `${user.profile?.first_name || ''} ${user.profile?.last_name || ''}`.trim(),
        email: user.email || '',
        phone_number: user.profile?.phone || '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'US',
        apartment_number: '',
        entrance_number: '',
        floor: '',
        door_code: '',
        delivery_instructions: '',
        address_type: 'shipping',
        is_default: true
      });
      setShowNewAddressForm(true);
    } else {
      setShowNewAddressForm(false);
    }
  };

  const handlePlaceOrder = async (paymentMethod) => {
    // Reset any previous errors
    setOrderError('');
    
    if (!user) {
      setAuthError("Please sign in or register to continue");
      setShowAuthModal(true);
      return;
    }
    
    if (!selectedAddress && !showNewAddressForm) {
      setAddressError("Please select an address");
      return;
    }
    
    try {
      setLoading(true);
      
      // Find the selected address
      const shippingAddress = addresses.find(address => address.id === selectedAddress);
      if (!shippingAddress) {
        setAddressError("Invalid shipping address selected");
        setLoading(false);
        return;
      }
      
      // Format shipping address for order
      const formattedAddress = `${shippingAddress.full_name}, ${shippingAddress.address_line1} ${shippingAddress.address_line2 || ''}, ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postal_code}, ${shippingAddress.country}`;
      
      // Prepare order data
      const orderData = {
        payment_method: paymentMethod === 'paypal' ? 'PayPal' : 'Credit Card',
        shipping_address: formattedAddress,
        billing_address: formattedAddress, // Using same address for billing
        order_items: cart.items.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity
        }))
      };
      
      // Send order to API
      const response = await api.post('/api/orders/', orderData);
      
      // Check if we have an order ID and payment is needed
      if (response.data && response.data.id) {
        // For a real implementation, we would process payment here
        
        // For our mock implementation, let's simulate payment processing
        // This would typically involve calling a payment processor API
        
        // Now clear the cart if order was successful
        try {
          // Some carts have a clear method, or we might need to remove items individually
          // For this example, let's assume we call the cart refresh after clearing
          await refreshCart();
          
          // Navigate to order confirmation page
          navigate('/order-confirmation', { 
            state: { 
              orderNumber: response.data.order_number || `ORD-${response.data.id}`,
              orderTotal: response.data.total_amount,
              orderId: response.data.id
            } 
          });
        } catch (cartError) {
          console.error("Error clearing cart:", cartError);
          // Still navigate to confirmation since order was created
          navigate('/order-confirmation', { 
            state: { 
              orderNumber: response.data.order_number || `ORD-${response.data.id}`,
              orderTotal: response.data.total_amount,
              orderId: response.data.id,
              cartClearError: true
            } 
          });
        }
      } else {
        throw new Error("Order creation failed - no order ID returned");
      }
    } catch (error) {
      console.error("Failed to place order:", error);
      setOrderError(error.response?.data?.detail || "There was an error placing your order. Please try again.");
      setLoading(false);
    }
  };

  if (cartLoading) {
    return <div className="container py-5 text-center">Loading checkout...</div>;
  }

  if (!cart || cart.items?.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h2>Your cart is empty</h2>
        <Link to="/shop" className="btn btn-primary mt-3">Continue Shopping</Link>
      </div>
    );
  }

  // Authentication section component
  const AuthenticationSection = () => (
    <>
      <h2 className="step-title">Sign In or Register</h2>
      
      {authError && (
        <div className="alert alert-danger" role="alert">
          {authError}
        </div>
      )}
      
      <div className="form-tab">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <button 
              className={`nav-link ${activeAuthTab === 'signin' ? 'active' : ''}`}
              onClick={() => setActiveAuthTab('signin')}
            >
              Sign In
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeAuthTab === 'register' ? 'active' : ''}`}
              onClick={() => setActiveAuthTab('register')}
            >
              Register
            </button>
          </li>
        </ul>

        <div className="tab-content">
          <div className={`tab-pane ${activeAuthTab === 'signin' ? 'active show' : 'fade'}`}>
            <form onSubmit={handleAuthSubmit}>
              <div className="form-group">
                <label htmlFor="signin-email">Email address *</label>
                <input
                  type="email"
                  className="form-control"
                  id="signin-email"
                  name="email"
                  required
                  value={authForm.email}
                  onChange={handleAuthInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="signin-password">Password *</label>
                <input
                  type="password"
                  className="form-control"
                  id="signin-password"
                  name="password"
                  required
                  value={authForm.password}
                  onChange={handleAuthInputChange}
                />
              </div>

              <div className="form-footer d-flex align-items-center justify-content-between">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>

                <div className="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="signin-remember"
                    name="rememberMe"
                    checked={authForm.rememberMe}
                    onChange={handleAuthInputChange}
                  />
                  <label className="custom-control-label" htmlFor="signin-remember">
                    Remember Me
                  </label>
                </div>
              </div>
            </form>
            
            <div className="form-choice mt-3">
              <div className="separator">
                <span className="separator-text">or sign in with</span>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <button onClick={handleGoogleLogin} className="btn btn-login btn-g">
                    <i className="icon-google"></i>
                    Login With Google
                  </button>
                </div>
                <div className="col-sm-6">
                  <button onClick={handleFacebookLogin} className="btn btn-login btn-f">
                    <i className="icon-facebook-f"></i>
                    Login With Facebook
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className={`tab-pane ${activeAuthTab === 'register' ? 'active show' : 'fade'}`}>
            <form onSubmit={handleAuthSubmit}>
              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label htmlFor="register-fname">First Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="register-fname"
                      name="firstName"
                      required
                      value={authForm.firstName}
                      onChange={handleAuthInputChange}
                    />
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <label htmlFor="register-lname">Last Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="register-lname"
                      name="lastName"
                      required
                      value={authForm.lastName}
                      onChange={handleAuthInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="register-email">Email address *</label>
                <input
                  type="email"
                  className="form-control"
                  id="register-email"
                  name="email"
                  required
                  value={authForm.email}
                  onChange={handleAuthInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="register-phone">Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  id="register-phone"
                  name="phone"
                  value={authForm.phone}
                  onChange={handleAuthInputChange}
                />
              </div>

              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label htmlFor="register-password">Password *</label>
                    <input
                      type="password"
                      className="form-control"
                      id="register-password"
                      name="password"
                      required
                      value={authForm.password}
                      onChange={handleAuthInputChange}
                    />
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <label htmlFor="register-confirm-password">Confirm Password *</label>
                    <input
                      type="password"
                      className="form-control"
                      id="register-confirm-password"
                      name="confirmPassword"
                      required
                      value={authForm.confirmPassword}
                      onChange={handleAuthInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="form-footer">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Registering...' : 'Register'}
                </button>

                <div className="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="register-policy"
                    name="agreePolicy"
                    required
                    checked={authForm.agreePolicy}
                    onChange={handleAuthInputChange}
                  />
                  <label className="custom-control-label" htmlFor="register-policy">
                    I agree to the <a href="#">privacy policy</a> *
                  </label>
                </div>
              </div>
            </form>
            
            <div className="form-choice mt-3">
              <div className="separator">
                <span className="separator-text">or sign up with</span>
              </div>
              <div className="row">
                <div className="col-sm-6">
                  <button onClick={handleGoogleLogin} className="btn btn-login btn-g">
                    <i className="icon-google"></i>
                    Login With Google
                  </button>
                </div>
                <div className="col-sm-6">
                  <button onClick={handleFacebookLogin} className="btn btn-login btn-f">
                    <i className="icon-facebook-f"></i>
                    Login With Facebook
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <main className="main main-test">
      <div className="container checkout-container">
        <ul className="checkout-progress-bar d-flex justify-content-center flex-wrap">
          <li>
            <a href="/cart">Shopping Cart</a>
          </li>
          <li className="active">
            <a href="/checkout">Checkout</a>
          </li>
        </ul>

        {/* Show info for guest users */}
        {isGuestCart && !user && (
          <div className="alert alert-info mb-4" role="alert">
            <i className="fas fa-info-circle mr-2"></i>
            You are currently shopping as a guest. Sign in or create an account to track your orders and save your shopping preferences.
          </div>
        )}

        {/* Display order error if any */}
        {orderError && (
          <div className="alert alert-danger mb-4" role="alert">
            {orderError}
          </div>
        )}

        <div className="row">
          <div className="col-lg-8">
            {/* Authentication section for non-logged-in users */}
            {(!user || showAuthModal) && (
              <ul className="checkout-steps">
                <li>
                  <AuthenticationSection />
                </li>
              </ul>
            )}
            
            {/* Shipping details */}
            {user && (
              <ul className="checkout-steps">
                <li>
                  <AddressManager
                    user={user}
                    addresses={addresses}
                    selectedAddress={selectedAddress}
                    showNewAddressForm={showNewAddressForm}
                    addressForm={addressForm}
                    handleAddressInputChange={handleAddressInputChange}
                    handleAddressSubmit={handleAddressSubmit}
                    handleAddressSelection={handleAddressSelection}
                    addressError={addressError}
                    loading={loading}
                    setShowNewAddressForm={setShowNewAddressForm}
                    refreshAddresses={fetchAddresses}
                  />
                </li>
              </ul>
            )}
          </div>
          
          {/* Order summary */}
          <CheckoutTotal 
            selectedAddress={selectedAddress} 
            onPlaceOrder={handlePlaceOrder}
            loading={loading}
            orderError={orderError}
          />
        </div>
      </div>

      <style>{`
        .separator {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 1.5rem 0;
        }

        .separator::before,
        .separator::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid #dee2e6;
        }

        .separator-text {
          padding: 0 1rem;
          color: #777;
          font-size: 1.2rem;
        }
        
        .btn-login {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          margin-bottom: 0.8rem;
          padding: 0.8rem;
          font-size: 1.4rem;
          font-weight: 500;
          border-radius: 3px;
          transition: opacity 0.3s;
        }

        .btn-login:hover {
          opacity: 0.9;
          color: #fff;
        }

        .btn-g {
          background: #dd4b39;
          color: white;
        }

        .btn-f {
          background: #3b5998;
          color: white;
        }
      `}</style>
    </main>
  );
}