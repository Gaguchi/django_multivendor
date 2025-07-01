import { memo, useCallback } from 'react'
import { Range } from 'react-range'

const PriceFilter = memo(function PriceFilter({
  priceRange = { min: 0, max: 1000 },
  selectedPriceRange = [0, 1000],
  onPriceRangeChange,
  onPriceInputChange,
  isPriceUpdating = false,
  collapsed = false,
  onToggleCollapse
}) {
  const hasActivePriceFilter = selectedPriceRange[0] > priceRange.min || selectedPriceRange[1] < priceRange.max

  const handleClearPrice = useCallback((e) => {
    e.preventDefault()
    onPriceRangeChange([priceRange.min, priceRange.max])
  }, [priceRange.min, priceRange.max, onPriceRangeChange])

  const handleQuickRangeClick = useCallback((range) => {
    onPriceRangeChange(range)
  }, [onPriceRangeChange])

  console.log('💰 PriceFilter render:', {
    currentRange: selectedPriceRange,
    fullRange: priceRange,
    hasActiveFilter: hasActivePriceFilter,
    isUpdating: isPriceUpdating,
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
          Price {isPriceUpdating && <span className="price-updating">⏳</span>}
          <i className={`fas fa-chevron-${collapsed ? 'down' : 'up'} ms-2`}></i>
        </button>
        {hasActivePriceFilter && (
          <button
            type="button"
            className="clear-section"
            onClick={handleClearPrice}
          >
            Clear
          </button>
        )}
      </h3>
      <div className={`widget-collapse ${collapsed ? 'collapsed' : 'expanded'}`}>
        <div className="widget-body pb-0">
          <div className="price-filter">
            {/* Price Range Display */}
            <div className="price-range-display mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <div className="price-input-wrapper">
                  <label className="price-label">Min</label>
                  <input
                    type="number"
                    className="form-control form-control-sm price-input"
                    value={selectedPriceRange[0]}
                    min={priceRange.min}
                    max={selectedPriceRange[1]}
                    onChange={(e) => {
                      const value = Math.max(priceRange.min, Math.min(parseInt(e.target.value) || priceRange.min, selectedPriceRange[1]))
                      onPriceInputChange(0, value)
                    }}
                  />
                </div>
                <div className="price-separator">-</div>
                <div className="price-input-wrapper">
                  <label className="price-label">Max</label>
                  <input
                    type="number"
                    className="form-control form-control-sm price-input"
                    value={selectedPriceRange[1]}
                    min={selectedPriceRange[0]}
                    max={priceRange.max}
                    onChange={(e) => {
                      const value = Math.min(priceRange.max, Math.max(parseInt(e.target.value) || priceRange.max, selectedPriceRange[0]))
                      onPriceInputChange(1, value)
                    }}
                  />
                </div>
              </div>
            </div>
            
            {/* Range Slider */}
            <div className="price-range-slider mb-3">
              {priceRange.min < priceRange.max && (
                <Range
                  step={1}
                  min={priceRange.min}
                  max={priceRange.max}
                  values={[
                    Math.max(priceRange.min, Math.min(selectedPriceRange[0], priceRange.max)),
                    Math.min(priceRange.max, Math.max(selectedPriceRange[1], priceRange.min))
                  ]}
                  onChange={onPriceRangeChange}
                  renderTrack={({ props, children }) => {
                    const { key, jsx, ...trackProps } = props
                    return (
                      <div
                        {...trackProps}
                        key={key}
                        className="range-track"
                        style={{
                          ...trackProps.style,
                          height: '8px',
                          width: '100%',
                          backgroundColor: '#e9ecef',
                          borderRadius: '4px',
                          position: 'relative'
                        }}
                      >
                        {children}
                      </div>
                    )
                  }}
                  renderThumb={({ props, index }) => {
                    const { key, jsx, ...thumbProps } = props
                    return (
                      <div
                        {...thumbProps}
                        key={key}
                        className="range-thumb"
                        style={{
                          ...thumbProps.style,
                          height: '24px',
                          width: '24px',
                          backgroundColor: '#08C',
                          borderRadius: '50%',
                          border: '3px solid white',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <div className="range-thumb-label">
                          ${selectedPriceRange[index]}
                        </div>
                      </div>
                    )
                  }}
                />
              )}
            </div>
            
            {/* Quick price ranges */}
            <div className="price-ranges">
              <div className="small mb-2 text-muted">Quick ranges:</div>
              <div className="d-flex flex-wrap gap-1">
                {[
                  { label: 'Under $25', range: [priceRange.min, 25] },
                  { label: '$25-$50', range: [25, 50] },
                  { label: '$50-$100', range: [50, 100] },
                  { label: '$100+', range: [100, priceRange.max] },
                ].map((rangeOption, index) => (
                  <button
                    key={index}
                    className={`btn btn-sm ${
                      selectedPriceRange[0] === rangeOption.range[0] && 
                      selectedPriceRange[1] === rangeOption.range[1]
                        ? 'btn-primary' 
                        : 'btn-outline-secondary'
                    }`}
                    onClick={() => handleQuickRangeClick(rangeOption.range)}
                  >
                    {rangeOption.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .price-updating {
          font-size: 12px;
          margin-left: 5px;
        }

        .price-range-display {
          margin-bottom: 1rem;
        }

        .price-input-wrapper {
          display: flex;
          flex-direction: column;
          width: 80px;
        }

        .price-label {
          font-size: 12px;
          color: #666;
          margin-bottom: 4px;
          font-weight: 500;
        }

        .price-input {
          font-size: 13px;
          padding: 0.375rem 0.5rem;
          text-align: center;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .price-input:focus {
          border-color: #08C;
          box-shadow: 0 0 0 0.2rem rgba(8, 140, 204, 0.25);
        }

        .price-separator {
          align-self: flex-end;
          margin: 0 10px 8px 10px;
          color: #666;
          font-weight: 500;
        }

        .price-range-slider {
          padding: 20px 10px 10px 10px;
          position: relative;
        }

        .range-thumb {
          position: relative;
        }

        .range-thumb-label {
          position: absolute;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          background: #333;
          color: white;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 11px;
          white-space: nowrap;
          opacity: 0;
          transition: opacity 0.2s;
          pointer-events: none;
        }

        .range-thumb:hover .range-thumb-label {
          opacity: 1;
        }

        .range-thumb-label::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border: 4px solid transparent;
          border-top-color: #333;
        }

        .range-track {
          background: linear-gradient(to right, 
            #e9ecef 0%, 
            #e9ecef ${((selectedPriceRange[0] - priceRange.min) / (priceRange.max - priceRange.min)) * 100}%, 
            #08C ${((selectedPriceRange[0] - priceRange.min) / (priceRange.max - priceRange.min)) * 100}%, 
            #08C ${((selectedPriceRange[1] - priceRange.min) / (priceRange.max - priceRange.min)) * 100}%, 
            #e9ecef ${((selectedPriceRange[1] - priceRange.min) / (priceRange.max - priceRange.min)) * 100}%, 
            #e9ecef 100%) !important;
          border-radius: 4px;
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
        }

        .price-ranges .btn-sm {
          font-size: 11px;
          padding: 0.25rem 0.5rem;
        }

        @media (max-width: 991px) {
          .price-input-wrapper {
            width: 70px;
          }

          .price-input {
            font-size: 12px;
            padding: 0.25rem 0.375rem;
          }

          .price-separator {
            margin: 0 8px 8px 8px;
          }

          .range-thumb-label {
            font-size: 10px;
            top: -25px;
          }
        }
      `}</style>
    </div>
  )
})

export default PriceFilter
