import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test-setup.js',
    // vmThreads + fileParallelism:false: workaround for worker timeout on Node v25
    pool: 'vmThreads',
    fileParallelism: false,
  },
})
