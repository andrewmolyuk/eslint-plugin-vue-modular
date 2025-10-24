import { createRule, parseRuleOptions, isIgnored, isComponent, parseProjectOptions } from '../utils'
import type { VueModularRuleModule, VueModularRuleContext } from '../types'
import { parse } from '@vue/compiler-sfc'

const defaultOptions = {
  order: ['script', 'template', 'style'],
  ignores: [''],
}

//
export const sfcOrder = createRule<VueModularRuleModule>({
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

        // If no script and no template, this rule does not enforce anything
        if (!hasTemplate && !hasScript) return {}

        const blocks = []
        // script / scriptSetup
        if (descriptor.script) blocks.push({ type: 'script', pos: descriptor.script.loc.start.offset })
        if (descriptor.scriptSetup) blocks.push({ type: 'script', pos: descriptor.scriptSetup.loc.start.offset })

        // template
        if (descriptor.template) blocks.push({ type: 'template', pos: descriptor.template.loc.start.offset })

        // styles (multiple)
        for (const s of descriptor.styles) {
          blocks.push({ type: 'style', pos: s.loc.start.offset })
        }

        // Sort by position to get actual order
        blocks.sort((a, b) => a.pos - b.pos)
        const actual = blocks.map((b) => b.type)

        // Determine expected order from options, but keep only known block types
        const optsOrder = Array.isArray(options.order) && options.order.length > 0 ? options.order : defaultOptions.order
        const expected = optsOrder.filter((t) => ['script', 'template', 'style'].includes(t))

        // Validate that the sequence of actual blocks follows the relative order defined in expected.
        // Missing blocks are allowed; only the relative order among present blocks is checked.
        const presentExpected = expected.filter((t) => actual.includes(t))
        const actualFiltered = actual.filter((t) => presentExpected.includes(t))

        const ok = presentExpected.every((type, idx) => actualFiltered[idx] === type)

        if (!ok) {
          const actualOrder = actual.join(', ')
          const expectedStr = expected.map((t) => `<${t}>`).join(', ')
          context.report({ node, messageId: 'wrongOrder', data: { order: actualOrder, expected: expectedStr } })
        }
      },
    }
  },
  name: 'sfc-order',
  recommended: true,
  level: 'warn',
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Components',
      description: 'Enforce order of blocks in Vue Single File Components (SFC)',
    },
    schema: [
      {
        type: 'object',
        properties: {
          order: { type: 'array', items: { type: 'string' } },
          ignores: { type: 'array', items: { type: 'string' } },
        },
        additionalProperties: false,
      },
    ],
    defaultOptions: [defaultOptions],
    messages: {
      wrongOrder: 'SFC blocks should be ordered: {{expected}}. Current order: {{order}}',
    },
  },
})
