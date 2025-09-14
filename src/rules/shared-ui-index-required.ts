import fs from 'fs'
import path from 'path'
import { parseRuleOptions, runOnce, createRule, isIgnored, parseProjectOptions } from '../utils'
import type { VueModularRuleModule } from '../types'

const defaultOptions = {
  ignores: [],
  index: 'index.ts',
}

export const sharedUiIndexRequired = createRule<VueModularRuleModule>({
  create(context) {
    if (!runOnce('shared-ui-index-required')) return {}

    const options = parseRuleOptions(context, defaultOptions)
    const projectOptions = parseProjectOptions(context)

    return {
      Program(node) {
        try {
          const indexPath = path.join(projectOptions.sharedPath, projectOptions.uiFolderName)
          if (isIgnored(indexPath, options.ignores)) return
          const isExists = fs.existsSync(indexPath)

          if (!isExists) {
            context.report({
              node,
              messageId: 'missingIndex',
              data: { indexPath: path.relative(process.cwd(), indexPath), index: options.index },
            })
          }
        } catch {
          // ignore fs errors
        }
      },
    }
  },
  name: 'shared-ui-index-required',
  recommended: true,
  level: 'error',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require a shared UI public API file shared/ui/index.ts when UI components exist',
      category: 'File Organization',
      recommended: false,
    },
    defaultOptions: [defaultOptions],
    schema: [
      {
        type: 'object',
        properties: {
          ignores: { type: 'array', items: { type: 'string' } },
          index: { type: 'string' },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      missingIndex: "Shared UI folder is missing a public API file '{{indexPath}}'. Add '{{index}}' to expose shared UI components.",
    },
  },
})
