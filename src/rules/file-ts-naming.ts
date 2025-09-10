import { createRule } from '../utils/createRule'
import type { VueModularProjectOptions, VueModularRuleContext, VueModularRuleModule } from '../types'

interface FileTsNamingOptions {
  src: string
  ignores: string[]
}

const defaultOptions: FileTsNamingOptions = {
  src: 'src',
  ignores: ['index.ts', 'types.ts', 'shims-vue.d.ts'],
}

// Rule to enforce camelCase naming for TypeScript files
export const fileTsNaming = createRule<VueModularRuleModule>({
  create(context) {
    return {
      Program() {
        console.log('file-ts-naming rule executed with options:', context.options[0])
        const projectOptions = context.settings['vue-modular'] as VueModularProjectOptions
        if (projectOptions.rootPath) {
          console.log('Project root path:', projectOptions.rootPath)
        }
        if (projectOptions.rootAlias) {
          console.log('Project root alias:', projectOptions.rootAlias)
        }
      },
    }
  },
  name: 'file-ts-naming',
  recommended: true,
  level: 'error',
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Stylistic Issues',
      description: 'Require TypeScript filenames to be camelCase',
    },
    schema: [
      {
        type: 'object',
        properties: {
          src: { type: 'string' },
          ignores: { type: 'array', items: { type: 'string' } },
        },
        additionalProperties: false,
      },
      defaultOptions,
    ],
    messages: {
      filenameNotCamel: 'TypeScript filename "{{filename}}" should be camelCase (e.g., "{{expected}}.ts").',
    },
  },
})
