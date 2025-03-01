import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import api from '../services/api';

export default function Checkout() {
  const { user } = useAuth();
  const { cart, loading: cartLoading } = useCart();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('signin');
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [authError, setAuthError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [loading, setLoading] = useState(false);

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
      
      // Make sure we handle both array and non-array responses
      if (Array.isArray(response.data)) {
        setAddresses(response.data);
        
        // Check if there's a default shipping address
        const defaultShipping = response.data.find(
          address => address.is_default && ['shipping', 'both'].includes(address.address_type)
        );
        
        if (defaultShipping) {
          setSelectedAddress(defaultShipping.id);
        }
      } else {
        console.error("Expected array but got:", response.data);
        setAddresses([]);
      }
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAuthForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddressInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    
    try {
      const endpoint = activeTab === 'signin'
        ? `/api/users/login/`
        : `/api/users/register/`;
        
      const payload = activeTab === 'signin'
        ? { 
            username: authForm.email,
            password: authForm.password 
          }
        : {
            username: authForm.email,
            email: authForm.email,
            password: authForm.password,
            userprofile: {
              first_name: authForm.firstName,
              last_name: authForm.lastName,
              phone: authForm.phone
            }
          };

      // Password validation for registration
      if (activeTab === 'register') {
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
      
      // Login will handle token storage
      await login(response.data);
      
      // After successful login/register, fetch addresses
      fetchAddresses();
      
    } catch (error) {
      setAuthError(error.response?.data?.detail || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setAddressError('');
    
    try {
      setLoading(true);
      const response = await api.post('/api/users/addresses/', addressForm);
      
      // Refresh address list
      await fetchAddresses();
      
      // Select the new address
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
      setShowNewAddressForm(true);
    } else {
      setShowNewAddressForm(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      setAuthError("Please sign in or register to continue");
      return;
    }
    
    if (!selectedAddress && !showNewAddressForm) {
      setAddressError("Please select an address");
      return;
    }
    
    // Logic to place order would go here
    // ...
    
    // Redirect to order confirmation
    navigate('/order-confirmation');
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

  // Calculate cart totals
  const itemsTotal = cart.items.reduce((sum, item) => sum + (item.quantity * parseFloat(item.unit_price)), 0);
  const discount = parseFloat(cart.discount || 0);
  const shipping = parseFloat(cart.shipping_cost || 0);
  const totalAmount = parseFloat(cart.total || itemsTotal - discount + shipping);

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
        <div className="row">
          <div className="col-lg-8">
            {/* Authentication section for non-logged-in users */}
            {!user && (
              <ul className="checkout-steps">
                <li>
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
                          className={`nav-link ${activeTab === 'signin' ? 'active' : ''}`}
                          onClick={() => setActiveTab('signin')}
                        >
                          Sign In
                        </button>
                      </li>
                      <li className="nav-item">
                        <button 
                          className={`nav-link ${activeTab === 'register' ? 'active' : ''}`}
                          onClick={() => setActiveTab('register')}
                        >
                          Register
                        </button>
                      </li>
                    </ul>

                    <div className="tab-content">
                      <div className={`tab-pane ${activeTab === 'signin' ? 'active show' : 'fade'}`}>
                        <form onSubmit={(e) => handleAuthSubmit(e)}>
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
                      </div>

                      <div className={`tab-pane ${activeTab === 'register' ? 'active show' : 'fade'}`}>
                        <form onSubmit={(e) => handleAuthSubmit(e)}>
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
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            )}
            
            {/* Billing details */}
            <ul className="checkout-steps">
              <li>
                <h2 className="step-title">Shipping Details</h2>
                {addressError && (
                  <div className="alert alert-danger" role="alert">
                    {addressError}
                  </div>
                )}
                
                {user && addresses && addresses.length > 0 && (
                  <div className="form-group mb-4">
                    <label htmlFor="address-select">Select Address</label>
                    <select 
                      className="form-control" 
                      id="address-select"
                      value={selectedAddress || ''}
                      onChange={handleAddressSelection}
                    >
                      <option value="">Select an address...</option>
                      {addresses.map(address => (
                        <option key={address.id} value={address.id}>
                          {address.full_name}, {address.address_line1}, {address.city}
                        </option>
                      ))}
                      <option value="-1">+ Add new address</option>
                    </select>
                  </div>
                )}
                
                {/* Show the selected address */}
                {user && selectedAddress && selectedAddress !== -1 && 
                !showNewAddressForm && addresses && addresses.length > 0 && (
                  <div className="selected-address mb-4">
                    <div className="card p-3">
                      {addresses.find(a => a.id === selectedAddress) && (
                        <div>
                          <h5>{addresses.find(a => a.id === selectedAddress).full_name}</h5>
                          <p className="mb-1">{addresses.find(a => a.id === selectedAddress).address_line1}</p>
                          {addresses.find(a => a.id === selectedAddress).address_line2 && (
                            <p className="mb-1">{addresses.find(a => a.id === selectedAddress).address_line2}</p>
                          )}
                          <p className="mb-1">
                            {addresses.find(a => a.id === selectedAddress).city}, {addresses.find(a => a.id === selectedAddress).state} {addresses.find(a => a.id === selectedAddress).postal_code}
                          </p>
                          <p className="mb-1">{addresses.find(a => a.id === selectedAddress).country}</p>
                          <p className="mb-1">Phone: {addresses.find(a => a.id === selectedAddress).phone_number}</p>
                          {addresses.find(a => a.id === selectedAddress).email && (
                            <p className="mb-1">Email: {addresses.find(a => a.id === selectedAddress).email}</p>
                          )}
                          <button 
                            className="btn btn-sm btn-outline-primary mt-2"
                            onClick={() => {
                              // Fill form with selected address data for editing
                              const addr = addresses.find(a => a.id === selectedAddress);
                              setAddressForm({...addr});
                              setShowNewAddressForm(true);
                            }}
                          >
                            Edit Address
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Address form */}
                {(showNewAddressForm || !user || !addresses || addresses.length === 0) && (
                  <form onSubmit={handleAddressSubmit} id="address-form">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>
                            Full Name
                            <abbr className="required" title="required">*</abbr>
                          </label>
                          <input 
                            type="text" 
                            className="form-control" 
                            name="full_name"
                            value={addressForm.full_name}
                            onChange={handleAddressInputChange}
                            required 
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>
                            Phone Number
                            <abbr className="required" title="required">*</abbr>
                          </label>
                          <input 
                            type="tel" 
                            className="form-control" 
                            name="phone_number"
                            value={addressForm.phone_number}
                            onChange={handleAddressInputChange}
                            required 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Email address</label>
                      <input 
                        type="email" 
                        className="form-control" 
                        name="email"
                        value={addressForm.email}
                        onChange={handleAddressInputChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>
                        Street Address Line 1
                        <abbr className="required" title="required">*</abbr>
                      </label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="House number and street name" 
                        name="address_line1"
                        value={addressForm.address_line1}
                        onChange={handleAddressInputChange}
                        required 
                      />
                    </div>

                    <div className="form-group">
                      <label>Street Address Line 2</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Apartment, suite, unit, etc. (optional)"
                        name="address_line2"
                        value={addressForm.address_line2}
                        onChange={handleAddressInputChange}
                      />
                    </div>

                    <div className="row">
                      <div className="col-md-4">
                        <div className="form-group">
                          <label>
                            Apartment Number
                          </label>
                          <input 
                            type="text" 
                            className="form-control" 
                            name="apartment_number"
                            value={addressForm.apartment_number}
                            onChange={handleAddressInputChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label>
                            Entrance Number
                          </label>
                          <input 
                            type="text" 
                            className="form-control" 
                            name="entrance_number"
                            value={addressForm.entrance_number}
                            onChange={handleAddressInputChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label>
                            Floor
                          </label>
                          <input 
                            type="text" 
                            className="form-control" 
                            name="floor"
                            value={addressForm.floor}
                            onChange={handleAddressInputChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>
                        Door Code
                      </label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Code to access the building (if any)"
                        name="door_code"
                        value={addressForm.door_code}
                        onChange={handleAddressInputChange}
                      />
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>
                            City
                            <abbr className="required" title="required">*</abbr>
                          </label>
                          <input 
                            type="text" 
                            className="form-control" 
                            name="city"
                            value={addressForm.city}
                            onChange={handleAddressInputChange}
                            required 
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>
                            State/Province
                            <abbr className="required" title="required">*</abbr>
                          </label>
                          <input 
                            type="text" 
                            className="form-control" 
                            name="state"
                            value={addressForm.state}
                            onChange={handleAddressInputChange}
                            required 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>
                            Postal Code
                            <abbr className="required" title="required">*</abbr>
                          </label>
                          <input 
                            type="text" 
                            className="form-control" 
                            name="postal_code"
                            value={addressForm.postal_code}
                            onChange={handleAddressInputChange}
                            required 
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>
                            Country
                            <abbr className="required" title="required">*</abbr>
                          </label>
                          <select 
                            className="form-control"
                            name="country"
                            value={addressForm.country}
                            onChange={handleAddressInputChange}
                            required
                          >
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="UK">United Kingdom</option>
                            <option value="AU">Australia</option>
                            <option value="DE">Germany</option>
                            <option value="FR">France</option>
                            {/* Add more countries as needed */}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Delivery Instructions (optional)</label>
                      <textarea 
                        className="form-control" 
                        placeholder="Notes about your order, e.g. special notes for delivery." 
                        name="delivery_instructions"
                        value={addressForm.delivery_instructions}
                        onChange={handleAddressInputChange}
                      />
                    </div>

                    {user && (
                      <div className="form-group">
                        <div className="custom-control custom-checkbox">
                          <input 
                            type="checkbox" 
                            className="custom-control-input" 
                            id="save-address"
                            name="is_default"
                            checked={addressForm.is_default}
                            onChange={handleAddressInputChange}
                          />
                          <label className="custom-control-label" htmlFor="save-address">
                            Save as default shipping address
                          </label>
                        </div>
                      </div>
                    )}

                    {user && (
                      <div className="form-group d-flex justify-content-end">
                        {showNewAddressForm && selectedAddress !== -1 && (
                          <button 
                            type="button" 
                            className="btn btn-outline-secondary mr-2"
                            onClick={() => {
                              setShowNewAddressForm(false);
                            }}
                          >
                            Cancel
                          </button>
                        )}
                        <button 
                          type="submit" 
                          className="btn btn-primary"
                          disabled={loading}
                        >
                          {loading ? 'Saving...' : 'Save Address'}
                        </button>
                      </div>
                    )}
                  </form>
                )}
              </li>
            </ul>
          </div>
          
          {/* Order summary */}
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
                      {/* Additional shipping methods could be added here */}
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
                      defaultChecked={true}
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
                    />
                    <label className="custom-control-label" htmlFor="payment-paypal">
                      PayPal
                    </label>
                  </div>
                </div>
              </div>
              
              <button
                type="button"
                className="btn btn-dark btn-place-order w-100 mt-3"
                onClick={handlePlaceOrder}
                disabled={(!user && !showNewAddressForm) || loading}
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
              
              <div className="mt-3 text-center small text-muted">
                By placing your order, you agree to our <a href="#">terms and conditions</a> and <a href="#">privacy policy</a>.
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}