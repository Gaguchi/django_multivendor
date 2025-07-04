import { useInfiniteQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import api from '../services/api'

export function useProducts(options = {}, queryConfig = {}) {
  // Reduced logging to minimize noise
  // console.log('🎣 useProducts hook called with options:', options)
  
  // Stable query configuration
  const stableConfig = useMemo(() => ({
    staleTime: 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(500 * 2 ** attemptIndex, 5000),
    ...queryConfig
  }), [queryConfig])
  
  return useInfiniteQuery({
      queryKey: ['products', options],
      queryFn: async ({ pageParam = 1 }) => {
        try {
          // Reduced logging to minimize noise in console
          // console.log('🔄 useProducts API call with params:', {
          //   page: pageParam,
          //   page_size: options.filters?.page_size || 20,
          //   ...options.filters
          // })
          
          const response = await api.get('/api/vendors/products/', {
            headers: {
            'X-Master-Token': import.meta.env.VITE_MASTER_TOKEN
          },
          params: {
            page: pageParam,
            page_size: options.filters?.page_size || 20,
            ...options.filters
          }
        })
        
        // Reduced logging to minimize noise
        // console.log('✅ useProducts API response:', response.data)
        return response.data
      } catch (error) {
        console.error('❌ useProducts API error:', error)
        // Parse error response with better error handling
        let message = 'Unknown error occurred'
        
        if (error.response?.data?.message) {
          message = error.response.data.message
        } else if (error.response?.data?.detail) {
          message = error.response.data.detail
        } else if (error.message) {
          message = error.message
        }
        
        // Don't throw promise-like objects, just throw an Error
        const errorObject = new Error(`Failed to fetch products: ${message}`)
        errorObject.status = error.response?.status
        throw errorObject
      }
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.next) return undefined
      try {
        const nextUrl = new URL(lastPage.next) 
        return nextUrl.searchParams.get('page')
      } catch {
        return undefined
      }
    },
    ...stableConfig
  })
}
