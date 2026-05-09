import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/', 
  resolve: {
    alias: {
      // Menggunakan path.join dan __dirname agar aman di Linux/Vercel
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
  }
})
