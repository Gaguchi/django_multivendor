import { useState, useEffect, useCallback, useRef, memo } from 'react'
import { Range } from 'react-range'

const Sidebar = memo(function Sidebar({ 
  onFiltersChange, 
  currentFilters = {}, 
  categories = [],
  brands = [],
  priceRange = { min: 0, max: 1000 },
  loading = false,
  className = '',
  isOpen = false,
  onClose = () => {}
}) {
  const [localFilters, setLocalFilters] = useState({
    categories: [],
    brands: [],
    priceRange: [priceRange.min, priceRange.max],
    ...currentFilters
  })

  // Local collapse states (instead of Bootstrap)
  const [collapsedSections, setCollapsedSections] = useState({
    categories: false,
    brands: false,
    price: false
  })

  // Debounce timer for price changes
  const debounceTimerRef = useRef(null)
  const [isPriceUpdating, setIsPriceUpdating] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Toggle section collapse
  const toggleSection = useCallback((section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }, [])

  // Initialize filters from currentFilters prop when it changes
  useEffect(() => {
    console.log('🎯 Sidebar useEffect: currentFilters changed to:', currentFilters)
    console.log('💰 Sidebar useEffect: priceRange is:', priceRange)
    console.log('🚀 Sidebar useEffect: isInitialized is:', isInitialized)
    
    // Only reset local filters on first initialization or if currentFilters have actually changed
    if (!isInitialized || (currentFilters && Object.keys(currentFilters).length > 0)) {
      setLocalFilters({
        categories: currentFilters.categories || [],
        brands: currentFilters.brands || [],
        priceRange: currentFilters.priceRange || [priceRange.min, priceRange.max],
      })
      setIsInitialized(true)
    }
  }, [currentFilters, isInitialized, priceRange.min, priceRange.max])

  // Separate effect to handle priceRange updates (only for initial setup)
  useEffect(() => {
    if (!isInitialized && !currentFilters.priceRange) {
      console.log('💰 Sidebar: Setting initial price range:', [priceRange.min, priceRange.max])
      setLocalFilters(prev => ({
        ...prev,
        priceRange: [priceRange.min, priceRange.max]
      }))
    }
  }, [priceRange.min, priceRange.max, isInitialized, currentFilters.priceRange])

  // Debounced function to update filters
  const debouncedUpdateFilters = useCallback((newFilters, immediate = false) => {
    console.log('debouncedUpdateFilters called:', { newFilters, immediate })
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    if (immediate) {
      // For non-price filters, update immediately
      setLocalFilters(newFilters)
      
      // Don't update URL params to avoid page refresh
      // Only notify parent component with formatted filters
      const formattedFilters = {
        ...newFilters,
        priceMin: newFilters.priceRange[0],
        priceMax: newFilters.priceRange[1]
      }
      console.log('Calling onFiltersChange immediately:', formattedFilters)
      onFiltersChange?.(formattedFilters)
    } else {
      // For price filters, debounce the update
      setLocalFilters(newFilters) // Update local state immediately for UI responsiveness
      setIsPriceUpdating(true)
      
      debounceTimerRef.current = setTimeout(() => {
        // Don't update URL params to avoid page refresh
        // Only notify parent component with formatted filters
        const formattedFilters = {
          ...newFilters,
          priceMin: newFilters.priceRange[0],
          priceMax: newFilters.priceRange[1]
        }
        console.log('Calling onFiltersChange (debounced):', formattedFilters)
        onFiltersChange?.(formattedFilters)
        setIsPriceUpdating(false)
      }, 300) // Reduced delay for better responsiveness
    }
  }, [onFiltersChange])

  // Update filters and notify parent
  const updateFilters = useCallback((newFilters, immediate = false) => {
    debouncedUpdateFilters(newFilters, immediate)
  }, [debouncedUpdateFilters])

  const toggleArrayFilter = useCallback((filterType, value) => {
    const currentArray = localFilters[filterType] || []
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value]
    
    updateFilters({
      ...localFilters,
      [filterType]: newArray
    }, true) // Immediate update for non-price filters
  }, [localFilters, updateFilters])

  const handlePriceRangeChange = useCallback((values) => {
    updateFilters({
      ...localFilters,
      priceRange: values
    }, false) // Debounced update for price filters
  }, [localFilters, updateFilters])

  const handlePriceInputChange = useCallback((index, value) => {
    const newRange = [...localFilters.priceRange]
    newRange[index] = value
    updateFilters({
      ...localFilters,
      priceRange: newRange
    }, false) // Debounced update for price inputs
  }, [localFilters, updateFilters])

  const clearAllFilters = useCallback(() => {
    const emptyFilters = {
      categories: [],
      brands: [],
      priceRange: [priceRange.min, priceRange.max]
    }
    updateFilters(emptyFilters, true)
  }, [priceRange.min, priceRange.max, updateFilters])

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  const hasActiveFilters = useCallback(() => {
    return localFilters.categories.length > 0 ||
           localFilters.brands.length > 0 ||
           localFilters.priceRange[0] > priceRange.min ||
           localFilters.priceRange[1] < priceRange.max
  }, [localFilters, priceRange.min, priceRange.max])

  console.log('🎨 Sidebar render:', { 
    localFilters, 
    hasActiveFilters: hasActiveFilters(),
    isPriceUpdating,
    renderTime: new Date().toISOString()
  })

  return (
    <>
      <div 
        className={`sidebar-overlay ${isOpen ? 'show' : ''}`}
        onClick={onClose}
      />
      <aside className={`sidebar-shop col-lg-3 order-lg-first mobile-sidebar ${className} ${isOpen ? 'show' : ''}`}>
        <div className="sidebar-wrapper">
          
          {/* Clear Filters */}
          {hasActiveFilters() && (
            <div className="widget">
              <div className="widget-body">
                <button 
                  className="btn btn-outline-primary btn-sm w-100"
                  onClick={clearAllFilters}
                >
                  <i className="icon-close me-2"></i>
                  Clear All Filters
                  {isPriceUpdating && <span className="ms-2">⏳</span>}
                </button>
              </div>
            </div>
          )}

          {/* Categories Widget */}
          <div className="widget">
            <h3 className="widget-title">
              <button
                className="widget-title collapse-toggle"
                onClick={() => toggleSection('categories')}
                type="button"
              >
                Categories
                <i className={`fas fa-chevron-${collapsedSections.categories ? 'down' : 'up'} ms-2`}></i>
              </button>
              {localFilters.categories.length > 0 && (
                <button
                  className="clear-section"
                  onClick={(e) => {
                    e.preventDefault()
                    updateFilters({ ...localFilters, categories: [] }, true)
                  }}
                >
                  Clear
                </button>
              )}
            </h3>
            <div className={`widget-collapse ${collapsedSections.categories ? 'collapsed' : 'expanded'}`}>
              <div className="widget-body">
                {loading ? (
                  <div className="category-skeleton">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div key={index} className="skeleton-line mb-2"></div>
                    ))}
                  </div>
                ) : (
                  <ul className="cat-list">
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <li key={category.id}>
                          <label className="category-item">
                            <input
                              type="checkbox"
                              checked={localFilters.categories.includes(String(category.id))}
                              onChange={() => toggleArrayFilter('categories', String(category.id))}
                            />
                            <span className="category-name">{category.name}</span>
                            {category.product_count && (
                              <span className="products-count">({category.product_count})</span>
                            )}
                          </label>
                        </li>
                      ))
                    ) : (
                      <li>
                        <label className="category-item">
                          <input
                            type="checkbox"
                            checked={localFilters.categories.includes('electronics')}
                            onChange={() => toggleArrayFilter('categories', 'electronics')}
                          />
                          <span className="category-name">Electronics</span>
                          <span className="products-count">(15)</span>
                        </label>
                      </li>
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Brands Widget */}
          <div className="widget">
            <h3 className="widget-title">
              <button
                className="collapse-toggle"
                onClick={() => toggleSection('brands')}
                type="button"
              >
                Brands
                <i className={`fas fa-chevron-${collapsedSections.brands ? 'down' : 'up'} ms-2`}></i>
              </button>
              {localFilters.brands.length > 0 && (
                <button
                  className="clear-section"
                  onClick={(e) => {
                    e.preventDefault()
                    updateFilters({ ...localFilters, brands: [] }, true)
                  }}
                >
                  Clear
                </button>
              )}
            </h3>
            <div className={`widget-collapse ${collapsedSections.brands ? 'collapsed' : 'expanded'}`}>
              <div className="widget-body">
                {loading ? (
                  <div className="brand-skeleton">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div key={index} className="skeleton-line mb-2"></div>
                    ))}
                  </div>
                ) : (
                  <ul className="cat-list">
                    {brands && brands.length > 0 ? (
                      brands.map((brand) => (
                        <li key={brand.id || brand.name}>
                          <label className="category-item">
                            <input
                              type="checkbox"
                              checked={localFilters.brands.includes(String(brand.id || brand.name))}
                              onChange={() => toggleArrayFilter('brands', String(brand.id || brand.name))}
                            />
                            <span className="category-name">{brand.store_name || brand.name}</span>
                            {brand.product_count && (
                              <span className="products-count">({brand.product_count})</span>
                            )}
                          </label>
                        </li>
                      ))
                    ) : (
                      <div className="text-muted small py-2">
                        No brands available
                      </div>
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Price Widget */}
          <div className="widget">
            <h3 className="widget-title">
              <button
                className="collapse-toggle"
                onClick={() => toggleSection('price')}
                type="button"
              >
                Price {isPriceUpdating && <span className="price-updating">⏳</span>}
                <i className={`fas fa-chevron-${collapsedSections.price ? 'down' : 'up'} ms-2`}></i>
              </button>
              {(localFilters.priceRange[0] > priceRange.min || localFilters.priceRange[1] < priceRange.max) && (
                <button
                  className="clear-section"
                  onClick={(e) => {
                    e.preventDefault()
                    updateFilters({ ...localFilters, priceRange: [priceRange.min, priceRange.max] }, true)
                  }}
                >
                  Clear
                </button>
              )}
            </h3>
            <div className={`widget-collapse ${collapsedSections.price ? 'collapsed' : 'expanded'}`}>
              <div className="widget-body pb-0">
                <div className="price-filter">
                  {/* Price Range Display */}
                  <div className="price-range-display mb-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="price-input-wrapper">
                        <label className="price-label">Min</label>
                        <input
                          type="number"
                          className="form-control form-control-sm price-input"
                          value={localFilters.priceRange[0]}
                          min={priceRange.min}
                          max={localFilters.priceRange[1]}
                          onChange={(e) => {
                            const value = Math.max(priceRange.min, Math.min(parseInt(e.target.value) || priceRange.min, localFilters.priceRange[1]))
                            handlePriceInputChange(0, value)
                          }}
                        />
                      </div>
                      <div className="price-separator">-</div>
                      <div className="price-input-wrapper">
                        <label className="price-label">Max</label>
                        <input
                          type="number"
                          className="form-control form-control-sm price-input"
                          value={localFilters.priceRange[1]}
                          min={localFilters.priceRange[0]}
                          max={priceRange.max}
                          onChange={(e) => {
                            const value = Math.min(priceRange.max, Math.max(parseInt(e.target.value) || priceRange.max, localFilters.priceRange[0]))
                            handlePriceInputChange(1, value)
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Range Slider */}
                  <div className="price-range-slider mb-3">
                    <Range
                      step={1}
                      min={priceRange.min}
                      max={priceRange.max}
                      values={localFilters.priceRange}
                      onChange={handlePriceRangeChange}
                      renderTrack={({ props, children }) => (
                        <div
                          {...props}
                          className="range-track"
                          style={{
                            ...props.style,
                            height: '8px',
                            width: '100%',
                            backgroundColor: '#e9ecef',
                            borderRadius: '4px',
                            position: 'relative'
                          }}
                        >
                          {children}
                        </div>
                      )}
                      renderThumb={({ props, index }) => (
                        <div
                          {...props}
                          className="range-thumb"
                          style={{
                            ...props.style,
                            height: '24px',
                            width: '24px',
                            backgroundColor: '#08C',
                            borderRadius: '50%',
                            border: '3px solid white',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                            outline: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          <div className="range-thumb-label">
                            ${localFilters.priceRange[index]}
                          </div>
                        </div>
                      )}
                    />
                  </div>
                  
                  {/* Quick price ranges */}
                  <div className="price-ranges">
                    <div className="small mb-2 text-muted">Quick ranges:</div>
                    <div className="d-flex flex-wrap gap-1">
                      {[
                        { label: 'Under $25', range: [priceRange.min, 25] },
                        { label: '$25-$50', range: [25, 50] },
                        { label: '$50-$100', range: [50, 100] },
                        { label: '$100+', range: [100, priceRange.max] },
                      ].map((rangeOption, index) => (
                        <button
                          key={index}
                          className={`btn btn-sm ${
                            localFilters.priceRange[0] === rangeOption.range[0] && 
                            localFilters.priceRange[1] === rangeOption.range[1]
                              ? 'btn-primary' 
                              : 'btn-outline-secondary'
                          }`}
                          onClick={() => updateFilters({
                            ...localFilters,
                            priceRange: rangeOption.range
                          }, false)}
                        >
                          {rangeOption.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recently Viewed Widget */}
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

          {/* Featured Products Widget */}
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

          {/* Custom HTML Block */}
          <div className="widget widget-block">
            <h3 className="widget-title">Special Offers</h3>
            <h5>Get the best deals!</h5>
            <p>
              Subscribe to our newsletter and get exclusive offers and discounts delivered to your inbox.
            </p>
            <button 
              className="btn btn-primary btn-sm" 
              onClick={(e) => {
                e.preventDefault()
                // Add subscribe functionality here if needed
              }}
            >
              Subscribe Now
            </button>
          </div>
        </div>
      </aside>

      <style jsx>{`
        .widget-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .widget-title .clear-section {
          font-size: 12px;
          color: #666;
          cursor: pointer;
          text-decoration: none;
        }

        .widget-title .clear-section:hover {
          color: #08C;
        }

        .price-updating {
          font-size: 12px;
          margin-left: 5px;
        }

        .category-item {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 8px 0;
          cursor: pointer;
          border: none;
          background: none;
          text-align: left;
        }

        .category-item input[type="checkbox"] {
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

        .price-range-display {
          margin-bottom: 1rem;
        }

        .price-input-wrapper {
          display: flex;
          flex-direction: column;
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
          padding: 0.375rem 0.5rem;
          text-align: center;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .price-input:focus {
          border-color: #08C;
          box-shadow: 0 0 0 0.2rem rgba(8, 140, 204, 0.25);
        }

        .price-separator {
          align-self: flex-end;
          margin: 0 10px 8px 10px;
          color: #666;
          font-weight: 500;
        }

        .price-range-slider {
          padding: 20px 10px 10px 10px;
          position: relative;
        }

        .range-thumb {
          position: relative;
        }

        .range-thumb-label {
          position: absolute;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          background: #333;
          color: white;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 11px;
          white-space: nowrap;
          opacity: 0;
          transition: opacity 0.2s;
          pointer-events: none;
        }

        .range-thumb:hover .range-thumb-label {
          opacity: 1;
        }

        .range-thumb-label::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border: 4px solid transparent;
          border-top-color: #333;
        }

        .range-track {
          background: linear-gradient(to right, 
            #e9ecef 0%, 
            #e9ecef ${((localFilters.priceRange[0] - priceRange.min) / (priceRange.max - priceRange.min)) * 100}%, 
            #08C ${((localFilters.priceRange[0] - priceRange.min) / (priceRange.max - priceRange.min)) * 100}%, 
            #08C ${((localFilters.priceRange[1] - priceRange.min) / (priceRange.max - priceRange.min)) * 100}%, 
            #e9ecef ${((localFilters.priceRange[1] - priceRange.min) / (priceRange.max - priceRange.min)) * 100}%, 
            #e9ecef 100%) !important;
          border-radius: 4px;
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
        }

        .price-ranges .btn-sm {
          font-size: 11px;
          padding: 0.25rem 0.5rem;
        }

        .skeleton-line {
          height: 20px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s infinite;
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

        .widget-title a {
          text-decoration: none;
          color: inherit;
        }

        .cat-list {
          list-style: none;
          padding: 0;
        }

        .cat-list li {
          border-bottom: 1px solid #eee;
          padding: 8px 0;
        }

        .cat-list li:last-child {
          border-bottom: none;
        }

        @media (max-width: 991px) {
          .mobile-sidebar {
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

          .mobile-sidebar.show {
            left: 0;
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

          .price-input-wrapper {
            width: 70px;
          }

          .price-input {
            font-size: 12px;
            padding: 0.25rem 0.375rem;
          }

          .price-separator {
            margin: 0 8px 8px 8px;
          }

          /* Button styles to replace anchor tags */
          .collapse-toggle {
            background: none;
            border: none;
            padding: 0;
            font: inherit;
            cursor: pointer;
            color: inherit;
            text-decoration: none;
          }

          .collapse-toggle:hover {
            color: inherit;
          }

          .breadcrumb-link {
            background: none;
            border: none;
            padding: 0;
            font: inherit;
            cursor: pointer;
            color: inherit;
            text-decoration: none;
          }

          .breadcrumb-link:hover {
            color: inherit;
          }

          .layout-btn {
            background: none;
            border: none;
            padding: 0.5rem;
            cursor: pointer;
            color: inherit;
            text-decoration: none;
          }

          .layout-btn:hover {
            background-color: rgba(0, 0, 0, 0.1);
          }

          .layout-btn.active {
            background-color: rgba(0, 0, 0, 0.2);
          }

          /* Custom collapse functionality */
          .widget-collapse {
            transition: all 0.3s ease;
          }

          .widget-collapse.expanded {
            max-height: none;
            opacity: 1;
          }

          .widget-collapse.collapsed {
            max-height: 0;
            opacity: 0;
            overflow: hidden;
          }

          .clear-section {
            background: none;
            border: none;
            padding: 0;
            font: inherit;
            cursor: pointer;
            color: #666;
            text-decoration: none;
            font-size: 12px;
          }

          .clear-section:hover {
            color: #08C;
          }

          .range-thumb-label {
            font-size: 10px;
            top: -25px;
          }
        }
      `}</style>
    </>
  )
})

export default Sidebar
