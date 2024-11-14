/// <reference types="vitest/config" />
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    // *.vitest.ts runs on Vitest in the browser.
    // *.test.ts runs on Ava in Node.
    include: ['**/*.vitest.ts?(x)'],
    includeTaskLocation: true,
    mockReset: true,
  },
})
