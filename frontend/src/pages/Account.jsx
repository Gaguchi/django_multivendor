export default function Account() {

    return (
        <>
  <div className="container account-container custom-account-container">
    <div className="row">
      <div className="sidebar widget widget-dashboard mb-lg-0 mb-3 col-lg-3 order-0">
        <h2 className="text-uppercase">My Account</h2>
        <ul className="nav nav-tabs list flex-column mb-0" role="tablist">
          <li className="nav-item">
            <a
              className="nav-link active"
              id="dashboard-tab"
              data-toggle="tab"
              href="dashboard.html#dashboard"
              role="tab"
              aria-controls="dashboard"
              aria-selected="true"
            >
              Dashboard
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              id="order-tab"
              data-toggle="tab"
              href="dashboard.html#order"
              role="tab"
              aria-controls="order"
              aria-selected="true"
            >
              Orders
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              id="download-tab"
              data-toggle="tab"
              href="dashboard.html#download"
              role="tab"
              aria-controls="download"
              aria-selected="false"
            >
              Downloads
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              id="address-tab"
              data-toggle="tab"
              href="dashboard.html#address"
              role="tab"
              aria-controls="address"
              aria-selected="false"
            >
              Addresses
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              id="edit-tab"
              data-toggle="tab"
              href="dashboard.html#edit"
              role="tab"
              aria-controls="edit"
              aria-selected="false"
            >
              Account details
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              id="shop-address-tab"
              data-toggle="tab"
              href="dashboard.html#shipping"
              role="tab"
              aria-controls="edit"
              aria-selected="false"
            >
              Shopping Addres
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="wishlist.html">
              Wishlist
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="login.html">
              Logout
            </a>
          </li>
        </ul>
      </div>
      <div className="col-lg-9 order-lg-last order-1 tab-content">
        <div
          className="tab-pane fade show active"
          id="dashboard"
          role="tabpanel"
        >
          <div className="dashboard-content">
            <p>
              Hello <strong className="text-dark">Editor</strong> (not
              <strong className="text-dark">Editor</strong>?
              <a href="login.html" className="btn btn-link ">
                Log out
              </a>
              )
            </p>
            <p>
              From your account dashboard you can view your
              <a
                className="btn btn-link link-to-tab"
                href="dashboard.html#order"
              >
                recent orders
              </a>
              , manage your
              <a
                className="btn btn-link link-to-tab"
                href="dashboard.html#address"
              >
                shipping and billing addresses
              </a>
              , and
              <a
                className="btn btn-link link-to-tab"
                href="dashboard.html#edit"
              >
                edit your password and account details.
              </a>
            </p>
            <div className="mb-4" />
            <div className="row row-lg">
              <div className="col-6 col-md-4">
                <div className="feature-box text-center pb-4">
                  <a href="dashboard.html#order" className="link-to-tab">
                    <i className="sicon-social-dropbox" />
                  </a>
                  <div className="feature-box-content">
                    <h3>ORDERS</h3>
                  </div>
                </div>
              </div>
              <div className="col-6 col-md-4">
                <div className="feature-box text-center pb-4">
                  <a href="dashboard.html#download" className="link-to-tab">
                    <i className="sicon-cloud-download" />
                  </a>
                  <div className=" feature-box-content">
                    <h3>DOWNLOADS</h3>
                  </div>
                </div>
              </div>
              <div className="col-6 col-md-4">
                <div className="feature-box text-center pb-4">
                  <a href="dashboard.html#address" className="link-to-tab">
                    <i className="sicon-location-pin" />
                  </a>
                  <div className="feature-box-content">
                    <h3>ADDRESSES</h3>
                  </div>
                </div>
              </div>
              <div className="col-6 col-md-4">
                <div className="feature-box text-center pb-4">
                  <a href="dashboard.html#edit" className="link-to-tab">
                    <i className="icon-user-2" />
                  </a>
                  <div className="feature-box-content p-0">
                    <h3>ACCOUNT DETAILS</h3>
                  </div>
                </div>
              </div>
              <div className="col-6 col-md-4">
                <div className="feature-box text-center pb-4">
                  <a href="wishlist.html">
                    <i className="sicon-heart" />
                  </a>
                  <div className="feature-box-content">
                    <h3>WISHLIST</h3>
                  </div>
                </div>
              </div>
              <div className="col-6 col-md-4">
                <div className="feature-box text-center pb-4">
                  <a href="login.html">
                    <i className="sicon-logout" />
                  </a>
                  <div className="feature-box-content">
                    <h3>LOGOUT</h3>
                  </div>
                </div>
              </div>
            </div>
            {/* End .row */}
          </div>
        </div>
        {/* End .tab-pane */}
        <div className="tab-pane fade" id="order" role="tabpanel">
          <div className="order-content">
            <h3 className="account-sub-title d-none d-md-block">
              <i className="sicon-social-dropbox align-middle mr-3" />
              Orders
            </h3>
            <div className="order-table-container text-center">
              <table className="table table-order text-left">
                <thead>
                  <tr>
                    <th className="order-id">ORDER</th>
                    <th className="order-date">DATE</th>
                    <th className="order-status">STATUS</th>
                    <th className="order-price">TOTAL</th>
                    <th className="order-action">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-center p-0" colSpan={5}>
                      <p className="mb-5 mt-5">No Order has been made yet.</p>
                    </td>
                  </tr>
                </tbody>
              </table>
              <hr className="mt-0 mb-3 pb-2" />
              <a href="category.html" className="btn btn-dark">
                Go Shop
              </a>
            </div>
          </div>
        </div>
        {/* End .tab-pane */}
        <div className="tab-pane fade" id="download" role="tabpanel">
          <div className="download-content">
            <h3 className="account-sub-title d-none d-md-block">
              <i className="sicon-cloud-download align-middle mr-3" />
              Downloads
            </h3>
            <div className="download-table-container">
              <p>No downloads available yet.</p>{" "}
              <a
                href="category.html"
                className="btn btn-primary text-transform-none mb-2"
              >
                GO SHOP
              </a>
            </div>
          </div>
        </div>
        {/* End .tab-pane */}
        <div className="tab-pane fade" id="address" role="tabpanel">
          <h3 className="account-sub-title d-none d-md-block mb-1">
            <i className="sicon-location-pin align-middle mr-3" />
            Addresses
          </h3>
          <div className="addresses-content">
            <p className="mb-4">
              The following addresses will be used on the checkout page by
              default.
            </p>
            <div className="row">
              <div className="address col-md-6">
                <div className="heading d-flex">
                  <h4 className="text-dark mb-0">Billing address</h4>
                </div>
                <div className="address-box">
                  You have not set up this type of address yet.
                </div>
                <a
                  href="dashboard.html#billing"
                  className="btn btn-default address-action link-to-tab"
                >
                  Add Address
                </a>
              </div>
              <div className="address col-md-6 mt-5 mt-md-0">
                <div className="heading d-flex">
                  <h4 className="text-dark mb-0">Shipping address</h4>
                </div>
                <div className="address-box">
                  You have not set up this type of address yet.
                </div>
                <a
                  href="dashboard.html#shipping"
                  className="btn btn-default address-action link-to-tab"
                >
                  Add Address
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* End .tab-pane */}
        <div className="tab-pane fade" id="edit" role="tabpanel">
          <h3 className="account-sub-title d-none d-md-block mt-0 pt-1 ml-1">
            <i className="icon-user-2 align-middle mr-3 pr-1" />
            Account Details
          </h3>
          <div className="account-content">
            <form action="dashboard.html#">
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="acc-name">
                      First name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Editor"
                      id="acc-name"
                      name="acc-name"
                      required=""
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="acc-lastname">
                      Last name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="acc-lastname"
                      name="acc-lastname"
                      required=""
                    />
                  </div>
                </div>
              </div>
              <div className="form-group mb-2">
                <label htmlFor="acc-text">
                  Display name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="acc-text"
                  name="acc-text"
                  placeholder="Editor"
                  required=""
                />
                <p>
                  This will be how your name will be displayed in the account
                  section and in reviews
                </p>
              </div>
              <div className="form-group mb-4">
                <label htmlFor="acc-email">
                  Email address <span className="required">*</span>
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="acc-email"
                  name="acc-email"
                  placeholder="editor@gmail.com"
                  required=""
                />
              </div>
              <div className="change-password">
                <h3 className="text-uppercase mb-2">Password Change</h3>
                <div className="form-group">
                  <label htmlFor="acc-password">
                    Current Password (leave blank to leave unchanged)
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="acc-password"
                    name="acc-password"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="acc-password">
                    New Password (leave blank to leave unchanged)
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="acc-new-password"
                    name="acc-new-password"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="acc-password">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="acc-confirm-password"
                    name="acc-confirm-password"
                  />
                </div>
              </div>
              <div className="form-footer mt-3 mb-0">
                <button type="submit" className="btn btn-dark mr-0">
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
        {/* End .tab-pane */}
        <div className="tab-pane fade" id="billing" role="tabpanel">
          <div className="address account-content mt-0 pt-2">
            <h4 className="title">Billing address</h4>
            <form className="mb-2" action="dashboard.html#">
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>
                      First name <span className="required">*</span>
                    </label>
                    <input type="text" className="form-control" required="" />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>
                      Last name <span className="required">*</span>
                    </label>
                    <input type="text" className="form-control" required="" />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label>Company </label>
                <input type="text" className="form-control" />
              </div>
              <div className="select-custom">
                <label>
                  Country / Region <span className="required">*</span>
                </label>
                <select name="orderby" className="form-control">
                  <option value="" selected="selected">
                    British Indian Ocean Territory
                  </option>
                  <option value={1}>Brunei</option>
                  <option value={2}>Bulgaria</option>
                  <option value={3}>Burkina Faso</option>
                  <option value={4}>Burundi</option>
                  <option value={5}>Cameroon</option>
                </select>
              </div>
              <div className="form-group">
                <label>
                  Street address <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="House number and street name"
                  required=""
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Apartment, suite, unit, etc. (optional)"
                  required=""
                />
              </div>
              <div className="form-group">
                <label>
                  Town / City <span className="required">*</span>
                </label>
                <input type="text" className="form-control" required="" />
              </div>
              <div className="form-group">
                <label>
                  State / Country <span className="required">*</span>
                </label>
                <input type="text" className="form-control" required="" />
              </div>
              <div className="form-group">
                <label>
                  Postcode / ZIP <span className="required">*</span>
                </label>
                <input type="text" className="form-control" required="" />
              </div>
              <div className="form-group mb-3">
                <label>
                  Phone <span className="required">*</span>
                </label>
                <input type="number" className="form-control" required="" />
              </div>
              <div className="form-group mb-3">
                <label>
                  Email address <span className="required">*</span>
                </label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="editor@gmail.com"
                  required=""
                />
              </div>
              <div className="form-footer mb-0">
                <div className="form-footer-right">
                  <button type="submit" className="btn btn-dark py-4">
                    Save Address
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        {/* End .tab-pane */}
        <div className="tab-pane fade" id="shipping" role="tabpanel">
          <div className="address account-content mt-0 pt-2">
            <h4 className="title mb-3">Shipping Address</h4>
            <form className="mb-2" action="dashboard.html#">
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>
                      First name <span className="required">*</span>
                    </label>
                    <input type="text" className="form-control" required="" />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>
                      Last name <span className="required">*</span>
                    </label>
                    <input type="text" className="form-control" required="" />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label>Company </label>
                <input type="text" className="form-control" />
              </div>
              <div className="select-custom">
                <label>
                  Country / Region <span className="required">*</span>
                </label>
                <select name="orderby" className="form-control">
                  <option value="" selected="selected">
                    British Indian Ocean Territory
                  </option>
                  <option value={1}>Brunei</option>
                  <option value={2}>Bulgaria</option>
                  <option value={3}>Burkina Faso</option>
                  <option value={4}>Burundi</option>
                  <option value={5}>Cameroon</option>
                </select>
              </div>
              <div className="form-group">
                <label>
                  Street address <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="House number and street name"
                  required=""
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Apartment, suite, unit, etc. (optional)"
                  required=""
                />
              </div>
              <div className="form-group">
                <label>
                  Town / City <span className="required">*</span>
                </label>
                <input type="text" className="form-control" required="" />
              </div>
              <div className="form-group">
                <label>
                  State / Country <span className="required">*</span>
                </label>
                <input type="text" className="form-control" required="" />
              </div>
              <div className="form-group">
                <label>
                  Postcode / ZIP <span className="required">*</span>
                </label>
                <input type="text" className="form-control" required="" />
              </div>
              <div className="form-footer mb-0">
                <div className="form-footer-right">
                  <button type="submit" className="btn btn-dark py-4">
                    Save Address
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        {/* End .tab-pane */}
      </div>
      {/* End .tab-content */}
    </div>
    {/* End .row */}
  </div>
  {/* End .container */}
</>

    )
}