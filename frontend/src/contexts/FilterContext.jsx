import { createContext, useContext, useReducer, useCallback } from 'react'

// Action types
const FILTER_ACTIONS = {
  SET_CATEGORIES: 'SET_CATEGORIES',
  SET_BRANDS: 'SET_BRANDS', 
  SET_PRICE_RANGE: 'SET_PRICE_RANGE',
  SET_PRICE_BOUNDS: 'SET_PRICE_BOUNDS',
  CLEAR_ALL: 'CLEAR_ALL',
  CLEAR_FILTER: 'CLEAR_FILTER'
}

// Initial state
const initialState = {
  categories: [],
  brands: [],
  priceRange: [0, 1000],
  priceBounds: { min: 0, max: 1000 },
  isInitialized: false
}

// Reducer for filter state management
function filterReducer(state, action) {
  switch (action.type) {
    case FILTER_ACTIONS.SET_CATEGORIES:
      return { ...state, categories: action.payload }
    
    case FILTER_ACTIONS.SET_BRANDS:
      return { ...state, brands: action.payload }
    
    case FILTER_ACTIONS.SET_PRICE_RANGE:
      return { ...state, priceRange: action.payload }
    
    case FILTER_ACTIONS.SET_PRICE_BOUNDS:
      const newBounds = action.payload
      return { 
        ...state, 
        priceBounds: newBounds,
        // Only update price range if it's at default values
        priceRange: state.priceRange[0] === 0 && state.priceRange[1] === 1000 
          ? [newBounds.min, newBounds.max] 
          : state.priceRange,
        isInitialized: true
      }
    
    case FILTER_ACTIONS.CLEAR_ALL:
      return {
        ...state,
        categories: [],
        brands: [],
        priceRange: [state.priceBounds.min, state.priceBounds.max]
      }
    
    case FILTER_ACTIONS.CLEAR_FILTER:
      const { filterKey } = action.payload
      if (filterKey === 'categories') return { ...state, categories: [] }
      if (filterKey === 'brands') return { ...state, brands: [] }
      if (filterKey === 'price') return { ...state, priceRange: [state.priceBounds.min, state.priceBounds.max] }
      return state
    
    default:
      return state
  }
}

// Create contexts
const FilterStateContext = createContext()
const FilterDispatchContext = createContext()

// Provider component
export function FilterProvider({ children, onFiltersChange }) {
  const [state, dispatch] = useReducer(filterReducer, initialState)

  // Debounced filter change callback
  const debouncedCallback = useCallback(
    debounce((filters) => {
      console.log('🔄 FilterContext: Notifying parent of filter change:', filters)
      onFiltersChange?.(filters)
    }, 300),
    [onFiltersChange]
  )

  // Action creators with automatic parent notification
  const actions = {
    setCategories: useCallback((categories) => {
      dispatch({ type: FILTER_ACTIONS.SET_CATEGORIES, payload: categories })
      
      // Immediately notify parent for non-price filters
      const filters = {
        categories,
        brands: state.brands,
        priceRange: state.priceRange,
        priceMin: state.priceRange[0],
        priceMax: state.priceRange[1]
      }
      console.log('📤 FilterContext: Categories changed, notifying immediately:', filters)
      onFiltersChange?.(filters)
    }, [state.brands, state.priceRange, onFiltersChange]),

    setBrands: useCallback((brands) => {
      dispatch({ type: FILTER_ACTIONS.SET_BRANDS, payload: brands })
      
      // Immediately notify parent for non-price filters
      const filters = {
        categories: state.categories,
        brands,
        priceRange: state.priceRange,
        priceMin: state.priceRange[0],
        priceMax: state.priceRange[1]
      }
      console.log('📤 FilterContext: Brands changed, notifying immediately:', filters)
      onFiltersChange?.(filters)
    }, [state.categories, state.priceRange, onFiltersChange]),

    setPriceRange: useCallback((priceRange) => {
      dispatch({ type: FILTER_ACTIONS.SET_PRICE_RANGE, payload: priceRange })
      
      // Debounce price changes
      const filters = {
        categories: state.categories,
        brands: state.brands,
        priceRange,
        priceMin: priceRange[0],
        priceMax: priceRange[1]
      }
      console.log('📤 FilterContext: Price range changed, debouncing:', filters)
      debouncedCallback(filters)
    }, [state.categories, state.brands, debouncedCallback]),

    setPriceBounds: useCallback((bounds) => {
      dispatch({ type: FILTER_ACTIONS.SET_PRICE_BOUNDS, payload: bounds })
    }, []),

    clearAll: useCallback(() => {
      dispatch({ type: FILTER_ACTIONS.CLEAR_ALL })
      
      const filters = {
        categories: [],
        brands: [],
        priceRange: [state.priceBounds.min, state.priceBounds.max],
        priceMin: state.priceBounds.min,
        priceMax: state.priceBounds.max
      }
      console.log('📤 FilterContext: Clearing all filters:', filters)
      onFiltersChange?.(filters)
    }, [state.priceBounds, onFiltersChange]),

    clearFilter: useCallback((filterKey) => {
      dispatch({ type: FILTER_ACTIONS.CLEAR_FILTER, payload: { filterKey } })
      
      let filters = { ...state }
      if (filterKey === 'categories') filters.categories = []
      if (filterKey === 'brands') filters.brands = []
      if (filterKey === 'price') filters.priceRange = [state.priceBounds.min, state.priceBounds.max]
      
      filters.priceMin = filters.priceRange[0]
      filters.priceMax = filters.priceRange[1]
      
      console.log('📤 FilterContext: Clearing filter:', filterKey, filters)
      onFiltersChange?.(filters)
    }, [state, onFiltersChange])
  }

  return (
    <FilterStateContext.Provider value={state}>
      <FilterDispatchContext.Provider value={actions}>
        {children}
      </FilterDispatchContext.Provider>
    </FilterStateContext.Provider>
  )
}

// Custom hooks
export function useFilterState() {
  const context = useContext(FilterStateContext)
  if (!context) {
    throw new Error('useFilterState must be used within FilterProvider')
  }
  return context
}

export function useFilterActions() {
  const context = useContext(FilterDispatchContext)
  if (!context) {
    throw new Error('useFilterActions must be used within FilterProvider')
  }
  return context
}

// Utility debounce function
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
