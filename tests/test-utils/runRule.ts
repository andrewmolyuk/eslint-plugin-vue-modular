import { vi } from 'vitest'

// Run a rule with the given context
export const runRule = (rule, filename = 'index.js', options = [{}]) => {
  const opts = Array.isArray(options) ? options : [options || {}]
  const context = {
    options: opts,
    filename,
    report: vi.fn(),
    settings: {},
  }
  const ruleInstance = rule.create(context)
  if (ruleInstance.Program) ruleInstance.Program()

  return context
}
