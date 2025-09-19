import { describe, it, expect } from 'vitest'
import { createRule } from '../../src/utils/createRule'

describe('createRule utility', () => {
  it('exports a function', () => {
    expect(typeof createRule).toBe('function')
  })

  it('returns a rule object that preserves provided meta and create implementation', () => {
    const ruleName = 'test-rule'
    const createImpl = () => ({})
    const input = {
      name: ruleName,
      meta: {
        docs: {
          category: 'Test',
          description: 'Test description',
          url: 'http://example.com/docs/test-rule',
        },
        type: 'suggestion' as const,
        messages: {
          testMessage: 'This is a test message',
        },
        schema: [],
      },
      defaultOptions: [],
      create: createImpl,
    }

    const rule = createRule(input)

    // meta.docs fields are preserved
    expect(rule.meta).toBeDefined()
    expect(rule.meta?.docs).toBeDefined()
    expect(rule.meta?.docs?.category).toBe('Test')
    expect(rule.meta?.docs?.description).toBe('Test description')
    expect(rule.meta?.docs?.url).toBe('https://github.com/andrewmolyuk/eslint-plugin-vue-modular/blob/main/docs/rules/test-rule.md')
  })
})
