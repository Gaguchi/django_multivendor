import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Home from './Svgs/Home';
import Attributes from './Svgs/Attributes';
import Faq from './Svgs/Faq';
import LogOut from './Svgs/LogOut';
import Online from './Svgs/Online';
import Order from './Svgs/Order';
import Setting from './Svgs/Setting';

export default function SideMenu() {
    // Get current location
    const location = useLocation();
    const currentPath = location.pathname;
    
    // State to track which menu items are expanded
    const [expandedMenus, setExpandedMenus] = useState({});
    
    // Function to toggle menu expansion
    const toggleMenu = (menuKey) => {
        setExpandedMenus(prev => ({
            ...prev,
            [menuKey]: !prev[menuKey]
        }));
    };
    
    // Function to check if route is active
    const isActive = (path) => currentPath === path;
    
    // Function to check if any child route is active
    const hasActiveChild = (paths) => {
        return paths.some(path => currentPath.startsWith(path));
    };
    
    // Function to handle logout
    const handleLogout = () => {
        // Clear localStorage
        localStorage.clear();
        // Redirect to login page
        window.location.href = '/login';
    };

    return (
        <>
        {/* section-menu-left */}
        <div className="section-menu-left">
          <div className="box-logo">
            <Link to="/" id="site-logo-inner">
              <img
                className=""
                id="logo_header"
                alt=""
                src="../images/logo/logo.svg"
                data-light="../images/logo/logo.svg"
                data-dark="../images/logo/logo-white.svg"
              />
            </Link>
            <div className="button-show-hide">
              <i className="icon-chevron-left" />
            </div>
          </div>
          <div className="section-menu-left-wrap">
            <div className="center">
              <div className="center-item">
                <ul className="">
                  <li className={`menu-item ${isActive('/') ? 'active' : ''}`}>
                    <Link to="/">
                      <Home />
                      <div className="text">Home</div>
                    </Link>
                  </li>
                  <li className={`menu-item has-children ${expandedMenus['products'] ? 'active' : ''} ${hasActiveChild(['/products', '/addproduct']) ? 'active' : ''}`}>
                    <a 
                      href="#" 
                      onClick={(e) => {e.preventDefault(); toggleMenu('products');}}
                      className="menu-item-button"
                    >
                      <div className="icon">
                        <i className="icon-file-plus" />
                      </div>
                      <div className="text">Products</div>
                    </a>
                    <ul className={`sub-menu ${expandedMenus['products'] ? 'show' : ''}`}>
                      <li className={`sub-menu-item ${isActive('/products') ? 'active' : ''}`}>
                        <Link to="/products">
                          <div className="text">All Products</div>
                        </Link>
                      </li>
                      <li className={`sub-menu-item ${isActive('/addproduct') ? 'active' : ''}`}>
                        <Link to="/addproduct">
                          <div className="text">Add Product</div>
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li className={`menu-item has-children ${expandedMenus['warehouses'] ? 'active' : ''}`}>
                    <a 
                      href="#" 
                      onClick={(e) => {e.preventDefault(); toggleMenu('warehouses');}}
                      className="menu-item-button"
                    >
                      <div className="icon">
                        <i className="icon-package" />
                      </div>
                      <div className="text">Warehouses</div>
                    </a>
                    <ul className={`sub-menu ${expandedMenus['warehouses'] ? 'show' : ''}`}>
                      <li className="sub-menu-item">
                        <Link to="/warehouses">
                          <div className="text">Warehouses list</div>
                        </Link>
                      </li>
                      <li className="sub-menu-item">
                        <Link to="/warehouses/new">
                          <div className="text">New Warehouse</div>
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li className={`menu-item has-children ${expandedMenus['messages'] ? 'active' : ''}`}>
                    <a 
                      href="#" 
                      onClick={(e) => {e.preventDefault(); toggleMenu('messages');}}
                      className="menu-item-button"
                    >
                      <div className="icon">
                        <i className="icon-message-square" />
                      </div>
                      <div className="text">Messages</div>
                    </a>
                    <ul className={`sub-menu ${expandedMenus['messages'] ? 'show' : ''}`}>
                      <li className="sub-menu-item">
                        <Link to="/attributes">
                          <div className="text">Attributes</div>
                        </Link>
                      </li>
                      <li className="sub-menu-item">
                        <Link to="/attributes/add">
                          <div className="text">Add attributes</div>
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li className={`menu-item has-children ${expandedMenus['orders'] ? 'active' : ''}`}>
                    <a 
                      href="#" 
                      onClick={(e) => {e.preventDefault(); toggleMenu('orders');}}
                      className="menu-item-button"
                    >
                      <Order />
                      <div className="text">Orders</div>
                    </a>
                    <ul className={`sub-menu ${expandedMenus['orders'] ? 'show' : ''}`}>
                      <li className="sub-menu-item">
                        <Link to="/orders">
                          <div className="text">Order list</div>
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li className={`menu-item has-children ${expandedMenus['account'] ? 'active' : ''}`}>
                    <a 
                      href="#" 
                      onClick={(e) => {e.preventDefault(); toggleMenu('account');}}
                      className="menu-item-button"
                    >
                      <div className="icon">
                        <i className="icon-user" />
                      </div>
                      <div className="text">Account</div>
                    </a>
                    <ul className={`sub-menu ${expandedMenus['account'] ? 'show' : ''}`}>
                      <li className="sub-menu-item">
                        <Link to="/users">
                          <div className="text">All user</div>
                        </Link>
                      </li>
                      <li className="sub-menu-item">
                        <Link to="/users/new">
                          <div className="text">Add new user</div>
                        </Link>
                      </li>
                      <li className="sub-menu-item">
                        <Link to="/login">
                          <div className="text">Login</div>
                        </Link>
                      </li>
                      <li className="sub-menu-item">
                        <Link to="/signup">
                          <div className="text">Sign up</div>
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li className={`menu-item has-children ${expandedMenus['notifications'] ? 'active' : ''}`}>
                    <a 
                      href="#" 
                      onClick={(e) => {e.preventDefault(); toggleMenu('notifications');}}
                      className="menu-item-button"
                    >
                      <div className="icon">
                        <i className="icon-bell" />
                      </div>
                      <div className="text">Notifications</div>
                    </a>
                    <ul className={`sub-menu ${expandedMenus['notifications'] ? 'show' : ''}`}>
                      <li className="sub-menu-item">
                        <a href="http://shop.bazro.ge" target="_blank" rel="noopener noreferrer">
                          <div className="text">View Store</div>
                        </a>
                      </li>
                      <li className="sub-menu-item">
                        <Link to="/store-settings">
                          <div className="text">Store Setting</div>
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li className="menu-item">
                    <Link to="/reports">
                      <div className="icon">
                        <i className="icon-pie-chart" />
                      </div>
                      <div className="text">Reports</div>
                    </Link>
                  </li>
                  <li className="menu-item">
                    <Link to="/settings">
                      <Setting />
                      <div className="text">Settings</div>
                    </Link>
                  </li>
                  <li className="menu-item">
                    <Link to="/faq">
                      <Faq />
                      <div className="text">FAQs</div>
                    </Link>
                  </li>
                  <li className="menu-item">
                    <a href="#" onClick={handleLogout}>
                      <LogOut />
                      <div className="text">Log out</div>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* /section-menu-left */}
        </>
    )
}