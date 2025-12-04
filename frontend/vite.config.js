import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Build Configuration
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable untuk production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log di production
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks untuk caching yang lebih baik
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['recharts'],
          export: ['xlsx', 'jspdf', 'jspdf-autotable']
        }
      }
    },
    chunkSizeWarningLimit: 1000 // KB
  },
  
  // Server Configuration
  server: {
    port: 5173,
    strictPort: false,
    host: true
  },
  
  // Preview Configuration (untuk test production build)
  preview: {
    port: 4173,
    strictPort: false,
    host: true
  },
  
  // Test Configuration
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: true,
    reporters: ['default', 'json'],
    outputFile: {
      json: './test-results.json'
    },
    coverage: {
      reporter: ['text', 'html', 'json-summary'],
      exclude: ['node_modules/', 'src/test/']
    }
  }
})
