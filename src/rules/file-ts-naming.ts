import { createRule } from '@/utils/createRule'
import type { VueModularRuleContext } from '@/types'

interface FileTsNamingOptions {
  src: string
  ignores: string[]
}

const defaultOptions: FileTsNamingOptions = {
  src: 'src',
  ignores: ['index.ts', 'types.ts', 'shims-vue.d.ts'],
}

// Rule to enforce camelCase naming for TypeScript files
export const fileTsNaming = createRule<[FileTsNamingOptions], 'filenameNotCamel'>({
  create(context: VueModularRuleContext<'filenameNotCamel', [FileTsNamingOptions]>) {
    return {
      Program() {
        if (context.projectOptions?.rootPath) {
          console.log('Project root path:', context.projectOptions.rootPath)
        }
      },
    }
  },
  name: 'file-ts-naming',
  defaultOptions: [defaultOptions],
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Stylistic Issues',
      description: 'Require TypeScript filenames to be camelCase',
      recommended: false,
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
    messages: {
      filenameNotCamel: 'TypeScript filename "{{filename}}" should be camelCase (e.g., "{{expected}}.ts").',
    },
  },
})
