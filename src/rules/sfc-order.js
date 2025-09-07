import fs from 'fs'
import { parse } from '@vue/compiler-sfc'
import { isIgnored, isOutsideSrc } from '../legacy_utils.js'
import { parseRuleOptions } from '../utils/rules.js'

const defaultOptions = { src: 'src', ignore: [], order: ['script', 'template', 'style'] }

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require SFC block order: <script>, <template>, <style>',
    },
    messages: {
      wrongOrder: 'SFC blocks should be ordered: {{expected}}. Current order: {{order}}',
    },
    schema: [
      {
        type: 'object',
        properties: {
          src: { type: 'string' },
          ignore: { type: 'array', items: { type: 'string' } },
          order: {
            type: 'array',
            items: { type: 'string', enum: ['script', 'template', 'style'] },
            uniqueItems: true,
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const opts = parseRuleOptions(context, defaultOptions)

    return {
      Program() {
        const filename = context.getFilename && context.getFilename()
        if (!filename) return

        if (String(filename).startsWith('<')) return
        if (isOutsideSrc(filename, opts.src)) return
        if (isIgnored(filename, opts.ignore)) return
        if (!String(filename).toLowerCase().endsWith('.vue')) return

        try {
          if (!fs.existsSync(filename)) return
          const content = fs.readFileSync(filename, 'utf8')
          const { descriptor } = parse(content)

          const blocks = []
          // script / scriptSetup
          if (descriptor.script) blocks.push({ type: 'script', pos: descriptor.script.loc.start.offset })
          if (descriptor.scriptSetup) blocks.push({ type: 'script', pos: descriptor.scriptSetup.loc.start.offset })
          // template
          if (descriptor.template) blocks.push({ type: 'template', pos: descriptor.template.loc.start.offset })
          // styles (multiple)
          if (Array.isArray(descriptor.styles)) {
            for (const s of descriptor.styles) {
              blocks.push({ type: 'style', pos: s.loc.start.offset })
            }
          }

          const hasScript = descriptor.script || descriptor.scriptSetup
          const hasTemplate = !!descriptor.template
          // If no script and no template, this rule does not enforce anything
          if (!hasScript && !hasTemplate) {
            return
          }

          // Sort by position to get actual order
          blocks.sort((a, b) => a.pos - b.pos)
          const actual = blocks.map((b) => b.type)

          // Determine expected order from options, but keep only known block types
          const optsOrder = Array.isArray(opts.order) && opts.order.length > 0 ? opts.order : defaultOptions.order
          const expected = optsOrder.filter((t) => ['script', 'template', 'style'].includes(t))

          // Validate that the sequence of actual blocks follows the relative order defined in expected.
          // Missing blocks are allowed; only the relative order among present blocks is checked.
          const presentExpected = expected.filter((t) => actual.includes(t))
          const actualFiltered = actual.filter((t) => presentExpected.includes(t))

          const ok = presentExpected.every((type, idx) => actualFiltered[idx] === type)

          if (!ok) {
            const order = actual.join(', ')
            const expectedStr = expected.map((t) => `<${t}>`).join(', ')
            context.report({ messageId: 'wrongOrder', data: { order, expected: expectedStr } })
          }
        } catch {
          return
        }
      },
    }
  },
}
