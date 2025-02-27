import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    https: {
      key: fs.readFileSync('../backend/certificates/localhost.key'),
      cert: fs.readFileSync('../backend/certificates/localhost.crt'),
    },
    port: 5173,
    host: 'localhost',
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
  }
})
