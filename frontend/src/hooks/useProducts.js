import { useInfiniteQuery } from '@tanstack/react-query'
import api from '../services/api'

export function useProducts(options = {}) {
  return useInfiniteQuery({
    queryKey: ['products', options],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        console.log('🔄 useProducts API call with params:', {
          page: pageParam,
          page_size: options.pageSize || 20,
          ...options.filters
        })
        
        const response = await api.get('/api/vendors/products/', {
          headers: {
            'X-Master-Token': import.meta.env.VITE_MASTER_TOKEN
          },
          params: {
            page: pageParam,
            page_size: options.pageSize || 20,
            ...options.filters
          }
        })
        
        console.log('✅ useProducts API response:', response.data)
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
    staleTime: 1000, // Reduce stale time to ensure filters trigger fresh requests
    gcTime: 5 * 60 * 1000, // Updated property name (cacheTime is deprecated)
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 2, // Reduce retries for faster response
    retryDelay: (attemptIndex) => Math.min(500 * 2 ** attemptIndex, 5000),
  })
}
