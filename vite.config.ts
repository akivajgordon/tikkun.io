/// <reference types="vitest/config" />
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    // *.vitest.ts runs on Vitest in the browser.
    // *.test.ts runs on Ava in Node.
    include: ['**/*.vitest.ts?(x)'],
    includeTaskLocation: true,
    mockReset: true,
    // Headless browser config for CI and non-interactive runs
    // --no-sandbox and --disable-setuid-sandbox are required in Docker/CI environments
    // where Chrome's sandbox cannot run due to missing Linux capabilities
    browser: {
      enabled: true,
      name: 'chromium',
      provider: 'playwright',
      headless: true,
      providerOptions: {
        launch: {
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        },
      },
    },
  },
})
