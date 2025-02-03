import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync('../django_multivendor/certificates/localhost.key'),
      cert: fs.readFileSync('../django_multivendor/certificates/localhost.crt'),
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
  }
})
