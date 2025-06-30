import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useProducts } from '../hooks/useProducts'
import { useCategories } from '../hooks/useCategories'
import { useVendors } from '../hooks/useVendors'
import ProductGrid from '../elements/ProductGrid'
import Sidebar from '../components/Shop/Sidebar'
import { SearchResultsSkeleton } from '../components/Skeleton'
import ReactUpdateTracker from '../components/Debug/ReactUpdateTracker'
import UpdateIndicator from '../components/Debug/UpdateIndicator'
import DebugErrorBoundary from '../components/Debug/DebugErrorBoundary'
import FilterTestHelper from '../components/Debug/FilterTestHelper'
import '../test-instructions.js' // Load test instructions

export default function Products() {
  const [filters, setFilters] = useState({})
  const [sortBy, setSortBy] = useState('menu_order')
  const [showCount, setShowCount] = useState(12)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // Price range state - will be dynamic based on products
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })
  
  const [sidebarFilters, setSidebarFilters] = useState({
    categories: [],
    brands: [],
    priceRange: [0, 1000]
  })

  // Memoize the query options to prevent unnecessary re-renders
  const queryOptions = useMemo(() => ({
    filters: {
      ...filters,
      ordering: sortBy,
      page_size: showCount
    }
  }), [filters, sortBy, showCount])

  const { 
    data, 
    isLoading, 
    error, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage,
  } = useProducts(queryOptions)

  const { data: categories, isLoading: categoriesLoading } = useCategories()
  const { data: vendors, isLoading: vendorsLoading } = useVendors()
  
  // Memoize products to prevent unnecessary re-renders
  const products = useMemo(() => {
    return data?.pages?.flatMap(page => page.results) || []
  }, [data?.pages])
  
  const observerRef = useRef()
  const loadMoreRef = useRef()

  // Calculate dynamic price range from products
  useEffect(() => {
    if (products.length > 0) {
      const prices = products.map(product => parseFloat(product.price || 0)).filter(price => price > 0)
      if (prices.length > 0) {
        const minPrice = Math.floor(Math.min(...prices))
        const maxPrice = Math.ceil(Math.max(...prices))
        
        // Only update price range if it's significantly different (avoid constant updates)
        if (Math.abs(priceRange.min - minPrice) > 1 || Math.abs(priceRange.max - maxPrice) > 1) {
          console.log('📊 Updating price range from products:', { minPrice, maxPrice })
          setPriceRange({ min: minPrice, max: maxPrice })
          
          // Only update sidebar filters if they're at the default values (meaning user hasn't changed them)
          if (sidebarFilters.priceRange[0] === 0 && sidebarFilters.priceRange[1] === 1000) {
            console.log('🎯 Updating sidebar price range to match product range')
            setSidebarFilters(prev => ({
              ...prev,
              priceRange: [minPrice, maxPrice]
            }))
          }
        }
      }
    }
  }, [products.length]) // Simplified dependency

  // Handle filter changes with useCallback to prevent unnecessary re-renders
  const handleFiltersChange = useCallback((newFilters) => {
    console.log('🔄 Shop handleFiltersChange called:', newFilters)
    console.log('📊 Current sidebar filters before update:', sidebarFilters)
    console.log('🎯 Current API filters before update:', filters)
    
    // Prevent unnecessary updates if filters haven't actually changed
    const hasChanged = JSON.stringify(sidebarFilters) !== JSON.stringify(newFilters)
    if (!hasChanged) {
      console.log('⏭️ Filters unchanged, skipping update')
      return
    }
    
    // Store the sidebar filters for passing back to sidebar (to maintain state)
    setSidebarFilters(newFilters)
    
    // Map sidebar filters to API parameters
    const apiFilters = {}
    
    // Categories filter
    if (newFilters.categories && newFilters.categories.length > 0) {
      apiFilters.category = newFilters.categories.join(',')
    }
    
    // Brands filter
    if (newFilters.brands && newFilters.brands.length > 0) {
      apiFilters.vendor = newFilters.brands.join(',')
    }
    
    // Price filters
    if (newFilters.priceMin && newFilters.priceMin > priceRange.min) {
      apiFilters.price_min = newFilters.priceMin
    }
    if (newFilters.priceMax && newFilters.priceMax < priceRange.max) {
      apiFilters.price_max = newFilters.priceMax
    }
    
    console.log('✅ Setting API filters to:', apiFilters)
    console.log('🎨 Setting sidebar filters to:', newFilters)
    
    setFilters(apiFilters)
    
    console.log('✨ setFilters called - React Query should automatically refetch')
  }, [sidebarFilters, filters, priceRange.min, priceRange.max])

  // Handle sort change
  const handleSortChange = useCallback((newSort) => {
    console.log('🔄 Sort changed to:', newSort)
    setSortBy(newSort)
  }, [])

  // Handle show count change
  const handleShowCountChange = useCallback((newCount) => {
    console.log('🔄 Show count changed to:', newCount)
    setShowCount(newCount)
  }, [])

  // Toggle sidebar on mobile
  const toggleSidebar = useCallback(() => {
    setSidebarOpen(!sidebarOpen)
  }, [sidebarOpen])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    observerRef.current = observer

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  // Show skeleton loader on initial load
  if (isLoading && !products.length) {
    return (
      <div className="container">
        <SearchResultsSkeleton />
      </div>
    )
  }

  return (
    <>
      {/* Debug components temporarily disabled */}
      {/* <DebugErrorBoundary>
        <ReactUpdateTracker componentName="Shop" />
        <UpdateIndicator componentName="Shop" />
        <FilterTestHelper filters={filters} products={products} />
      </DebugErrorBoundary> */}
      <div className="category-banner-container bg-gray">
        <div
          className="category-banner banner text-uppercase"
          style={{
            background:
              'no-repeat 60%/cover url("src/assets/images/banners/banner-top.jpg")'
          }}
        >
          <div className="container position-relative">
            <div className="row">
              <div className="pl-lg-5 pb-5 pb-md-0 col-md-5 col-xl-4 col-lg-4 offset-1">
                <h3>
                  Electronic
                  <br />
                  Deals
                </h3>
                <button 
                  className="btn btn-dark"
                  onClick={(e) => {
                    e.preventDefault()
                    // Add get yours functionality here if needed
                  }}
                >
                  Get Yours!
                </button>
              </div>
              <div className="pl-lg-3 col-md-4 offset-md-0 offset-1 pt-3">
                <div className="coupon-sale-content">
                  <h4 className="m-b-1 coupon-sale-text bg-white text-transform-none">
                    Exclusive COUPON
                  </h4>
                  <h5 className="mb-2 coupon-sale-text d-block ls-10 p-0">
                    <i className="ls-0">UP TO</i>
                    <b className="text-dark">$100</b> OFF
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <nav aria-label="breadcrumb" className="breadcrumb-nav">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <button 
                className="breadcrumb-link"
                onClick={(e) => {
                  e.preventDefault()
                  // Navigate to home if needed
                }}
              >
                <i className="icon-home" />
              </button>
            </li>
            <li className="breadcrumb-item">
              <button 
                className="breadcrumb-link"
                onClick={(e) => {
                  e.preventDefault()
                  // Navigate to Men category if needed
                }}
              >
                Men
              </button>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Accessories
            </li>
          </ol>
        </nav>
        <div className="row">
          <div className="col-lg-9">
            {/* Active Filters Display */}
            {Object.keys(filters).length > 0 && (
              <div className="active-filters mb-3">
                <div className="d-flex flex-wrap align-items-center gap-2">
                  <span className="fw-bold me-2">Active Filters:</span>
                  {Object.entries(filters).map(([key, value]) => (
                    <span key={key} className="badge bg-primary">
                      {key}: {value}
                      <button 
                        className="btn-close btn-close-white btn-sm ms-1"
                        onClick={() => {
                          const newFilters = { ...filters }
                          delete newFilters[key]
                          setFilters(newFilters)
                        }}
                      ></button>
                    </span>
                  ))}
                  <button 
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => {
                      setFilters({})
                      setSidebarFilters({
                        categories: [],
                        brands: [],
                        priceRange: [0, 1000]
                      })
                    }}
                  >
                    Clear All
                  </button>
                </div>
              </div>
            )}

            {/* Products count and loading info */}
            <div className="products-info mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted">
                  {data?.pages?.[0]?.count ? `${data.pages[0].count} products found` : ''}
                  {isLoading && ' (Loading...)'}
                </span>
                {error && (
                  <span className="text-danger">
                    <i className="icon-exclamation-triangle me-1"></i>
                    {error.message}
                  </span>
                )}
              </div>
            </div>

            <nav
              className="toolbox sticky-header"
              data-sticky-options="{'mobile': true}"
            >
              <div className="toolbox-left">
                <button
                  type="button"
                  className="sidebar-toggle"
                  onClick={toggleSidebar}
                >
                  <svg
                    data-name="Layer 3"
                    id="Layer_3"
                    viewBox="0 0 32 32"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <line x1={15} x2={26} y1={9} y2={9} className="cls-1" />
                    <line x1={6} x2={9} y1={9} y2={9} className="cls-1" />
                    <line x1={23} x2={26} y1={16} y2={16} className="cls-1" />
                    <line x1={6} x2={17} y1={16} y2={16} className="cls-1" />
                    <line x1={17} x2={26} y1={23} y2={23} className="cls-1" />
                    <line x1={6} x2={11} y1={23} y2={23} className="cls-1" />
                    <path
                      d="M14.5,8.92A2.6,2.6,0,0,1,12,11.5,2.6,2.6,0,0,1,9.5,8.92a2.5,2.5,0,0,1,5,0Z"
                      className="cls-2"
                    />
                    <path
                      d="M22.5,15.92a2.5,2.5,0,1,1-5,0,2.5,2.5,0,0,1,5,0Z"
                      className="cls-2"
                    />
                    <path
                      d="M21,16a1,1,0,1,1-2,0,1,1,0,0,1,2,0Z"
                      className="cls-3"
                    />
                    <path
                      d="M16.5,22.92A2.6,2.6,0,0,1,14,25.5a2.6,2.6,0,0,1-2.5-2.58,2.5,2.5,0,0,1,5,0Z"
                      className="cls-2"
                    />
                  </svg>
                  <span>Filter</span>
                </button>
                <div className="toolbox-item toolbox-sort">
                  <label>Sort By:</label>
                  <div className="select-custom">
                    <select 
                      name="orderby" 
                      className="form-control" 
                      value={sortBy}
                      onChange={(e) => handleSortChange(e.target.value)}
                    >
                      <option value="menu_order">Default sorting</option>
                      <option value="popularity">Sort by popularity</option>
                      <option value="rating">Sort by average rating</option>
                      <option value="-created_at">Sort by newness</option>
                      <option value="price">Sort by price: low to high</option>
                      <option value="-price">Sort by price: high to low</option>
                    </select>
                  </div>
                  {/* End .select-custom */}
                </div>
                {/* End .toolbox-item */}
              </div>
              {/* End .toolbox-left */}
              <div className="toolbox-right">
                <div className="toolbox-item toolbox-show">
                  <label>Show:</label>
                  <div className="select-custom">
                    <select 
                      name="count" 
                      className="form-control" 
                      value={showCount}
                      onChange={(e) => handleShowCountChange(parseInt(e.target.value))}
                    >
                      <option value={12}>12</option>
                      <option value={24}>24</option>
                      <option value={36}>36</option>
                    </select>
                  </div>
                  {/* End .select-custom */}
                </div>
                {/* End .toolbox-item */}
                <div className="toolbox-item layout-modes">
                  <button
                    className="layout-btn btn-grid active"
                    title="Grid"
                    onClick={(e) => {
                      e.preventDefault()
                      // Handle grid view if needed
                    }}
                  >
                    <i className="icon-mode-grid" />
                  </button>
                  <button
                    className="layout-btn btn-list"
                    title="List"
                    onClick={(e) => {
                      e.preventDefault()
                      // Handle list view if needed
                    }}
                  >
                    <i className="icon-mode-list" />
                  </button>
                </div>
                {/* End .layout-modes */}
              </div>
              {/* End .toolbox-right */}
            </nav>

            <ProductGrid 
              key={`grid-${JSON.stringify(filters)}-${products.length}`}
              products={products}
              loading={isLoading}
              error={error}
              defaultColumns={{
                xs: 2,
                sm: 2,
                md: 3,
                lg: 4,
                xl: 4
              }}
              className="row product-ajax-grid scroll-load"
            />
            
            {/* Infinite scroll trigger */}
            <div ref={loadMoreRef} className="load-more-trigger" style={{ height: '20px', margin: '20px 0' }}>
              {isFetchingNextPage && (
                <div className="text-center">
                  <div className="spinner-border" role="status">
                    <span className="sr-only">Loading more products...</span>
                  </div>
                </div>
              )}
            </div>

          </div>
          
          <Sidebar
            onFiltersChange={handleFiltersChange}
            currentFilters={sidebarFilters}
            categories={categories}
            brands={vendors}
            priceRange={priceRange}
            loading={categoriesLoading || vendorsLoading}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            className={sidebarOpen ? 'show' : ''}
          />
        </div>
        {/* End .row */}
      </div>
      {/* End .container */}
      <div className="mb-3" />
      {/* margin */}
    </>
  )
}