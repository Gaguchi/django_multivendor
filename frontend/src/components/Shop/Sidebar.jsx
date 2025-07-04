import React, { memo, useCallback, useState, useRef, useMemo, useEffect } from 'react'
import { Range } from 'react-range'

// Individual filter sections - each memoized independently
const CategoriesSection = memo(function CategoriesSection({ 
  categories, 
  selectedCategories, 
  onCategoriesChange, 
  collapsed, 
  onToggleCollapse 
}) {
  // Removed excessive console logging for performance

  const handleCategoryChange = useCallback((categoryId) => {
    const newSelection = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId]
    onCategoriesChange(newSelection)
  }, [selectedCategories, onCategoriesChange])

  if (!categories?.length) return null

  return (
    <div className="widget">
      <h3 className="widget-title">
        <a 
          href="#" 
          className={collapsed ? 'collapsed' : ''}
          onClick={(e) => {
            e.preventDefault()
            onToggleCollapse()
          }}
        >
          Product Categories
        </a>
      </h3>
      <div className={`widget-body ${collapsed ? 'collapse' : ''}`}>
        <ul className="cat-list">
          {categories.map(category => (
            <li key={category.id}>
              <div className="d-flex justify-content-between align-items-center">
                <label className="custom-checkbox mb-0">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => handleCategoryChange(category.id)}
                  />
                  <span className="category-name">{category.name}</span>
                </label>
                <span className="products-count">({category.product_count || 0})</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}, (prevProps, nextProps) => {
  // Only re-render if categories data or selection actually changed
  return (
    JSON.stringify(prevProps.categories) === JSON.stringify(nextProps.categories) &&
    JSON.stringify(prevProps.selectedCategories) === JSON.stringify(nextProps.selectedCategories) &&
    prevProps.collapsed === nextProps.collapsed
  )
})

const BrandsSection = memo(function BrandsSection({ 
  brands, 
  selectedBrands, 
  onBrandsChange, 
  collapsed, 
  onToggleCollapse 
}) {
  // Removed excessive console logging for performance

  const handleBrandChange = useCallback((brandId) => {
    const newSelection = selectedBrands.includes(brandId)
      ? selectedBrands.filter(id => id !== brandId)
      : [...selectedBrands, brandId]
    onBrandsChange(newSelection)
  }, [selectedBrands, onBrandsChange])

  if (!brands?.length) return null

  return (
    <div className="widget">
      <h3 className="widget-title">
        <a 
          href="#" 
          className={collapsed ? 'collapsed' : ''}
          onClick={(e) => {
            e.preventDefault()
            onToggleCollapse()
          }}
        >
          Brands
        </a>
      </h3>
      <div className={`widget-body ${collapsed ? 'collapse' : ''}`}>
        <ul className="cat-list">
          {brands.map(brand => (
            <li key={brand.id}>
              <div className="d-flex justify-content-between align-items-center">
                <label className="custom-checkbox mb-0">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand.id)}
                    onChange={() => handleBrandChange(brand.id)}
                  />
                  <span className="category-name">{brand.business_name}</span>
                </label>
                <span className="products-count">({brand.product_count || 0})</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}, (prevProps, nextProps) => {
  // Only re-render if brands data or selection actually changed
  return (
    JSON.stringify(prevProps.brands) === JSON.stringify(nextProps.brands) &&
    JSON.stringify(prevProps.selectedBrands) === JSON.stringify(nextProps.selectedBrands) &&
    prevProps.collapsed === nextProps.collapsed
  )
})

const PriceSection = memo(function PriceSection({ 
  priceRange, 
  minPrice, 
  maxPrice, 
  onPriceChange, 
  collapsed, 
  onToggleCollapse 
}) {
  // Removed excessive console logging for performance

  const [values, setValues] = useState([minPrice, maxPrice])
  const debounceRef = useRef(null)

  // Update local state when props change
  useEffect(() => {
    setValues([minPrice, maxPrice])
  }, [minPrice, maxPrice])

  const handleRangeChange = useCallback((newValues) => {
    setValues(newValues)
    
    // Debounce the actual price change to prevent excessive API calls
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    debounceRef.current = setTimeout(() => {
      onPriceChange(newValues[0], newValues[1])
    }, 500)
  }, [onPriceChange])

  const handleInputChange = useCallback((index, value) => {
    const numValue = parseInt(value) || 0
    const newValues = [...values]
    
    if (index === 0) {
      // Min price shouldn't exceed max price
      newValues[0] = Math.min(numValue, values[1])
    } else {
      // Max price shouldn't be less than min price
      newValues[1] = Math.max(numValue, values[0])
    }
    
    setValues(newValues)
    
    // Debounce the actual price change
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    debounceRef.current = setTimeout(() => {
      onPriceChange(newValues[0], newValues[1])
    }, 500)
  }, [values, onPriceChange])

  return (
    <div className="widget">
      <h3 className="widget-title">
        <a 
          href="#" 
          className={collapsed ? 'collapsed' : ''}
          onClick={(e) => {
            e.preventDefault()
            onToggleCollapse()
          }}
        >
          Price Range
        </a>
      </h3>
      <div className={`widget-body ${collapsed ? 'collapse' : ''}`}>
        <div className="price-range">
          {/* Price inputs */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="price-input-wrapper">
              <label className="price-label">Min</label>
              <input
                type="number"
                className="form-control form-control-sm price-input"
                value={values[0]}
                min={priceRange.min}
                max={values[1]}
                onChange={(e) => handleInputChange(0, e.target.value)}
              />
            </div>
            <div className="price-separator">-</div>
            <div className="price-input-wrapper">
              <label className="price-label">Max</label>
              <input
                type="number"
                className="form-control form-control-sm price-input"
                value={values[1]}
                min={values[0]}
                max={priceRange.max}
                onChange={(e) => handleInputChange(1, e.target.value)}
              />
            </div>
          </div>

          {/* Range slider */}
          <div className="price-slider-container mb-3">
            <Range
              values={values}
              step={1}
              min={priceRange.min}
              max={priceRange.max}
              onChange={handleRangeChange}
              renderTrack={({ props, children }) => (
                <div
                  {...props}
                  className="price-slider-track"
                >
                  {children}
                </div>
              )}
              renderThumb={({ props, isDragged }) => (
                <div
                  {...props}
                  className={`price-slider-thumb ${isDragged ? 'dragged' : ''}`}
                />
              )}
            />
          </div>

          {/* Price display */}
          <div className="price-display text-center">
            <strong>${values[0]} - ${values[1]}</strong>
          </div>
        </div>
      </div>
    </div>
  )
}, (prevProps, nextProps) => {
  // Only re-render if price values actually changed
  return (
    prevProps.minPrice === nextProps.minPrice &&
    prevProps.maxPrice === nextProps.maxPrice &&
    prevProps.collapsed === nextProps.collapsed &&
    JSON.stringify(prevProps.priceRange) === JSON.stringify(nextProps.priceRange)
  )
})

const ClearFiltersSection = memo(function ClearFiltersSection({ onClearAll, hasActiveFilters }) {
  // Removed excessive console logging for performance

  if (!hasActiveFilters) return null

  return (
    <div className="widget clear-filters-widget">
      <div className="widget-body">
        <button 
          className="btn btn-outline-danger btn-sm w-100 clear-filters-btn"
          onClick={onClearAll}
          title="Clear all active filters"
        >
          <i className="fas fa-broom me-2"></i>
          Clear All Filters
        </button>
        <div className="clear-filters-help">
          <small className="text-muted">
            <i className="fas fa-info-circle me-1"></i>
            Remove all active filters to see all products
          </small>
        </div>
      </div>
    </div>
  )
}, (prevProps, nextProps) => {
  // Only re-render if hasActiveFilters changes
  return prevProps.hasActiveFilters === nextProps.hasActiveFilters
})

// Static sections that never change
const StaticSections = memo(function StaticSections() {
  return (
    <>
      <div className="widget widget-recently-viewed">
        <h3 className="widget-title">Recently Viewed</h3>
        <div className="widget-body">
          <div className="recently-viewed-products">
            <div className="text-center text-muted py-3">
              <small>Recently viewed products will appear here</small>
            </div>
          </div>
        </div>
      </div>
      
      <div className="widget widget-featured">
        <h3 className="widget-title">Featured</h3>
        <div className="widget-body">
          <div className="featured-products">
            <div className="text-center text-muted py-3">
              <small>Featured products will appear here</small>
            </div>
          </div>
        </div>
      </div>

      <div className="widget widget-block">
        <h3 className="widget-title">Special Offers</h3>
        <h5>Get the best deals!</h5>
        <p>
          Subscribe to our newsletter and get exclusive offers and discounts delivered to your inbox.
        </p>
        <button className="btn btn-primary btn-sm">
          Subscribe Now
        </button>
      </div>
    </>
  )
})

// Main sidebar component with proper memo comparison
const Sidebar = memo(function Sidebar({
  // Data props
  categories = [],
  brands = [],
  priceRange = { min: 0, max: 1000 },
  
  // Current filter values
  selectedCategories = [],
  selectedBrands = [],
  minPrice = 0,
  maxPrice = 1000,
  
  // Change handlers
  onCategoriesChange,
  onBrandsChange,
  onPriceChange,
  onClearAll,
  
  // UI props
  loading = false,
  className = '',
  isOpen = false,
  onClose = () => {}
}) {
  const sidebarRef = useRef(null)
  
  // Removed excessive console logging for performance

  // Collapse state for each section
  const [collapsed, setCollapsed] = useState({
    categories: false,
    brands: false,
    price: false
  })

  // Sticky behavior is handled by parent StickyBox wrapper in Shop.jsx

  // Handle section collapse
  const toggleCollapse = useCallback((section) => {
    setCollapsed(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }, [])

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return selectedCategories.length > 0 ||
           selectedBrands.length > 0 ||
           minPrice > priceRange.min ||
           maxPrice < priceRange.max
  }, [selectedCategories.length, selectedBrands.length, minPrice, maxPrice, priceRange])

  // Memoize section toggle handlers to prevent re-creation
  const toggleCategoriesCollapse = useCallback(() => toggleCollapse('categories'), [toggleCollapse])
  const toggleBrandsCollapse = useCallback(() => toggleCollapse('brands'), [toggleCollapse])
  const togglePriceCollapse = useCallback(() => toggleCollapse('price'), [toggleCollapse])

  // Use proper sidebar classes for styling
  const sidebarClasses = `sidebar-shop ${className} ${isOpen ? 'show' : ''}`.trim()

  if (loading) {
    return (
      <>
        <div 
          className={`sidebar-overlay ${isOpen ? 'show' : ''}`}
          onClick={onClose}
        />
        <aside className={sidebarClasses}>
          <div className="sidebar-wrapper sidebar-sticky" ref={sidebarRef}>
            <div className="sidebar-content">
              <div className="loading-placeholder">
                <div className="skeleton-widget"></div>
                <div className="skeleton-widget"></div>
                <div className="skeleton-widget"></div>
              </div>
            </div>
          </div>
        </aside>
      </>
    )
  }

  return (
    <>
      <div 
        className={`sidebar-overlay ${isOpen ? 'show' : ''}`}
        onClick={onClose}
      />
      <aside className={sidebarClasses}>
        {/* Mobile close button */}
        {isOpen && (
          <button className="sidebar-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        )}

        {/* Sidebar content - sticky behavior handled by parent StickyBox */}
        <div className="sidebar-content" ref={sidebarRef}>
          {/* Categories filter */}
          <CategoriesSection
            categories={categories}
            selectedCategories={selectedCategories}
            onCategoriesChange={onCategoriesChange}
            collapsed={collapsed.categories}
            onToggleCollapse={toggleCategoriesCollapse}
          />

          {/* Brands filter */}
          <BrandsSection
            brands={brands}
            selectedBrands={selectedBrands}
            onBrandsChange={onBrandsChange}
            collapsed={collapsed.brands}
            onToggleCollapse={toggleBrandsCollapse}
          />

          {/* Price filter with Range slider */}
          <PriceSection
            priceRange={priceRange}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onPriceChange={onPriceChange}
            collapsed={collapsed.price}
            onToggleCollapse={togglePriceCollapse}
          />

          {/* Clear filters section - moved to bottom as requested */}
          <ClearFiltersSection 
            onClearAll={onClearAll}
            hasActiveFilters={hasActiveFilters}
          />

          {/* Static sections that never change */}
          <StaticSections />
        </div>
      </aside>
    </>
  )
}, (prevProps, nextProps) => {
  // Custom comparison function for optimal re-rendering
  const keysToCompare = [
    'loading', 'className', 'isOpen',
    'minPrice', 'maxPrice'
  ]
  
  // Check primitive props
  for (const key of keysToCompare) {
    if (prevProps[key] !== nextProps[key]) {
      return false
    }
  }
  
  // Check priceRange object
  if (
    prevProps.priceRange?.min !== nextProps.priceRange?.min ||
    prevProps.priceRange?.max !== nextProps.priceRange?.max
  ) {
    return false
  }
  
  // Check arrays (using length + content comparison for performance)
  const arrayProps = ['categories', 'brands', 'selectedCategories', 'selectedBrands']
  for (const prop of arrayProps) {
    const prevArray = prevProps[prop] || []
    const nextArray = nextProps[prop] || []
    
    if (prevArray.length !== nextArray.length) {
      return false
    }
    
    // For small arrays, do content comparison
    if (prevArray.length < 100 && JSON.stringify(prevArray) !== JSON.stringify(nextArray)) {
      return false
    }
  }
  
  return true
})

// Sidebar styles component - Optimized for react-sticky-box
const SidebarStyles = () => (
  <style>{`
    /* Sidebar content styling - sticky behavior handled by parent StickyBox */
    .sidebar-content {
      padding: 0;
      /* Parent StickyBox handles all positioning */
    }

    /* Container grid setup for better layout */
    .shop-grid-container {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 30px;
      align-items: start;
      min-height: 600px;
    }

    .shop-grid-container .sidebar-column {
      /* No positioning needed - parent StickyBox handles sticky behavior */
    }

    .shop-grid-container .products-column {
      min-height: 600px;
    }

    /* Enhanced grid layout for better alignment */
    @media (min-width: 992px) {
      .shop-grid-container {
        grid-gap: 40px;
        grid-template-columns: 300px 1fr;
      }
      
      .products-column {
        width: 100%;
        min-width: 0;
      }
    }

    /* Responsive behavior for smaller screens */
    @media (max-width: 991px) {
      .shop-grid-container {
        display: none !important;
      }
    }

    /* Show grid only on desktop */
    @media (min-width: 992px) {
      .shop-grid-container.d-none.d-lg-grid {
        display: grid !important;
      }
      
      .row.d-lg-none {
        display: none !important;
      }
    }

    /* Ultra compact widget styling */
    .widget {
      margin-bottom: 8px;
      border: 1px solid #e9ecef;
      border-radius: 6px;
      overflow: hidden;
      background: white;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
      transition: box-shadow 0.2s ease;
    }

    .widget:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .widget-title {
      margin: 0;
      padding: 8px 12px;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      border-bottom: 1px solid #e9ecef;
      font-size: 13px;
      position: relative;
    }

    .widget-title a {
      color: #333;
      text-decoration: none;
      font-weight: 600;
      font-size: 13px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .widget-title a:hover {
      color: #007bff;
    }

    .widget-title a:after {
      content: '▼';
      font-size: 10px;
      color: #666;
      transition: transform 0.2s ease;
    }

    .widget-title a.collapsed:after {
      transform: rotate(-90deg);
    }

    .widget-body {
      padding: 8px 12px;
    }

    .widget-body.collapse {
      display: none;
    }

    /* Compact checkbox styling */
    .custom-checkbox {
      display: flex;
      align-items: center;
      width: 100%;
      cursor: pointer;
      padding: 3px 0;
      border-bottom: 1px solid #f8f9fa;
      font-size: 12px;
      transition: background-color 0.15s ease;
    }

    .custom-checkbox:last-child {
      border-bottom: none;
    }

    .custom-checkbox:hover {
      background: #f8f9fa;
      margin: 0 -6px;
      padding-left: 6px;
      padding-right: 6px;
      border-radius: 4px;
    }

    .custom-checkbox input[type="checkbox"] {
      margin-right: 6px;
      transform: scale(0.9);
    }

    .category-name {
      flex: 1;
      font-size: 12px;
      font-weight: 500;
      line-height: 1.2;
    }

    .products-count {
      font-size: 10px;
      color: #666;
      background: #f1f3f4;
      padding: 1px 4px;
      border-radius: 8px;
      font-weight: 500;
      min-width: 18px;
      text-align: center;
    }

    /* Compact price range styling */
    .price-input-wrapper {
      width: 65px;
    }

    .price-label {
      font-size: 10px;
      color: #666;
      margin-bottom: 2px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .price-input {
      font-size: 11px;
      text-align: center;
      font-weight: 500;
      border: 1px solid #e9ecef;
      border-radius: 4px;
      transition: border-color 0.3s ease;
      padding: 3px 4px;
      height: 28px;
    }

    .price-input:focus {
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
    }

    .price-separator {
      align-self: center;
      margin: 0 6px;
      color: #666;
      font-weight: 600;
      font-size: 12px;
    }

    /* Ultra compact range slider */
    .price-slider-container {
      padding: 8px 3px;
      margin: 8px 0;
    }

    .price-slider-track {
      height: 4px;
      width: 100%;
      background: #e9ecef;
      border-radius: 2px;
      position: relative;
      display: flex;
      align-items: center;
    }

    .price-slider-track:before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      background: linear-gradient(90deg, #007bff 0%, #0056b3 100%);
      border-radius: 2px;
      z-index: 1;
    }

    .price-slider-thumb {
      height: 14px;
      width: 14px;
      background: #007bff;
      border: 2px solid white;
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
      transition: all 0.2s ease;
      z-index: 2;
      position: relative;
    }

    .price-slider-thumb:hover,
    .price-slider-thumb.dragged {
      background: #0056b3;
      transform: scale(1.15);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    }

    .price-slider-thumb:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
    }

    .price-display {
      margin-top: 8px;
      font-size: 11px;
      color: #333;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      padding: 6px 8px;
      border-radius: 4px;
      border: 1px solid #dee2e6;
      text-align: center;
      font-weight: 600;
    }

    /* Ultra compact clear filters section */
    .clear-filters-widget {
      border-top: 2px solid #e9ecef;
      margin-top: 12px;
      padding-top: 12px;
      background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
    }

    .clear-filters-btn {
      font-weight: 500;
      transition: all 0.3s ease;
      border: 2px solid #dc3545;
      background: transparent;
      color: #dc3545;
      font-size: 12px;
      padding: 6px 12px;
      border-radius: 6px;
    }

    .clear-filters-btn:hover {
      background: #dc3545;
      color: white;
      transform: translateY(-1px);
      box-shadow: 0 3px 6px rgba(220, 53, 69, 0.2);
    }

    .clear-filters-help {
      margin-top: 6px;
      text-align: center;
    }

    .clear-filters-help small {
      font-size: 10px;
      color: #6c757d;
    }

    /* Loading placeholder compact */
    .loading-placeholder {
      padding: 10px;
    }

    .skeleton-widget {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      height: 60px;
      margin-bottom: 8px;
      border-radius: 6px;
    }

    @keyframes shimmer {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }

    /* Compact static sections */
    .widget-recently-viewed,
    .widget-featured,
    .widget-block {
      margin-bottom: 8px;
    }

    .widget-block h5 {
      font-size: 13px;
      margin-bottom: 6px;
      font-weight: 600;
    }

    .widget-block p {
      font-size: 11px;
      line-height: 1.3;
      margin-bottom: 8px;
      color: #666;
    }

    .widget-block .btn {
      font-size: 11px;
      padding: 4px 8px;
      border-radius: 4px;
    }

    /* Better scrollbar for the sidebar content */
    .sidebar-content::-webkit-scrollbar {
      width: 6px;
    }

    .sidebar-content::-webkit-scrollbar-track {
      background: #f8f9fa;
      border-radius: 3px;
    }

    .sidebar-content::-webkit-scrollbar-thumb {
      background: #dee2e6;
      border-radius: 3px;
      transition: background 0.2s ease;
    }

    .sidebar-content::-webkit-scrollbar-thumb:hover {
      background: #adb5bd;
    }

    /* Firefox scrollbar */
    .sidebar-content {
      scrollbar-width: thin;
      scrollbar-color: #dee2e6 #f8f9fa;
    }

    /* Mobile responsive adjustments */
    @media (max-width: 991px) {

      .widget-title {
        padding: 10px 15px;
      }

      .widget-body {
        padding: 10px 15px;
      }

      .custom-checkbox {
        padding: 6px 0;
        font-size: 13px;
      }

      .price-input-wrapper {
        width: 70px;
      }

      .price-input {
        font-size: 12px;
        height: 32px;
      }
    }

    /* Ensure sidebar doesn't interfere with main content */
    @media (min-width: 992px) {
      .sidebar-shop {
        position: static;
        width: 100%;
        height: auto;
        z-index: auto;
      }
      
      .sidebar-overlay {
        display: none;
      }
    }
  `}</style>
)

// Enhanced Sidebar with styling
const SidebarWithStyles = (props) => (
  <>
    <SidebarStyles />
    <Sidebar {...props} />
  </>
)

export default SidebarWithStyles
