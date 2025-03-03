import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../assets/css/account.css';
import api from '../services/api';

// Import Dashboard Components
import DashboardSummary from '../components/Dashboard/DashboardSummary';
import OrdersList from '../components/Dashboard/OrdersList';
import AddressesList from '../components/Dashboard/AddressesList';

export default function Account() {
    const { user, logout } = useAuth();
    const [searchParams] = useSearchParams();
    const [activeSection, setActiveSection] = useState('dashboard');
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    // Handle section from hash or query params
    useEffect(() => {
        // Check for section in hash (e.g. #addresses)
        if (location.hash) {
            const section = location.hash.substring(1);
            setActiveSection(section);
            return;
        }
        
        // Check for section in query params (e.g. ?section=addresses)
        const sectionParam = searchParams.get('section');
        if (sectionParam) {
            setActiveSection(sectionParam);
            return;
        }
    }, [location.hash, searchParams]);
    
    // Handle section navigation
    const handleSectionChange = (section) => {
        setActiveSection(section);
        // Update URL hash for better navigation
        window.history.pushState(null, '', `#${section}`);
    };
    
    // Handle logout
    const handleLogout = (e) => {
        e.preventDefault();
        logout();
        navigate('/');
    };

    // Handle user profile update
    const handleProfileUpdate = async (formData) => {
        try {
            setLoading(true);
            setError('');
            await api.patch('/api/users/profile/update/', {
                profile: formData
            });
            // Success handling
        } catch (error) {
            setError('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };
    
    // If not authenticated, redirect to login page
    useEffect(() => {
        if (!user) {
            navigate('/login', { state: { redirect: location.pathname } });
        }
    }, [user, navigate, location]);

    // Show loading state when checking auth
    if (!user) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
                <p className="mt-2">Checking authentication...</p>
            </div>
        );
    }

    return (
        <div className="container account-container custom-account-container py-5">
            <div className="row">
                {/* Account Sidebar */}
                <div className="sidebar widget widget-dashboard mb-lg-0 mb-3 col-lg-3 order-0">
                    <h2 className="text-uppercase mb-3">My Account</h2>
                    <ul className="nav nav-tabs list flex-column mb-0" role="tablist">
                        {/* Dashboard */}
                        <li className="nav-item">
                            <a
                                className={`nav-link ${activeSection === 'dashboard' ? 'active' : ''}`}
                                onClick={() => handleSectionChange('dashboard')}
                                href="#dashboard"
                                role="tab"
                                aria-selected={activeSection === 'dashboard'}
                            >
                                Dashboard
                            </a>
                        </li>
                        
                        {/* Orders Section with Sublinks */}
                        <li className="nav-item">
                            <a
                                className={`nav-link ${activeSection.startsWith('order') ? 'active' : ''}`}
                                onClick={() => handleSectionChange('orders')}
                                href="#orders"
                                role="tab"
                                aria-selected={activeSection.startsWith('order')}
                            >
                                Orders
                            </a>
                            {activeSection.startsWith('order') && (
                                <ul className="nav flex-column ml-3 mb-1">
                                    <li className="nav-item">
                                        <a 
                                            className={`nav-link smaller ${activeSection === 'orders' ? 'active' : ''}`}
                                            onClick={() => handleSectionChange('orders')}
                                            href="#orders"
                                        >
                                            All Orders
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a 
                                            className={`nav-link smaller ${activeSection === 'orders-recent' ? 'active' : ''}`}
                                            onClick={() => handleSectionChange('orders-recent')}
                                            href="#orders-recent"
                                        >
                                            Recent Orders
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a 
                                            className={`nav-link smaller ${activeSection === 'orders-returns' ? 'active' : ''}`}
                                            onClick={() => handleSectionChange('orders-returns')}
                                            href="#orders-returns"
                                        >
                                            Returns
                                        </a>
                                    </li>
                                </ul>
                            )}
                        </li>
                        
                        {/* Addresses with Sublinks */}
                        <li className="nav-item">
                            <a
                                className={`nav-link ${activeSection.startsWith('address') ? 'active' : ''}`}
                                onClick={() => handleSectionChange('addresses')}
                                href="#addresses"
                                role="tab"
                                aria-selected={activeSection.startsWith('address')}
                            >
                                Addresses
                            </a>
                            {activeSection.startsWith('address') && (
                                <ul className="nav flex-column ml-3 mb-1">
                                    <li className="nav-item">
                                        <a 
                                            className={`nav-link smaller ${activeSection === 'addresses' ? 'active' : ''}`}
                                            onClick={() => handleSectionChange('addresses')}
                                            href="#addresses"
                                        >
                                            All Addresses
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a 
                                            className={`nav-link smaller ${activeSection === 'address-shipping' ? 'active' : ''}`}
                                            onClick={() => handleSectionChange('address-shipping')}
                                            href="#address-shipping"
                                        >
                                            Shipping Addresses
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a 
                                            className={`nav-link smaller ${activeSection === 'address-billing' ? 'active' : ''}`}
                                            onClick={() => handleSectionChange('address-billing')}
                                            href="#address-billing"
                                        >
                                            Billing Addresses
                                        </a>
                                    </li>
                                </ul>
                            )}
                        </li>

                        {/* Account Settings with Sublinks */}
                        <li className="nav-item">
                            <a
                                className={`nav-link ${activeSection.startsWith('account') ? 'active' : ''}`}
                                onClick={() => handleSectionChange('account-details')}
                                href="#account-details"
                                role="tab"
                                aria-selected={activeSection.startsWith('account')}
                            >
                                Account Settings
                            </a>
                            {activeSection.startsWith('account') && (
                                <ul className="nav flex-column ml-3 mb-1">
                                    <li className="nav-item">
                                        <a 
                                            className={`nav-link smaller ${activeSection === 'account-details' ? 'active' : ''}`}
                                            onClick={() => handleSectionChange('account-details')}
                                            href="#account-details"
                                        >
                                            Personal Information
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a 
                                            className={`nav-link smaller ${activeSection === 'account-security' ? 'active' : ''}`}
                                            onClick={() => handleSectionChange('account-security')}
                                            href="#account-security"
                                        >
                                            Password & Security
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a 
                                            className={`nav-link smaller ${activeSection === 'account-preferences' ? 'active' : ''}`}
                                            onClick={() => handleSectionChange('account-preferences')}
                                            href="#account-preferences"
                                        >
                                            Preferences
                                        </a>
                                    </li>
                                </ul>
                            )}
                        </li>
                        
                        {/* Other menu items */}
                        <li className="nav-item">
                            <Link to="/wishlist" className="nav-link">
                                Wishlist
                            </Link>
                        </li>
                        
                        {/* Logout */}
                        <li className="nav-item">
                            <a className="nav-link" href="#" onClick={handleLogout}>
                                Logout
                            </a>
                        </li>
                    </ul>
                </div>
                
                {/* Account Content */}
                <div className="col-lg-9 order-lg-last order-1 tab-content">
                    {/* Dashboard Section */}
                    {activeSection === 'dashboard' && (
                        <DashboardSummary />
                    )}

                    {/* Orders Section */}
                    {activeSection === 'orders' && (
                        <div className="orders-content">
                            <h2>My Orders</h2>
                            <OrdersList />
                        </div>
                    )}
                    
                    {/* Recent Orders Section */}
                    {activeSection === 'orders-recent' && (
                        <div className="orders-content">
                            <h2>Recent Orders</h2>
                            <OrdersList filter="recent" />
                        </div>
                    )}
                    
                    {/* Order Returns Section */}
                    {activeSection === 'orders-returns' && (
                        <div className="orders-content">
                            <h2>Returns & Refunds</h2>
                            <OrdersList filter="returns" />
                        </div>
                    )}
                    
                    {/* Addresses Section */}
                    {activeSection === 'addresses' && (
                        <div className="addresses-content">
                            <h2>My Addresses</h2>
                            <AddressesList />
                        </div>
                    )}
                    
                    {/* Shipping Addresses Section */}
                    {activeSection === 'address-shipping' && (
                        <div className="addresses-content">
                            <h2>Shipping Addresses</h2>
                            <AddressesList filter="shipping" />
                        </div>
                    )}
                    
                    {/* Billing Addresses Section */}
                    {activeSection === 'address-billing' && (
                        <div className="addresses-content">
                            <h2>Billing Addresses</h2>
                            <AddressesList filter="billing" />
                        </div>
                    )}
                    
                    {/* Account Details Section */}
                    {activeSection === 'account-details' && (
                        <div className="account-details-content">
                            <h2>Personal Information</h2>
                            <div className="card">
                                <div className="card-body">
                                    <form>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label htmlFor="firstName">First Name</label>
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        id="firstName" 
                                                        defaultValue={user?.profile?.first_name || ''}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label htmlFor="lastName">Last Name</label>
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        id="lastName" 
                                                        defaultValue={user?.profile?.last_name || ''}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="email">Email</label>
                                            <input 
                                                type="email" 
                                                className="form-control" 
                                                id="email" 
                                                defaultValue={user?.email || ''}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="phone">Phone Number</label>
                                            <input 
                                                type="tel" 
                                                className="form-control" 
                                                id="phone" 
                                                defaultValue={user?.profile?.phone || ''}
                                            />
                                        </div>
                                        <button type="submit" className="btn btn-primary">Save Changes</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Security Section */}
                    {activeSection === 'account-security' && (
                        <div className="security-content">
                            <h2>Password & Security</h2>
                            <div className="card">
                                <div className="card-body">
                                    <form>
                                        <div className="form-group">
                                            <label htmlFor="currentPassword">Current Password</label>
                                            <input type="password" className="form-control" id="currentPassword" />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="newPassword">New Password</label>
                                            <input type="password" className="form-control" id="newPassword" />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="confirmPassword">Confirm New Password</label>
                                            <input type="password" className="form-control" id="confirmPassword" />
                                        </div>
                                        <button type="submit" className="btn btn-primary">Update Password</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Preferences Section */}
                    {activeSection === 'account-preferences' && (
                        <div className="preferences-content">
                            <h2>Communication Preferences</h2>
                            <div className="card">
                                <div className="card-body">
                                    <form>
                                        <div className="form-group">
                                            <div className="custom-control custom-checkbox">
                                                <input type="checkbox" className="custom-control-input" id="emailOrders" defaultChecked />
                                                <label className="custom-control-label" htmlFor="emailOrders">
                                                    Email me about my orders and account
                                                </label>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="custom-control custom-checkbox">
                                                <input type="checkbox" className="custom-control-input" id="emailPromotions" />
                                                <label className="custom-control-label" htmlFor="emailPromotions">
                                                    Email me about promotions and new products
                                                </label>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="custom-control custom-checkbox">
                                                <input type="checkbox" className="custom-control-input" id="smsOrders" />
                                                <label className="custom-control-label" htmlFor="smsOrders">
                                                    Text me about my orders
                                                </label>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <div className="custom-control custom-checkbox">
                                                <input type="checkbox" className="custom-control-input" id="smsPromotions" />
                                                <label className="custom-control-label" htmlFor="smsPromotions">
                                                    Text me about promotions
                                                </label>
                                            </div>
                                        </div>
                                        <button type="submit" className="btn btn-primary">Save Preferences</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}