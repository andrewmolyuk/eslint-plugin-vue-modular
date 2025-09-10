import { createRule, toCamelCase, parseRuleOptions, isIgnored } from '../utils'
import type { VueModularRuleModule, VueModularRuleContext } from '../types'
import path from 'path'

interface FileTsNamingOptions {
  ignores: string[]
}

const defaultOptions: FileTsNamingOptions = {
  ignores: ['shims-vue.d.ts'],
}

// Rule to enforce camelCase naming for TypeScript files
export const fileTsNaming = createRule<VueModularRuleModule>({
  create(context: VueModularRuleContext) {
    const { ignores } = parseRuleOptions(context)
    if (isIgnored(context.filename, ignores)) return {}

    // Only check TypeScript files
    if (path.extname(context.filename) !== '.ts' && path.extname(context.filename) !== '.tsx') return {}

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
      category: 'Stylistic Issues',
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
      defaultOptions,
    ],
    messages: {
      filenameNotCamel: 'TypeScript filename "{{filename}}" should be camelCase (e.g., "{{expected}}").',
    },
  },
})
