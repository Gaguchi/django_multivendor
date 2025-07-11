import { useQuery } from '@tanstack/react-query'
import api from '../services/api'

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      console.log('🔄 useCategories: Starting API call to fetch ALL categories')
      console.log('🔄 useCategories: Master token:', import.meta.env.VITE_MASTER_TOKEN ? 'Present' : 'Missing')
      
      try {
        // Force fetch ALL categories by getting each page
        let allCategories = []
        let page = 1
        let hasMore = true
        
        while (hasMore) {
          console.log(`🔄 useCategories: Fetching page ${page}`)
          
          const response = await api.get('/api/categories/', {
            params: { page },
            headers: {
              'X-Master-Token': import.meta.env.VITE_MASTER_TOKEN
            }
          })
          
          console.log(`✅ useCategories: Page ${page} response:`, {
            status: response.status,
            count: response.data.count,
            pageResults: response.data.results?.length || 0,
            hasNext: !!response.data.next
          })
          
          if (response.data.results) {
            allCategories = allCategories.concat(response.data.results)
          }
          
          hasMore = !!response.data.next
          page++
          
          // Safety limit to prevent infinite loops
          if (page > 50) {
            console.warn('🚨 useCategories: Reached page limit, stopping')
            break
          }
        }
        
        console.log('✅ useCategories: All pages fetched:', {
          totalPages: page - 1,
          totalCategories: allCategories.length,
          jewelryCategory: allCategories.find(c => c.slug === 'jewelry'),
          categoriesWithProducts: allCategories.filter(c => c.product_count > 0).length
        })

        return allCategories
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
