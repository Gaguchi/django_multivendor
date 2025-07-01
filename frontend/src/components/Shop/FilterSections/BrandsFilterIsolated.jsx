import React, { memo, useCallback } from 'react'
import { useFilterContext } from './FilterProvider'

const BrandsFilterIsolated = memo(function BrandsFilterIsolated({ 
  brands = [],
  loading = false,
  collapsed = false,
  onToggleCollapse = () => {}
}) {
  const { filters, updateFilter } = useFilterContext()
  const selectedBrands = filters.brands

  console.log('🏪 BrandsFilterIsolated render:', {
    brandsCount: brands.length,
    selectedCount: selectedBrands.length,
    timestamp: new Date().toISOString(),
    note: 'This should ONLY re-render when brands data or selection changes'
  })

  const handleToggleBrand = useCallback((brandId) => {
    const newBrands = selectedBrands.includes(brandId)
      ? selectedBrands.filter(id => id !== brandId)
      : [...selectedBrands, brandId]
    
    updateFilter('brands', newBrands, true) // Immediate update
  }, [selectedBrands, updateFilter])

  const handleClearBrands = useCallback(() => {
    updateFilter('brands', [], true)
  }, [updateFilter])

  if (loading) {
    return (
      <div className="widget widget-brands">
        <h3 className="widget-title">Brands</h3>
        <div className="widget-body">
          <div className="cat-list">
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton-line mb-2"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="widget widget-brands">
      <h3 className="widget-title">
        <button 
          className="collapse-toggle"
          onClick={onToggleCollapse}
          aria-expanded={!collapsed}
        >
          Brands
          <i className={`icon-${collapsed ? 'plus' : 'minus'} ml-2`}></i>
        </button>
        {selectedBrands.length > 0 && (
          <button 
            className="clear-section"
            onClick={handleClearBrands}
            title="Clear brands"
          >
            Clear ({selectedBrands.length})
          </button>
        )}
      </h3>
      
      <div className={`widget-collapse ${collapsed ? 'collapsed' : 'expanded'}`}>
        <div className="widget-body">
          <div className="cat-list">
            {brands.map((brand) => (
              <button
                key={brand.id}
                className="category-item"
                onClick={() => handleToggleBrand(brand.id)}
              >
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand.id)}
                  onChange={() => {}} // Handled by button click
                  tabIndex="-1"
                />
                <span className="category-name">{brand.name}</span>
                <small className="products-count">({brand.product_count || 0})</small>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
})

export default BrandsFilterIsolated
