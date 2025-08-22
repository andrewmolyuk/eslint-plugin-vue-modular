/**
 * @fileoverview Enforce allowed top-level folders and files in the src directory
 */
import path from 'path'
import fs from 'fs'

// Allowed top-level folders and files in src
const defaultOptions = {
  allowed: ['app', 'components', 'composables', 'entities', 'features', 'modules', 'shared', 'main.ts', 'main.js'],
  src: 'src',
}

// Create a session-based cache that resets for each ESLint run
// Use process.hrtime.bigint() to get a unique session identifier
let currentSession = null
let checkedSrcDirs = new Set()

function getSession() {
  // Create a new session based on current time - this ensures we get a fresh session for each ESLint run
  const now = process.hrtime.bigint()
  if (currentSession === null || now - currentSession > 1000000000n) {
    // Reset after 1 second
    currentSession = now
    checkedSrcDirs = new Set()
  }
  return currentSession
}

// Export for testing purposes
export function resetSession() {
  currentSession = null
  checkedSrcDirs = new Set()
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce allowed top-level folders and files in the src directory',
      category: 'Best Practices',
      recommended: false,
    },
    schema: [
      {
        type: 'object',
        properties: {
          allowed: {
            type: 'array',
            description: 'List of allowed top-level folders and files in the src directory',
            items: { type: 'string' },
            uniqueItems: true,
          },
          src: {
            type: 'string',
            description: 'Name of the source directory to check',
          },
        },
        additionalProperties: false,
      },
    ],
    defaultOptions: [
      {
        allowed: defaultOptions.allowed,
        src: defaultOptions.src,
      },
    ],
    messages: {
      notAllowed: "'{{name}}' is not an allowed top-level folder or file in src/. Allowed: {{allowed}}",
    },
  },
  create(context) {
    // Initialize session
    getSession()

    // Get options
    const options = context.options && context.options[0] ? context.options[0] : {}
    const allowed = Array.isArray(options.allowed) && options.allowed.length > 0 ? options.allowed : defaultOptions.allowed
    const src = typeof options.src === 'string' && options.src.trim() ? options.src.trim() : defaultOptions.src

    // Only run if we're in a file within the src directory
    const filename = context.getFilename()
    if (!filename.includes(`${path.sep}${src}${path.sep}`)) {
      return {}
    }

    // Find the src directory path by looking for the src segment in the path
    const srcSegment = `${path.sep}${src}${path.sep}`
    const srcIndex = filename.indexOf(srcSegment)
    if (srcIndex === -1) {
      return {}
    }
    const srcDir = filename.substring(0, srcIndex + srcSegment.length - 1) // Remove trailing separator

    // Only check each src directory once per ESLint session
    if (checkedSrcDirs.has(srcDir)) {
      return {}
    }
    checkedSrcDirs.add(srcDir)

    return {
      Program() {
        try {
          const entries = fs.readdirSync(srcDir)
          for (const entry of entries) {
            if (!allowed.includes(entry)) {
              context.report({
                loc: { line: 1, column: 0 },
                messageId: 'notAllowed',
                data: { name: entry, allowed: allowed.join(', ') },
              })
            }
          }
        } catch (e) {
          // Ignore if srcDir can't be read
        }
      },
    }
  },
}
