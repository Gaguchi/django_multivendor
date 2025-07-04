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
import StickyBox from 'react-sticky-box'
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

  // StickyBox ref for forcing recalculation
  const stickyBoxRef = useRef(null)

  // Track product count to trigger StickyBox recalculation when content changes
  const [lastProductCount, setLastProductCount] = useState(0)

  // Effect to handle StickyBox recalculation when products change (infinite scroll)
  useEffect(() => {
    const currentProductCount = products?.length || 0
    
    if (currentProductCount !== lastProductCount) {
      setLastProductCount(currentProductCount)
      
      // Force StickyBox to recalculate when product grid height changes
      if (stickyBoxRef.current && typeof stickyBoxRef.current.recalculate === 'function') {
        setTimeout(() => {
          stickyBoxRef.current.recalculate()
          console.log('🔄 StickyBox recalculated for', currentProductCount, 'products')
        }, 100)
      }
    }
  }, [products?.length, lastProductCount])

  // Log column heights for debugging sticky behavior
  useEffect(() => {
    const logColumnHeights = () => {
      if (sidebarColumnRef.current && productsColumnRef.current) {
        const sidebarHeight = sidebarColumnRef.current.scrollHeight
        const productsHeight = productsColumnRef.current.scrollHeight
        console.log('� Column Heights:', {
          sidebar: `${sidebarHeight}px`,
          products: `${productsHeight}px`,
          difference: `${Math.abs(sidebarHeight - productsHeight)}px`,
          productCount: products?.length || 0,
          note: sidebarHeight < productsHeight ? 'Sidebar shorter (perfect for sticky)' : 'Sidebar taller'
        })
      }
    }

    // Log heights after render and when products change
    const timer = setTimeout(logColumnHeights, 100)
    
    // Log on window resize
    window.addEventListener('resize', logColumnHeights)
    
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', logColumnHeights)
    }
  }, [products?.length]) // Re-run when products change

  // Simplified scroll event logging for debugging sticky behavior  
  useEffect(() => {
    let scrollLogTimer = null
    
    const logScrollBehavior = () => {
      if (sidebarColumnRef.current && productsColumnRef.current) {
        const sidebarRect = sidebarColumnRef.current.getBoundingClientRect()
        const windowScrollY = window.scrollY
        
        console.log('📜 Scroll Debug:', {
          scrollY: `${windowScrollY}px`,
          sidebarTop: `${Math.round(sidebarRect.top)}px`,
          isSticking: sidebarRect.top <= 20 && sidebarRect.top >= 0 ? '✅ STICKY' : '❌ NOT STICKY',
          productCount: products?.length || 0,
          stickyBoxWorking: sidebarRect.top <= 20 ? '✅ Active' : '⚠️ Waiting'
        })
      }
    }

    const handleScroll = () => {
      if (scrollLogTimer) clearTimeout(scrollLogTimer)
      scrollLogTimer = setTimeout(logScrollBehavior, 200) // Reduced frequency
    }

    // Initial position log
    setTimeout(logScrollBehavior, 100)
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollLogTimer) clearTimeout(scrollLogTimer)
    }
  }, [products?.length]) // Re-run when products change to update product count in logs

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
      {/* Visual render tracking */}
      <RenderVisualizer componentName="Shop" style={{ top: '10px', right: '10px' }} />
      
      {/* Debug components - SIMPLIFIED to reduce overhead */}
      <DebugErrorBoundary>
        <ReactUpdateTracker componentName="Shop" />
      </DebugErrorBoundary>
      
      {/* Static header - should not re-render when filters change */}
      <ShopHeader />
      
      <div className="container">
        {/* Desktop Layout with proper StickyBox container */}
        <div className="row d-none d-lg-flex" style={{ alignItems: 'flex-start' }}>
          {/* Sidebar column - must have proper container for StickyBox */}
          <div className="col-lg-3" ref={sidebarColumnRef}>
            <StickyBox 
              ref={stickyBoxRef}
              offsetTop={20} 
              offsetBottom={20}
              bottom={false}
              key={`stickybox-${products?.length || 0}`}
              onChangeMode={(oldMode, newMode) => {
                console.log('🔄 StickyBox Mode Change:', { 
                  from: oldMode, 
                  to: newMode,
                  productCount: products?.length || 0,
                  timestamp: new Date().toISOString()
                })
              }}
            >
              <DebugErrorBoundary fallback={<div className="alert alert-danger">Sidebar error - check console</div>}>
                <Sidebar {...sidebarProps} />
              </DebugErrorBoundary>
            </StickyBox>
          </div>
          
          {/* Products column - this will expand with infinite scroll */}
          <div className="col-lg-9" ref={productsColumnRef}>
            {/* Active Filters Display - only re-renders when filters change */}
            <ActiveFilters {...activeFiltersProps} />

            {/* Product Grid Section - only re-renders when products change */}
            <ProductGridSection {...productGridProps} />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="row d-lg-none">
          {/* Sidebar - first on mobile */}
          <div className="col-12">
            <DebugErrorBoundary fallback={<div className="alert alert-danger">Sidebar error - check console</div>}>
              <Sidebar {...sidebarProps} />
            </DebugErrorBoundary>
          </div>
          
          {/* Main content - second on mobile */}
          <div className="col-12">
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
