import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      reporter: ['lcovonly', 'text'],
      include: ['src/**/*.js'],
      // exclude: ['**/tests/**', 'examples/**', 'node_modules/**'],
      // Report on all matched files, even if not imported during tests
      all: true,
    },
  },
})
