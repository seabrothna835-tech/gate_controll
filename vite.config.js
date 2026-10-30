import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    dedupe: ['react', 'react-dom'], 
  },
  server: {
    host: '0.0.0.0',
    proxy: {
      '/live': {
        // target: 'https://mis-uat.ppap.com.kh',
        target: 'http://localhost:8889',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})