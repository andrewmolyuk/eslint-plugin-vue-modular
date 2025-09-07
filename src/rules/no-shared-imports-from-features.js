import path from 'path'
import { isFileIgnored } from '../legacy_utils.js'
import { parseRuleOptions } from '../utils/rules.js'

const defaultOptions = {
  shared: 'src/shared',
  features: 'src/features',
  views: 'src/views',
  ignore: [],
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description: "Disallow imports from 'features/' or 'views/' inside the shared layer",
      category: 'Best Practices',
      recommended: false,
    },
    defaultOptions: [defaultOptions],
    schema: [
      {
        type: 'object',
        properties: {
          shared: { type: 'string' },
          features: { type: 'string' },
          views: { type: 'string' },
          ignore: { type: 'array', items: { type: 'string' } },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      forbidden: "Shared code must not import from '{{layer}}' (target: '{{target}}').",
    },
  },

  create(context) {
    const { shared, features, views, ignore } = parseRuleOptions(context, defaultOptions)
    // per-file state (avoid mutating context)
    let fileState = null

    return {
      Program() {
        const filename = context.getFilename()
        if (!filename || filename === '<input>' || filename === '<text>') {
          fileState = null
          return
        }

        const normalized = path.normalize(filename)
        const parts = normalized.split(path.sep)
        const sharedIdx = parts.lastIndexOf(shared)
        if (sharedIdx === -1) {
          fileState = null
          return
        }

        // store filename in closure-scoped state
        fileState = { filename }
      },

      ImportDeclaration(node) {
        const state = fileState
        if (!state) return

        const { filename } = state
        const spec = node && node.source && node.source.value
        if (!spec || typeof spec !== 'string') return

        // Resolve relative imports against the current file
        let impPath = spec
        if (impPath.startsWith('.')) {
          impPath = path.join(path.dirname(filename), impPath)
        }

        const impParts = path.normalize(impPath).split(path.sep)

        // check features
        const impFeaturesIdx = impParts.lastIndexOf(features)
        if (impFeaturesIdx !== -1) {
          const targetFeature = impParts[impFeaturesIdx + 1]
          if (targetFeature && !isFileIgnored(targetFeature, ignore)) {
            context.report({ node, messageId: 'forbidden', data: { layer: 'features', target: targetFeature } })
            return
          }
        }

        // check views
        const impViewsIdx = impParts.lastIndexOf(views)
        if (impViewsIdx !== -1) {
          const target = impParts[impViewsIdx + 1] || ''
          if (!isFileIgnored(target, ignore)) {
            context.report({ node, messageId: 'forbidden', data: { layer: 'views', target } })
            return
          }
        }
      },
    }
  },
}
