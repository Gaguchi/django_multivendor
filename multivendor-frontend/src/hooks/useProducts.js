import { useInfiniteQuery } from '@tanstack/react-query'
import api from '../services/api'

export function useProducts(options = {}) {
  return useInfiniteQuery({
    queryKey: ['products'],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get('/api/vendors/products/', {
        headers: {
          'X-Master-Token': import.meta.env.VITE_MASTER_TOKEN
        },
        params: {
          page: pageParam,
          page_size: options.pageSize || 10
        }
      })
      return response.data
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined
      // Extract page number from next URL
      const nextUrl = new URL(lastPage.next)
      return nextUrl.searchParams.get('page')
    },
    getPreviousPageParam: (firstPage) => {
      if (!firstPage.previous) return undefined
      const prevUrl = new URL(firstPage.previous)
      return prevUrl.searchParams.get('page')
    }
  })
}
