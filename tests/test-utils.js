import { vi } from 'vitest'
import { RuleTester } from 'eslint'
import plugin from '../src/index.js'

/**
 * Common beforeEach setup for ESLint rule tests
 * Restores all mocks and clears global state
 */
export const setupTest = () => {
  vi.restoreAllMocks()
  if (global.__eslintVueModularState) {
    delete global.__eslintVueModularState
  }
}

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

/**
 * Cleans up global state used by vue-modular plugin
 * Should be called in beforeEach or afterEach hooks
 */
export const cleanupGlobalState = () => {
  if (global.__eslintVueModularState) {
    delete global.__eslintVueModularState
  }
}

/**
 * Sets up a fresh RuleTester and cleans global state
 * Use this in beforeEach hooks for consistent test setup
 * @returns {RuleTester} Fresh RuleTester instance
 */
export const setupRuleTester = () => {
  cleanupGlobalState()
  return createRuleTester()
}

/**
 * Setup with custom reset function
 * @param {Function} resetFn - Custom reset function to call
 */
export const setupTestWithReset = (resetFn) => () => {
  vi.restoreAllMocks()
  resetFn()
}

/**
 * Creates a mock ESLint context for testing rules
 * @param {string} filename - The filename to mock (default: '/project/src/App.vue')
 * @param {Array} options - Rule options (default: [{}])
 * @returns {Object} Mock ESLint context
 */
export const createContext = (filename = '/project/src/App.vue', options = [{}]) => ({
  options,
  getFilename: () => filename,
  report: vi.fn(),
  settings: {},
})

/**
 * Helper to run an ESLint rule with a given context
 * @param {Object} rule - The ESLint rule object
 * @param {Object} context - The ESLint context (default: creates new context)
 * @returns {Object} The context after running the rule
 */
export const runRule = (rule, context = createContext()) => {
  const ruleInstance = rule.create(context)
  if (ruleInstance.Program) ruleInstance.Program()
  return context
}

/**
 * Helper to create a rule instance without running it
 * @param {Object} rule - The ESLint rule object
 * @param {Object} context - The ESLint context (default: creates new context)
 * @returns {Object} The rule instance
 */
export const createRuleInstance = (rule, context = createContext()) => {
  return rule.create(context)
}
