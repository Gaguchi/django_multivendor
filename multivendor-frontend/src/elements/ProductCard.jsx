import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

export default function ProductCard({ 
  product, 
  isHot = false,
  showQuickView = false 
}) {
  const {
    id,
    thumbnail,
    name,
    category,  // Changed from category_name to match what we're passing
    price,
    old_price,
    rating = 0,
    vendor_name,
    is_hot = false // Use the server-provided is_hot value if available
  } = product;

  // Calculate sale percentage if old_price exists
  const salePercentage = old_price ? 
    Math.round(((old_price - price) / old_price) * 100) : null;

  return (
    <div className="product-default inner-btn inner-icon inner-icon-inline left-details">
      <figure>
        <Link to={`/product/${id}`}>
          <img
            src={thumbnail}
            width={280}
            height={280}
            alt={name}
          />
        </Link>
        <div className="label-group">
          {(isHot || is_hot) && <div className="product-label label-hot">HOT</div>}
          {salePercentage && (
            <div className="product-label label-sale">-{salePercentage}%</div>
          )}
        </div>
        <div className="btn-icon-group">
          <a
            href="#"
            className="btn-icon btn-add-cart product-type-simple"
            onClick={(e) => e.preventDefault()}
          >
            <i className="icon-shopping-cart" />
          </a>
          <a
            href="#"
            className="btn-icon btn-icon-wish product-type-simple"
            title="wishlist"
            onClick={(e) => e.preventDefault()}
          >
            <i className="icon-heart" />
          </a>
          {showQuickView && (
            <a
              href="#"
              className="btn-icon btn-quickview"
              title="Quick View"
              onClick={(e) => {
                e.preventDefault();
                // Handle quick view logic here
              }}
            >
              <i className="fas fa-external-link-alt" />
            </a>
          )}
        </div>
      </figure>
      <div className="product-details">
        <div className="category-wrap">
          <div className="category-list">
            <Link
              to={`/category/${category}`}
              className="product-category"
            >
              {category}  {/* Using the category prop directly */}
            </Link>
          </div>
        </div>
        <h3 className="product-title">
          <Link to={`/product/${id}`}>{name}</Link>
        </h3>
        <div className="ratings-container">
          <div className="product-ratings">
            <span 
              className="ratings" 
              style={{ width: `${rating * 20}%` }} 
            />
            <span className="tooltiptext tooltip-top" />
          </div>
        </div>
        <div className="price-box">
          {old_price && (
            <span className="old-price">${parseFloat(old_price).toFixed(2)}</span>
          )}
          <span className="product-price">${parseFloat(price).toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    thumbnail: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.string,  // Changed from category_name to match what we're passing
    vendor_name: PropTypes.string,
    price: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]).isRequired,
    old_price: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]),
    rating: PropTypes.number,
    is_hot: PropTypes.bool
  }).isRequired,
  isHot: PropTypes.bool,
  showQuickView: PropTypes.bool
}
