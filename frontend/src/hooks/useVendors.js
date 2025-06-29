import { useQuery } from '@tanstack/react-query'
import api from '../services/api'

export function useVendors() {
  return useQuery({
    queryKey: ['vendors'],
    queryFn: async () => {
      try {
        const response = await api.get('/api/vendors/', {
          headers: {
            'X-Master-Token': import.meta.env.VITE_MASTER_TOKEN
          }
        })
        return response.data.results || response.data
      } catch (error) {
        const message = error.response?.data?.message || error.message
        throw new Error(`Failed to fetch vendors: ${message}`)
      }
    },
    staleTime: 10 * 60 * 1000, // Vendors stay fresh for 10 minutes
    cacheTime: 60 * 60 * 1000, // Cache for 1 hour
    refetchOnWindowFocus: false,
  })
}
