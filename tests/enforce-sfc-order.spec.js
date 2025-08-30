import { test, expect } from 'vitest'
import rule from '../src/rules/enforce-sfc-order.js'

// Test the rule logic directly since ESLint RuleTester doesn't work well with SFC content
test('enforce-sfc-order', () => {
  // Mock context for testing
  const createMockContext = (sourceText, filename = 'Component.vue', order = ['script', 'template', 'style']) => ({
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
    options: [{ order }],
  })

  // Test helper to check if rule reports errors
  const testRule = (sourceText, filename = 'Component.vue', order) => {
    const errors = []
    const context = {
      ...createMockContext(sourceText, filename, order),
      report: (error) => errors.push(error),
    }

    const visitor = rule.create(context)
    if (visitor.Program) {
      visitor.Program()
    }

    return errors
  }

  // Valid cases - script-first order (default)
  expect(testRule('// not vue file', 'script.js')).toHaveLength(0)

  const validSfc1 = `<script>
export default { name: 'Test' }
</script>

<template>
  <div>Hello</div>
</template>

<style>
.hello { color: red; }
</style>`
  expect(testRule(validSfc1)).toHaveLength(0)

  const validSfc2 = `<script setup>
const msg = 'Hello'
</script>

<template>
  <div>Hello</div>
</template>`
  expect(testRule(validSfc2)).toHaveLength(0)

  const validSfc3 = `<script>
export default { name: 'Test' }
</script>

<template>
  <div>Hello</div>
</template>`
  expect(testRule(validSfc3)).toHaveLength(0)

  // Valid case - template-first order
  const validSfc4 = `<template>
  <div>Hello</div>
</template>

<script>
export default { name: 'Test' }
</script>

<style>
.hello { color: red; }
</style>`
  expect(testRule(validSfc4, 'Component.vue', ['template', 'script', 'style'])).toHaveLength(0)

  // Valid case - only script
  const validSfc5 = `<script>
export default { name: 'Test' }
</script>`
  expect(testRule(validSfc5)).toHaveLength(0)

  // Valid case - only template
  const validSfc6 = `<template>
  <div>Hello</div>
</template>`
  expect(testRule(validSfc6)).toHaveLength(0)

  // Invalid cases
  const invalidSfc1 = `<style>
.hello { color: red; }
</style>`
  const missingRequiredErrors = testRule(invalidSfc1)
  expect(missingRequiredErrors).toHaveLength(1)
  expect(missingRequiredErrors[0].messageId).toBe('missingRequiredBlock')

  const invalidSfc2 = `<template>
  <div>Hello</div>
</template>

<script>
export default { name: 'Test' }
</script>

<style>
.hello { color: red; }
</style>`
  const wrongOrderErrors = testRule(invalidSfc2) // template before script with script-first order
  expect(wrongOrderErrors).toHaveLength(1)
  expect(wrongOrderErrors[0].messageId).toBe('wrongOrder')

  const invalidSfc3 = `<script>
export default { name: 'Test' }
</script>

<style>
.hello { color: red; }
</style>

<template>
  <div>Hello</div>
</template>`
  const styleNotLastErrors = testRule(invalidSfc3)
  expect(styleNotLastErrors).toHaveLength(1)
  expect(styleNotLastErrors[0].messageId).toBe('styleNotLast')
})
