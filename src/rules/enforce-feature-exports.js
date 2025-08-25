/**
 * @fileoverview Ensure each global feature under src/features exposes a public API (index.ts/index.js)
 */
import path from 'path'
import fs from 'fs'

const defaultOptions = {
  src: 'src',
  featuresDir: 'features',
  indexFiles: ['index.ts', 'index.js'],
}

const eslintRunId = `${process.pid}_${process.cwd()}_featurestructure`
if (!global.__eslintVueModularState) {
  global.__eslintVueModularState = new Map()
}
function getCheckedDirs() {
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
    type: 'problem',
    docs: {
      description: 'Enforce each global feature in `src/features` exposes a public API via an index file',
      category: 'Best Practices',
      recommended: false,
    },
    schema: [
      {
        type: 'object',
        properties: {
          src: { type: 'string', description: 'Path to the source directory (default: src)' },
          featuresDir: { type: 'string', description: 'Name of the features directory under src' },
          indexFiles: { type: 'array', items: { type: 'string' }, description: 'Allowed index file names for feature public API' },
        },
        additionalProperties: false,
      },
    ],
    defaultOptions: [defaultOptions],
    messages: {
      missingFeaturesDir: 'Project is missing `{{src}}/{{featuresDir}}` directory. Create features under `{{src}}/{{featuresDir}}`',
      missingIndex: 'Feature `{{feature}}` is missing a public API file (expected one of: {{indexFiles}})',
    },
  },

  create(context) {
    const checked = getCheckedDirs()
    const options = context.options && context.options[0] ? context.options[0] : {}
    const src = typeof options.src === 'string' && options.src.trim() ? options.src.trim() : defaultOptions.src
    const featuresDirName =
      typeof options.featuresDir === 'string' && options.featuresDir.trim() ? options.featuresDir.trim() : defaultOptions.featuresDir
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
          if (!entries.includes(featuresDirName)) {
            context.report({ loc: { line: 1, column: 0 }, messageId: 'missingFeaturesDir', data: { src, featuresDir: featuresDirName } })
            return
          }

          const featuresDir = path.join(srcDir, featuresDirName)
          const features = fs.readdirSync(featuresDir)
          for (const feat of features) {
            const featPath = path.join(featuresDir, feat)
            try {
              const featEntries = fs.readdirSync(featPath)
              const hasIndex = featEntries.some((f) => indexFiles.includes(f))
              if (!hasIndex) {
                context.report({
                  loc: { line: 1, column: 0 },
                  messageId: 'missingIndex',
                  data: { feature: feat, indexFiles: indexFiles.join(', ') },
                })
              }
            } catch (e) {
              // skip non-directories or unreadable feature entries
              continue
            }
          }
        } catch (e) {
          // ignore read errors
        }
      },
    }
  },
}
