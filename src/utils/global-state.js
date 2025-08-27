/**
 * Shared utility for managing global ESLint run state across rules
 * This prevents duplicate directory checking within the same ESLint run
 */

/**
 * Creates a function to get checked directories for a specific rule
 * @param {string} ruleName - Unique identifier for the rule (e.g., 'appstructure', 'featurestructure')
 * @returns {Function} Function that returns the Set of checked directories for this rule
 */
export function createCheckedDirsGetter(ruleName) {
  const eslintRunId = `${process.pid}_${process.cwd()}_${ruleName}`

  // Initialize global state if needed
  if (!global.__eslintVueModularState) {
    global.__eslintVueModularState = new Map()
  }

  return function getCheckedDirs() {
    // Ensure the global map exists (tests may delete it between runs)
    if (!global.__eslintVueModularState) {
      global.__eslintVueModularState = new Map()
    }
    if (!global.__eslintVueModularState.has(eslintRunId)) {
      global.__eslintVueModularState.set(eslintRunId, new Set())
    }
    return global.__eslintVueModularState.get(eslintRunId)
  }
}
