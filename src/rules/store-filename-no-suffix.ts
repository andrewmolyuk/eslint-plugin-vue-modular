import path from 'path'
import { createRule, parseRuleOptions, parseProjectOptions, resolvePath, isIgnored, isTs } from '../utils'
import type { VueModularRuleModule, VueModularRuleContext } from '../types'

const defaultOptions = {
  suffix: 'Store',
  ignores: ['**/*.d.ts', '**/*.spec.*', '**/*.test.*', '**/*.stories.*'],
}

export const storeFilenameNoSuffix = createRule<VueModularRuleModule>({
  create(context: VueModularRuleContext) {
    const options = parseRuleOptions(context, defaultOptions)
    const projectOptions = parseProjectOptions(context)
    const filename = resolvePath(context.filename, projectOptions.rootPath, projectOptions.rootAlias)
    if (!filename) return {}
    if (isIgnored(filename, options.ignores)) return {}

    // Only check TypeScript files
    if (!isTs(context.filename)) return {}

    // Only check files inside shared/stores or features/*/stores
    const inSharedStores = filename.startsWith(`${projectOptions.sharedPath}/stores`)
    const inFeatureStores = filename.startsWith(projectOptions.featuresPath) && filename.includes('/stores/')
    if (!inSharedStores && !inFeatureStores) return {}

    return {
      Program(node) {
        const base = path.basename(context.filename, path.extname(context.filename))

        if (new RegExp(`${options.suffix}$`, 'i').test(base)) {
          context.report({
            node,
            messageId: 'noStoreSuffix',
            data: { filename: path.basename(context.filename) },
          })
        }
      },
    }
  },
  name: 'store-filename-no-suffix',
  recommended: true,
  level: 'error',
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Store Rules',
      description: 'Store files must not have "Store" suffix (e.g., auth.ts, not authStore.ts)',
    },
    defaultOptions: [defaultOptions],
    schema: [
      {
        type: 'object',
        properties: {
          suffix: { type: 'string' },
          ignores: { type: 'array', items: { type: 'string' } },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      noStoreSuffix: 'Store filename "{{filename}}" should not include the "Store" suffix (use e.g. "auth.ts").',
    },
  },
})
