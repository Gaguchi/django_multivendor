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
    <div className="dashboard-summary">
      <div className="dashboard-header">
        <h2>Account Dashboard</h2>
        <div className="welcome-badge">
          <i className="icon-star"></i>
          <span>Welcome back, <strong>{user?.profile?.first_name || user?.username}</strong>!</span>
        </div>
      </div>
      
      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
          <p>Loading your dashboard...</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon orders">
                <i className="icon-bag"></i>
              </div>
              <div className="stat-content">
                <h3>{orderCount}</h3>
                <p>Total Orders</p>
                <Link to="/account/orders" className="stat-link">View all orders →</Link>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon addresses">
                <i className="icon-location-pin"></i>
              </div>
              <div className="stat-content">
                <h3>{defaultAddresses.shipping && defaultAddresses.billing ? '2' : defaultAddresses.shipping || defaultAddresses.billing ? '1' : '0'}</h3>
                <p>Saved Addresses</p>
                <Link 
                  to="#addresses"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.hash = 'addresses';
                  }}
                  className="stat-link"
                >
                  Manage addresses →
                </Link>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon member">
                <i className="icon-calendar"></i>
              </div>
              <div className="stat-content">
                <h3>{user?.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'N/A'}</h3>
                <p>Member Since</p>
                <span className="stat-link">Thank you for being with us!</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <div className="actions-grid">
              <Link 
                to="#orders"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.hash = 'orders';
                }}
                className="action-card"
              >
                <div className="action-icon">
                  <i className="icon-bag"></i>
                </div>
                <div className="action-content">
                  <h4>View Orders</h4>
                  <p>Track your recent purchases</p>
                </div>
              </Link>

              <Link 
                to="#account-details"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.hash = 'account-details';
                }}
                className="action-card"
              >
                <div className="action-icon">
                  <i className="icon-user"></i>
                </div>
                <div className="action-content">
                  <h4>Edit Profile</h4>
                  <p>Update your personal information</p>
                </div>
              </Link>

              <Link 
                to="#addresses"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.hash = 'addresses';
                }}
                className="action-card"
              >
                <div className="action-icon">
                  <i className="icon-location-pin"></i>
                </div>
                <div className="action-content">
                  <h4>Manage Addresses</h4>
                  <p>Add or edit shipping addresses</p>
                </div>
              </Link>

              <Link to="/shop" className="action-card">
                <div className="action-icon">
                  <i className="icon-handbag"></i>
                </div>
                <div className="action-content">
                  <h4>Continue Shopping</h4>
                  <p>Explore our latest products</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Address Overview */}
          <div className="address-overview">
            <h3>Your Addresses</h3>
            <div className="addresses-grid">
              <div className="address-card">
                <div className="address-header">
                  <h4>
                    <i className="icon-truck"></i>
                    Shipping Address
                  </h4>
                  {defaultAddresses.shipping && <span className="default-badge">Default</span>}
                </div>
                <div className="address-content">
                  {defaultAddresses.shipping ? (
                    <>
                      {formatAddress(defaultAddresses.shipping)}
                      <Link 
                        to="#addresses"
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.hash = 'addresses';
                        }}
                        className="edit-link"
                      >
                        <i className="icon-pencil"></i>
                        Edit Address
                      </Link>
                    </>
                  ) : (
                    <div className="no-address">
                      <i className="icon-plus"></i>
                      <p>No shipping address set</p>
                      <Link 
                        to="#addresses"
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.hash = 'addresses';
                        }}
                        className="add-link"
                      >
                        Add Address
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              <div className="address-card">
                <div className="address-header">
                  <h4>
                    <i className="icon-credit-card"></i>
                    Billing Address
                  </h4>
                  {defaultAddresses.billing && <span className="default-badge">Default</span>}
                </div>
                <div className="address-content">
                  {defaultAddresses.billing ? (
                    <>
                      {formatAddress(defaultAddresses.billing)}
                      <Link 
                        to="#addresses"
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.hash = 'addresses';
                        }}
                        className="edit-link"
                      >
                        <i className="icon-pencil"></i>
                        Edit Address
                      </Link>
                    </>
                  ) : (
                    <div className="no-address">
                      <i className="icon-plus"></i>
                      <p>No billing address set</p>
                      <Link 
                        to="#addresses"
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.hash = 'addresses';
                        }}
                        className="add-link"
                      >
                        Add Address
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Dashboard Styles */}
      <style jsx>{`
        .dashboard-summary {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        .dashboard-header h2 {
          margin: 0;
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
        }

        .welcome-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%);
          color: #92400e;
          padding: 12px 20px;
          border-radius: 50px;
          font-size: 14px;
          font-weight: 500;
        }

        .welcome-badge i {
          color: #f59e0b;
        }

        .loading-state {
          text-align: center;
          padding: 60px 20px;
        }

        .loading-spinner {
          margin-bottom: 20px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f4f6;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }

        .stat-card {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          border-radius: 16px;
          padding: 24px;
          border: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          gap: 20px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: white;
        }

        .stat-icon.orders {
          background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
        }

        .stat-icon.addresses {
          background: linear-gradient(135deg, #10b981 0%, #047857 100%);
        }

        .stat-icon.member {
          background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
        }

        .stat-content h3 {
          margin: 0 0 5px 0;
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
        }

        .stat-content p {
          margin: 0 0 10px 0;
          color: #6b7280;
          font-weight: 500;
        }

        .stat-link {
          color: #667eea;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .stat-link:hover {
          color: #4f46e5;
        }

        .quick-actions {
          background: #f8fafc;
          border-radius: 16px;
          padding: 30px;
        }

        .quick-actions h3 {
          margin: 0 0 24px 0;
          font-size: 1.5rem;
          font-weight: 600;
          color: #1f2937;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .action-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 15px;
          text-decoration: none;
          color: inherit;
          transition: all 0.3s ease;
          border: 1px solid #e5e7eb;
        }

        .action-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          text-decoration: none;
          color: inherit;
        }

        .action-icon {
          width: 50px;
          height: 50px;
          border-radius: 10px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 20px;
        }

        .action-content h4 {
          margin: 0 0 5px 0;
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
        }

        .action-content p {
          margin: 0;
          font-size: 14px;
          color: #6b7280;
        }

        .address-overview h3 {
          margin: 0 0 24px 0;
          font-size: 1.5rem;
          font-weight: 600;
          color: #1f2937;
        }

        .addresses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }

        .address-card {
          background: white;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
        }

        .address-header {
          background: linear-gradient(135deg, #f8fafc 0%, #e5e7eb 100%);
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .address-header h4 {
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
        }

        .default-badge {
          background: #10b981;
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .address-content {
          padding: 20px;
        }

        .address-content p {
          margin: 0 0 5px 0;
          color: #374151;
          font-size: 14px;
        }

        .edit-link, .add-link {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: #667eea;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          margin-top: 15px;
          transition: color 0.2s ease;
        }

        .edit-link:hover, .add-link:hover {
          color: #4f46e5;
          text-decoration: none;
        }

        .no-address {
          text-align: center;
          padding: 20px 0;
        }

        .no-address i {
          font-size: 32px;
          color: #d1d5db;
          margin-bottom: 10px;
        }

        .no-address p {
          color: #9ca3af;
          margin-bottom: 15px;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .dashboard-header h2 {
            font-size: 1.5rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .actions-grid {
            grid-template-columns: 1fr;
          }

          .addresses-grid {
            grid-template-columns: 1fr;
          }

          .stat-card {
            flex-direction: column;
            text-align: center;
          }

          .action-card {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
