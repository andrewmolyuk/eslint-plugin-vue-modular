import { vi } from 'vitest'
import { RuleTester } from 'eslint'
import { minimatch } from 'minimatch'
import plugin from '../src/index.js'

/**
 * Restores all mocks and clears global state
 */
export const resetMocks = () => {
  vi.restoreAllMocks()
  if (global.__eslintVueModularState) {
    delete global.__eslintVueModularState
  }
}

/**
 * Standard test setup function
 * Alias for resetMocks for compatibility
 */
export const setupTest = resetMocks

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

/**
 * Creates test cases for file patterns
 * @param {string|string[]} patterns - Glob patterns for filenames
 * @param {Object} testCase - Base test case template
 * @returns {Array} Generated test cases
 */
export const createPatternTestCases = (patterns, testCase) => {
  const patternArray = Array.isArray(patterns) ? patterns : [patterns]
  return patternArray.map((pattern) => ({
    ...testCase,
    filename: pattern,
  }))
}

/**
 * Validates filename against multiple patterns
 * @param {string} filename - File to check
 * @param {string[]} patterns - Patterns to match against
 * @returns {boolean} True if matches any pattern
 */
export const matchesAnyPattern = (filename, patterns) => {
  return patterns.some((pattern) => minimatch(filename, pattern))
}

/**
 * Creates a mock file system implementation using pattern matching
 * @param {Object} structure - Object mapping glob patterns to file arrays
 * @returns {Function} Mock implementation function
 */
export const createMockFileSystem = (structure) => {
  return (path) => {
    for (const [pattern, files] of Object.entries(structure)) {
      if (minimatch(path, pattern)) {
        return files
      }
    }
    return []
  }
}
