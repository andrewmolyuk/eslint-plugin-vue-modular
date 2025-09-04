import fs from 'fs'
import path from 'path'
import { parseRuleOptions, runOnce } from '../utils.js'

const defaultOptions = {
  shared: 'shared',
  index: 'index.ts',
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require a shared/ui public API file shared/ui/index.ts when UI components exist',
      category: 'Best Practices',
      recommended: false,
    },
    defaultOptions: [defaultOptions],
    schema: [
      {
        type: 'object',
        properties: {
          shared: { type: 'string' },
          index: { type: 'string' },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      missingIndex:
        "Shared UI folder is missing a public API file '{{indexPath}}' (expected '{{index}}'). Add '{{index}}' to expose shared UI components.",
    },
  },

  create(context) {
    const { shared, index } = parseRuleOptions(context, defaultOptions)

    return {
      Program(node) {
        if (!runOnce('vue-modular/shared-ui-index-required')) return

        const filename = context.getFilename()
        if (!filename || filename === '<input>' || filename === '<text>') return

        const normalized = path.normalize(filename)
        const parts = normalized.split(path.sep)
        const idx = parts.lastIndexOf(shared)
        if (idx === -1) return

        // expect the next segment to be 'ui'
        if (parts[idx + 1] !== 'ui') return

        const sharedUiKey = parts.slice(0, idx + 2).join(path.sep)
        const indexPath = path.join(sharedUiKey, index)
        const exists = fs.existsSync(indexPath)

        if (!exists) {
          context.report({ node, messageId: 'missingIndex', data: { indexPath, index } })
        }
      },
    }
  },
}
