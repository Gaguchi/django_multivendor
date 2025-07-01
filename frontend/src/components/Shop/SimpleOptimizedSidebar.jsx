import React, { memo, useCallback, useState, useRef, useMemo } from 'react'

// Individual filter sections - each memoized independently
const CategoriesSection = memo(function CategoriesSection({ 
  categories, 
  selectedCategories, 
  onCategoriesChange, 
  collapsed, 
  onToggleCollapse 
}) {
  const renderCount = useRef(0)
  renderCount.current++
  
  console.log('📁 CategoriesSection render:', { 
    count: renderCount.current,
    selectedCount: selectedCategories.length,
    note: 'Should only render when categories or selection changes'
  })

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
  const renderCount = useRef(0)
  renderCount.current++
  
  console.log('🏢 BrandsSection render:', { 
    count: renderCount.current,
    selectedCount: selectedBrands.length,
    note: 'Should only render when brands or selection changes'
  })

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
  const renderCount = useRef(0)
  renderCount.current++
  
  console.log('💰 PriceSection render:', { 
    count: renderCount.current,
    currentRange: [minPrice, maxPrice],
    note: 'Should only render when price range changes'
  })

  const [localMin, setLocalMin] = useState(minPrice)
  const [localMax, setLocalMax] = useState(maxPrice)
  const debounceRef = useRef(null)

  // Update local state when props change
  React.useEffect(() => {
    setLocalMin(minPrice)
    setLocalMax(maxPrice)
  }, [minPrice, maxPrice])

  const handleMinChange = useCallback((e) => {
    const value = parseInt(e.target.value)
    setLocalMin(value)
    
    // Debounce the actual price change
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    debounceRef.current = setTimeout(() => {
      onPriceChange(value, localMax)
    }, 300)
  }, [localMax, onPriceChange])

  const handleMaxChange = useCallback((e) => {
    const value = parseInt(e.target.value)
    setLocalMax(value)
    
    // Debounce the actual price change
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    debounceRef.current = setTimeout(() => {
      onPriceChange(localMin, value)
    }, 300)
  }, [localMin, onPriceChange])

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
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="price-input-wrapper">
              <label className="price-label">Min</label>
              <input
                type="number"
                className="form-control form-control-sm price-input"
                value={localMin}
                min={priceRange.min}
                max={localMax}
                onChange={handleMinChange}
              />
            </div>
            <div className="price-separator">-</div>
            <div className="price-input-wrapper">
              <label className="price-label">Max</label>
              <input
                type="number"
                className="form-control form-control-sm price-input"
                value={localMax}
                min={localMin}
                max={priceRange.max}
                onChange={handleMaxChange}
              />
            </div>
          </div>
          <div className="price-display text-center">
            <strong>${localMin} - ${localMax}</strong>
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
  const renderCount = useRef(0)
  renderCount.current++
  
  console.log('🧹 ClearFiltersSection render:', { 
    count: renderCount.current,
    hasActiveFilters,
    note: 'Should only render when hasActiveFilters changes'
  })

  if (!hasActiveFilters) return null

  return (
    <div className="widget">
      <div className="widget-body">
        <button 
          className="btn btn-outline-danger btn-sm w-100"
          onClick={onClearAll}
        >
          <i className="fas fa-times"></i> Clear All Filters
        </button>
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
const SimpleOptimizedSidebar = memo(function SimpleOptimizedSidebar({
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
  const renderCount = useRef(0)
  renderCount.current++
  
  console.log('📋 SimpleOptimizedSidebar render:', {
    count: renderCount.current,
    timestamp: new Date().toISOString(),
    note: 'MAIN SIDEBAR - Should render minimally',
    warning: renderCount.current > 3 ? '⚠️ Too many renders!' : '✅ Good'
  })

  // Collapse state for each section
  const [collapsed, setCollapsed] = useState({
    categories: false,
    brands: false,
    price: false
  })

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
          <div className="sidebar-wrapper">
            <div className="loading-placeholder">
              <div className="skeleton-widget"></div>
              <div className="skeleton-widget"></div>
              <div className="skeleton-widget"></div>
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
        <div className="sidebar-wrapper">
          {/* Mobile close button */}
          {isOpen && (
            <button className="sidebar-close" onClick={onClose}>
              <i className="fas fa-times"></i>
            </button>
          )}

          {/* Clear filters section */}
          <ClearFiltersSection 
            onClearAll={onClearAll}
            hasActiveFilters={hasActiveFilters}
          />

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

          {/* Price filter */}
          <PriceSection
            priceRange={priceRange}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onPriceChange={onPriceChange}
            collapsed={collapsed.price}
            onToggleCollapse={togglePriceCollapse}
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
      console.log(`📋 SimpleOptimizedSidebar memo: ${key} changed`)
      return false
    }
  }
  
  // Check priceRange object
  if (
    prevProps.priceRange?.min !== nextProps.priceRange?.min ||
    prevProps.priceRange?.max !== nextProps.priceRange?.max
  ) {
    console.log('📋 SimpleOptimizedSidebar memo: priceRange changed')
    return false
  }
  
  // Check arrays (using length + content comparison for performance)
  const arrayProps = ['categories', 'brands', 'selectedCategories', 'selectedBrands']
  for (const prop of arrayProps) {
    const prevArray = prevProps[prop] || []
    const nextArray = nextProps[prop] || []
    
    if (prevArray.length !== nextArray.length) {
      console.log(`📋 SimpleOptimizedSidebar memo: ${prop} length changed`)
      return false
    }
    
    // For small arrays, do content comparison
    if (prevArray.length < 100 && JSON.stringify(prevArray) !== JSON.stringify(nextArray)) {
      console.log(`📋 SimpleOptimizedSidebar memo: ${prop} content changed`)
      return false
    }
  }
  
  console.log('📋 SimpleOptimizedSidebar memo: Props equal, skipping render')
  return true
})

// Minimal custom styles to enhance the existing theme
const SidebarStyles = () => (
  <style>{`
    .custom-checkbox {
      display: flex;
      align-items: center;
      width: 100%;
      cursor: pointer;
    }

    .custom-checkbox input[type="checkbox"] {
      margin-right: 8px;
    }

    .category-name {
      flex: 1;
      font-size: 14px;
    }

    .products-count {
      font-size: 12px;
      color: #666;
    }

    .price-input-wrapper {
      width: 80px;
    }

    .price-label {
      font-size: 12px;
      color: #666;
      margin-bottom: 4px;
      font-weight: 500;
    }

    .price-input {
      font-size: 13px;
      text-align: center;
    }

    .price-separator {
      align-self: center;
      margin: 0 10px;
      color: #666;
      font-weight: 500;
    }

    .skeleton-widget {
      height: 60px;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: skeleton-loading 1.5s infinite;
      margin-bottom: 15px;
      border-radius: 4px;
    }

    @keyframes skeleton-loading {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }

    .sidebar-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1040;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }

    .sidebar-overlay.show {
      opacity: 1;
      visibility: visible;
    }

    /* Fix for desktop sidebar position */
    @media (min-width: 992px) {
      .sidebar-shop {
        position: static !important;
        transform: none !important;
        width: 100% !important;
        height: auto !important;
        z-index: auto !important;
      }
      
      .sidebar-wrapper {
        width: 100% !important;
        padding: 0 !important;
      }
      
      .sidebar-overlay {
        display: none;
      }
    }

    @media (max-width: 991px) {
      .sidebar-shop {
        position: fixed;
        top: 0;
        left: -300px;
        width: 300px;
        height: 100vh;
        background: white;
        z-index: 1050;
        transition: left 0.3s ease;
        overflow-y: auto;
      }

      .sidebar-shop.show {
        left: 0;
      }

      .sidebar-wrapper {
        padding: 1rem;
      }

      .sidebar-close {
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        z-index: 10;
      }
    }
  `}</style>
)

// Enhanced SimpleOptimizedSidebar with styling
const StyledSimpleOptimizedSidebar = (props) => (
  <>
    <SidebarStyles />
    <SimpleOptimizedSidebar {...props} />
  </>
)

export default StyledSimpleOptimizedSidebar
