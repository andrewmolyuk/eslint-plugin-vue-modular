/**
 * @fileoverview Ensure the `app/` folder under `src/` follows the blueprint structure
 */
import path from 'node:path'
import fs from 'node:fs'
import { createCheckedDirsGetter, parseRuleOptions, setupSrcDirectoryCheck } from '../utils/global-state.js'

const defaultOptions = {
  src: 'src',
  required: ['router', 'stores', 'layouts', 'App.vue'],
}

// Create the getCheckedDirs function for this rule
const getCheckedDirs = createCheckedDirsGetter('appstructure')

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce the app/ layer structure (router, stores, layouts, App.vue) under src/',
      category: 'Best Practices',
      recommended: false,
    },
    schema: [
      {
        type: 'object',
        properties: {
          src: { type: 'string', description: 'Path to the source directory to check (default: "src")' },
          required: { type: 'array', items: { type: 'string' }, description: 'List of required entries inside the app/ directory' },
        },
        additionalProperties: false,
      },
    ],
    defaultOptions: [defaultOptions],
    messages: {
      missingApp: 'Project is missing `{{src}}/app` directory. Create `{{src}}/app` with required entries: {{required}}',
      missingEntry: 'App folder is missing `{{name}}`. Expected entries: {{required}}',
    },
  },

  create(context) {
    const checked = getCheckedDirs()
    const { src, required } = parseRuleOptions(context, defaultOptions)

    const setup = setupSrcDirectoryCheck(context, src, checked)
    if (!setup) return {}
    const { srcDir } = setup

    return {
      Program() {
        try {
          const entries = fs.readdirSync(srcDir)
          if (!entries.includes('app')) {
            context.report({ loc: { line: 1, column: 0 }, messageId: 'missingApp', data: { src, required: required.join(', ') } })
            return
          }

          const appDir = path.join(srcDir, 'app')
          const appEntries = fs.readdirSync(appDir)
          for (const req of required) {
            if (!appEntries.includes(req)) {
              context.report({ loc: { line: 1, column: 0 }, messageId: 'missingEntry', data: { name: req, required: required.join(', ') } })
            }
          }

          // router index file is optional; do not enforce an index export here
        } catch {
          // ignore read errors
        }
      },
    }
  },
}
