import { vi } from 'vitest'

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
