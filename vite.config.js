import { defineConfig } from 'vite'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { viteStaticCopy } from 'vite-plugin-static-copy'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

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

  // Plugins
  plugins: [
    // Copy CSS files to dist for browser @import resolution
    viteStaticCopy({
      targets: [
        {
          src: resolve(__dirname, 'css/*'),
          dest: 'css'
        }
      ]
    })
  ],

  // Resolve paths to allow imports from parent directory
  resolve: {
    alias: {
      '/css': resolve(__dirname, 'css'),
    }
  },

  // CSS configuration
  css: {
    // Process imports
    devSourcemap: true,
  },
})
