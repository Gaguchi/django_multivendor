import React, { memo, useCallback } from 'react'
import { useFilterContext } from './FilterProvider'

const ClearFiltersWidgetIsolated = memo(function ClearFiltersWidgetIsolated({ 
  defaultPriceRange = { min: 0, max: 1000 }
}) {
  const { hasActiveFilters, clearAllFilters, isPriceUpdating, filters } = useFilterContext()
  
  const activeFiltersCount = filters.categories.length + filters.brands.length + 
    (filters.priceRange[0] > defaultPriceRange.min || filters.priceRange[1] < defaultPriceRange.max ? 1 : 0)

  console.log('🧹 ClearFiltersWidgetIsolated render:', {
    hasActiveFilters: hasActiveFilters(),
    activeCount: activeFiltersCount,
    isPriceUpdating,
    timestamp: new Date().toISOString(),
    note: 'This should ONLY re-render when hasActiveFilters or isPriceUpdating changes'
  })

  const handleClearAll = useCallback(() => {
    clearAllFilters([defaultPriceRange.min, defaultPriceRange.max])
  }, [clearAllFilters, defaultPriceRange.min, defaultPriceRange.max])

  if (!hasActiveFilters()) {
    return null // Don't render if no active filters
  }

  return (
    <div className="widget widget-clear-filters">
      <div className="widget-body">
        <div className="d-flex justify-content-between align-items-center">
          <span className="text-muted">
            {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} active
            {isPriceUpdating && (
              <i className="fa fa-spinner fa-spin ml-2"></i>
            )}
          </span>
          <button 
            className="btn btn-sm btn-outline-secondary"
            onClick={handleClearAll}
            disabled={isPriceUpdating}
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  )
})

export default ClearFiltersWidgetIsolated
