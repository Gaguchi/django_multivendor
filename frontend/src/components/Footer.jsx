
export default function Footer() {

  return (
      <>
    <footer className="footer font2 ">
      <div className="container">
        <div className="footer-middle">
          <div className="row">
            <div className="col-lg-3">
              <div className="widget mb-3">
                <h4 className="widget-title">Customer Service</h4>
                <ul className="links">
                  <li>
                    <a href="demo35.html#">Help &amp; FAQs</a>
                  </li>
                  <li>
                    <a href="dashboard.html">Order Tracking</a>
                  </li>
                  <li>
                    <a href="demo35.html#">Shipping &amp; Delivery</a>
                  </li>
                  <li>
                    <a href="demo35.html#">Orders History</a>
                  </li>
                  <li>
                    <a href="demo35.html#">Advanced Search</a>
                  </li>
                  <li>
                    <a href="login.html">Login</a>
                  </li>
                </ul>
              </div>
              {/* End .widget */}
            </div>
            {/* End .col-lg-3 */}
            <div className="col-lg-3">
              <div className="widget mb-3">
                <h4 className="widget-title">About Us</h4>
                <ul className="links">
                  <li>
                    <a href="about.html">About Us</a>
                  </li>
                  <li>
                    <a href="demo35.html#">Careers</a>
                  </li>
                  <li>
                    <a href="demo35.html#">Our Stores</a>
                  </li>
                  <li>
                    <a href="demo35.html#">Corporate Sales</a>
                  </li>
                  <li>
                    <a href="demo35.html#">Careers</a>
                  </li>
                </ul>
              </div>
              {/* End .widget */}
            </div>
            {/* End .col-lg-3 */}
            <div className="col-lg-3">
              <div className="widget mb-3">
                <h4 className="widget-title">More Information</h4>
                <ul className="links">
                  <li>
                    <a href="demo35.html#">Affiliates</a>
                  </li>
                  <li>
                    <a href="demo35.html#">Refer a Friend</a>
                  </li>
                  <li>
                    <a href="demo35.html#">Student Beans Offers</a>
                  </li>
                  <li>
                    <a href="demo35.html#">Gift Vouchers</a>
                  </li>
                </ul>
              </div>
              {/* End .widget */}
            </div>
            {/* End .col-lg-3 */}
            <div className="col-lg-3">
              <div className="widget mb-3">
                <h4 className="widget-title">Social Media</h4>
                <div className="social-icons">
                  <a
                    href="demo35.html#"
                    className="social-icon social-instagram icon-instagram"
                    target="_blank"
                  />
                  <a
                    href="demo35.html#"
                    className="social-icon social-twitter icon-twitter"
                    target="_blank"
                  />
                  <a
                    href="demo35.html#"
                    className="social-icon social-facebook icon-facebook"
                    target="_blank"
                  />
                </div>
                {/* End .social-icons */}
              </div>
              {/* End .col-lg-3 */}
              <div className="widget mb-3">
                <h4 className="widget-title">Payment Methods</h4>
                <img
                  src="/src/assets/images/demoes/demo35/payment.png"
                  alt="payment"
                  width={240}
                  height={32}
                />
              </div>
            </div>
            {/* End .row */}
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-copyright text-lg-center ls-n-25 mb-0">
            Porto eCommerce.&nbsp;©&nbsp;&nbsp;2021.&nbsp;&nbsp;All Rights
            Reserved.
          </p>
        </div>
        {/* End .footer-bottom */}
      </div>
      {/* End .container */}
    </footer>
    {/* End .footer */}
</>
  )
}