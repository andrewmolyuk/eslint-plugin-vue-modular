import { createRule, parseRuleOptions, isIgnored, isComponent, parseProjectOptions } from '../utils'
import type { VueModularRuleModule, VueModularRuleContext } from '../types'
import { parse } from '@vue/compiler-sfc'

const defaultOptions = {
  ignores: [''],
}

//
export const sfcRequired = createRule<VueModularRuleModule>({
  create(context: VueModularRuleContext) {
    const options = parseRuleOptions(context, defaultOptions)
    if (isIgnored(context.filename, options.ignores)) return {}

    const projectOptions = parseProjectOptions(context)

    // Only check Component files
    if (!isComponent(context.filename, projectOptions.rootPath, projectOptions.rootAlias, projectOptions.componentsFolderName)) return {}

    return {
      Program(node) {
        const { descriptor } = parse(context.sourceCode.text)
        const hasTemplate = !!descriptor.template
        const hasScript = !!descriptor.script || !!descriptor.scriptSetup

        if (!hasTemplate && !hasScript) {
          context.report({
            node,
            messageId: 'missingSfcBlock',
            data: { name: context.filename },
          })
        }
      },
    }
  },
  name: 'sfc-required',
  recommended: true,
  level: 'warn',
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Component Rules',
      description: 'Require Single File Component structure for Vue components',
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
      missingSfcBlock: 'Vue file "{{name}}" should contain at least a <template> or a <script> block.',
    },
  },
})
