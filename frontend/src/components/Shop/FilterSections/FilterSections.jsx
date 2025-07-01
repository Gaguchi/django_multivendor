import { memo, useCallback } from 'react'
import { useFilterState, useFilterActions } from '../../contexts/FilterContext'

// Individual filter components that only re-render when their data changes
const CategoriesFilterSection = memo(function CategoriesFilterSection({ categories = [] }) {
  const { categories: selectedCategories } = useFilterState()
  const { setCategories } = useFilterActions()

  const handleCategoryToggle = useCallback((categoryId) => {
    const currentCategories = selectedCategories || []
    const newCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter(id => id !== categoryId)
      : [...currentCategories, categoryId]
    
    console.log('🏷️ CategoriesFilter: Toggling category', { categoryId, newCategories })
    setCategories(newCategories)
  }, [selectedCategories, setCategories])

  console.log('🏷️ CategoriesFilter render:', {
    categoriesCount: categories.length,
    selectedCount: selectedCategories?.length || 0,
    timestamp: new Date().toISOString()
  })

  return (
    <div className="sidebar-widget">
      <h5 className="widget-title">Categories</h5>
      <div className="widget-content">
        {categories.map(category => (
          <div key={category.id} className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id={`category-${category.id}`}
              checked={selectedCategories?.includes(category.id) || false}
              onChange={() => handleCategoryToggle(category.id)}
            />
            <label className="form-check-label" htmlFor={`category-${category.id}`}>
              {category.name} ({category.product_count})
            </label>
          </div>
        ))}
      </div>
    </div>
  )
})

const BrandsFilterSection = memo(function BrandsFilterSection({ brands = [] }) {
  const { brands: selectedBrands } = useFilterState()
  const { setBrands } = useFilterActions()

  const handleBrandToggle = useCallback((brandId) => {
    const currentBrands = selectedBrands || []
    const newBrands = currentBrands.includes(brandId)
      ? currentBrands.filter(id => id !== brandId)
      : [...currentBrands, brandId]
    
    console.log('🏪 BrandsFilter: Toggling brand', { brandId, newBrands })
    setBrands(newBrands)
  }, [selectedBrands, setBrands])

  console.log('🏪 BrandsFilter render:', {
    brandsCount: brands.length,
    selectedCount: selectedBrands?.length || 0,
    timestamp: new Date().toISOString()
  })

  return (
    <div className="sidebar-widget">
      <h5 className="widget-title">Brands</h5>
      <div className="widget-content">
        {brands.map(brand => (
          <div key={brand.id} className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id={`brand-${brand.id}`}
              checked={selectedBrands?.includes(brand.id) || false}
              onChange={() => handleBrandToggle(brand.id)}
            />
            <label className="form-check-label" htmlFor={`brand-${brand.id}`}>
              {brand.name} ({brand.product_count})
            </label>
          </div>
        ))}
      </div>
    </div>
  )
})

const PriceFilterSection = memo(function PriceFilterSection() {
  const { priceRange, priceBounds } = useFilterState()
  const { setPriceRange } = useFilterActions()

  const handlePriceChange = useCallback((values) => {
    console.log('💰 PriceFilter: Range changed', { values, bounds: priceBounds })
    setPriceRange(values)
  }, [setPriceRange, priceBounds])

  const hasActiveFilter = priceRange[0] !== priceBounds.min || priceRange[1] !== priceBounds.max

  console.log('💰 PriceFilter render:', {
    currentRange: priceRange,
    fullRange: priceBounds,
    hasActiveFilter,
    timestamp: new Date().toISOString()
  })

  return (
    <div className="sidebar-widget">
      <h5 className="widget-title">Price Range</h5>
      <div className="widget-content">
        <div className="price-range-container">
          <div className="price-inputs">
            <input
              type="number"
              className="form-control"
              placeholder="Min"
              value={priceRange[0]}
              onChange={(e) => handlePriceChange([parseInt(e.target.value) || priceBounds.min, priceRange[1]])}
            />
            <span>-</span>
            <input
              type="number"
              className="form-control"
              placeholder="Max"
              value={priceRange[1]}
              onChange={(e) => handlePriceChange([priceRange[0], parseInt(e.target.value) || priceBounds.max])}
            />
          </div>
          <div className="price-display">
            ${priceRange[0]} - ${priceRange[1]}
          </div>
        </div>
      </div>
    </div>
  )
})

const ClearFiltersSection = memo(function ClearFiltersSection() {
  const { categories, brands, priceRange, priceBounds } = useFilterState()
  const { clearAll, clearFilter } = useFilterActions()

  const hasActiveFilters = 
    (categories?.length > 0) || 
    (brands?.length > 0) || 
    (priceRange[0] !== priceBounds.min || priceRange[1] !== priceBounds.max)

  console.log('🧹 ClearFiltersSection render:', {
    hasActiveFilters,
    activeFilters: {
      categories: categories?.length || 0,
      brands: brands?.length || 0,
      priceModified: priceRange[0] !== priceBounds.min || priceRange[1] !== priceBounds.max
    },
    timestamp: new Date().toISOString()
  })

  if (!hasActiveFilters) return null

  return (
    <div className="sidebar-widget">
      <div className="widget-content">
        <button
          type="button"
          className="btn btn-outline-danger btn-sm w-100 mb-2"
          onClick={clearAll}
        >
          Clear All Filters
        </button>
        
        <div className="active-filters">
          {categories?.length > 0 && (
            <button
              type="button"
              className="btn btn-outline-secondary btn-xs me-1 mb-1"
              onClick={() => clearFilter('categories')}
            >
              Clear Categories ({categories.length})
            </button>
          )}
          
          {brands?.length > 0 && (
            <button
              type="button"
              className="btn btn-outline-secondary btn-xs me-1 mb-1"
              onClick={() => clearFilter('brands')}
            >
              Clear Brands ({brands.length})
            </button>
          )}
          
          {(priceRange[0] !== priceBounds.min || priceRange[1] !== priceBounds.max) && (
            <button
              type="button"
              className="btn btn-outline-secondary btn-xs me-1 mb-1"
              onClick={() => clearFilter('price')}
            >
              Reset Price
            </button>
          )}
        </div>
      </div>
    </div>
  )
})

// Static widgets that never re-render
const StaticSidebarWidgets = memo(function StaticSidebarWidgets() {
  console.log('📌 StaticSidebarWidgets render:', {
    timestamp: new Date().toISOString(),
    note: 'This should only render once unless props change'
  })

  return (
    <>
      {/* Add any static sidebar content here */}
      <div className="sidebar-widget">
        <h5 className="widget-title">Popular Products</h5>
        <div className="widget-content">
          {/* Static content that doesn't change */}
          <p>Featured items, ads, etc.</p>
        </div>
      </div>
    </>
  )
})

export {
  CategoriesFilterSection,
  BrandsFilterSection,
  PriceFilterSection,
  ClearFiltersSection,
  StaticSidebarWidgets
}
