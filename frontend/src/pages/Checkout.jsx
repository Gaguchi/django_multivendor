import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import api from '../services/api';
import AddressManager from '../components/Address/AddressManager';
import CheckoutTotal from '../components/Cart/CheckoutTotal';
import CheckoutAuth from '../components/Auth/CheckoutAuth';

export default function Checkout() {
  const { user, login } = useAuth();
  const { cart, loading: cartLoading, refreshCart, isGuestCart } = useCart();
  const navigate = useNavigate();
  
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [authError, setAuthError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);

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

  const handleAuthSuccess = async (authData) => {
    // Login will handle token storage
    await login(authData);
    
    // After successful login/register, fetch addresses
    fetchAddresses();
    
    // Hide the auth modal
    setShowAuthModal(false);
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
                  <CheckoutAuth onAuthenticated={handleAuthSuccess} />
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
    </main>
  );
}