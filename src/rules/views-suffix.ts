import { createRule, parseRuleOptions, parseProjectOptions, resolvePath, isIgnored } from '../utils'
import type { VueModularRuleModule, VueModularRuleContext } from '../types'
import path from 'path'

const defaultOptions = {
  suffix: 'View',
  ignores: [] as string[],
}

export const viewsSuffix = createRule<VueModularRuleModule>({
  create(context: VueModularRuleContext) {
    const options = parseRuleOptions(context, defaultOptions as unknown as Record<string, unknown>) as typeof defaultOptions
    const projectOptions = parseProjectOptions(context)

    const filename = resolvePath(context.filename, projectOptions.rootPath, projectOptions.rootAlias)
    if (!filename) return {}
    if (isIgnored(filename, options.ignores)) return {}

    if (!filename.includes(`/${projectOptions.viewsFolderName}/`)) return {}

    return {
      Program(node) {
        const base = path.basename(filename)
        if (!base.endsWith(`${options.suffix}.vue`)) {
          context.report({ node, messageId: 'invalidSuffix', data: { filename: base } })
        }
      },
    }
  },
  name: 'views-suffix',
  recommended: false,
  level: 'error',
  meta: {
    type: 'suggestion',
    docs: {
      category: 'File Organization',
      description: 'Require view filenames to end with `View.vue`',
    },
    defaultOptions: [defaultOptions],
    schema: [
      {
        type: 'object',
        properties: {
          suffix: { type: 'string' },
          ignores: { type: 'array', items: { type: 'string' } },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      invalidSuffix: 'View filename "{{filename}}" must end with `View.vue`.',
    },
  },
})
