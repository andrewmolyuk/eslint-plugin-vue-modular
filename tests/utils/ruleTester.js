import { RuleTester } from 'eslint'
import plugin from '../../src/index.js'

/**
 * Creates a configured RuleTester instance for vue-modular plugin tests
 * @returns {RuleTester} Configured RuleTester instance
 */
export const createRuleTester = () => {
  return new RuleTester({
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    plugins: {
      'vue-modular': plugin,
    },
  })
}

export const setupRuleTester = () => {
  // Keep backward compatibility
  return createRuleTester()
}
