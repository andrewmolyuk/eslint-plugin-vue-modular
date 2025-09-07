import fs from 'fs'
import path from 'path'
import { isFileIgnored } from '../utils.js'
import { parseRuleOptions, runOnce } from '../utils/rules.js'

const defaultOptions = {
  components: 'components',
  ignore: [],
  index: 'index.ts',
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require a components public API file components/{parent}/index.ts when a components folder contains files',
      category: 'Best Practices',
      recommended: false,
    },
    defaultOptions: [defaultOptions],
    schema: [
      {
        type: 'object',
        properties: {
          components: { type: 'string' },
          ignore: { type: 'array', items: { type: 'string' } },
          index: { type: 'string' },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      missingIndex:
        "Components folder '{{parent}}' is missing a public API file '{{indexPath}}' (expected '{{index}}'). Add '{{index}}' to expose the components public API.",
    },
  },

  create(context) {
    const { components, ignore, index } = parseRuleOptions(context, defaultOptions)

    return {
      Program(node) {
        if (!runOnce('vue-modular/components-index-required')) return

        const filename = context.getFilename()
        if (!filename || filename === '<input>' || filename === '<text>') return

        const normalized = path.normalize(filename)
        const parts = normalized.split(path.sep)
        const idx = parts.lastIndexOf(components)
        if (idx === -1) return

        const parentName = parts[idx - 1]
        if (!parentName) return
        if (isFileIgnored(parentName, ignore)) return

        const componentsKey = parts.slice(0, idx + 1).join(path.sep)
        const indexPath = path.join(componentsKey, index)
        const exists = fs.existsSync(indexPath)

        if (!exists) {
          context.report({ node, messageId: 'missingIndex', data: { parent: parentName, indexPath, index } })
        }
      },
    }
  },
}
