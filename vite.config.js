import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('firebase')) {
              return 'vendor-firebase';
            }
            if (id.includes('react-router-dom') || id.includes('react-dom') || id.match(/node_modules\/react\//)) {
              return 'vendor-react';
            }
            if (id.includes('react-icons')) {
              return 'vendor-icons';
            }
            return 'vendor-core';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
