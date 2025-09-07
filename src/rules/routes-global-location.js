import fs from 'fs'
import path from 'path'
import { parseRuleOptions, runOnce } from '../utils/rules.js'

const defaultOptions = {
  app: 'src/app',
  routes: 'routes.ts',
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require a global routes file routes.ts in app folder',
      category: 'Best Practices',
      recommended: false,
    },
    defaultOptions: [defaultOptions],
    schema: [
      {
        type: 'object',
        properties: {
          app: { type: 'string' },
          routes: { type: 'string' },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      missingRoutes: "Global routes file '{{routesPath}}' is missing. Add '{{routes}}' to define application routes.",
    },
  },

  create(context) {
    const { app, routes } = parseRuleOptions(context, defaultOptions)

    return {
      Program(node) {
        if (!runOnce('vue-modular/routes-global-location')) return

        const filename = context.getFilename()
        if (!filename || filename === '<input>' || filename === '<text>') return

        const projectRoot = process.cwd()

        const routesPath = path.join(projectRoot, app, routes)
        const exists = fs.existsSync(routesPath)
        if (!exists) {
          context.report({ node, messageId: 'missingRoutes', data: { routesPath, routes } })
        }
      },
    }
  },
}
