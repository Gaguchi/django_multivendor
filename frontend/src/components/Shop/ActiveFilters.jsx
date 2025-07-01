import { memo, useCallback, useRef } from 'react'
import PropTypes from 'prop-types'

// Custom comparison function for ActiveFilters memo
function activeFiltersPropsAreEqual(prevProps, nextProps) {
  // Compare filters object
  if (JSON.stringify(prevProps.filters) !== JSON.stringify(nextProps.filters)) {
    console.log('🏷️ ActiveFilters memo: Filters changed')
    return false
  }
  
  console.log('🏷️ ActiveFilters memo: Props are equal, skipping re-render')
  return true
}

/**
 * Active filters display - only re-renders when filters actually change
 */
const ActiveFilters = memo(function ActiveFilters({ filters, onClearFilter, onClearAll }) {
  const renderCountRef = useRef(0)
  renderCountRef.current++
  
  console.log('🏷️ ActiveFilters render:', { 
    filterCount: Object.keys(filters).length,
    timestamp: new Date().toISOString(),
    renderCount: renderCountRef.current,
    note: 'This should only re-render when filters change'
  })

  const handleClearFilter = useCallback((filterKey) => {
    console.log('❌ Clearing single filter:', filterKey)
    onClearFilter(filterKey)
  }, [onClearFilter])

  const handleClearAll = useCallback(() => {
    console.log('🧹 Clearing all filters')
    onClearAll()
  }, [onClearAll])

  // Don't render if no filters are active
  if (!filters || Object.keys(filters).length === 0) {
    return null
  }

  return (
    <div className="active-filters mb-3">
      <div className="d-flex flex-wrap align-items-center gap-2">
        <span className="fw-bold me-2">Active Filters:</span>
        {Object.entries(filters).map(([key, value]) => (
          <span key={key} className="badge bg-primary">
            {key}: {value}
            <button 
              className="btn-close btn-close-white btn-sm ms-1"
              onClick={() => handleClearFilter(key)}
              title={`Remove ${key} filter`}
            ></button>
          </span>
        ))}
        <button 
          className="btn btn-outline-secondary btn-sm"
          onClick={handleClearAll}
        >
          Clear All
        </button>
      </div>
    </div>
  )
}, activeFiltersPropsAreEqual)

ActiveFilters.propTypes = {
  filters: PropTypes.object.isRequired,
  onClearFilter: PropTypes.func.isRequired,
  onClearAll: PropTypes.func.isRequired
}

export default ActiveFilters
