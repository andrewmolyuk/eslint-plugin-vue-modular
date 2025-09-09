import path from 'path'
import process from 'process'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      reporter: ['lcovonly', 'text'],
      include: ['src/**/*.ts'],
      all: true,
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), 'src'),
    },
  },
})
