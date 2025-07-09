import React, { memo, useCallback, useState, useRef, useEffect } from 'react'
import { Range } from 'react-range'

const Price = memo(function Price({ 
  priceRange = { min: 0, max: 1000 }, 
  minPrice = 0, 
  maxPrice = 1000, 
  onPriceChange, 
  collapsed = false, 
  onToggleCollapse 
}) {
  const [values, setValues] = useState([minPrice, maxPrice])
  const debounceRef = useRef(null)

  // Update local state when props change
  useEffect(() => {
    setValues([minPrice, maxPrice])
  }, [minPrice, maxPrice])

  const handleRangeChange = useCallback((newValues) => {
    setValues(newValues)
    
    // Debounce the actual price change to prevent excessive API calls
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    debounceRef.current = setTimeout(() => {
      onPriceChange(newValues[0], newValues[1])
    }, 500)
  }, [onPriceChange])

  const handleInputChange = useCallback((index, value) => {
    const numValue = parseInt(value) || 0
    const newValues = [...values]
    newValues[index] = numValue
    
    // Validate range
    if (index === 0 && numValue > values[1]) {
      newValues[1] = numValue
    }
    if (index === 1 && numValue < values[0]) {
      newValues[0] = numValue
    }
    
    setValues(newValues)
    onPriceChange(newValues[0], newValues[1])
  }, [values, onPriceChange])

  const handleClearPrice = useCallback(() => {
    const defaultValues = [priceRange.min, priceRange.max]
    setValues(defaultValues)
    onPriceChange(defaultValues[0], defaultValues[1])
  }, [priceRange.min, priceRange.max, onPriceChange])

  const hasActiveFilter = values[0] > priceRange.min || values[1] < priceRange.max

  return (
    <div className="widget">
      <h3 className="widget-title">
        <button 
          className="collapse-toggle"
          onClick={onToggleCollapse}
          aria-expanded={!collapsed}
        >
          Price Range
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
          <div className="price-filter">
            {/* Price Range Slider */}
            <div className="price-range-container">
              <Range
                values={values}
                step={1}
                min={priceRange.min}
                max={priceRange.max}
                onChange={handleRangeChange}
                renderTrack={({ props, children }) => (
                  <div
                    {...props}
                    style={{
                      ...props.style,
                      height: '6px',
                      background: '#ddd',
                      borderRadius: '3px'
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
                      backgroundColor: '#007bff',
                      borderRadius: '50%',
                      border: '2px solid #fff',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                    }}
                  />
                )}
              />
            </div>

            {/* Price Input Fields */}
            <div className="price-inputs mt-3">
              <div className="row">
                <div className="col-6">
                  <label className="form-label small">Min Price</label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={values[0]}
                    min={priceRange.min}
                    max={priceRange.max}
                    onChange={(e) => handleInputChange(0, e.target.value)}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small">Max Price</label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={values[1]}
                    min={priceRange.min}
                    max={priceRange.max}
                    onChange={(e) => handleInputChange(1, e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Current Price Display */}
            <div className="price-display mt-2 text-center">
              <small className="text-muted">
                ${values[0]} - ${values[1]}
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}, (prevProps, nextProps) => {
  // Only re-render if price data actually changed
  return (
    JSON.stringify(prevProps.priceRange) === JSON.stringify(nextProps.priceRange) &&
    prevProps.minPrice === nextProps.minPrice &&
    prevProps.maxPrice === nextProps.maxPrice &&
    prevProps.collapsed === nextProps.collapsed
  )
})

export default Price
