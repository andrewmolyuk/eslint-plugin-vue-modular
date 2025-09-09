import fs from 'fs'
import path from 'path'
import { isIgnored } from '../legacy_utils.js'
import { parseRuleOptions, runOnce } from '../utils/rules.js'

const defaultOptions = {
  features: 'src/features',
  ignore: [],
  index: 'index.ts',
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require a feature public API file features/{feature}/index.ts when a feature contains files',
      category: 'Best Practices',
      recommended: false,
    },
    defaultOptions: [defaultOptions],
    schema: [
      {
        type: 'object',
        properties: {
          features: { type: 'string' },
          ignore: { type: 'array', items: { type: 'string' } },
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

  create(context) {
    const { features, ignore, index } = parseRuleOptions(context, defaultOptions)

    return {
      Program(node) {
        // run once per eslint execution
        if (!runOnce('vue-modular/feature-index-required')) return

        const filename = context.getFilename()
        if (!filename || filename === '<input>' || filename === '<text>') return

        const normalized = path.normalize(filename)
        const parts = normalized.split(path.sep)
        const idx = parts.lastIndexOf(features)
        if (idx === -1) return

        const featureName = parts[idx + 1]
        if (!featureName) return
        if (isIgnored(featureName, ignore)) return

        const featureKey = parts.slice(0, idx + 2).join(path.sep)
        const indexPath = path.join(featureKey, index)
        const exists = fs.existsSync(indexPath)

        if (!exists) {
          context.report({ node, messageId: 'missingIndex', data: { feature: featureName, indexPath, index } })
        }
      },
    }
  },
}
