import { useQuery } from '@tanstack/react-query'
import api from '../services/api'

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await api.get('/api/vendors/products/', {
        headers: {
          'X-Master-Token': import.meta.env.VITE_MASTER_TOKEN
        }
      })
      return response.data
    }
  })
}
