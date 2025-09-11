import { createRule, toCamelCase, parseRuleOptions, isIgnored, isTs } from '../utils'
import type { VueModularRuleModule, VueModularRuleContext } from '../types'
import path from 'path'

const defaultOptions = {
  ignores: ['**/*.d.ts', '**/*.spec.*', '**/*.test.*', '**/*.stories.*'],
}

// Rule to enforce camelCase naming for TypeScript files
export const fileTsNaming = createRule<VueModularRuleModule>({
  create(context: VueModularRuleContext) {
    const options = parseRuleOptions(context, defaultOptions)
    if (isIgnored(context.filename, options.ignores)) return {}

    // Only check TypeScript files
    if (!isTs(context.filename)) return {}

    return {
      Program(node) {
        const base = path.basename(context.filename)
        const expected = toCamelCase(base)

        if (base !== expected) {
          context.report({ node, messageId: 'filenameNotCamel', data: { filename: base, expected } })
        }
      },
    }
  },
  name: 'file-ts-naming',
  recommended: true,
  level: 'error',
  meta: {
    type: 'suggestion',
    docs: {
      category: 'File Organization',
      description: 'Require TypeScript filenames to be camelCase',
    },
    schema: [
      {
        type: 'object',
        properties: {
          src: { type: 'string' },
          ignores: { type: 'array', items: { type: 'string' } },
        },
        additionalProperties: false,
      },
    ],
    defaultOptions: [defaultOptions],
    messages: {
      filenameNotCamel: 'TypeScript filename "{{filename}}" should be camelCase (e.g., "{{expected}}").',
    },
  },
})
