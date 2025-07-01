import React, { memo, useState, useCallback } from 'react'
import { FilterProvider } from './FilterSections/FilterProvider'
import CategoriesFilterIsolated from './FilterSections/CategoriesFilterIsolated'
import BrandsFilterIsolated from './FilterSections/BrandsFilterIsolated'
import PriceFilterIsolated from './FilterSections/PriceFilterIsolated'
import ClearFiltersWidgetIsolated from './FilterSections/ClearFiltersWidgetIsolated'
import StaticSidebarWidgets from './FilterSections/StaticSidebarWidgets'

// Custom comparison - this sidebar should RARELY re-render
function isolatedSidebarPropsAreEqual(prevProps, nextProps) {
  // Only re-render if these specific props change
  const propsToCheck = ['loading', 'className', 'isOpen']
  
  for (const prop of propsToCheck) {
    if (prevProps[prop] !== nextProps[prop]) {
      console.log(`🔄 IsolatedSidebar memo: Props changed (${prop})`)
      return false
    }
  }
  
  // Compare arrays with JSON.stringify (only for reference data, not state)
  if (
    JSON.stringify(prevProps.categories) !== JSON.stringify(nextProps.categories) ||
    JSON.stringify(prevProps.brands) !== JSON.stringify(nextProps.brands)
  ) {
    console.log('🔄 IsolatedSidebar memo: Reference data changed (categories/brands)')
    return false
  }
  
  // Compare priceRange for reference bounds only
  if (
    prevProps.priceRange?.min !== nextProps.priceRange?.min ||
    prevProps.priceRange?.max !== nextProps.priceRange?.max
  ) {
    console.log('🔄 IsolatedSidebar memo: Price range bounds changed')
    return false
  }
  
  console.log('✅ IsolatedSidebar memo: Props are equal, skipping re-render')
  return true
}

const IsolatedSidebar = memo(function IsolatedSidebar({ 
  onFiltersChange,
  categories = [],
  brands = [],
  priceRange = { min: 0, max: 1000 },
  loading = false,
  className = '',
  isOpen = false,
  onClose = () => {}
}) {
  console.log('📦 IsolatedSidebar render:', {
    timestamp: new Date().toISOString(),
    categoriesCount: categories.length,
    brandsCount: brands.length,
    priceRange,
    note: 'This container should RARELY re-render - children are isolated'
  })

  // Local collapse states only
  const [collapsedSections, setCollapsedSections] = useState({
    categories: false,
    brands: false,
    price: false
  })

  const handleToggleSection = useCallback((section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }, [])

  return (
    <>
      <div 
        className={`sidebar-overlay ${isOpen ? 'show' : ''}`}
        onClick={onClose}
      />
      
      <aside className={`sidebar-shop col-lg-3 order-lg-first mobile-sidebar ${className} ${isOpen ? 'show' : ''}`}>
        <div className="sidebar-wrapper">
          
          {/* Filter Provider manages all filter state internally */}
          <FilterProvider onFiltersChange={onFiltersChange}>
            
            {/* Clear All Filters - only re-renders when active filters change */}
            <ClearFiltersWidgetIsolated 
              defaultPriceRange={priceRange}
            />

            {/* Categories Filter - only re-renders when categories data changes */}
            <CategoriesFilterIsolated
              categories={categories}
              loading={loading}
              collapsed={collapsedSections.categories}
              onToggleCollapse={() => handleToggleSection('categories')}
            />

            {/* Brands Filter - only re-renders when brands data changes */}
            <BrandsFilterIsolated
              brands={brands}
              loading={loading}
              collapsed={collapsedSections.brands}
              onToggleCollapse={() => handleToggleSection('brands')}
            />

            {/* Price Filter - only re-renders when price bounds or state changes */}
            <PriceFilterIsolated
              priceRange={priceRange}
              collapsed={collapsedSections.price}
              onToggleCollapse={() => handleToggleSection('price')}
            />

            {/* Static Widgets - never re-render unless forced */}
            <StaticSidebarWidgets />
            
          </FilterProvider>
        </div>
      </aside>

      <style>{`
        .widget-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .widget-title .clear-section {
          font-size: 12px;
          color: #666;
          cursor: pointer;
          text-decoration: none;
          background: none;
          border: none;
          padding: 0;
        }

        .widget-title .clear-section:hover {
          color: #08C;
        }

        .collapse-toggle {
          background: none;
          border: none;
          padding: 0;
          font: inherit;
          cursor: pointer;
          color: inherit;
          text-decoration: none;
          font-weight: bold;
          font-size: 16px;
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

        .category-item {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 8px 0;
          cursor: pointer;
          border: none;
          background: none;
          text-align: left;
          font-size: 14px;
        }

        .category-item:hover {
          background-color: #f8f9fa;
        }

        .category-item input[type="checkbox"] {
          margin-right: 8px;
        }

        .category-name {
          flex: 1;
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

        .price-range-container {
          margin: 20px 0;
        }

        .price-inputs .form-control {
          text-align: center;
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
        }
      `}</style>
    </>
  )
}, isolatedSidebarPropsAreEqual)

export default IsolatedSidebar
