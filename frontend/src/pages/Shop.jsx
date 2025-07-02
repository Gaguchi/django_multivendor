import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useProducts } from '../hooks/useProducts'
import { useCategories } from '../hooks/useCategories'
import { useVendors } from '../hooks/useVendors'
import SimpleOptimizedSidebar from '../components/Shop/SimpleOptimizedSidebar'
import ProductGridSection from '../components/Shop/ProductGridSection'
import ShopHeader from '../components/Shop/ShopHeader'
import ActiveFilters from '../components/Shop/ActiveFilters'
import ReactUpdateTracker from '../components/Debug/ReactUpdateTracker'
import RenderVisualizer from '../components/Debug/RenderVisualizer'
import DebugErrorBoundary from '../components/Debug/DebugErrorBoundary'
import '../sidebar-test-instructions.js' // Load test instructions

function ShopPageContent() {
  // Track renders for debugging
  const renderCountRef = useRef(0)
  const mountTimeRef = useRef(Date.now())
  renderCountRef.current++

  // Log renders (less frequently to reduce noise)
  if (renderCountRef.current <= 3 || renderCountRef.current % 5 === 0) {
    console.log('🛍️ Shop Page render:', { 
      renderCount: renderCountRef.current,
      timestamp: new Date().toISOString(),
      warning: renderCountRef.current > 8 ? '⚠️ Too many renders!' : '✅ Normal'
    })
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

  // Memoize API query options to prevent unnecessary re-renders
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

    console.log('🔍 Shop: Query options memo updated:', { apiFilters, ordering: sortBy })
    
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

  // Data fetching hooks
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

  // FILTER CHANGE HANDLERS - Each updates only the relevant part of filter state
  const handleCategoriesChange = useCallback((selectedCategories) => {
    console.log('� Categories changed:', selectedCategories)
    setFilterState(prev => ({
      ...prev,
      selectedCategories
    }))
  }, [])

  const handleBrandsChange = useCallback((selectedBrands) => {
    console.log('🏢 Brands changed:', selectedBrands)
    setFilterState(prev => ({
      ...prev,
      selectedBrands
    }))
  }, [])

  const handlePriceChange = useCallback((minPrice, maxPrice) => {
    console.log('💰 Price changed:', { minPrice, maxPrice })
    setFilterState(prev => ({
      ...prev,
      minPrice,
      maxPrice
    }))
  }, [])

  const handleClearAllFilters = useCallback(() => {
    console.log('🧹 Clearing all filters')
    setFilterState({
      selectedCategories: [],
      selectedBrands: [],
      minPrice: 0,
      maxPrice: 1000
    })
  }, [])

  // OTHER UI HANDLERS
  const handleSortChange = useCallback((newSort) => {
    console.log('🔄 Sort changed:', newSort)
    setSortBy(newSort)
  }, [])

  const handleShowCountChange = useCallback((newCount) => {
    console.log('🔄 Show count changed:', newCount)
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
    console.log('❌ Clearing individual filter:', filterKey)
    
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
    if (renderCountRef.current <= 2) {
      console.log('⏳ Shop: Showing simple loading state')
    }
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

  if (renderCountRef.current <= 3) {
    console.log('🎨 Shop: Rendering main layout with', products.length, 'products')
  }

  return (
    <>
      {/* Visual render tracking */}
      <RenderVisualizer componentName="Shop" style={{ top: '10px', right: '10px' }} />
      
      {/* Debug components - SIMPLIFIED to reduce overhead */}
      <DebugErrorBoundary>
        <ReactUpdateTracker componentName="Shop" />
      </DebugErrorBoundary>
      
      {/* Static header - should not re-render when filters change */}
      <ShopHeader />
      
      <div className="container">
        <div className="row">
          {/* Sidebar - left side on desktop, first on mobile */}
          <div className="col-lg-3">
            <DebugErrorBoundary fallback={<div className="alert alert-danger">Sidebar error - check console</div>}>
              <SimpleOptimizedSidebar {...sidebarProps} />
            </DebugErrorBoundary>
          </div>
          
          {/* Main content - right side on desktop, second on mobile */}
          <div className="col-lg-9">
            {/* Active Filters Display - only re-renders when filters change */}
            <ActiveFilters {...activeFiltersProps} />

            {/* Product Grid Section - only re-renders when products change */}
            <ProductGridSection {...productGridProps} />
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
