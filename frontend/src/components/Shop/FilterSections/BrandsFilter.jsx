import { memo, useCallback } from 'react'

const BrandsFilter = memo(function BrandsFilter({
  brands = [],
  selectedBrands = [],
  onToggleBrand,
  loading = false,
  collapsed = false,
  onToggleCollapse
}) {
  const handleClearBrands = useCallback((e) => {
    e.preventDefault()
    selectedBrands.forEach(brandId => {
      onToggleBrand(brandId)
    })
  }, [selectedBrands, onToggleBrand])

  console.log('🏪 BrandsFilter render:', {
    brandsCount: brands.length,
    selectedCount: selectedBrands.length,
    timestamp: new Date().toISOString()
  })

  return (
    <div className="widget">
      <h3 className="widget-title">
        <button
          className="collapse-toggle"
          onClick={onToggleCollapse}
          type="button"
        >
          Brands
          <i className={`fas fa-chevron-${collapsed ? 'down' : 'up'} ms-2`}></i>
        </button>
        {selectedBrands.length > 0 && (
          <button
            type="button"
            className="clear-section"
            onClick={handleClearBrands}
          >
            Clear
          </button>
        )}
      </h3>
      <div className={`widget-collapse ${collapsed ? 'collapsed' : 'expanded'}`}>
        <div className="widget-body">
          {loading ? (
            <div className="brand-skeleton">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="skeleton-line mb-2"></div>
              ))}
            </div>
          ) : (
            <ul className="cat-list">
              {brands && brands.length > 0 ? (
                brands.map((brand) => (
                  <li key={brand.id || brand.name}>
                    <label className="category-item">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(String(brand.id || brand.name))}
                        onChange={() => onToggleBrand(String(brand.id || brand.name))}
                      />
                      <span className="category-name">{brand.store_name || brand.name}</span>
                      {brand.product_count && (
                        <span className="products-count">({brand.product_count})</span>
                      )}
                    </label>
                  </li>
                ))
              ) : (
                <div className="text-muted small py-2">
                  No brands available
                </div>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
})

export default BrandsFilter
