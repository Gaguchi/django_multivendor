import { memo, useCallback } from 'react'

const ClearFiltersWidget = memo(function ClearFiltersWidget({
  hasActiveFilters,
  onClearAllFilters,
  isPriceUpdating = false
}) {
  console.log('🧹 ClearFiltersWidget render:', {
    hasActiveFilters,
    isPriceUpdating,
    timestamp: new Date().toISOString()
  })

  if (!hasActiveFilters) {
    return null
  }

  return (
    <div className="widget">
      <div className="widget-body">
        <button 
          type="button"
          className="btn btn-outline-primary btn-sm w-100"
          onClick={onClearAllFilters}
        >
          <i className="icon-close me-2"></i>
          Clear All Filters
          {isPriceUpdating && <span className="ms-2">⏳</span>}
        </button>
      </div>
    </div>
  )
})

export default ClearFiltersWidget
