export default function HeaderLeft() {

    return (
        <>
          <div className="header-left w-lg-max">
            <button
              className="mobile-menu-toggler text-primary mr-2"
              type="button"
            >
              <i className="fas fa-bars" />
            </button>
            <a href="/" className="logo">
              <img
                src="/src/assets/images/logo-black.png"
                className="w-100"
                width={111}
                height={44}
                alt="Porto Logo"
              />
            </a>
            <div className="header-icon header-search header-search-inline header-search-category d-lg-block d-none text-right mt-0">
              <a href="/" className="search-toggle" role="button">
                <i className="icon-magnifier" />
              </a>
              <form action="/" method="get">
                <div className="header-search-wrapper">
                  <input
                    type="search"
                    className="form-control"
                    name="q"
                    id="q"
                    placeholder="Search..."
                    required=""
                  />
                  <div className="select-custom">
                    <select id="cat" name="cat">
                      <option value="">All Categories</option>
                      <option value={4}>Fashion</option>
                      <option value={12}>- Women</option>
                      <option value={13}>- Men</option>
                      <option value={66}>- Jewellery</option>
                      <option value={67}>- Kids Fashion</option>
                      <option value={5}>Electronics</option>
                      <option value={21}>- Smart TVs</option>
                      <option value={22}>- Cameras</option>
                      <option value={63}>- Games</option>
                      <option value={7}>Home &amp; Garden</option>
                      <option value={11}>Motors</option>
                      <option value={31}>- Cars and Trucks</option>
                      <option value={32}>
                        - Motorcycles &amp; Powersports
                      </option>
                      <option value={33}>- Parts &amp; Accessories</option>
                      <option value={34}>- Boats</option>
                      <option value={57}>- Auto Tools &amp; Supplies</option>
                    </select>
                  </div>
                  {/* End .select-custom */}
                  <button
                    className="btn icon-magnifier p-0"
                    title="search"
                    type="submit"
                  />
                </div>
                {/* End .header-search-wrapper */}
              </form>
            </div>
            {/* End .header-search */}
          </div>
          {/* End .header-left */}

        </>
    )
}