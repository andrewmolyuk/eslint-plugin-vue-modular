import { createRule, toPascalCase, parseRuleOptions, isIgnored, isComponent, parseProjectOptions } from '../utils'
import type { VueModularRuleModule, VueModularRuleContext } from '../types'
import path from 'path'

const defaultOptions = {
  ignores: ['**/*.spec.*', '**/*.test.*', '**/*.stories.*'],
}

// Rule to enforce camelCase naming for TypeScript files
export const fileComponentNaming = createRule<VueModularRuleModule>({
  create(context: VueModularRuleContext) {
    const options = parseRuleOptions(context, defaultOptions)
    if (isIgnored(context.filename, options.ignores)) return {}

    const projectOptions = parseProjectOptions(context)

    // Only check Component files
    if (!isComponent(context.filename, projectOptions.rootPath, projectOptions.rootAlias, projectOptions.componentsFolderName)) return {}

    return {
      Program(node) {
        const base = path.basename(context.filename)
        const expected = toPascalCase(base)

        if (base !== expected) {
          context.report({ node, messageId: 'filenameNotPascal', data: { filename: base, expected } })
        }
      },
    }
  },
  name: 'file-component-naming',
  recommended: true,
  level: 'error',
  meta: {
    type: 'suggestion',
    docs: {
      category: 'File Organization',
      description: 'Require component filenames to be PascalCase',
    },
    schema: [
      {
        type: 'object',
        properties: {
          ignores: { type: 'array', items: { type: 'string' } },
        },
        additionalProperties: false,
      },
    ],
    defaultOptions: [defaultOptions],
    messages: {
      filenameNotPascal: 'Component filename "{{filename}}" should be PascalCase (e.g., "{{expected}}").',
    },
  },
})
