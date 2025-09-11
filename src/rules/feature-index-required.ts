import fs from 'fs'
import path from 'path'
import { parseRuleOptions, runOnce, createRule, isIgnored, parseProjectOptions } from '../utils'
import type { VueModularRuleModule } from '../types'

const defaultOptions = {
  ignores: [],
  index: 'index.ts',
}

export const featureIndexRequired = createRule<VueModularRuleModule>({
  create(context) {
    if (!runOnce('feature-index-required')) return {}

    const options = parseRuleOptions(context, defaultOptions)
    const projectOptions = parseProjectOptions(context)

    return {
      Program(node) {
        try {
          const dirs = fs
            .readdirSync(projectOptions.featuresPath)
            .filter((d) => fs.statSync(path.join(projectOptions.featuresPath, d)).isDirectory())
            .filter((d) => !isIgnored(d, options.ignores))

          dirs.forEach((dir) => {
            const indexPath = path.join(projectOptions.featuresPath, dir, options.index)
            const isExists = fs.existsSync(indexPath)

            if (!isExists) {
              context.report({
                node,
                messageId: 'missingIndex',
                data: { feature: dir, indexPath: path.relative(process.cwd(), indexPath), index: options.index },
              })
            }
          })
        } catch {
          // ignore fs errors
        }
      },
    }
  },
  name: 'feature-index-required',
  recommended: true,
  level: 'error',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require a feature public API file features/{feature}/index.ts when a feature contains files',
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
      missingIndex:
        "Feature '{{feature}}' is missing a public API file '{{indexPath}}' (expected '{{index}}'). Add '{{index}}' to expose the feature public API.",
    },
  },
})
