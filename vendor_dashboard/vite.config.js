import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    host: true,
    allowedHosts: ['seller.bazro.ge','shop.bazro.ge', 'api.bazro.ge', 'localhost', '127.0.0.1'],
    proxy: {
      '/api': {
        target: 'https://api.bazro.ge',
        secure: false,
        changeOrigin: true
      }
    }
  }
})
