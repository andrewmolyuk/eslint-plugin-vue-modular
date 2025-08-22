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
    // Get options
    const options = context.options && context.options[0] ? context.options[0] : {}
    const allowed = Array.isArray(options.allowed) && options.allowed.length > 0 ? options.allowed : defaultOptions.allowed
    const src = typeof options.src === 'string' && options.src.trim() ? options.src.trim() : defaultOptions.src

    // Use context.settings to store a static flag for this lint run so we only run it once
    if (!context.settings) context.settings = {}
    const flagKey = `__vue_modular_src_structure_${src}`
    if (context.settings[flagKey]) {
      return {}
    }

    if (context.getFilename().includes(`${path.sep}${src}${path.sep}`)) {
      context.settings[flagKey] = true
      const srcDir = path.resolve(context.getFilename().split(src)[0], src)
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
    }
    return {}
  },
}
