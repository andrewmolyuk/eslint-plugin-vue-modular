import path from 'path'
import { isFileIgnored, isOutsideSrc, isTestFile } from '../utils'
import { parseRuleOptions } from '../utils/rules.js'

const defaultOptions = {
  src: 'src',
  ignore: [],
  suffix: 'Store',
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow store filename suffix (e.g. `Store`) in TypeScript files under src',
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
          suffix: { type: 'string' },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      noSuffix: 'Filename "{{filename}}" must not use the "{{suffix}}" suffix; use "{{expected}}" instead.',
    },
  },

  create(context) {
    const filename = context.getFilename()
    if (!filename) return {}

    const { src, ignore, suffix } = parseRuleOptions(context, defaultOptions)

    if (isTestFile(filename)) return {}
    if (isFileIgnored(filename, ignore)) return {}
    if (isOutsideSrc(filename, src)) return {}

    const { base, name } = path.parse(filename)
    const ext = path.extname(base).toLowerCase()

    if (ext !== '.ts' && ext !== '.tsx') return {}

    return {
      Program(node) {
        if (typeof suffix === 'string' && suffix.length > 0 && name.endsWith(suffix)) {
          const expected = name.slice(0, -suffix.length)
          context.report({ node, messageId: 'noSuffix', data: { filename: base, suffix, expected } })
        }
      },
    }
  },
}
