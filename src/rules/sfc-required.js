import fs from 'fs'
import path from 'path'
import { parse } from '@vue/compiler-sfc'
import { isIgnored, isOutsideSrc } from '../legacy_utils.js'
import { parseRuleOptions, runOnce } from '../utils/rules.js'

const defaultOptions = { src: 'src', ignore: [] }

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require Single File Component structure for Vue components under a configured src segment',
    },
    messages: {
      missingSfcBlock: 'Vue file "{{name}}" should contain at least a <template> or a <script> block.',
    },
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
  },

  create(context) {
    const opts = parseRuleOptions(context, defaultOptions)
    const ruleId = 'vue-modular/sfc-required'

    if (!runOnce(ruleId)) return {}

    return {
      Program() {
        const filename = context.getFilename && context.getFilename()
        if (!filename) return

        // ignore virtual files and text inputs
        if (String(filename).startsWith('<')) return

        if (isOutsideSrc(filename, opts.src)) return
        if (isIgnored(filename, opts.ignore)) return

        // only operate on .vue files
        if (!String(filename).toLowerCase().endsWith('.vue')) return

        try {
          if (!fs.existsSync(filename)) return
          const content = fs.readFileSync(filename, 'utf8')

          // parse SFC using official compiler to reliably detect blocks
          const { descriptor } = parse(content)
          const hasTemplate = !!descriptor.template
          const hasScript = !!descriptor.script || !!descriptor.scriptSetup

          if (!hasTemplate && !hasScript) {
            const name = path.basename(filename)
            context.report({ messageId: 'missingSfcBlock', data: { name } })
          }
        } catch {
          // If reading or parsing fails, skip silently (do not crash ESLint)
          return
        }
      },
    }
  },
}
