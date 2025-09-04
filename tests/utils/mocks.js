import { vi } from 'vitest'

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
 * Cleans up global state used by vue-modular plugin
 * Should be called in beforeEach or afterEach hooks
 */
export const cleanupGlobalState = () => {
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
