import path from 'path'
import { parseRuleOptions, isIgnored } from '../utils'

const defaultOptions = {
  app: 'src/app',
  shared: 'src/shared',
  features: 'src/features',
  ignore: [],
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        "Restrict imports inside the 'app/' layer: app files should only import from 'shared/' and the public API of 'features/'. The app router may import feature route files.",
      category: 'Best Practices',
      recommended: false,
    },
    defaultOptions: [defaultOptions],
    schema: [
      {
        type: 'object',
        properties: {
          app: { type: 'string' },
          shared: { type: 'string' },
          features: { type: 'string' },
          ignore: { type: 'array', items: { type: 'string' } },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      forbiddenOther: "App files may only import from '{{allowed}}' (target: '{{target}}').",
      forbiddenDeepFeature: "App files should import a feature's public API only. Deep import into '{{targetFeature}}' is not allowed.",
    },
  },

  create(context) {
    const { app, shared, features, ignore } = parseRuleOptions(context, defaultOptions)
    // per-file state: avoid mutating context
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
        const appIdx = parts.lastIndexOf(app)
        if (appIdx === -1) {
          fileState = null
          return
        }

        // capture the filename and whether it's the app router
        const base = parts[parts.length - 1] || ''
        const isRouter = base === 'router.ts' || base === 'router.js'

        fileState = { filename, isRouter }
      },

      ImportDeclaration(node) {
        const state = fileState
        if (!state) return

        const { filename, isRouter } = state
        const spec = node && node.source && node.source.value
        if (!spec || typeof spec !== 'string') return

        // resolve relative imports against the current file
        let impPath = spec
        if (impPath.startsWith('.')) {
          impPath = path.join(path.dirname(filename), impPath)
        }

        const impParts = path.normalize(impPath).split(path.sep)

        // If import is from shared, it's allowed
        if (impParts.lastIndexOf(shared) !== -1) return

        // If import is from features, allow public API (features/<feature>) only,
        // unless this is the app router importing feature route files (contains 'routes')
        const impFeaturesIdx = impParts.lastIndexOf(features)
        if (impFeaturesIdx !== -1) {
          const targetFeature = impParts[impFeaturesIdx + 1]
          if (!targetFeature) return
          if (isIgnored(targetFeature, ignore)) return

          const nextSegment = impParts[impFeaturesIdx + 2]
          // deep import (beyond the feature folder)
          if (nextSegment) {
            // allow router to import feature route files (paths that include 'routes')
            const afterFeature = impParts.slice(impFeaturesIdx + 2)
            const includesRoutes = afterFeature.includes('routes') || afterFeature.some((s) => s && s.startsWith('routes'))
            if (isRouter && includesRoutes) return

            // otherwise it's a forbidden deep import
            context.report({ node, messageId: 'forbiddenDeepFeature', data: { targetFeature } })
            return
          }

          // importing the public API of the feature (features/<feature>) is allowed
          return
        }

        // Import is not from shared or features -> forbidden
        const allowed = `${shared}, ${features}`
        const target = impParts[impParts.length - 1] || ''
        if (!isIgnored(target, ignore)) {
          context.report({ node, messageId: 'forbiddenOther', data: { allowed, target } })
        }
      },
    }
  },
}
