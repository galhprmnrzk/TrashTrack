import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // Tambahkan ini

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Ini akan membuat '@' merujuk ke folder 'src'
      '@': path.resolve(__dirname, './src'),
    },
  },
})
