import React, { createContext, useContext, useCallback, useRef, useState } from 'react'

// Create context for filter communication
const FilterContext = createContext()

export const useFilterContext = () => {
  const context = useContext(FilterContext)
  if (!context) {
    throw new Error('useFilterContext must be used within FilterProvider')
  }
  return context
}

export const FilterProvider = ({ children, onFiltersChange }) => {
  const [filters, setFilters] = useState({
    categories: [],
    brands: [],
    priceRange: [0, 1000]
  })
  
  const debounceTimerRef = useRef(null)
  const [isPriceUpdating, setIsPriceUpdating] = useState(false)

  console.log('🏭 FilterProvider render:', {
    timestamp: new Date().toISOString(),
    currentFilters: filters,
    note: 'This should be the ONLY component managing filter state'
  })

  // Update a specific filter section without affecting others
  const updateFilter = useCallback((filterType, value, immediate = false) => {
    console.log(`🔄 FilterProvider: Updating ${filterType}:`, value)
    
    setFilters(prevFilters => {
      const newFilters = {
        ...prevFilters,
        [filterType]: value
      }
      
      // Only notify parent after state update
      if (immediate) {
        // For non-price filters, notify immediately
        const formattedFilters = {
          ...newFilters,
          priceMin: newFilters.priceRange[0],
          priceMax: newFilters.priceRange[1]
        }
        console.log('📤 FilterProvider: Immediate filter change:', formattedFilters)
        onFiltersChange?.(formattedFilters)
      } else {
        // For price filters, debounce
        setIsPriceUpdating(true)
        
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current)
        }
        
        debounceTimerRef.current = setTimeout(() => {
          const formattedFilters = {
            ...newFilters,
            priceMin: newFilters.priceRange[0],
            priceMax: newFilters.priceRange[1]
          }
          console.log('📤 FilterProvider: Debounced filter change:', formattedFilters)
          onFiltersChange?.(formattedFilters)
          setIsPriceUpdating(false)
        }, 300)
      }
      
      return newFilters
    })
  }, [onFiltersChange])

  // Clear all filters
  const clearAllFilters = useCallback((defaultPriceRange = [0, 1000]) => {
    console.log('🧹 FilterProvider: Clearing all filters')
    const emptyFilters = {
      categories: [],
      brands: [],
      priceRange: defaultPriceRange
    }
    setFilters(emptyFilters)
    onFiltersChange?.({
      ...emptyFilters,
      priceMin: defaultPriceRange[0],
      priceMax: defaultPriceRange[1]
    })
  }, [onFiltersChange])

  // Check if any filters are active
  const hasActiveFilters = useCallback(() => {
    return filters.categories.length > 0 ||
           filters.brands.length > 0 ||
           filters.priceRange[0] > 0 ||
           filters.priceRange[1] < 1000
  }, [filters])

  const contextValue = {
    filters,
    updateFilter,
    clearAllFilters,
    hasActiveFilters,
    isPriceUpdating
  }

  return (
    <FilterContext.Provider value={contextValue}>
      {children}
    </FilterContext.Provider>
  )
}
