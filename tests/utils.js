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

// Run a rule with the given context
export const runRule = (rule, filename = 'index.js', options = [{}], imports = []) => {
  const opts = Array.isArray(options) ? options : [options || {}]
  const context = {
    options: opts,
    getFilename: () => filename,
    report: vi.fn(),
    settings: {},
  }
  const ruleInstance = rule.create(context)
  if (ruleInstance.Program) ruleInstance.Program()

  // If tests provided an `imports` array, synthesize minimal ImportDeclaration nodes
  const importsArr = Array.isArray(imports) ? imports : []
  if (Array.isArray(importsArr) && ruleInstance.ImportDeclaration) {
    for (const imp of importsArr) {
      // create a minimal node similar to ESTree ImportDeclaration
      const node = { source: { value: imp } }
      ruleInstance.ImportDeclaration(node)
    }
  }
  return context
}
