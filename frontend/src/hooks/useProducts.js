import { useInfiniteQuery } from '@tanstack/react-query'
import api from '../services/api'

export function useProducts(options = {}) {
  return useInfiniteQuery({
    queryKey: ['products', options],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const response = await api.get('/api/vendors/products/', {
          headers: {
            'X-Master-Token': import.meta.env.VITE_MASTER_TOKEN
          },
          params: {
            page: pageParam,
            page_size: options.pageSize || 10,
            ...options.filters
          }
        })
        return response.data
      } catch (error) {
        // Parse error response
        const message = error.response?.data?.message || error.message
        throw new Error(`Failed to fetch products: ${message}`)
      }
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined
      const nextUrl = new URL(lastPage.next) 
      return nextUrl.searchParams.get('page')
    },
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
    cacheTime: 30 * 60 * 1000, // Cache data for 30 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 3, // Retry failed requests 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}
