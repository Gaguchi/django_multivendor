import React, { memo, useCallback } from 'react'

const Brands = memo(function Brands({ 
  brands = [], 
  selectedBrands = [], 
  onBrandsChange, 
  collapsed = false, 
  onToggleCollapse 
}) {
  const handleBrandChange = useCallback((brandId) => {
    const newSelection = selectedBrands.includes(brandId)
      ? selectedBrands.filter(id => id !== brandId)
      : [...selectedBrands, brandId]
    onBrandsChange(newSelection)
  }, [selectedBrands, onBrandsChange])

  const handleClearBrands = useCallback(() => {
    onBrandsChange([])
  }, [onBrandsChange])

  if (!brands?.length) return null

  return (
    <div className="widget">
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
          <ul className="cat-list">
            {brands.map(brand => (
              <li key={brand.id}>
                <div className="d-flex justify-content-between align-items-center">
                  <label className="custom-checkbox mb-0">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand.id)}
                      onChange={() => handleBrandChange(brand.id)}
                    />
                    <span className="category-name">{brand.business_name || brand.name}</span>
                  </label>
                  <span className="products-count">({brand.product_count || 0})</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}, (prevProps, nextProps) => {
  // Only re-render if brands data or selection actually changed
  return (
    JSON.stringify(prevProps.brands) === JSON.stringify(nextProps.brands) &&
    JSON.stringify(prevProps.selectedBrands) === JSON.stringify(nextProps.selectedBrands) &&
    prevProps.collapsed === nextProps.collapsed
  )
})

export default Brands
