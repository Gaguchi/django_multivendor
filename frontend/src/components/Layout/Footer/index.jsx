import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="footer bg-dark">
            <div className="footer-middle">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 col-md-6">
                            <div className="widget">
                                <h4 className="widget-title">Contact Us</h4>
                                <ul className="contact-info">
                                    <li>
                                        <span className="contact-info-label">Address:</span>123 Street Name, City, Country
                                    </li>
                                    <li>
                                        <span className="contact-info-label">Phone:</span>Toll Free <a href="tel:">(123) 456-7890</a>
                                    </li>
                                    <li>
                                        <span className="contact-info-label">Email:</span> <a href="mailto:mail@example.com">mail@example.com</a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-6">
                            <div className="widget">
                                <h4 className="widget-title">Customer Service</h4>

                                <ul className="links">
                                    <li><Link to="/account/orders">Order History</Link></li>
                                    <li><Link to="/track">Order Tracking</Link></li>  {/* Add tracking link */}
                                    <li><Link to="/account">My Account</Link></li>
                                    <li><Link to="/wishlist">Wishlist</Link></li>
                                    <li><Link to="/blog">Blog</Link></li>
                                    <li><Link to="/contact">Contact</Link></li>
                                </ul>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-6">
                            <div className="widget">
                                <h4 className="widget-title">Popular Tags</h4>
                                
                                <div className="tagcloud">
                                    <a href="#">Clothes</a>
                                    <a href="#">Fashion</a>
                                    <a href="#">Hub</a>
                                    <a href="#">Shirt</a>
                                    <a href="#">Shoes</a>
                                    <a href="#">Skirt</a>
                                    <a href="#">Sports</a>
                                    <a href="#">Sweater</a>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-6">
                            <div className="widget widget-newsletter">
                                <h4 className="widget-title">Subscribe newsletter</h4>
                                <p>Get all the latest information on events, sales and offers. Sign up for newsletter:</p>
                                <form action="#" className="mb-0">
                                    <input type="email" className="form-control m-b-3" placeholder="Email address" required />

                                    <input type="submit" className="btn btn-primary shadow-none" value="Subscribe" />
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="footer-bottom d-flex justify-content-between align-items-center flex-wrap">
                    <p className="footer-copyright py-3 pr-4 mb-0">© MultiVendor. 2023. All Rights Reserved</p>
                </div>
            </div>
        </footer>
    )
}
