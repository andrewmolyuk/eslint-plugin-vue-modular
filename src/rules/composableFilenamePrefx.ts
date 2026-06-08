import { createRule, parseRuleOptions, isIgnored, isTs } from '../utils'
import type { VueModularRuleModule, VueModularRuleContext } from '../types'
import path from 'path'

const defaultOptions = {
  prefix: 'use',
  ignores: ['**/*.d.ts', '**/*.spec.*', '**/*.test.*', '**/*.stories.*'],
}

export const composableFilenamePrefix = createRule<VueModularRuleModule>({
  create(context: VueModularRuleContext) {
    const options = parseRuleOptions(context, defaultOptions)
    if (isIgnored(context.filename, options.ignores)) return {}
    if (!isTs(context.filename)) return {}

    const composablesPattern = /[/\\]composables[/\\]/
    if (!composablesPattern.test(context.filename)) return {}

    return {
      Program(node) {
        const base = path.basename(context.filename)
        const nameWithoutExt = base.replace(/\.[^.]+$/, '')

        if (nameWithoutExt === 'index') return

        if (!nameWithoutExt.startsWith(options.prefix)) {
          context.report({
            node,
            messageId: 'missingPrefix',
            data: { filename: base, prefix: options.prefix },
          })
        }
      },
    }
  },
  name: 'composable-filename-prefix',
  recommended: true,
  level: 'error',
  meta: {
    type: 'suggestion',
    docs: {
      category: 'File Organization',
      description: 'Require composable filenames to start with a prefix (default: "use")',
    },
    schema: [
      {
        type: 'object',
        properties: {
          prefix: { type: 'string' },
          ignores: { type: 'array', items: { type: 'string' } },
        },
        additionalProperties: false,
      },
    ],
    defaultOptions: [defaultOptions],
    messages: {
      missingPrefix: 'Composable filename "{{filename}}" must start with "{{prefix}}" prefix.',
    },
  },
})
