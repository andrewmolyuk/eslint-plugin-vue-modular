/**
 * @fileoverview Prevent excessive folder nesting in modules and features
 * @author andrewmolyuk
 */

import path from 'path'

const DEFAULT_MAX_DEPTH = 3
const DEFAULT_PATHS = ['modules', 'features']

/**
 * Calculates the nesting depth within a specific base path
 * @param {string} filePath - The full file path
 * @param {string} basePath - The base path to calculate depth from (e.g., 'modules', 'features')
 * @returns {number} The nesting depth
 */
function calculateNestingDepth(filePath, basePath) {
  const normalizedPath = path.normalize(filePath)
  const parts = normalizedPath.split(path.sep)

  // Find the base path index (e.g., 'modules' or 'features')
  const baseIndex = parts.findIndex((part) => part === basePath)
  if (baseIndex === -1) return 0

  // Count segments after the base path, excluding the filename
  const pathAfterBase = parts.slice(baseIndex + 1)
  const filename = pathAfterBase[pathAfterBase.length - 1]

  // If it's a file, exclude the filename from depth calculation
  if (filename && filename.includes('.')) {
    return Math.max(0, pathAfterBase.length - 1)
  }

  return pathAfterBase.length
}

/**
 * Checks if a file path violates nesting rules
 * @param {string} filePath - The file path to check
 * @param {Object} options - Rule options
 * @returns {Object|null} Violation details or null if valid
 */
function checkNestingViolation(filePath, options) {
  const { maxDepth, paths } = options

  for (const basePath of paths) {
    const depth = calculateNestingDepth(filePath, basePath)

    if (depth > maxDepth) {
      return {
        basePath,
        actualDepth: depth,
        maxDepth,
        violation: true,
      }
    }
  }

  return null
}

/**
 * Generates suggestion for reducing nesting depth
 * @param {string} filePath - The problematic file path
 * @param {string} basePath - The base path where violation occurred
 * @param {number} maxDepth - Maximum allowed depth
 * @returns {string} Suggestion message
 */
function generateSuggestion(filePath, basePath, maxDepth) {
  const parts = filePath.split(path.sep)
  const baseIndex = parts.findIndex((part) => part === basePath)

  if (baseIndex === -1) return 'Consider flattening the directory structure'

  const pathAfterBase = parts.slice(baseIndex + 1)
  const moduleName = pathAfterBase[0]

  if (basePath === 'modules') {
    return `Consider extracting nested functionality into separate services or components within the ${moduleName} module`
  }

  if (basePath === 'features') {
    return `Consider breaking down the ${moduleName} feature into smaller, more focused features`
  }

  return `Consider restructuring to stay within ${maxDepth} levels of nesting`
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prevent excessive folder nesting in modules and features',
      category: 'Best Practices',
      recommended: false,
    },
    fixable: null,
    defaultOptions: [
      {
        maxDepth: DEFAULT_MAX_DEPTH,
        paths: DEFAULT_PATHS,
      },
    ],
    schema: [
      {
        type: 'object',
        properties: {
          maxDepth: {
            type: 'integer',
            minimum: 1,
            description: 'Maximum allowed nesting depth',
          },
          paths: {
            type: 'array',
            items: {
              type: 'string',
            },
            description: 'Base paths to check for nesting violations',
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      deepNesting: 'Excessive nesting detected in {{basePath}}: {{actualDepth}} levels (max: {{maxDepth}}). {{suggestion}}',
    },
  },

  create(context) {
    const options = context.options[0] || {}
    const maxDepth = options.maxDepth || DEFAULT_MAX_DEPTH
    const paths = options.paths || DEFAULT_PATHS

    return {
      Program(node) {
        const filePath = context.getFilename()

        // Skip if not in project source
        if (!filePath.includes('/src/')) {
          return
        }

        const violation = checkNestingViolation(filePath, { maxDepth, paths })

        if (violation) {
          const suggestion = generateSuggestion(filePath, violation.basePath, maxDepth)

          context.report({
            node,
            messageId: 'deepNesting',
            data: {
              basePath: violation.basePath,
              actualDepth: violation.actualDepth,
              maxDepth: violation.maxDepth,
              suggestion,
            },
          })
        }
      },
    }
  },
}
