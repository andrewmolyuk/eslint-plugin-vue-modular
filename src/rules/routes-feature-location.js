import fs from 'fs'
import path from 'path'
import { parseRuleOptions, runOnce } from '../utils/rules.js'

const defaultOptions = {
  features: 'src/features',
  views: 'views',
  routes: 'routes.ts',
  viewSuffix: 'View',
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require a feature-level routes file (features/{feature}/routes.ts) when the feature contains view components',
      category: 'Best Practices',
      recommended: false,
    },
    defaultOptions: [defaultOptions],
    schema: [
      {
        type: 'object',
        properties: {
          features: { type: 'string' },
          views: { type: 'string' },
          routes: { type: 'string' },
          viewSuffix: { type: 'string' },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      missingRoutes:
        "Feature '{{feature}}' contains view components but is missing a routes file '{{routesPath}}' (expected '{{routes}}'). Add '{{routes}}' to define feature routes.",
    },
  },

  create(context) {
    const { features, views, routes, viewSuffix } = parseRuleOptions(context, defaultOptions)

    return {
      Program(node) {
        // run once per eslint execution
        if (!runOnce('vue-modular/routes-feature-location')) return

        const filename = context.getFilename()
        if (!filename || filename === '<input>' || filename === '<text>') return

        const normalized = path.normalize(filename)
        const parts = normalized.split(path.sep)
        const idx = parts.lastIndexOf(features)
        if (idx === -1) return

        const featureName = parts[idx + 1]
        if (!featureName) return

        const featureKey = parts.slice(0, idx + 2).join(path.sep)

        // check whether the feature contains a views folder with *View.vue files
        const viewsDir = path.join(featureKey, views)
        try {
          if (!fs.existsSync(viewsDir)) return

          const files = fs.readdirSync(viewsDir)
          let suffix = 'View.vue'
          if (typeof viewSuffix === 'string') {
            // accept either 'View' or 'View.vue' from config
            suffix = viewSuffix.endsWith('.vue') ? viewSuffix : `${viewSuffix}.vue`
          }
          const hasView = files.some((f) => f.endsWith(suffix))
          if (!hasView) return
        } catch {
          return
        }

        // ensure routes file exists
        const routesPath = path.join(featureKey, routes)
        const exists = fs.existsSync(routesPath)
        if (!exists) {
          context.report({ node, messageId: 'missingRoutes', data: { feature: featureName, routesPath, routes } })
        }
      },
    }
  },
}
