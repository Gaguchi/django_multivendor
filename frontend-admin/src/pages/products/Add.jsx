export default function Add() {

    return (
        <><>
  <div className="flex items-center flex-wrap justify-between gap20 mb-30">
    <h3>Add Product</h3>
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
        <a href="add-product.html#">
          <div className="text-tiny">Product</div>
        </a>
      </li>
      <li>
        <i className="icon-chevron-right" />
      </li>
      <li>
        <div className="text-tiny">Add Product</div>
      </li>
    </ul>
  </div>
  {/* form-add-product */}
  <form className="form-add-product">
    <div className="wg-box mb-30">
      <fieldset>
        <div className="body-title mb-10">Upload images</div>
        <div className="upload-image mb-16">
          <div className="up-load">
            <label className="uploadfile" htmlFor="myFile">
              <span className="icon">
                <i className="icon-upload-cloud" />
              </span>
              <div className="text-tiny">
                Drop your images here or select{" "}
                <span className="text-secondary">click to browse</span>
              </div>
              <input type="file" id="myFile" name="filename" />
              <img src="add-product.html" id="myFile-input" alt="" />
            </label>
          </div>
          <div className="flex gap20 flex-wrap">
            <div className="item">
              <img src="images/upload/img-1.jpg" alt="" />
            </div>
            <div className="item">
              <img src="images/upload/img-2.jpg" alt="" />
            </div>
          </div>
        </div>
        <div className="body-text">
          You need to add at least 4 images. Pay attention to the quality of the
          pictures you add, comply with the background color standards. Pictures
          must be in certain dimensions. Notice that the product shows all the
          details
        </div>
      </fieldset>
    </div>
    <div className="wg-box mb-30">
      <fieldset className="name">
        <div className="body-title mb-10">
          Product title <span className="tf-color-1">*</span>
        </div>
        <input
          className="mb-10"
          type="text"
          placeholder="Enter title"
          name="text"
          tabIndex={0}
          defaultValue=""
          aria-required="true"
          required=""
        />
        <div className="text-tiny text-surface-2">
          Do not exceed 20 characters when entering the product name.
        </div>
      </fieldset>
      <fieldset className="category">
        <div className="body-title mb-10">
          Category <span className="tf-color-1">*</span>
        </div>
        <input
          className=""
          type="text"
          placeholder="Choose category"
          name="text"
          tabIndex={0}
          defaultValue=""
          aria-required="true"
          required=""
        />
      </fieldset>
      <div className="cols-lg gap22">
        <fieldset className="price">
          <div className="body-title mb-10">
            Price <span className="tf-color-1">*</span>
          </div>
          <input
            className=""
            type="number"
            placeholder="Price"
            name="text"
            tabIndex={0}
            defaultValue=""
            aria-required="true"
            required=""
          />
        </fieldset>
        <fieldset className="sale-price">
          <div className="body-title mb-10">Sale Price </div>
          <input
            className=""
            type="number"
            placeholder="Sale Price "
            name="text"
            tabIndex={0}
            defaultValue=""
            aria-required="true"
            required=""
          />
        </fieldset>
        <fieldset className="schedule">
          <div className="body-title mb-10">Schedule</div>
          <input type="date" name="date" />
        </fieldset>
      </div>
      <div className="cols-lg gap22">
        <fieldset className="choose-brand">
          <div className="body-title mb-10">
            Brand <span className="tf-color-1">*</span>
          </div>
          <input
            className=""
            type="text"
            placeholder="Choose brand"
            name="text"
            tabIndex={0}
            defaultValue=""
            aria-required="true"
            required=""
          />
        </fieldset>
        <fieldset className="variant-picker-item">
          <div className="variant-picker-label body-title">
            Color:{" "}
            <span className="body-title-2 fw-4 variant-picker-label-value">
              Orange
            </span>
          </div>
          <div className="variant-picker-values">
            <input
              id="values-orange"
              type="radio"
              name="color"
              defaultChecked=""
            />
            <label
              className="radius-60"
              htmlFor="values-orange"
              data-value="Orange"
            >
              <span className="btn-checkbox bg-color-orange" />
            </label>
            <input id="values-blue" type="radio" name="color" />
            <label
              className="radius-60"
              htmlFor="values-blue"
              data-value="Blue"
            >
              <span className="btn-checkbox bg-color-blue" />
            </label>
            <input id="values-yellow" type="radio" name="color" />
            <label
              className="radius-60"
              htmlFor="values-yellow"
              data-value="Yellow"
            >
              <span className="btn-checkbox bg-color-yellow" />
            </label>
            <input id="values-black" type="radio" name="color" />
            <label
              className="radius-60"
              htmlFor="values-black"
              data-value="Black"
            >
              <span className="btn-checkbox bg-color-black" />
            </label>
          </div>
        </fieldset>
        <fieldset className="variant-picker-item">
          <div className="variant-picker-label body-text">
            Size:{" "}
            <span className="body-title-2 variant-picker-label-value">S</span>
          </div>
          <div className="variant-picker-values">
            <input type="radio" name="size" id="values-s" />
            <label className="style-text" htmlFor="values-s" data-value="S">
              <div className="text">S</div>
            </label>
            <input type="radio" name="size" id="values-m" defaultChecked="" />
            <label className="style-text" htmlFor="values-m" data-value="M">
              <div className="text">M</div>
            </label>
            <input type="radio" name="size" id="values-l" />
            <label className="style-text" htmlFor="values-l" data-value="L">
              <div className="text">L</div>
            </label>
            <input type="radio" name="size" id="values-xl" />
            <label className="style-text" htmlFor="values-xl" data-value="XL">
              <div className="text">XL</div>
            </label>
          </div>
        </fieldset>
      </div>
      <div className="cols-lg gap22">
        <fieldset className="sku">
          <div className="body-title mb-10">SKU</div>
          <input
            className=""
            type="text"
            placeholder="Enter SKU"
            name="text"
            tabIndex={0}
            defaultValue=""
            aria-required="true"
            required=""
          />
        </fieldset>
        <fieldset className="category">
          <div className="body-title mb-10">
            Stock <span className="tf-color-1">*</span>
          </div>
          <input
            className=""
            type="text"
            placeholder="Enter Stock"
            name="text"
            tabIndex={0}
            defaultValue=""
            aria-required="true"
            required=""
          />
        </fieldset>
        <fieldset className="sku">
          <div className="body-title mb-10">Tags</div>
          <input
            className=""
            type="text"
            placeholder="Enter a tag"
            name="text"
            tabIndex={0}
            defaultValue=""
            aria-required="true"
            required=""
          />
        </fieldset>
      </div>
      <fieldset className="description">
        <div className="body-title mb-10">
          Description <span className="tf-color-1">*</span>
        </div>
        <textarea
          className="mb-10"
          name="description"
          placeholder="Short description about product"
          tabIndex={0}
          aria-required="true"
          required=""
          defaultValue={""}
        />
        <div className="text-tiny">
          Do not exceed 100 characters when entering the product name.
        </div>
      </fieldset>
    </div>
    <div className="cols gap10">
      <button className="tf-button w380" type="submit">
        Add product
      </button>
      <a
        href="add-product.html#"
        className="tf-button style-3 w380"
        type="submit"
      >
        Cancel
      </a>
    </div>
  </form>
  {/* /form-add-product */}
</>

        </>
    )
}