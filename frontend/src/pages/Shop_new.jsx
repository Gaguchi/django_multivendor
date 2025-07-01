import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useProducts } from '../hooks/useProducts'
import { useCategories } from '../hooks/useCategories'
import { useVendors } from '../hooks/useVendors'
import Sidebar from '../components/Shop/Sidebar'
import ProductGridSection from '../components/Shop/ProductGridSection'
import ShopHeader from '../components/Shop/ShopHeader'
import ActiveFilters from '../components/Shop/ActiveFilters'
import { SearchResultsSkeleton } from '../components/Skeleton'
import ReactUpdateTracker from '../components/Debug/ReactUpdateTracker'
import UpdateIndicator from '../components/Debug/UpdateIndicator'
import DebugErrorBoundary from '../components/Debug/DebugErrorBoundary'
import FilterTestHelper from '../components/Debug/FilterTestHelper'
import '../test-instructions.js' // Load test instructions

export default function Products() {
  // Add render tracking
  console.log('🛍️ Shop Page render:', { 
    timestamp: new Date().toISOString(),
    reason: 'State or props changed'
  })

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
    console.log('🔄 Shop: Memoizing products from data:', data?.pages?.length || 0, 'pages')
    return data?.pages?.flatMap(page => page.results) || []
  }, [data?.pages])

  // Handle filter changes with useCallback to prevent unnecessary re-renders
  const handleFiltersChange = useCallback((newFilters) => {
    console.log('🔄 Shop handleFiltersChange called:', { 
      newFilters, 
      currentSidebarFilters: sidebarFilters,
      currentAPIFilters: filters,
      timestamp: new Date().toISOString()
    })
    
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
    
    console.log('✅ Setting API filters to:', { apiFilters, triggeredAt: new Date().toISOString() })
    
    setFilters(apiFilters)
    
    console.log('✨ setFilters called - React Query should automatically refetch')
  }, [sidebarFilters, filters, priceRange.min, priceRange.max])

  // Handle sort change
  const handleSortChange = useCallback((newSort) => {
    console.log('🔄 Shop: Sort changed to:', { newSort, timestamp: new Date().toISOString() })
    setSortBy(newSort)
  }, [])

  // Handle show count change
  const handleShowCountChange = useCallback((newCount) => {
    console.log('🔄 Shop: Show count changed to:', { newCount, timestamp: new Date().toISOString() })
    setShowCount(newCount)
  }, [])

  // Clear single filter
  const handleClearFilter = useCallback((filterKey) => {
    console.log('❌ Shop: Clearing filter:', { filterKey, timestamp: new Date().toISOString() })
    const newFilters = { ...filters }
    delete newFilters[filterKey]
    setFilters(newFilters)
  }, [filters])

  // Clear all filters
  const handleClearAllFilters = useCallback(() => {
    console.log('🧹 Shop: Clearing all filters:', { timestamp: new Date().toISOString() })
    setFilters({})
    setSidebarFilters({
      categories: [],
      brands: [],
      priceRange: [priceRange.min, priceRange.max]
    })
  }, [priceRange.min, priceRange.max])

  // Toggle sidebar on mobile
  const toggleSidebar = useCallback(() => {
    console.log('📱 Shop: Toggling sidebar:', { wasOpen: sidebarOpen, timestamp: new Date().toISOString() })
    setSidebarOpen(!sidebarOpen)
  }, [sidebarOpen])

  // Calculate dynamic price range from products
  useEffect(() => {
    console.log('📊 Shop: Price range effect triggered, products length:', products.length)
    
    if (products.length > 0) {
      const prices = products.map(product => parseFloat(product.price || 0)).filter(price => price > 0)
      if (prices.length > 0) {
        const minPrice = Math.floor(Math.min(...prices))
        const maxPrice = Math.ceil(Math.max(...prices))
        
        // Only update price range if it's significantly different (avoid constant updates)
        if (Math.abs(priceRange.min - minPrice) > 1 || Math.abs(priceRange.max - maxPrice) > 1) {
          console.log('📊 Shop: Updating price range from products:', { 
            oldRange: priceRange, 
            newRange: { min: minPrice, max: maxPrice },
            timestamp: new Date().toISOString()
          })
          setPriceRange({ min: minPrice, max: maxPrice })
          
          // Only update sidebar filters if they're at the default values (meaning user hasn't changed them)
          if (sidebarFilters.priceRange[0] === 0 && sidebarFilters.priceRange[1] === 1000) {
            console.log('🎯 Shop: Updating sidebar price range to match product range')
            setSidebarFilters(prev => ({
              ...prev,
              priceRange: [minPrice, maxPrice]
            }))
          }
        }
      }
    }
  }, [products.length]) // Simplified dependency

  // Show skeleton loader on initial load
  if (isLoading && !products.length) {
    console.log('⏳ Shop: Showing initial loading skeleton')
    return (
      <div className="container">
        <SearchResultsSkeleton />
      </div>
    )
  }

  console.log('🎨 Shop: Rendering main layout with', products.length, 'products')

  return (
    <>
      {/* Debug components - enable to see re-render tracking */}
      <DebugErrorBoundary>
        <ReactUpdateTracker componentName="Shop" />
        <UpdateIndicator componentName="Shop" />
        <FilterTestHelper filters={filters} products={products} />
      </DebugErrorBoundary>
      
      {/* Static header - should not re-render when filters change */}
      <ShopHeader />
      
      <div className="container">
        <div className="row">
          <div className="col-lg-9">
            {/* Active Filters Display - only re-renders when filters change */}
            <ActiveFilters 
              filters={filters}
              onClearFilter={handleClearFilter}
              onClearAll={handleClearAllFilters}
            />

            {/* Product Grid Section - only re-renders when products change */}
            <ProductGridSection
              products={products}
              isLoading={isLoading}
              error={error}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
              sortBy={sortBy}
              showCount={showCount}
              onSortChange={handleSortChange}
              onShowCountChange={handleShowCountChange}
            />
          </div>
          
          {/* Sidebar */}
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
      </div>
      
      <div className="mb-3" />
    </>
  )
}
