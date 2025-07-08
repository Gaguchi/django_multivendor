import { useQuery } from '@tanstack/react-query'
import api from '../services/api'

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      console.log('🔄 useCategories: Starting API call to /api/categories/')
      console.log('🔄 useCategories: Master token:', import.meta.env.VITE_MASTER_TOKEN ? 'Present' : 'Missing')
      
      try {
        const response = await api.get('/api/categories/', {
          headers: {
            'X-Master-Token': import.meta.env.VITE_MASTER_TOKEN
          }
        })
        
        console.log('✅ useCategories: API response received:', {
          status: response.status,
          dataKeys: Object.keys(response.data),
          hasResults: !!response.data.results,
          resultsCount: response.data.results?.length || 0,
          directDataLength: Array.isArray(response.data) ? response.data.length : 'not array'
        })
        
        const categories = response.data.results || response.data
        console.log('✅ useCategories: Final categories:', {
          count: categories.length,
          firstFew: categories.slice(0, 3).map(c => ({ id: c.id, name: c.name, parent: c.parent_category }))
        })
        
        return categories
      } catch (error) {
        console.error('❌ useCategories: API call failed:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          url: error.config?.url
        })
        
        const message = error.response?.data?.message || error.message
        throw new Error(`Failed to fetch categories: ${message}`)
      }
    },
    staleTime: 10 * 60 * 1000, // Categories stay fresh for 10 minutes
    cacheTime: 60 * 60 * 1000, // Cache for 1 hour
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      console.log('🎉 useCategories: React Query success callback:', {
        dataLength: data?.length || 0,
        isArray: Array.isArray(data)
      })
    },
    onError: (error) => {
      console.error('💥 useCategories: React Query error callback:', error)
    }
  })
}
