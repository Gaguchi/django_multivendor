import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    port: 5173,
    host: 'localhost',
    // Add allowedHosts configuration to allow Cloudflare tunnel access
    allowedHosts: ['shop.bazro.ge', 'api.bazro.ge', 'localhost', '127.0.0.1'],
    proxy: {
      '/api': {
        target: 'https://127.0.0.1:8000',
        secure: false,
        changeOrigin: true
      }
    }
  },
  optimizeDeps: {
    include: ['jquery'],
    exclude: ['simple-line-icons'] // Exclude problematic assets
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@tanstack/react-query', '@tanstack/react-virtual'],
          jquery: ['jquery']
        }
      }
    },
    sourcemap: true,
  },
  css: {
    devSourcemap: true,
  },
  // Add preview configuration for production builds
  preview: {
    port: 5173,
    host: true, // Listen on all addresses
    allowedHosts: ['shop.bazro.ge', 'api.bazro.ge', 'localhost', '127.0.0.1'],
  }
})
