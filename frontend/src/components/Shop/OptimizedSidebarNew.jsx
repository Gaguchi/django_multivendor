import { memo, useEffect } from 'react'
import { FilterProvider, useFilterActions } from '../../contexts/FilterContext'
import {
  CategoriesFilterSection,
  BrandsFilterSection,
  PriceFilterSection,
  ClearFiltersSection,
  StaticSidebarWidgets
} from './FilterSections/FilterSections'

// Internal component that uses the context
const SidebarContent = memo(function SidebarContent({
  categories = [],
  brands = [],
  priceRange,
  className = '',
  isOpen = false,
  onClose = () => {}
}) {
  const { setPriceBounds } = useFilterActions()

  // Update price bounds when they change from props
  useEffect(() => {
    if (priceRange?.min !== undefined && priceRange?.max !== undefined) {
      console.log('🎯 SidebarContent: Updating price bounds from props:', priceRange)
      setPriceBounds(priceRange)
    }
  }, [priceRange?.min, priceRange?.max, setPriceBounds])

  console.log('📂 SidebarContent render:', {
    categoriesCount: categories.length,
    brandsCount: brands.length,
    priceRange,
    className,
    isOpen,
    timestamp: new Date().toISOString()
  })

  return (
    <div className={`col-lg-3 ${className}`}>
      <div className="shop-sidebar">
        {/* Mobile sidebar header */}
        {isOpen && (
          <div className="sidebar-header d-lg-none">
            <h5>Filters</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
              aria-label="Close"
            />
          </div>
        )}

        {/* Filter sections - each only re-renders when its specific data changes */}
        <ClearFiltersSection />
        <CategoriesFilterSection categories={categories} />
        <BrandsFilterSection brands={brands} />
        <PriceFilterSection />
        
        {/* Static content */}
        <StaticSidebarWidgets />
      </div>
    </div>
  )
})

// Props comparison for SidebarContent
function sidebarContentPropsAreEqual(prevProps, nextProps) {
  // Compare primitive props
  if (
    prevProps.className !== nextProps.className ||
    prevProps.isOpen !== nextProps.isOpen
  ) {
    console.log('📂 SidebarContent memo: Props changed (primitives)')
    return false
  }
  
  // Compare priceRange object
  if (
    prevProps.priceRange?.min !== nextProps.priceRange?.min ||
    prevProps.priceRange?.max !== nextProps.priceRange?.max
  ) {
    console.log('📂 SidebarContent memo: Props changed (priceRange)')
    return false
  }
  
  // Compare arrays by length and content
  if (
    prevProps.categories?.length !== nextProps.categories?.length ||
    prevProps.brands?.length !== nextProps.brands?.length ||
    JSON.stringify(prevProps.categories) !== JSON.stringify(nextProps.categories) ||
    JSON.stringify(prevProps.brands) !== JSON.stringify(nextProps.brands)
  ) {
    console.log('📂 SidebarContent memo: Props changed (arrays)')
    return false
  }
  
  console.log('📂 SidebarContent memo: Props are equal, skipping re-render')
  return true
}

// Apply memo with custom comparison
const MemoizedSidebarContent = memo(SidebarContent, sidebarContentPropsAreEqual)

// Main sidebar component with context provider
const OptimizedSidebar = memo(function OptimizedSidebar({
  onFiltersChange,
  categories = [],
  brands = [],
  priceRange = { min: 0, max: 1000 },
  className = '',
  isOpen = false,
  onClose = () => {}
}) {
  console.log('📂 OptimizedSidebar render:', {
    categoriesCount: categories.length,
    brandsCount: brands.length,
    priceRange,
    timestamp: new Date().toISOString(),
    note: 'This should only re-render when props actually change'
  })

  return (
    <FilterProvider onFiltersChange={onFiltersChange}>
      <MemoizedSidebarContent
        categories={categories}
        brands={brands}
        priceRange={priceRange}
        className={className}
        isOpen={isOpen}
        onClose={onClose}
      />
    </FilterProvider>
  )
})

// Props comparison for main OptimizedSidebar
function optimizedSidebarPropsAreEqual(prevProps, nextProps) {
  // Compare all props that matter
  if (
    prevProps.className !== nextProps.className ||
    prevProps.isOpen !== nextProps.isOpen ||
    prevProps.priceRange?.min !== nextProps.priceRange?.min ||
    prevProps.priceRange?.max !== nextProps.priceRange?.max ||
    prevProps.categories?.length !== nextProps.categories?.length ||
    prevProps.brands?.length !== nextProps.brands?.length ||
    JSON.stringify(prevProps.categories) !== JSON.stringify(nextProps.categories) ||
    JSON.stringify(prevProps.brands) !== JSON.stringify(nextProps.brands)
  ) {
    console.log('📂 OptimizedSidebar memo: Props changed')
    return false
  }
  
  console.log('📂 OptimizedSidebar memo: Props are equal, skipping re-render')
  return true
}

export default memo(OptimizedSidebar, optimizedSidebarPropsAreEqual)
