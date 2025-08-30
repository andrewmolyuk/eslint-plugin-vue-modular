import { test, expect } from 'vitest'
import rule from '../src/rules/enforce-sfc-order.js'

// Test the rule logic directly since ESLint RuleTester doesn't work well with SFC content
test('enforce-sfc-order', () => {
  // Mock context for testing
  const createMockContext = (sourceText, filename = 'Component.vue') => ({
    getSourceCode: () => ({
      getText: () => sourceText,
      getLocFromIndex: (index) => {
        const lines = sourceText.substring(0, index).split('\n')
        return {
          line: lines.length,
          column: lines[lines.length - 1].length,
        }
      },
    }),
    getFilename: () => filename,
    report: () => {}, // Will be overridden in tests
    options: [{ order: ['template', 'script', 'style'] }],
  })

  // Test helper to check if rule reports errors
  const testRule = (sourceText, filename = 'Component.vue') => {
    const errors = []
    const context = {
      ...createMockContext(sourceText, filename),
      report: (error) => errors.push(error),
    }

    const visitor = rule.create(context)
    if (visitor.Program) {
      visitor.Program()
    }

    return errors
  }

  // Valid cases
  expect(testRule('// not vue file', 'script.js')).toHaveLength(0)

  const validSfc1 = `<template>
  <div>Hello</div>
</template>

<script>
export default { name: 'Test' }
</script>

<style>
.hello { color: red; }
</style>`
  expect(testRule(validSfc1)).toHaveLength(0)

  const validSfc2 = `<template>
  <div>Hello</div>
</template>

<script setup>
const msg = 'Hello'
</script>`
  expect(testRule(validSfc2)).toHaveLength(0)

  const validSfc3 = `<template>
  <div>Hello</div>
</template>`
  expect(testRule(validSfc3)).toHaveLength(0)

  // Invalid cases
  const invalidSfc1 = `<script>
export default { name: 'Test' }
</script>

<style>
.hello { color: red; }
</style>`
  const noTemplateErrors = testRule(invalidSfc1)
  expect(noTemplateErrors).toHaveLength(1)
  expect(noTemplateErrors[0].messageId).toBe('missingTemplate')

  const invalidSfc2 = `<script>
export default { name: 'Test' }
</script>

<template>
  <div>Hello</div>
</template>`
  const wrongOrderErrors = testRule(invalidSfc2)
  expect(wrongOrderErrors).toHaveLength(1)
  expect(wrongOrderErrors[0].messageId).toBe('missingTemplate') // Template exists but not first

  const invalidSfc3 = `<template>
  <div>Hello</div>
</template>

<style>
.hello { color: red; }
</style>

<script>
export default { name: 'Test' }
</script>`
  const styleBeforeScriptErrors = testRule(invalidSfc3)
  expect(styleBeforeScriptErrors).toHaveLength(1)
  expect(styleBeforeScriptErrors[0].messageId).toBe('wrongOrder')
})
