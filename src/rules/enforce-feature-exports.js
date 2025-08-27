/**
 * @fileoverview Ensure each global feature under src/features exposes a public API (index.ts/index.js)
 */
import path from 'node:path'
import fs from 'node:fs'
import { createCheckedDirsGetter, parseRuleOptions } from '../utils/global-state.js'

const defaultOptions = {
  src: 'src',
  featuresDir: 'features',
  indexFiles: ['index.ts', 'index.js'],
}

// Create the getCheckedDirs function for this rule
const getCheckedDirs = createCheckedDirsGetter('featurestructure')

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
      missingIndex: 'Feature `{{feature}}` is missing a public API file (expected one of: {{indexFiles}})',
    },
  },

  create(context) {
    const checked = getCheckedDirs()
    const { src, featuresDir, indexFiles } = parseRuleOptions(context, defaultOptions)

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
          if (!entries.includes(featuresDir)) {
            // features directory is optional; do not report an error when absent
            return
          }

          const featuresDirPath = path.join(srcDir, featuresDir)
          const features = fs.readdirSync(featuresDirPath)
          for (const feat of features) {
            const featPath = path.join(featuresDirPath, feat)
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
            } catch {
              // skip non-directories or unreadable feature entries
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
