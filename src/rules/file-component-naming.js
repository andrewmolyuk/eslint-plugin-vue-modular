import path from 'path'
import { toPascalCase, isComponent, isIgnored, isOutsideSrc } from '../legacy_utils.js'
import { parseRuleOptions } from '../utils/rules.js'

const defaultOptions = {
  src: 'src', // Base source directory
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

    if (!isComponent(filename)) return {}
    if (isIgnored(filename, ignore)) return {}
    if (isOutsideSrc(filename, src)) return {}

    return {
      Program(node) {
        const { base, name } = path.parse(filename)
        const expected = toPascalCase(name)

        if (name !== expected) {
          context.report({ node, messageId: 'filenameNotPascal', data: { filename: base, expected } })
        }
      },
    }
  },
}
