/**
 * @fileoverview Ensure each module under src/modules exposes a public API (index.ts/index.js)
 */
import path from 'path'
import fs from 'fs'
import { createCheckedDirsGetter } from '../utils/global-state.js'

const defaultOptions = {
  src: 'src',
  modulesDir: 'modules',
  indexFiles: ['index.ts', 'index.js'],
}

// Create the getCheckedDirs function for this rule
const getCheckedDirs = createCheckedDirsGetter('modulestructure')

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce each module in `src/modules` exposes a public API via an index file',
      category: 'Best Practices',
      recommended: false,
    },
    schema: [
      {
        type: 'object',
        properties: {
          src: { type: 'string', description: 'Path to the source directory (default: src)' },
          modulesDir: { type: 'string', description: 'Name of the modules directory under src' },
          indexFiles: { type: 'array', items: { type: 'string' }, description: 'Allowed index file names for module public API' },
        },
        additionalProperties: false,
      },
    ],
    defaultOptions: [defaultOptions],
    messages: {
      missingModulesDir: 'Project is missing `{{src}}/{{modulesDir}}` directory. Create modules under `{{src}}/{{modulesDir}}`',
      missingIndex: 'Module `{{module}}` is missing a public API file (expected one of: {{indexFiles}})',
    },
  },

  create(context) {
    const checked = getCheckedDirs()
    const options = context.options && context.options[0] ? context.options[0] : {}
    const src = typeof options.src === 'string' && options.src.trim() ? options.src.trim() : defaultOptions.src
    const modulesDirName =
      typeof options.modulesDir === 'string' && options.modulesDir.trim() ? options.modulesDir.trim() : defaultOptions.modulesDir
    const indexFiles = Array.isArray(options.indexFiles) && options.indexFiles.length > 0 ? options.indexFiles : defaultOptions.indexFiles

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
          if (!entries.includes(modulesDirName)) {
            context.report({ loc: { line: 1, column: 0 }, messageId: 'missingModulesDir', data: { src, modulesDir: modulesDirName } })
            return
          }

          const modulesDir = path.join(srcDir, modulesDirName)
          const modules = fs.readdirSync(modulesDir)
          for (const mod of modules) {
            const modPath = path.join(modulesDir, mod)
            try {
              const modEntries = fs.readdirSync(modPath)
              const hasIndex = modEntries.some((f) => indexFiles.includes(f))
              if (!hasIndex) {
                context.report({
                  loc: { line: 1, column: 0 },
                  messageId: 'missingIndex',
                  data: { module: mod, indexFiles: indexFiles.join(', ') },
                })
              }
            } catch {
              // skip non-directories or unreadable module entries
              continue
            }
          }
        } catch {
          // ignore read errors
        }
      },
    }
  },
}
