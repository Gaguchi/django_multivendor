import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useProducts } from '../hooks/useProducts'
import { useCategories } from '../hooks/useCategories'
import { useVendors } from '../hooks/useVendors'
import Sidebar from '../components/Shop/Sidebar'
import ProductGridSection from '../components/Shop/ProductGridSection'
import ShopHeader from '../components/Shop/ShopHeader'
import ActiveFilters from '../components/Shop/ActiveFilters'
import ReactUpdateTracker from '../components/Debug/ReactUpdateTracker'
import RenderVisualizer from '../components/Debug/RenderVisualizer'
import DebugErrorBoundary from '../components/Debug/DebugErrorBoundary'
import { runStickyDiagnostics } from '../utils/stickyDiagnostics'
import '../assets/css/sticky-fixes.css' // CSS fixes for sticky positioning
import '../sidebar-test-instructions.js' // Load test instructions

function ShopPageContent() {
  // Track renders for debugging
  const renderCountRef = useRef(0)
  const mountTimeRef = useRef(Date.now())
  const sidebarColumnRef = useRef(null)
  const productsColumnRef = useRef(null)
  renderCountRef.current++

  // Log renders (less frequently to reduce noise)
  if (renderCountRef.current === 1) {
    console.log('🛍️ Shop Page initial render')
  }

  // SINGLE SOURCE OF TRUTH: All filter state in one place
  const [filterState, setFilterState] = useState({
    selectedCategories: [],
    selectedBrands: [],
    minPrice: 0,
    maxPrice: 1000
  })

  // UI state
  const [sortBy, setSortBy] = useState('menu_order')
  const [showCount, setShowCount] = useState(12)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Memoize API query options to prevent unnecessary re-renders - MOVED UP
  const queryOptions = useMemo(() => {
    const apiFilters = {}
    
    // Map filter state to API parameters
    if (filterState.selectedCategories.length > 0) {
      apiFilters.category = filterState.selectedCategories.join(',')
    }
    if (filterState.selectedBrands.length > 0) {
      apiFilters.vendor = filterState.selectedBrands.join(',')
    }
    if (filterState.minPrice > 0) {
      apiFilters.price_min = filterState.minPrice
    }
    if (filterState.maxPrice < 1000) {
      apiFilters.price_max = filterState.maxPrice
    }

    // Removed excessive logging for performance
    
    return {
      filters: {
        ...apiFilters,
        ordering: sortBy,
        page_size: showCount
      }
    }
  }, [
    JSON.stringify(filterState.selectedCategories),
    JSON.stringify(filterState.selectedBrands),
    filterState.minPrice,
    filterState.maxPrice,
    sortBy,
    showCount
  ])

  // Data fetching hooks - NOW AFTER queryOptions is defined
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

  // Price range from categories data
  const priceRange = useMemo(() => ({
    min: 0,
    max: 1000 // Could be calculated from products if needed
  }), [])

  // Track product count for minimal debugging
  const [lastProductCount, setLastProductCount] = useState(0)

  // Simple product count tracking with height logging
  useEffect(() => {
    const currentProductCount = products?.length || 0
    
    if (currentProductCount !== lastProductCount) {
      setLastProductCount(currentProductCount)
      
      // Log height information to understand the dynamic growth issue
      setTimeout(() => {
        const sidebarEl = document.querySelector('[style*="position: sticky"]')
        const contentEl = document.querySelector('[style*="flex: 1"]')
        const productGrid = document.querySelector('.uniform-product-grid')
        
        console.log('📦 HEIGHT ANALYSIS:', {
          productCount: currentProductCount,
          sidebarHeight: sidebarEl ? sidebarEl.offsetHeight + 'px' : 'N/A',
          contentHeight: contentEl ? contentEl.offsetHeight + 'px' : 'N/A', 
          productGridHeight: productGrid ? productGrid.offsetHeight + 'px' : 'N/A',
          timestamp: new Date().toISOString()
        })
      }, 100)
    }
  }, [products?.length, lastProductCount])

  // Apply CSS fixes to body/html for sticky positioning
  useEffect(() => {
    // Add CSS classes to overcome global CSS issues
    document.documentElement.classList.add('sticky-page-fix')
    document.body.classList.add('sticky-page-fix')
    
    console.log('✅ Applied sticky CSS fixes to document')
    
    return () => {
      // Clean up on unmount
      document.documentElement.classList.remove('sticky-page-fix')
      document.body.classList.remove('sticky-page-fix')
      console.log('🧹 Removed sticky CSS fixes from document')
    }
  }, [])
  // FILTER CHANGE HANDLERS - Each updates only the relevant part of filter state
  const handleCategoriesChange = useCallback((selectedCategories) => {
    // console.log('📁 Categories changed:', selectedCategories)
    setFilterState(prev => ({
      ...prev,
      selectedCategories
    }))
  }, [])

  const handleBrandsChange = useCallback((selectedBrands) => {
    // console.log('🏢 Brands changed:', selectedBrands)
    setFilterState(prev => ({
      ...prev,
      selectedBrands
    }))
  }, [])

  const handlePriceChange = useCallback((minPrice, maxPrice) => {
    // console.log('💰 Price changed:', { minPrice, maxPrice })
    setFilterState(prev => ({
      ...prev,
      minPrice,
      maxPrice
    }))
  }, [])

  const handleClearAllFilters = useCallback(() => {
    // console.log('🧹 Clearing all filters')
    setFilterState({
      selectedCategories: [],
      selectedBrands: [],
      minPrice: 0,
      maxPrice: 1000
    })
  }, [])

  // OTHER UI HANDLERS
  const handleSortChange = useCallback((newSort) => {
    // console.log('🔄 Sort changed:', newSort)
    setSortBy(newSort)
  }, [])

  const handleShowCountChange = useCallback((newCount) => {
    // console.log('🔄 Show count changed:', newCount)
    setShowCount(newCount)
  }, [])

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev)
  }, [])

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false)
  }, [])

  // Legacy filter handling for ActiveFilters component
  const legacyFilters = useMemo(() => {
    const filters = {}
    if (filterState.selectedCategories.length > 0) {
      filters.category = filterState.selectedCategories.join(',')
    }
    if (filterState.selectedBrands.length > 0) {
      filters.vendor = filterState.selectedBrands.join(',')
    }
    if (filterState.minPrice > 0) {
      filters.price_min = filterState.minPrice
    }
    if (filterState.maxPrice < 1000) {
      filters.price_max = filterState.maxPrice
    }
    return filters
  }, [filterState])

  const handleClearFilter = useCallback((filterKey) => {
    // console.log('❌ Clearing individual filter:', filterKey)
    
    if (filterKey === 'category') {
      handleCategoriesChange([])
    } else if (filterKey === 'vendor') {
      handleBrandsChange([])
    } else if (filterKey === 'price_min') {
      handlePriceChange(0, filterState.maxPrice)
    } else if (filterKey === 'price_max') {
      handlePriceChange(filterState.minPrice, 1000)
    }
  }, [filterState.maxPrice, filterState.minPrice, handleCategoriesChange, handleBrandsChange, handlePriceChange])

  // Memoize sidebar props to prevent unnecessary re-renders
  const sidebarProps = useMemo(() => ({
    // Data props
    categories: categories || [],
    brands: vendors || [],
    priceRange,
    
    // Current filter values
    selectedCategories: filterState.selectedCategories,
    selectedBrands: filterState.selectedBrands,
    minPrice: filterState.minPrice,
    maxPrice: filterState.maxPrice,
    
    // Change handlers
    onCategoriesChange: handleCategoriesChange,
    onBrandsChange: handleBrandsChange,
    onPriceChange: handlePriceChange,
    onClearAll: handleClearAllFilters,
    
    // UI props
    loading: categoriesLoading || vendorsLoading,
    isOpen: sidebarOpen,
    onClose: closeSidebar
  }), [
    categories,
    vendors,
    priceRange,
    filterState.selectedCategories,
    filterState.selectedBrands,
    filterState.minPrice,
    filterState.maxPrice,
    handleCategoriesChange,
    handleBrandsChange,
    handlePriceChange,
    handleClearAllFilters,
    categoriesLoading,
    vendorsLoading,
    sidebarOpen,
    closeSidebar
  ])

  // Memoize ProductGridSection props
  const productGridProps = useMemo(() => ({
    products,
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    sortBy,
    showCount,
    onSortChange: handleSortChange,
    onShowCountChange: handleShowCountChange
  }), [
    products,
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    sortBy,
    showCount,
    handleSortChange,
    handleShowCountChange
  ])

  // Memoize ActiveFilters props
  const activeFiltersProps = useMemo(() => ({
    filters: legacyFilters,
    onClearFilter: handleClearFilter,
    onClearAll: handleClearAllFilters
  }), [legacyFilters, handleClearFilter, handleClearAllFilters])

  // Show simple loading state instead of skeleton - ONLY on initial load
  if (isLoading && !products.length && renderCountRef.current <= 3) {
    return (
      <div className="container">
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Static header */}
      <ShopHeader />
      
      {/* CLEAN STRUCTURE MATCHING ISOLATED STICKY TEST */}
      <div style={{ fontFamily: 'inherit', margin: 0, padding: 0 }}>
        {/* Desktop Layout - Same structure as IsolatedStickyTest */}
        <div className="d-none d-lg-block">
          <div style={{ display: 'flex', gap: '20px', padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Sticky Sidebar - Exact same approach as IsolatedStickyTest */}
            <div style={{
              width: '300px',
              position: 'sticky',
              top: '20px',
              height: 'fit-content',
              background: '#fff',
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              // Critical CSS overrides that make sticky work (same as IsolatedStickyTest)
              transform: 'none',
              overflow: 'visible',
              contain: 'none',
              zIndex: 10
            }}>
              <Sidebar {...sidebarProps} />
            </div>

            {/* Main Content - Simple flex: 1 like IsolatedStickyTest */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Active Filters Display */}
              <ActiveFilters {...activeFiltersProps} />

              {/* Product Grid Section */}
              <ProductGridSection {...productGridProps} />
            </div>
          </div>
        </div>

        {/* Mobile Layout - Bootstrap grid for responsive behavior */}
        <div className="d-lg-none">
          <div className="container">
            <div className="row">
              {/* Sidebar - first on mobile */}
              <div className="col-12">
                <Sidebar {...sidebarProps} />
              </div>
              
              {/* Main content - second on mobile */}
              <div className="col-12">
                {/* Active Filters Display */}
                <ActiveFilters {...activeFiltersProps} />

                {/* Product Grid Section */}
                <ProductGridSection {...productGridProps} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-3" />
    </>
  )
}

// Export the memoized component directly to prevent unnecessary wrapper re-renders
const MemoizedShop = React.memo(ShopPageContent)
MemoizedShop.displayName = 'Shop'

export default MemoizedShop
