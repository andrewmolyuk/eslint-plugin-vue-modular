import path from 'path'
import { parseRuleOptions, isTestFile, isFileIgnored } from '../utils.js'

const defaultOptions = {
  features: 'src/features',
  ignore: [],
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow direct imports from other feature folders (use shared layer or feature public API)',
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
        },
        additionalProperties: false,
      },
    ],
    messages: {
      forbidden:
        "Direct import from another feature '{{targetFeature}}' is not allowed. Import from the feature public API or from 'shared/'.",
    },
  },

  create(context) {
    const { features, ignore } = parseRuleOptions(context, defaultOptions)

    // per-file state (do not mutate `context` directly; it may be non-extensible)
    let fileState = null

    return {
      Program() {
        // compute per-file context needed by ImportDeclaration visitor
        const filename = context.getFilename()
        if (!filename || filename === '<input>' || filename === '<text>') {
          // mark as no-op
          fileState = null
          return
        }
        if (isTestFile(filename)) {
          fileState = null
          return
        }

        const normalized = path.normalize(filename)
        const parts = normalized.split(path.sep)
        const featuresIdx = parts.lastIndexOf(features)
        if (featuresIdx === -1) {
          fileState = null
          return
        }

        const sourceFeature = parts[featuresIdx + 1]
        if (!sourceFeature) {
          fileState = null
          return
        }

        // store sourceFeature and filename in closure-scoped state for ImportDeclaration to use
        fileState = { sourceFeature, filename }
      },

      ImportDeclaration(node) {
        const state = fileState
        if (!state) return

        const { sourceFeature, filename } = state
        const spec = node && node.source && node.source.value
        if (!spec || typeof spec !== 'string') return

        // Resolve relative imports against the current file so './utils' -> absolute path
        let impPath = spec
        if (impPath.startsWith('.')) {
          impPath = path.join(path.dirname(filename), impPath)
        }

        const impParts = path.normalize(impPath).split(path.sep)
        const impFeaturesIdx = impParts.lastIndexOf(features)
        if (impFeaturesIdx === -1) return

        const targetFeature = impParts[impFeaturesIdx + 1]
        if (!targetFeature) return

        // skip reporting for ignored target features
        if (isFileIgnored(targetFeature, ignore)) return

        if (targetFeature !== sourceFeature) {
          context.report({ node, messageId: 'forbidden', data: { targetFeature } })
        }
      },
    }
  },
}
