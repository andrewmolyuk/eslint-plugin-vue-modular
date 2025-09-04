import { RuleTester } from 'eslint'
import { vi } from 'vitest'
import plugin from '../src/index.js'

// Create a RuleTester instance with the plugin loaded
export const tester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  plugins: {
    'vue-modular': plugin,
  },
})

// Standard setup function to reset mocks and global state
export const setupTest = () => {
  vi.restoreAllMocks()
  if (global.__eslintVueModularState) {
    delete global.__eslintVueModularState
  }
  if (global.__eslintVueModularRunId) {
    delete global.__eslintVueModularRunId
  }
}
