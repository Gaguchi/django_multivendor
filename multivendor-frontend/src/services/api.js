import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Track refresh token promise
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If error is not 401 or request already retried, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      // Queue requests while token is being refreshed
      try {
        const token = await new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
        originalRequest.headers['Authorization'] = `Bearer ${token}`
        return api(originalRequest)
      } catch (err) {
        return Promise.reject(err)
      }
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      const refreshToken = localStorage.getItem('refreshToken')
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/token/refresh/`,
        { refresh: refreshToken }
      )

      const { access: newToken } = response.data
      localStorage.setItem('token', newToken)
      
      // Update authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
      originalRequest.headers['Authorization'] = `Bearer ${newToken}`
      
      processQueue(null, newToken)
      
      return api(originalRequest)
    } catch (err) {
      processQueue(err, null)
      // Clear tokens and redirect to login
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken') 
      window.location.href = '/login'
      return Promise.reject(err)
    } finally {
      isRefreshing = false
    }
  }
)

// Add request interceptor to add token to all requests
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

export default api