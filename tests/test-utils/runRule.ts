import { vi } from 'vitest'

// Run a rule with the given context
export const runRule = (rule, filename = 'index.js', options = [{}], imports = []) => {
  const opts = Array.isArray(options) ? options : [options || {}]
  const context = {
    options: opts,
    filename,
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
