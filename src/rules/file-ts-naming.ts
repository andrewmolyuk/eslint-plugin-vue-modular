import { createRule } from '../utils/createRule'
import type { VueModularRuleModule, VueModularRuleContext } from '../types'
import { parseRuleOptions } from '../utils/parseRuleOptions'
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
    return {
      Program(node) {
        // Read options per-invocation to respect RuleTester per-case options
        const opts = (parseRuleOptions(context) || {}) as { ignores?: string[] }
        const ignores: string[] = opts.ignores ?? defaultOptions.ignores

        // Determine filename per-invocation
        const filename = context.getFilename ? context.getFilename() : ''
        const base = filename ? path.basename(filename) : ''

        // Only check TypeScript files
        if (!base || !/\.tsx?$/.test(base)) return

        // Respect ignores
        if (ignores.includes(base)) return

        const nameWithoutExt = base.replace(/\.[^.]+$/, '')

        // Expected camelCase from dashed/underscored or PascalCase
        const parts = nameWithoutExt.split(/[-_]/)
        const expected = parts
          .map((p, i) => (i === 0 ? p.charAt(0).toLowerCase() + p.slice(1) : p.charAt(0).toUpperCase() + p.slice(1)))
          .join('')

        if (nameWithoutExt !== expected) {
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
      filenameNotCamel: 'TypeScript filename "{{filename}}" should be camelCase (e.g., "{{expected}}.ts").',
    },
  },
})
