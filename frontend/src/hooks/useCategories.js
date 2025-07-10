import { useQuery } from '@tanstack/react-query'
import api from '../services/api'

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      console.log('🔄 useCategories: Starting API call to fetch ALL categories')
      console.log('🔄 useCategories: Master token:', import.meta.env.VITE_MASTER_TOKEN ? 'Present' : 'Missing')
      
      try {
        // First, get the first page to see total count
        const firstResponse = await api.get('/api/categories/', {
          headers: {
            'X-Master-Token': import.meta.env.VITE_MASTER_TOKEN
          }
        })
        
        console.log('✅ useCategories: First page response:', {
          status: firstResponse.status,
          count: firstResponse.data.count,
          pageResults: firstResponse.data.results?.length || 0,
          hasNext: !!firstResponse.data.next
        })
        
        let allCategories = firstResponse.data.results || []
        
        // If there are more pages, fetch them all
        if (firstResponse.data.next && firstResponse.data.count > allCategories.length) {
          console.log('🔄 useCategories: Fetching all pages...')
          
          // Calculate how many more pages we need (assuming 10 per page)
          const pageSize = allCategories.length
          const totalPages = Math.ceil(firstResponse.data.count / pageSize)
          
          // Fetch remaining pages in parallel
          const remainingPagePromises = []
          for (let page = 2; page <= totalPages; page++) {
            const promise = api.get('/api/categories/', {
              params: { page },
              headers: {
                'X-Master-Token': import.meta.env.VITE_MASTER_TOKEN
              }
            })
            remainingPagePromises.push(promise)
          }
          
          const remainingPages = await Promise.all(remainingPagePromises)
          
          // Combine all results
          for (const pageResponse of remainingPages) {
            if (pageResponse.data.results) {
              allCategories = allCategories.concat(pageResponse.data.results)
            }
          }
          
          console.log('✅ useCategories: All pages fetched:', {
            totalPages,
            totalCategories: allCategories.length,
            expectedTotal: firstResponse.data.count
          })
        }
        
        console.log('✅ useCategories: Final categories:', {
          count: allCategories.length,
          firstFew: allCategories.slice(0, 3).map(c => ({ 
            id: c.id, 
            name: c.name, 
            parent: c.parent_category,
            product_count: c.product_count,
            hasSubcategories: c.subcategories?.length > 0
          })),
          categoriesWithProducts: allCategories.filter(c => c.product_count > 0).length,
          categoriesWithSubcategories: allCategories.filter(c => c.subcategories?.length > 0).length
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
