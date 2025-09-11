import fs from 'fs'
import path from 'path'
import { parseRuleOptions, runOnce, createRule, isIgnored, parseProjectOptions } from '../utils'
import type { VueModularRuleModule } from '../types'

const defaultOptions = {
  ignores: [],
  index: 'index.ts',
}

export const componentsIndexRequired = createRule<VueModularRuleModule>({
  create(context) {
    if (!runOnce('components-index-required')) return {}

    const options = parseRuleOptions(context, defaultOptions)
    const projectOptions = parseProjectOptions(context)

    return {
      Program(node) {
        try {
          const dirs = fs
            .readdirSync(projectOptions.rootPath, { recursive: true })
            .filter((d) => fs.statSync(d).isDirectory())
            .filter((d) => !isIgnored(String(d), options.ignores)) as string[]

          dirs.forEach((dir) => {
            const indexPath = path.join(dir, options.index)
            const isExists = fs.existsSync(indexPath)

            if (!isExists) {
              context.report({
                node,
                messageId: 'missingIndex',
                data: { indexPath: path.relative(process.cwd(), indexPath), index: options.index },
              })
            }
          })
        } catch {
          // ignore fs errors
        }
      },
    }
  },
  name: 'components-index-required',
  recommended: true,
  level: 'error',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require a components/index.ts to expose the components public API',
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
      missingIndex: "Components folder is missing a public API file '{{indexPath}}'. Add '{{index}}' to expose the component public API.",
    },
  },
})
