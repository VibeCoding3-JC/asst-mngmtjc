import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
