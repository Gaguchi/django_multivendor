import { Link, useLocation } from 'react-router-dom';
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
    
    // Function to check if route is active
    const isActive = (path) => currentPath === path;
    
    // Function to check if any child route is active
    const hasActiveChild = (paths) => {
        return paths.some(path => currentPath.startsWith(path));
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
                  <li className={`menu-item has-children ${hasActiveChild(['/products', '/addproduct']) ? 'active' : ''}`}>
                    <a href="javascript:void(0);" className="menu-item-button">
                      <div className="icon">
                        <i className="icon-file-plus" />
                      </div>
                      <div className="text">Product</div>
                    </a>
                    <ul className="sub-menu">
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
                  <li className="menu-item has-children">
                    <a href="javascript:void(0);" className="menu-item-button">
                      <div className="icon">
                        <i className="icon-layers" />
                      </div>
                      <div className="text">Category</div>
                    </a>
                    <ul className="sub-menu">
                      <li className="sub-menu-item">
                        <a href="category-list.html" className="">
                          <div className="text">Category list</div>
                        </a>
                      </li>
                      <li className="sub-menu-item">
                        <a href="new-category.html" className="">
                          <div className="text">New category</div>
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li className="menu-item has-children">
                    <a href="javascript:void(0);" className="menu-item-button">
                      <Attributes />
                      <div className="text">Attributes</div>
                    </a>
                    <ul className="sub-menu">
                      <li className="sub-menu-item">
                        <a href="attributes.html" className="">
                          <div className="text">Attributes</div>
                        </a>
                      </li>
                      <li className="sub-menu-item">
                        <a href="add-attributes.html" className="">
                          <div className="text">Add attributes</div>
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li className="menu-item has-children">
                    <a href="javascript:void(0);" className="menu-item-button">
                      <Order />
                      <div className="text">Order</div>
                    </a>
                    <ul className="sub-menu">
                      <li className="sub-menu-item">
                        <a href="oder-list.html" className="">
                          <div className="text">Order list</div>
                        </a>
                      </li>
                      <li className="sub-menu-item">
                        <a href="oder-detail.html" className="">
                          <div className="text">Order detail</div>
                        </a>
                      </li>
                      <li className="sub-menu-item">
                        <a href="oder-tracking.html" className="">
                          <div className="text">Order tracking</div>
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li className="menu-item has-children">
                    <a href="javascript:void(0);" className="menu-item-button">
                      <div className="icon">
                        <i className="icon-user" />
                      </div>
                      <div className="text">Users</div>
                    </a>
                    <ul className="sub-menu">
                      <li className="sub-menu-item">
                        <a href="all-user.html" className="">
                          <div className="text">All user</div>
                        </a>
                      </li>
                      <li className="sub-menu-item">
                        <a href="add-new-user.html" className="">
                          <div className="text">Add new user</div>
                        </a>
                      </li>
                      <li className="sub-menu-item">
                        <a href="login.html" className="">
                          <div className="text">Login</div>
                        </a>
                      </li>
                      <li className="sub-menu-item">
                        <a href="sign-up.html" className="">
                          <div className="text">Sign up</div>
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li className="menu-item has-children">
                    <a href="javascript:void(0);" className="menu-item-button">
                      <Online />
                      <div className="text">Online Store</div>
                    </a>
                    <ul className="sub-menu">
                      <li className="sub-menu-item">
                        <a href="../index.html" className="">
                          <div className="text">View Store</div>
                        </a>
                      </li>
                      <li className="sub-menu-item">
                        <a href="store-setting.html" className="">
                          <div className="text">Store Setting</div>
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li className="menu-item">
                    <a href="report.html" className="">
                      <div className="icon">
                        <i className="icon-pie-chart" />
                      </div>
                      <div className="text">Report</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="setting.html" className="">
                      <Setting />
                      <div className="text">Setting</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="faq.html" className="">
                      <Faq />
                      <div className="text">FAQ</div>
                    </a>
                  </li>
                  <li className="menu-item">
                    <a href="login.html" className="">
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