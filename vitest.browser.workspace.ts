import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  {
    extends: 'vite.config.ts',
    test: {
      browser: {
        // Override base config to use visible browser for local debugging
        name: 'chromium',
        provider: 'playwright',
        headless: false,
      },
    },
  },
])

