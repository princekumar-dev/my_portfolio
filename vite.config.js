import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import compression from 'vite-plugin-compression'

export default defineConfig({
  // Relative base so the built assets resolve correctly when hosted under a
  // sub-path (GitHub Pages: /my_portfolio/) as well as on a custom domain.
  base: './',
  plugins: [
    react(),
    compression({ algorithm: 'brotliCompress' }),
    compression({ algorithm: 'gzip' }),
  ],
  server: {
    port: 3000,
    open: true
  },
  build: {
    target: 'es2020',
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'framer': ['framer-motion'],
          'icons': ['react-icons'],
        }
      }
    }
  }
})
