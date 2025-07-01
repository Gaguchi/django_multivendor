import { memo, useEffect } from 'react'
import { FilterProvider, useFilterActions } from '../../contexts/FilterContext'
import {
  CategoriesFilterSection,
  BrandsFilterSection,
  PriceFilterSection,
  ClearFiltersSection,
  StaticSidebarWidgets
} from './FilterSections/FilterSections'

// Custom comparison function for Sidebar memo
function sidebarPropsAreEqual(prevProps, nextProps) {
  // Compare primitive props
  if (
    prevProps.loading !== nextProps.loading ||
    prevProps.className !== nextProps.className ||
    prevProps.isOpen !== nextProps.isOpen
  ) {
    console.log('📂 OptimizedSidebar memo: Props changed (primitives)')
    return false
  }
  
  // Compare priceRange object
  if (
    prevProps.priceRange?.min !== nextProps.priceRange?.min ||
    prevProps.priceRange?.max !== nextProps.priceRange?.max
  ) {
    console.log('📂 OptimizedSidebar memo: Props changed (priceRange)')
    return false
  }
  
  // Compare arrays with deep comparison
  if (
    JSON.stringify(prevProps.categories) !== JSON.stringify(nextProps.categories) ||
    JSON.stringify(prevProps.brands) !== JSON.stringify(nextProps.brands) ||
    JSON.stringify(prevProps.currentFilters) !== JSON.stringify(nextProps.currentFilters)
  ) {
    console.log('📂 OptimizedSidebar memo: Props changed (arrays/objects)')
    return false
  }
  
  console.log('📂 OptimizedSidebar memo: Props are equal, skipping re-render')
  return true
}

const OptimizedSidebar = memo(function OptimizedSidebar({ 
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
  // Track renders - this should be minimal now
  const renderCountRef = useRef(0)
  renderCountRef.current++
  
  console.log('📂 OptimizedSidebar render:', {
    renderCount: renderCountRef.current,
    timestamp: new Date().toISOString(),
    note: 'This component should rarely re-render - children handle their own updates',
    warning: renderCountRef.current > 2 ? '⚠️ WARNING: Too many renders!' : '✅ Good render count'
  })

  // Local state for filters - initialized once
  const [localFilters, setLocalFilters] = useState(() => {
    const validPriceRange = [
      Math.max(priceRange.min, currentFilters.priceRange?.[0] || priceRange.min),
      Math.min(priceRange.max, currentFilters.priceRange?.[1] || priceRange.max)
    ]
    
    return {
      categories: currentFilters.categories || [],
      brands: currentFilters.brands || [],
      priceRange: validPriceRange
    }
  })

  // Local collapse states
  const [collapsedSections, setCollapsedSections] = useState({
    categories: false,
    brands: false,
    price: false
  })

  // Debounce timer for price changes
  const debounceTimerRef = useRef(null)
  const [isPriceUpdating, setIsPriceUpdating] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize on mount only
  useEffect(() => {
    console.log('🎯 OptimizedSidebar: Initializing on mount')
    if (!isInitialized) {
      setIsInitialized(true)
    }
  }, [isInitialized])

  // Sync external filter changes (but avoid circular updates)
  const isInternalUpdateRef = useRef(false)
  
  useEffect(() => {
    if (isInitialized && !isInternalUpdateRef.current) {
      console.log('🔄 OptimizedSidebar: Syncing external filter changes')
      const updatedFilters = {
        categories: currentFilters.categories || [],
        brands: currentFilters.brands || [],
        priceRange: currentFilters.priceRange || [priceRange.min, priceRange.max],
      }
      setLocalFilters(updatedFilters)
    } else if (isInternalUpdateRef.current) {
      console.log('⏭️ OptimizedSidebar: Skipping external sync (internal change)')
      isInternalUpdateRef.current = false
    }
  }, [
    JSON.stringify(currentFilters.categories || []),
    JSON.stringify(currentFilters.brands || []),
    JSON.stringify(currentFilters.priceRange || [priceRange.min, priceRange.max]),
    isInitialized,
    priceRange.min,
    priceRange.max
  ])

  // Helper to notify parent of filter changes
  const notifyFilterChange = useCallback((newFilters, immediate = false) => {
    const safePriceRange = priceRange || { min: 0, max: 1000 }
    const formattedFilters = {
      ...newFilters,
      priceMin: newFilters.priceRange[0] || safePriceRange.min,
      priceMax: newFilters.priceRange[1] || safePriceRange.max
    }
    
    if (immediate) {
      console.log('📤 OptimizedSidebar: Immediate filter change:', formattedFilters)
      isInternalUpdateRef.current = true
      onFiltersChange?.(formattedFilters)
    } else {
      console.log('📤 OptimizedSidebar: Debounced filter change:', formattedFilters)
      setIsPriceUpdating(true)
      
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
      
      debounceTimerRef.current = setTimeout(() => {
        isInternalUpdateRef.current = true
        onFiltersChange?.(formattedFilters)
        setIsPriceUpdating(false)
      }, 300)
    }
  }, [onFiltersChange, priceRange])

  // Category filter handlers
  const handleToggleCategory = useCallback((categoryId) => {
    setLocalFilters(prev => {
      const newCategories = prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
      
      const newFilters = { ...prev, categories: newCategories }
      notifyFilterChange(newFilters, true) // Immediate for categories
      return newFilters
    })
  }, [notifyFilterChange])

  // Brand filter handlers
  const handleToggleBrand = useCallback((brandId) => {
    setLocalFilters(prev => {
      const newBrands = prev.brands.includes(brandId)
        ? prev.brands.filter(id => id !== brandId)
        : [...prev.brands, brandId]
      
      const newFilters = { ...prev, brands: newBrands }
      notifyFilterChange(newFilters, true) // Immediate for brands
      return newFilters
    })
  }, [notifyFilterChange])

  // Price filter handlers
  const handlePriceRangeChange = useCallback((values) => {
    const validValues = [
      Math.max(priceRange.min, Math.min(values[0], priceRange.max)),
      Math.min(priceRange.max, Math.max(values[1], priceRange.min))
    ]
    
    setLocalFilters(prev => {
      const newFilters = { ...prev, priceRange: validValues }
      notifyFilterChange(newFilters, false) // Debounced for price
      return newFilters
    })
  }, [notifyFilterChange, priceRange.min, priceRange.max])

  const handlePriceInputChange = useCallback((index, value) => {
    const numValue = Math.max(0, parseInt(value) || 0)
    
    setLocalFilters(prev => {
      const newRange = [...prev.priceRange]
      
      if (index === 0) {
        newRange[index] = Math.max(priceRange.min, Math.min(numValue, Math.min(newRange[1], priceRange.max)))
      } else {
        newRange[index] = Math.min(priceRange.max, Math.max(numValue, Math.max(newRange[0], priceRange.min)))
      }
      
      const newFilters = { ...prev, priceRange: newRange }
      notifyFilterChange(newFilters, false) // Debounced for price inputs
      return newFilters
    })
  }, [notifyFilterChange, priceRange.min, priceRange.max])

  // Section collapse handlers
  const handleToggleSection = useCallback((section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }, [])

  // Clear all filters
  const handleClearAllFilters = useCallback(() => {
    const emptyFilters = {
      categories: [],
      brands: [],
      priceRange: [priceRange.min, priceRange.max]
    }
    setLocalFilters(emptyFilters)
    notifyFilterChange(emptyFilters, true)
  }, [priceRange.min, priceRange.max, notifyFilterChange])

  // Check if any filters are active
  const hasActiveFilters = useCallback(() => {
    return localFilters.categories.length > 0 ||
           localFilters.brands.length > 0 ||
           localFilters.priceRange[0] > priceRange.min ||
           localFilters.priceRange[1] < priceRange.max
  }, [localFilters, priceRange.min, priceRange.max])

  // Cleanup
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  return (
    <>
      <div 
        className={`sidebar-overlay ${isOpen ? 'show' : ''}`}
        onClick={onClose}
      />
      <aside className={`sidebar-shop col-lg-3 order-lg-first mobile-sidebar ${className} ${isOpen ? 'show' : ''}`}>
        <div className="sidebar-wrapper">
          
          {/* Clear All Filters Widget */}
          <ClearFiltersWidget
            hasActiveFilters={hasActiveFilters()}
            onClearAllFilters={handleClearAllFilters}
            isPriceUpdating={isPriceUpdating}
          />

          {/* Categories Filter */}
          <CategoriesFilter
            categories={categories}
            selectedCategories={localFilters.categories}
            onToggleCategory={handleToggleCategory}
            loading={loading}
            collapsed={collapsedSections.categories}
            onToggleCollapse={() => handleToggleSection('categories')}
          />

          {/* Brands Filter */}
          <BrandsFilter
            brands={brands}
            selectedBrands={localFilters.brands}
            onToggleBrand={handleToggleBrand}
            loading={loading}
            collapsed={collapsedSections.brands}
            onToggleCollapse={() => handleToggleSection('brands')}
          />

          {/* Price Filter */}
          <PriceFilter
            priceRange={priceRange}
            selectedPriceRange={localFilters.priceRange}
            onPriceRangeChange={handlePriceRangeChange}
            onPriceInputChange={handlePriceInputChange}
            isPriceUpdating={isPriceUpdating}
            collapsed={collapsedSections.price}
            onToggleCollapse={() => handleToggleSection('price')}
          />

          {/* Static Widgets (never re-render) */}
          <StaticSidebarWidgets />
        </div>
      </aside>

      <style>{`
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
        }
      `}</style>
    </>
  )
}, sidebarPropsAreEqual)

export default OptimizedSidebar
