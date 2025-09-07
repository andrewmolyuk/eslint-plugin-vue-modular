import path from 'path'
import { toCamelCase, isFileIgnored, isOutsideSrc, isTestFile } from '../legacy_utils.js'
import { parseRuleOptions } from '../utils/rules.js'

const defaultOptions = {
  src: 'src',
  ignore: [],
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require TypeScript filenames to be camelCase',
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
      filenameNotCamel: 'TypeScript filename "{{filename}}" should be camelCase (e.g., "{{expected}}.ts").',
    },
  },

  create(context) {
    const filename = context.getFilename()
    if (!filename) return {}

    const { src, ignore } = parseRuleOptions(context, defaultOptions)

    if (isTestFile(filename)) return {}
    if (isFileIgnored(filename, ignore)) return {}
    if (isOutsideSrc(filename, src)) return {}

    const { base, name } = path.parse(filename)
    const ext = path.extname(base).toLowerCase()

    // Only check .ts and .tsx files
    if (ext !== '.ts' && ext !== '.tsx') return {}

    return {
      Program(node) {
        const expected = toCamelCase(name)
        if (name !== expected) {
          context.report({ node, messageId: 'filenameNotCamel', data: { filename: base, expected } })
        }
      },
    }
  },
}
