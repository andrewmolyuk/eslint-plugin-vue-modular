/**
 * @fileoverview Ensure the `app/` folder under `src/` follows the blueprint structure
 */
import path from 'path'
import fs from 'fs'

const defaultOptions = {
  src: 'src',
  required: ['router', 'stores', 'layouts', 'App.vue'],
}

// reuse global run state from enforce-src-structure rule
const eslintRunId = `${process.pid}_${process.cwd()}_appstructure`
if (!global.__eslintVueModularState) {
  global.__eslintVueModularState = new Map()
}
function getCheckedDirs() {
  // Ensure the global map exists (tests may delete it between runs)
  if (!global.__eslintVueModularState) {
    global.__eslintVueModularState = new Map()
  }
  if (!global.__eslintVueModularState.has(eslintRunId)) {
    global.__eslintVueModularState.set(eslintRunId, new Set())
  }
  return global.__eslintVueModularState.get(eslintRunId)
}

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
    const options = context.options && context.options[0] ? context.options[0] : {}
    const src = typeof options.src === 'string' && options.src.trim() ? options.src.trim() : defaultOptions.src
    const required = Array.isArray(options.required) && options.required.length > 0 ? options.required : defaultOptions.required

    const filename = context.getFilename()
    if (!filename.includes(`${path.sep}${src}${path.sep}`)) {
      return {}
    }

    const srcSegment = `${path.sep}${src}${path.sep}`
    const srcIndex = filename.indexOf(srcSegment)
    if (srcIndex === -1) return {}
    const srcDir = filename.substring(0, srcIndex + srcSegment.length - 1)

    if (checked.has(srcDir)) return {}
    checked.add(srcDir)

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
