import { defineConfig } from 'vite'

export default defineConfig({
  // Set root to static directory where index.html is located
  root: 'static',

  // Build output goes to dist (one level up from static)
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    // Don't inline assets
    assetsInlineLimit: 0,
  },

  // Public assets are in the assets subdirectory
  publicDir: 'assets',

  // CSS configuration
  css: {
    // Ensure CSS imports are resolved
    preprocessorOptions: {},
  },
})
