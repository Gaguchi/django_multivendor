export default function PopularCategories() {

  return (
    <>
          <h2 className="section-title">Popular Categories</h2>
          <p className="section-info font2">
            Products From These Categories Often Buy
          </p>
          <div
            className="categories-slider owl-carousel owl-theme mb-4"
            data-owl-options="{
                  'items': 1,
                  'responsive': {
                      '576': {
                          'items': 2
                      },
                      '768': {
                          'items': 3
                      },
                      '992': {
                          'items': 4
                      }
                  }
              }"
          >
            <div className="product-category bg-white">
              <a href="category.html">
                <figure>
                  <img
                    src="src/assets/images/demoes/demo35/products/cats/cat-3.png"
                    alt="cat"
                    width={341}
                    height={200}
                  />
                </figure>
                <div className="category-content">
                  <h3 className="font2 ls-n-25">Cooking</h3>
                  <span className="font2 ls-n-20">4 Products</span>
                </div>
              </a>
            </div>
            <div className="product-category bg-white">
              <a href="category.html">
                <figure>
                  <img
                    src="src/assets/images/demoes/demo35/products/cats/cat-2.png"
                    alt="cat"
                    width={341}
                    height={200}
                  />
                </figure>
                <div className="category-content">
                  <h3 className="font2 ls-n-25">Fruits</h3>
                  <span className="font2 ls-n-20">10 Products</span>
                </div>
              </a>
            </div>
            <div className="product-category bg-white">
              <a href="category.html">
                <figure>
                  <img
                    src="src/assets/images/demoes/demo35/products/cats/cat-1.png"
                    alt="cat"
                    width={341}
                    height={200}
                  />
                </figure>
                <div className="category-content">
                  <h3 className="font2 ls-n-25">Vegetables</h3>
                  <span className="font2 ls-n-20">1 Products</span>
                </div>
              </a>
            </div>
            <div className="product-category bg-white">
              <a href="category.html">
                <figure>
                  <img
                    src="src/assets/images/demoes/demo35/products/cats/cat-4.png"
                    alt="cat"
                    width={341}
                    height={200}
                  />
                </figure>
                <div className="category-content">
                  <h3 className="font2 ls-n-25">Breakfast</h3>
                  <span className="font2 ls-n-20">8 Products</span>
                </div>
              </a>
            </div>
          </div>
    </>
  )
}