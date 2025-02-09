import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

export default function ProductCard({ 
  product, 
  isHot = false,
  showQuickView = true 
}) {
  const {
    id,
    thumbnail,
    name,
    category,
    price,
    rating = 0,
    priceRange
  } = product;

  return (
    <div className="product-default inner-quickview inner-icon">
      <figure>
        <Link to={`/product/${id}`}>
          <img
            src={thumbnail}
            width={217}
            height={217}
            alt={name}
          />
        </Link>
        {isHot && (
          <div className="label-group">
            <div className="product-label label-hot">HOT</div>
          </div>
        )}
        <div className="btn-icon-group">
          <Link
            to={`/product/${id}`}
            className="btn-icon btn-add-cart"
          >
            <i className="fa fa-arrow-right" />
          </Link>
        </div>
        {showQuickView && (
          <a
            href="#"
            className="btn-quickview"
            title="Quick View"
            onClick={(e) => {
              e.preventDefault();
              // Handle quick view logic here
            }}
          >
            Quick View
          </a>
        )}
      </figure>
      <div className="product-details">
        <div className="category-wrap">
          <div className="category-list">
            <Link
              to={`/category/${category}`}
              className="product-category"
            >
              {category}
            </Link>
          </div>
          <a href="#" className="btn-icon-wish">
            <i className="icon-heart" />
          </a>
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
          <span className="product-price">
            {priceRange ? `$${priceRange}` : `$${price.toFixed(2)}`}
          </span>
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
    category: PropTypes.string.isRequired,
    price: PropTypes.number,
    priceRange: PropTypes.string,
    rating: PropTypes.number
  }).isRequired,
  isHot: PropTypes.bool,
  showQuickView: PropTypes.bool
}
