import React, { memo, useCallback, useState } from 'react'
import { Range } from 'react-range'
import { useFilterContext } from './FilterProvider'

const PriceFilterIsolated = memo(function PriceFilterIsolated({ 
  priceRange = { min: 0, max: 1000 },
  collapsed = false,
  onToggleCollapse = () => {}
}) {
  const { filters, updateFilter, isPriceUpdating } = useFilterContext()
  const currentPriceRange = filters.priceRange

  console.log('💰 PriceFilterIsolated render:', {
    currentRange: currentPriceRange,
    fullRange: priceRange,
    hasActiveFilter: currentPriceRange[0] > priceRange.min || currentPriceRange[1] < priceRange.max,
    isUpdating: isPriceUpdating,
    timestamp: new Date().toISOString(),
    note: 'This should ONLY re-render when price data changes or isUpdating changes'
  })

  const handleRangeChange = useCallback((values) => {
    // Validate values are within bounds
    const validValues = [
      Math.max(priceRange.min, Math.min(values[0], priceRange.max)),
      Math.min(priceRange.max, Math.max(values[1], priceRange.min))
    ]
    
    updateFilter('priceRange', validValues, false) // Debounced update
  }, [updateFilter, priceRange.min, priceRange.max])

  const handleInputChange = useCallback((index, value) => {
    const numValue = Math.max(0, parseInt(value) || 0)
    const newRange = [...currentPriceRange]
    newRange[index] = numValue
    
    // Validate the range
    if (index === 0 && numValue <= currentPriceRange[1]) {
      updateFilter('priceRange', newRange, false)
    } else if (index === 1 && numValue >= currentPriceRange[0]) {
      updateFilter('priceRange', newRange, false)
    }
  }, [currentPriceRange, updateFilter])

  const handleClearPrice = useCallback(() => {
    updateFilter('priceRange', [priceRange.min, priceRange.max], true)
  }, [updateFilter, priceRange.min, priceRange.max])

  const hasActiveFilter = currentPriceRange[0] > priceRange.min || currentPriceRange[1] < priceRange.max

  return (
    <div className="widget widget-price">
      <h3 className="widget-title">
        <button 
          className="collapse-toggle"
          onClick={onToggleCollapse}
          aria-expanded={!collapsed}
        >
          Price
          <i className={`icon-${collapsed ? 'plus' : 'minus'} ml-2`}></i>
        </button>
        {hasActiveFilter && (
          <button 
            className="clear-section"
            onClick={handleClearPrice}
            title="Clear price filter"
          >
            Clear
          </button>
        )}
      </h3>
      
      <div className={`widget-collapse ${collapsed ? 'collapsed' : 'expanded'}`}>
        <div className="widget-body">
          {isPriceUpdating && (
            <div className="text-center mb-2">
              <small className="text-muted">
                <i className="fa fa-spinner fa-spin"></i> Updating...
              </small>
            </div>
          )}
          
          <div className="price-range-container">
            <Range
              step={1}
              min={priceRange.min}
              max={priceRange.max}
              values={currentPriceRange}
              onChange={handleRangeChange}
              renderTrack={({ props, children }) => (
                <div
                  {...props}
                  style={{
                    ...props.style,
                    height: '6px',
                    width: '100%',
                    background: '#ddd',
                    borderRadius: '3px',
                    margin: '20px 0'
                  }}
                >
                  {children}
                </div>
              )}
              renderThumb={({ props }) => (
                <div
                  {...props}
                  style={{
                    ...props.style,
                    height: '20px',
                    width: '20px',
                    borderRadius: '50%',
                    backgroundColor: '#08C',
                    border: '2px solid #fff',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}
                />
              )}
            />
          </div>
          
          <div className="price-inputs d-flex justify-content-between align-items-center">
            <div className="price-input-group">
              <label htmlFor="price-min" className="sr-only">Minimum price</label>
              <input
                id="price-min"
                type="number"
                min={priceRange.min}
                max={priceRange.max}
                value={currentPriceRange[0]}
                onChange={(e) => handleInputChange(0, e.target.value)}
                className="form-control form-control-sm"
                style={{ width: '80px' }}
              />
            </div>
            <span className="mx-2">-</span>
            <div className="price-input-group">
              <label htmlFor="price-max" className="sr-only">Maximum price</label>
              <input
                id="price-max"
                type="number"
                min={priceRange.min}
                max={priceRange.max}
                value={currentPriceRange[1]}
                onChange={(e) => handleInputChange(1, e.target.value)}
                className="form-control form-control-sm"
                style={{ width: '80px' }}
              />
            </div>
          </div>
          
          <div className="text-center mt-3">
            <small className="text-muted">
              Price: ${currentPriceRange[0]} - ${currentPriceRange[1]}
            </small>
          </div>
        </div>
      </div>
    </div>
  )
})

export default PriceFilterIsolated
