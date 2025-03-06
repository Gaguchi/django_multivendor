export default function All() {

    return (<>
  <div className="flex items-center flex-wrap justify-between gap20 mb-30">
    <h3>All Products</h3>
    <ul className="breadcrumbs flex items-center flex-wrap justify-start gap10">
      <li>
        <a href="index.html">
          <div className="text-tiny">Dashboard</div>
        </a>
      </li>
      <li>
        <i className="icon-chevron-right" />
      </li>
      <li>
        <a href="product-list.html#">
          <div className="text-tiny">Product</div>
        </a>
      </li>
      <li>
        <i className="icon-chevron-right" />
      </li>
      <li>
        <div className="text-tiny">All Products</div>
      </li>
    </ul>
  </div>
  {/* product-list */}
  <div className="wg-box">
    <div className="title-box">
      <i className="icon-coffee" />
      <div className="body-text">
        Tip search by Product ID: Each product is provided with a unique ID,
        which you can rely on to find the exact product you need.
      </div>
    </div>
    <div className="flex items-center justify-between gap10 flex-wrap">
      <div className="wg-filter flex-grow">
        <div className="show">
          <div className="text-tiny">Showing</div>
          <div className="select">
            <select className="">
              <option>10</option>
              <option>20</option>
              <option>30</option>
            </select>
          </div>
          <div className="text-tiny">entries</div>
        </div>
        <form className="form-search">
          <fieldset className="name">
            <input
              type="text"
              placeholder="Search here..."
              className=""
              name="name"
              tabIndex={2}
              defaultValue=""
              aria-required="true"
              required=""
            />
          </fieldset>
          <div className="button-submit">
            <button className="" type="submit">
              <i className="icon-search" />
            </button>
          </div>
        </form>
      </div>
      <a className="tf-button style-1 w208" href="add-product.html">
        <i className="icon-plus" />
        Add new
      </a>
    </div>
    <div className="wg-table table-product-list">
      <ul className="table-title flex gap20 mb-14">
        <li>
          <div className="body-title">Product</div>
        </li>
        <li>
          <div className="body-title">Product ID</div>
        </li>
        <li>
          <div className="body-title">Price</div>
        </li>
        <li>
          <div className="body-title">Quantity</div>
        </li>
        <li>
          <div className="body-title">Sale</div>
        </li>
        <li>
          <div className="body-title">Stock</div>
        </li>
        <li>
          <div className="body-title">Start date</div>
        </li>
        <li>
          <div className="body-title">Action</div>
        </li>
      </ul>
      <ul className="flex flex-column">
        <li className="wg-product item-row gap20">
          <div className="name">
            <div className="image">
              <img src="images/products/product-1.jpg" alt="" />
            </div>
            <div className="title line-clamp-2 mb-0">
              <a href="product-list.html#" className="body-text">
                Dog Food, Chicken &amp; Chicken Liver Recipe...
              </a>
            </div>
          </div>
          <div className="body-text text-main-dark mt-4">#7712309</div>
          <div className="body-text text-main-dark mt-4">$1,452.500</div>
          <div className="body-text text-main-dark mt-4">1,638</div>
          <div className="body-text text-main-dark mt-4">20</div>
          <div>
            <div className="block-stock bg-1 fw-7">Out of stock</div>
          </div>
          <div className="body-text text-main-dark mt-4">08/24/2024</div>
          <div className="list-icon-function">
            <div className="item eye">
              <i className="icon-eye" />
            </div>
            <div className="item edit">
              <i className="icon-edit-3" />
            </div>
            <div className="item trash">
              <i className="icon-trash-2" />
            </div>
          </div>
        </li>
        <li className="wg-product item-row gap20">
          <div className="name">
            <div className="image">
              <img src="images/products/product-2.jpg" alt="" />
            </div>
            <div className="title line-clamp-2 mb-0">
              <a href="product-list.html#" className="body-text">
                Grain Free Dry Dog Food{" "}
              </a>
            </div>
          </div>
          <div className="body-text text-main-dark mt-4">#7712309</div>
          <div className="body-text text-main-dark mt-4">$1,452.500</div>
          <div className="body-text text-main-dark mt-4">1,638</div>
          <div className="body-text text-main-dark mt-4">20</div>
          <div>
            <div className="block-available bg-1 fw-7">In Stock</div>
          </div>
          <div className="body-text text-main-dark mt-4">08/24/2024</div>
          <div className="list-icon-function">
            <div className="item eye">
              <i className="icon-eye" />
            </div>
            <div className="item edit">
              <i className="icon-edit-3" />
            </div>
            <div className="item trash">
              <i className="icon-trash-2" />
            </div>
          </div>
        </li>
        <li className="wg-product item-row gap20">
          <div className="name">
            <div className="image">
              <img src="images/products/product-3.jpg" alt="" />
            </div>
            <div className="title line-clamp-2 mb-0">
              <a href="product-list.html#" className="body-text">
                Weruva Pumpkin Patch Up! Pumpkin With Ginger...{" "}
              </a>
            </div>
          </div>
          <div className="body-text text-main-dark mt-4">#7712309</div>
          <div className="body-text text-main-dark mt-4">$1,452.500</div>
          <div className="body-text text-main-dark mt-4">1,638</div>
          <div className="body-text text-main-dark mt-4">20</div>
          <div>
            <div className="block-available bg-1 fw-7">In Stock</div>
          </div>
          <div className="body-text text-main-dark mt-4">08/24/2024</div>
          <div className="list-icon-function">
            <div className="item eye">
              <i className="icon-eye" />
            </div>
            <div className="item edit">
              <i className="icon-edit-3" />
            </div>
            <div className="item trash">
              <i className="icon-trash-2" />
            </div>
          </div>
        </li>
        <li className="wg-product item-row gap20">
          <div className="name">
            <div className="image">
              <img src="images/products/product-4.jpg" alt="" />
            </div>
            <div className="title line-clamp-2 mb-0">
              <a href="product-list.html#" className="body-text">
                Milk-Bone Mini's Flavor Snacks Dog Treats, 15 Ounce{" "}
              </a>
            </div>
          </div>
          <div className="body-text text-main-dark mt-4">#7712309</div>
          <div className="body-text text-main-dark mt-4">$1,452.500</div>
          <div className="body-text text-main-dark mt-4">1,638</div>
          <div className="body-text text-main-dark mt-4">20</div>
          <div>
            <div className="block-available bg-1 fw-7">In Stock</div>
          </div>
          <div className="body-text text-main-dark mt-4">08/24/2024</div>
          <div className="list-icon-function">
            <div className="item eye">
              <i className="icon-eye" />
            </div>
            <div className="item edit">
              <i className="icon-edit-3" />
            </div>
            <div className="item trash">
              <i className="icon-trash-2" />
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div className="divider" />
    <div className="flex items-center justify-between flex-wrap gap10">
      <div className="text-tiny">Showing 10 entries</div>
      <ul className="wg-pagination">
        <li>
          <a href="product-list.html#">
            <i className="icon-chevron-left" />
          </a>
        </li>
        <li>
          <a href="product-list.html#">1</a>
        </li>
        <li className="active">
          <a href="product-list.html#">2</a>
        </li>
        <li>
          <a href="product-list.html#">3</a>
        </li>
        <li>
          <a href="product-list.html#">
            <i className="icon-chevron-right" />
          </a>
        </li>
      </ul>
    </div>
  </div>
</>
    )
}