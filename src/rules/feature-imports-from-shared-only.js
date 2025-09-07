import path from 'path'
import { isTestFile, isFileIgnored } from '../legacy_utils.js'
import { parseRuleOptions } from '../utils/rules.js'

const defaultOptions = {
  features: 'src/features',
  ignore: [],
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description: "Features may only import from the 'shared/' layer (no imports from other features)",
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
      forbidden: "Features must import shared code only. Importing from feature '{{targetFeature}}' is not allowed.",
    },
  },

  create(context) {
    const { features, ignore } = parseRuleOptions(context, defaultOptions)
    // per-file state: don't mutate context (it may be non-extensible)
    let fileState = null

    return {
      Program() {
        const filename = context.getFilename()
        if (!filename || filename === '<input>' || filename === '<text>') {
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

        fileState = { sourceFeature, filename }
      },

      ImportDeclaration(node) {
        const state = fileState
        if (!state) return

        const { sourceFeature, filename } = state
        const spec = node && node.source && node.source.value
        if (!spec || typeof spec !== 'string') return

        // resolve relative imports
        let impPath = spec
        if (impPath.startsWith('.')) {
          impPath = path.join(path.dirname(filename), impPath)
        }

        const impParts = path.normalize(impPath).split(path.sep)
        const impFeaturesIdx = impParts.lastIndexOf(features)
        if (impFeaturesIdx === -1) return // not importing from features/

        const targetFeature = impParts[impFeaturesIdx + 1]
        if (!targetFeature) return

        if (isFileIgnored(targetFeature, ignore)) return

        // importing from another feature (including its public API) is forbidden
        if (targetFeature !== sourceFeature) {
          context.report({ node, messageId: 'forbidden', data: { targetFeature } })
        }
      },
    }
  },
}
