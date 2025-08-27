import { vi } from 'vitest'

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
