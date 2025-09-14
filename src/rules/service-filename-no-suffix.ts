import path from 'path'
import { createRule, parseRuleOptions, parseProjectOptions, resolvePath, isIgnored, isTs } from '../utils'
import type { VueModularRuleModule, VueModularRuleContext } from '../types'

const defaultOptions = {
  ignores: ['**/*.d.ts', '**/*.spec.*', '**/*.test.*', '**/*.stories.*'],
}

export const serviceFilenameNoSuffix = createRule<VueModularRuleModule>({
  create(context: VueModularRuleContext) {
    const options = parseRuleOptions(context, defaultOptions)
    const projectOptions = parseProjectOptions(context)
    const filename = resolvePath(context.filename, projectOptions.rootPath, projectOptions.rootAlias)
    if (!filename) return {}
    if (isIgnored(filename, options.ignores)) return {}

    // Only check TypeScript files
    if (!isTs(context.filename)) return {}

    return {
      Program(node) {
        const base = path.basename(context.filename, path.extname(context.filename))

        if (/Service$/i.test(base)) {
          context.report({
            node,
            messageId: 'noServiceSuffix',
            data: { filename: path.basename(context.filename) },
          })
        }
      },
    }
  },
  name: 'service-filename-no-suffix',
  recommended: true,
  level: 'error',
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Service Rules',
      description: 'Service files must not have "Service" suffix (e.g., auth.ts, not authService.ts)',
    },
    defaultOptions: [defaultOptions],
    schema: [
      {
        type: 'object',
        properties: {
          ignores: { type: 'array', items: { type: 'string' } },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      noServiceSuffix: 'Service filename "{{filename}}" should not include the "Service" suffix (use e.g. "auth.ts").',
    },
  },
})
