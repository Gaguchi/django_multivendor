import { useState, useEffect } from 'react'
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// Import Dashboard Components
import DashboardSummary from '../components/Dashboard/DashboardSummary'
import OrdersList from '../components/Dashboard/OrdersList'
import AddressesList from '../components/Dashboard/AddressesList'

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
            // Implementation would go here
            // await api.updateUserProfile(formData);
        } catch (error) {
            setError('Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    // If not authenticated, redirect to login page
    useEffect(() => {
        if (!user && location.pathname.includes('/account')) {
            navigate('/login', { state: { from: location } });
        }
    }, [user, navigate, location]);

    // Show loading state when checking auth
    if (!user) {
        return (
            <div className="container">
                <div className="text-center py-5">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="account-page">
            {/* Header Section */}
            <div className="account-header">
                <div className="container">
                    <div className="account-header-content">
                        <div className="user-welcome">
                            <div className="user-avatar">
                                <div className="avatar-circle">
                                    <i className="icon-user"></i>
                                </div>
                            </div>
                            <div className="welcome-text">
                                <h1>Welcome back, {user?.profile?.first_name || user?.username || 'User'}!</h1>
                                <p>Manage your account, orders, and preferences</p>
                            </div>
                        </div>
                        <button className="logout-btn" onClick={handleLogout}>
                            <i className="icon-logout"></i>
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="account-layout">
                    {/* Sidebar Navigation */}
                    <div className="account-sidebar">
                        <div className="sidebar-menu">
                            <div className="menu-section">
                                <h3>Overview</h3>
                                <ul>
                                    <li>
                                        <button 
                                            className={`menu-item ${activeSection === 'dashboard' ? 'active' : ''}`}
                                            onClick={() => handleSectionChange('dashboard')}
                                        >
                                            <i className="icon-dashboard"></i>
                                            <span>Dashboard</span>
                                        </button>
                                    </li>
                                    <li>
                                        <button 
                                            className={`menu-item ${activeSection === 'orders' ? 'active' : ''}`}
                                            onClick={() => handleSectionChange('orders')}
                                        >
                                            <i className="icon-bag"></i>
                                            <span>My Orders</span>
                                            <span className="badge">2</span>
                                        </button>
                                    </li>
                                </ul>
                            </div>

                            <div className="menu-section">
                                <h3>Account</h3>
                                <ul>
                                    <li>
                                        <button 
                                            className={`menu-item ${activeSection === 'account-details' ? 'active' : ''}`}
                                            onClick={() => handleSectionChange('account-details')}
                                        >
                                            <i className="icon-user"></i>
                                            <span>Personal Info</span>
                                        </button>
                                    </li>
                                    <li>
                                        <button 
                                            className={`menu-item ${activeSection === 'addresses' ? 'active' : ''}`}
                                            onClick={() => handleSectionChange('addresses')}
                                        >
                                            <i className="icon-location"></i>
                                            <span>Addresses</span>
                                        </button>
                                    </li>
                                    <li>
                                        <button 
                                            className={`menu-item ${activeSection === 'account-security' ? 'active' : ''}`}
                                            onClick={() => handleSectionChange('account-security')}
                                        >
                                            <i className="icon-shield"></i>
                                            <span>Security</span>
                                        </button>
                                    </li>
                                    <li>
                                        <button 
                                            className={`menu-item ${activeSection === 'account-preferences' ? 'active' : ''}`}
                                            onClick={() => handleSectionChange('account-preferences')}
                                        >
                                            <i className="icon-settings"></i>
                                            <span>Preferences</span>
                                        </button>
                                    </li>
                                </ul>
                            </div>

                            <div className="menu-section">
                                <h3>More</h3>
                                <ul>
                                    <li>
                                        <button 
                                            className={`menu-item ${activeSection === 'downloads' ? 'active' : ''}`}
                                            onClick={() => handleSectionChange('downloads')}
                                        >
                                            <i className="icon-download"></i>
                                            <span>Downloads</span>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="account-content">
                        <div className="content-wrapper">
                            {/* Error Display */}
                            {error && (
                                <div className="alert alert-error">
                                    <div className="alert-content">
                                        <h4>Error</h4>
                                        <p>{error}</p>
                                    </div>
                                </div>
                            )}

                            {/* Dashboard Section */}
                            {activeSection === 'dashboard' && (
                                <DashboardSummary />
                            )}

                            {/* Orders Section */}
                            {activeSection === 'orders' && (
                                <div className="orders-content">
                                    <div className="section-header">
                                        <h2>My Orders</h2>
                                        <p>Track and manage your orders</p>
                                    </div>
                                    <OrdersList />
                                </div>
                            )}
                            
                            {/* Addresses Section */}
                            {activeSection === 'addresses' && (
                                <div className="addresses-content">
                                    <div className="section-header">
                                        <h2>My Addresses</h2>
                                        <p>Manage your shipping and billing addresses</p>
                                    </div>
                                    <AddressesList />
                                </div>
                            )}

                            {/* Account Details Section */}
                            {activeSection === 'account-details' && (
                                <div className="account-details-content">
                                    <div className="section-header">
                                        <h2>Personal Information</h2>
                                        <p>Update your personal details</p>
                                    </div>
                                    <div className="form-card">
                                        <form>
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label htmlFor="firstName">First Name</label>
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        id="firstName" 
                                                        defaultValue={user?.profile?.first_name || ''}
                                                    />
                                                </div>
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
                                            <div className="form-group">
                                                <label htmlFor="email">Email Address</label>
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
                                            <div className="form-actions">
                                                <button type="submit" className="btn-primary" disabled={loading}>
                                                    {loading ? 'Saving...' : 'Save Changes'}
                                                </button>
                                                <button type="button" className="btn-secondary">Cancel</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}
                            
                            {/* Security Section */}
                            {activeSection === 'account-security' && (
                                <div className="security-content">
                                    <div className="section-header">
                                        <h2>Password & Security</h2>
                                        <p>Update your password and security settings</p>
                                    </div>
                                    <div className="form-card">
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
                                            <div className="form-actions">
                                                <button type="submit" className="btn-primary" disabled={loading}>
                                                    {loading ? 'Updating...' : 'Update Password'}
                                                </button>
                                                <button type="button" className="btn-secondary">Cancel</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}
                            
                            {/* Preferences Section */}
                            {activeSection === 'account-preferences' && (
                                <div className="preferences-content">
                                    <div className="section-header">
                                        <h2>Communication Preferences</h2>
                                        <p>Manage how we communicate with you</p>
                                    </div>
                                    <div className="form-card">
                                        <form>
                                            <div className="preferences-section">
                                                <h4>Email Notifications</h4>
                                                <div className="checkbox-group">
                                                    <label className="checkbox-label">
                                                        <input type="checkbox" defaultChecked />
                                                        <span className="checkmark"></span>
                                                        Order updates and account information
                                                    </label>
                                                    <label className="checkbox-label">
                                                        <input type="checkbox" />
                                                        <span className="checkmark"></span>
                                                        Promotions and new products
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="preferences-section">
                                                <h4>SMS Notifications</h4>
                                                <div className="checkbox-group">
                                                    <label className="checkbox-label">
                                                        <input type="checkbox" />
                                                        <span className="checkmark"></span>
                                                        Order delivery updates
                                                    </label>
                                                    <label className="checkbox-label">
                                                        <input type="checkbox" />
                                                        <span className="checkmark"></span>
                                                        Special offers and deals
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="form-actions">
                                                <button type="submit" className="btn-primary" disabled={loading}>
                                                    {loading ? 'Saving...' : 'Save Preferences'}
                                                </button>
                                                <button type="button" className="btn-secondary">Reset</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}

                            {/* Downloads Section */}
                            {activeSection === 'downloads' && (
                                <div className="downloads-content">
                                    <div className="section-header">
                                        <h2>Downloads</h2>
                                        <p>Access your digital purchases and invoices</p>
                                    </div>
                                    <div className="downloads-list">
                                        <div className="download-item">
                                            <div className="download-info">
                                                <h4>Order #12345 Invoice</h4>
                                                <p>Downloaded 2 times • Last: Jan 15, 2024</p>
                                            </div>
                                            <button className="btn-download">
                                                <i className="icon-download"></i>
                                                Download
                                            </button>
                                        </div>
                                        <div className="download-item">
                                            <div className="download-info">
                                                <h4>Order #12344 Invoice</h4>
                                                <p>Downloaded 1 time • Last: Jan 10, 2024</p>
                                            </div>
                                            <button className="btn-download">
                                                <i className="icon-download"></i>
                                                Download
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .account-page {
                    min-height: calc(100vh - 100px);
                    background-color: #f8f9fa;
                }

                .account-header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 40px 0;
                    margin-bottom: 30px;
                }

                .account-header-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .user-welcome {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }

                .user-avatar {
                    flex-shrink: 0;
                }

                .avatar-circle {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 32px;
                    color: white;
                }

                .welcome-text h1 {
                    margin: 0 0 5px 0;
                    font-size: 2.5rem;
                    font-weight: 600;
                }

                .welcome-text p {
                    margin: 0;
                    opacity: 0.9;
                    font-size: 1.1rem;
                }

                .logout-btn {
                    background: rgba(255, 255, 255, 0.2);
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    color: white;
                    padding: 12px 24px;
                    border-radius: 50px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.3s ease;
                    cursor: pointer;
                }

                .logout-btn:hover {
                    background: rgba(255, 255, 255, 0.3);
                    border-color: rgba(255, 255, 255, 0.5);
                    color: white;
                    text-decoration: none;
                }

                .account-layout {
                    display: grid;
                    grid-template-columns: 280px 1fr;
                    gap: 40px;
                    margin-bottom: 40px;
                }

                .account-sidebar {
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                    height: fit-content;
                    position: sticky;
                    top: 20px;
                }

                .sidebar-menu {
                    padding: 30px;
                    display: flex;
                    flex-direction: column;
                    gap: 30px;
                }

                .menu-section h3 {
                    font-size: 0.85rem;
                    text-transform: uppercase;
                    font-weight: 700;
                    color: #8e9aaf;
                    letter-spacing: 1px;
                    margin: 0 0 15px 0;
                }

                .menu-section ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .menu-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 16px;
                    border: none;
                    background: none;
                    color: #6c757d;
                    font-weight: 500;
                    border-radius: 12px;
                    transition: all 0.2s ease;
                    cursor: pointer;
                    width: 100%;
                    text-align: left;
                    position: relative;
                }

                .menu-item:hover {
                    background-color: #f8f9fa;
                    color: #495057;
                }

                .menu-item.active {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
                }

                .menu-item i {
                    font-size: 18px;
                    width: 20px;
                    text-align: center;
                }

                .menu-item span {
                    flex: 1;
                }

                .badge {
                    background: #dc3545;
                    color: white;
                    font-size: 0.75rem;
                    padding: 4px 8px;
                    border-radius: 50px;
                    font-weight: 600;
                    min-width: 20px;
                    text-align: center;
                }

                .menu-item.active .badge {
                    background: rgba(255, 255, 255, 0.3);
                }

                .account-content {
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                    overflow: hidden;
                }

                .content-wrapper {
                    padding: 40px;
                }

                .section-header {
                    margin-bottom: 30px;
                    padding-bottom: 20px;
                    border-bottom: 2px solid #f1f3f4;
                }

                .section-header h2 {
                    margin: 0 0 8px 0;
                    font-size: 2rem;
                    font-weight: 600;
                    color: #2c3e50;
                }

                .section-header p {
                    margin: 0;
                    color: #6c757d;
                    font-size: 1.1rem;
                }

                .form-card {
                    background: #f8f9fa;
                    border-radius: 12px;
                    padding: 30px;
                    margin-top: 20px;
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    margin-bottom: 20px;
                }

                .form-group {
                    margin-bottom: 20px;
                }

                .form-group label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 600;
                    color: #2c3e50;
                }

                .form-control {
                    width: 100%;
                    padding: 12px 16px;
                    border: 2px solid #e9ecef;
                    border-radius: 8px;
                    font-size: 1rem;
                    transition: all 0.2s ease;
                    background: white;
                }

                .form-control:focus {
                    outline: none;
                    border-color: #667eea;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                }

                .form-actions {
                    display: flex;
                    gap: 15px;
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid #e9ecef;
                }

                .btn-primary {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    padding: 12px 30px;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .btn-primary:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
                }

                .btn-primary:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .btn-secondary {
                    background: #f8f9fa;
                    color: #6c757d;
                    border: 2px solid #e9ecef;
                    padding: 10px 28px;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .btn-secondary:hover {
                    background: #e9ecef;
                    color: #495057;
                }

                .preferences-section {
                    margin-bottom: 30px;
                }

                .preferences-section h4 {
                    margin-bottom: 15px;
                    color: #2c3e50;
                    font-weight: 600;
                }

                .checkbox-group {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .checkbox-label {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    cursor: pointer;
                    padding: 8px 0;
                }

                .checkbox-label input[type="checkbox"] {
                    display: none;
                }

                .checkmark {
                    width: 20px;
                    height: 20px;
                    border: 2px solid #e9ecef;
                    border-radius: 4px;
                    position: relative;
                    transition: all 0.2s ease;
                }

                .checkbox-label input[type="checkbox"]:checked + .checkmark {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-color: #667eea;
                }

                .checkbox-label input[type="checkbox"]:checked + .checkmark::after {
                    content: "✓";
                    position: absolute;
                    color: white;
                    font-weight: bold;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 12px;
                }

                .downloads-list {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }

                .download-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px;
                    background: #f8f9fa;
                    border-radius: 12px;
                    border: 2px solid #e9ecef;
                    transition: all 0.2s ease;
                }

                .download-item:hover {
                    border-color: #667eea;
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
                }

                .download-info h4 {
                    margin: 0 0 5px 0;
                    color: #2c3e50;
                    font-weight: 600;
                }

                .download-info p {
                    margin: 0;
                    color: #6c757d;
                    font-size: 0.9rem;
                }

                .btn-download {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.2s ease;
                }

                .btn-download:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
                }

                .alert {
                    padding: 20px;
                    border-radius: 12px;
                    margin-bottom: 30px;
                    border: none;
                }

                .alert-error {
                    background: #f8d7da;
                    color: #721c24;
                    border-left: 4px solid #dc3545;
                }

                .alert-content h4 {
                    margin: 0 0 5px 0;
                    font-size: 16px;
                    font-weight: 600;
                }

                .alert-content p {
                    margin: 0;
                    font-size: 14px;
                }

                /* Responsive Design */
                @media (max-width: 1024px) {
                    .account-layout {
                        grid-template-columns: 250px 1fr;
                        gap: 30px;
                    }
                    
                    .content-wrapper {
                        padding: 30px;
                    }
                }

                @media (max-width: 768px) {
                    .account-header-content {
                        flex-direction: column;
                        gap: 20px;
                        text-align: center;
                    }

                    .user-welcome {
                        flex-direction: column;
                        gap: 15px;
                    }

                    .welcome-text h1 {
                        font-size: 2rem;
                    }

                    .account-layout {
                        grid-template-columns: 1fr;
                        gap: 20px;
                    }

                    .account-sidebar {
                        order: 2;
                        position: static;
                    }

                    .content-wrapper {
                        padding: 20px;
                    }

                    .sidebar-menu {
                        gap: 20px;
                    }

                    .menu-section ul {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                        gap: 10px;
                    }
                }

                @media (max-width: 576px) {
                    .account-header {
                        padding: 20px 0;
                    }

                    .avatar-circle {
                        width: 60px;
                        height: 60px;
                        font-size: 24px;
                    }

                    .welcome-text h1 {
                        font-size: 1.5rem;
                    }

                    .logout-btn {
                        padding: 8px 16px;
                        font-size: 14px;
                    }

                    .logout-btn span {
                        display: none;
                    }
                }
            `}</style>
        </div>
    )
}
