import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function DashboardSummary() {
  const { user } = useAuth();
  const [orderCount, setOrderCount] = useState(0);
  const [defaultAddresses, setDefaultAddresses] = useState({
    shipping: null,
    billing: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch order count
        const ordersResponse = await api.get('/api/orders/');
        if (ordersResponse.data && Array.isArray(ordersResponse.data)) {
          setOrderCount(ordersResponse.data.length);
        } else if (ordersResponse.data && ordersResponse.data.results) {
          setOrderCount(ordersResponse.data.results.length);
        }
        
        // Fetch default addresses
        const addressesResponse = await api.get('/api/users/addresses/');
        const addresses = Array.isArray(addressesResponse.data) 
          ? addressesResponse.data 
          : (addressesResponse.data.results || []);
        
        // Find default shipping and billing addresses
        const defaultShipping = addresses.find(addr => 
          addr.is_default && ['shipping', 'both'].includes(addr.address_type)
        );
        
        const defaultBilling = addresses.find(addr => 
          addr.is_default && ['billing', 'both'].includes(addr.address_type)
        );
        
        setDefaultAddresses({
          shipping: defaultShipping,
          billing: defaultBilling
        });
        
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  const formatAddress = (address) => {
    if (!address) return null;
    
    return (
      <>
        <p className="mb-1">{address.full_name}</p>
        <p className="mb-1">{address.address_line1}</p>
        {address.address_line2 && <p className="mb-1">{address.address_line2}</p>}
        <p className="mb-1">
          {address.city}, {address.state} {address.postal_code}
        </p>
        <p className="mb-1">{address.country}</p>
      </>
    );
  };

  return (
    <div className="dashboard-content">
      <h2>Account Dashboard</h2>
      <div className="alert alert-info">
        Hello <strong>{user?.profile?.first_name || user?.username}</strong>, 
        welcome to your account dashboard!
      </div>
      
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row row-lg">
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-body">
                <h4 className="card-title">Account Summary</h4>
                <div className="row mb-2">
                  <div className="col-6">Joined:</div>
                  <div className="col-6 text-right">
                    {user?.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-6">Email:</div>
                  <div className="col-6 text-right">{user?.email || 'N/A'}</div>
                </div>
                <div className="row mb-2">
                  <div className="col-6">Orders:</div>
                  <div className="col-6 text-right">{orderCount}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-body">
                <h4 className="card-title">Recent Orders</h4>
                {orderCount > 0 ? (
                  <div className="mb-2">
                    <p>You have {orderCount} orders.</p>
                    <Link to="/account/orders" className="btn btn-outline-primary btn-sm">View All Orders</Link>
                  </div>
                ) : (
                  <>
                    <p>You haven't placed any orders yet.</p>
                    <Link to="/shop" className="btn btn-primary btn-sm">Start Shopping</Link>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-body">
                <h4 className="card-title">Default Addresses</h4>
                <div className="address-box mb-3">
                  <h5>Shipping Address</h5>
                  {defaultAddresses.shipping ? (
                    formatAddress(defaultAddresses.shipping)
                  ) : (
                    <p className="mb-1">Not set</p>
                  )}
                  <Link 
                    to="#addresses"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.hash = 'addresses';
                    }}
                    className="btn btn-link p-0"
                  >
                    {defaultAddresses.shipping ? 'Edit Address' : 'Add Address'}
                  </Link>
                </div>
                
                <div className="address-box">
                  <h5>Billing Address</h5>
                  {defaultAddresses.billing ? (
                    formatAddress(defaultAddresses.billing)
                  ) : (
                    <p className="mb-1">Not set</p>
                  )}
                  <Link 
                    to="#addresses"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.hash = 'addresses';
                    }}
                    className="btn btn-link p-0"
                  >
                    {defaultAddresses.billing ? 'Edit Address' : 'Add Address'}
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-body">
                <h4 className="card-title">Account Settings</h4>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <Link 
                      to="#account-details"
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.hash = 'account-details';
                      }}
                    >
                      Edit Profile
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link 
                      to="#account-security"
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.hash = 'account-security';
                      }}
                    >
                      Change Password
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="#account-preferences"
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.hash = 'account-preferences';
                      }}
                    >
                      Communication Preferences
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
