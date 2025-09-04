/**
 * Enforce PascalCase filenames for Vue component files
 */

import { toPascalCase } from '../utils'
import { minimatch } from 'minimatch'
import path from 'path'
import { parseRuleOptions } from '../utils/global-state'

const defaultOptions = {
  src: 'src', // Base source directory to enforce the rule in
  ignore: [], // Array of glob patterns to ignore
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require Vue component filenames to be PascalCase',
      category: 'Stylistic Issues',
      recommended: false,
    },
    defaultOptions: [defaultOptions],
    schema: [
      {
        type: 'object',
        properties: {
          src: { type: 'string' },
          ignore: { type: 'array', items: { type: 'string' } },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      filenameNotPascal: 'Component filename "{{filename}}" should be PascalCase (e.g., "{{expected}}.vue").',
    },
  },

  create(context) {
    const filename = context.getFilename()
    const { src, ignore } = parseRuleOptions(context, defaultOptions)

    if (!filename || !filename.endsWith('.vue')) {
      return {}
    }

    // Skip ignored patterns (match against absolute and project-relative paths)
    const rel = path.relative(process.cwd(), filename)
    const isIgnored = ignore.some((pattern) => minimatch(filename, pattern) || minimatch(rel, pattern))
    if (isIgnored) return {}

    // If src option is provided, only apply inside that folder
    if (src) {
      const parts = rel.split(path.sep)
      if (!parts.includes(src)) return {}
    }

    return {
      Program(node) {
        const base = filename.split('/').pop()
        const name = base.replace(/\.vue$/i, '')
        const expected = toPascalCase(name)

        if (name !== expected) {
          context.report({ node, messageId: 'filenameNotPascal', data: { filename: base, expected } })
        }
      },
    }
  },
}
