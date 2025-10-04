import { createRule, parseRuleOptions, parseProjectOptions, isIgnored } from '../utils'
import type { VueModularRuleModule, VueModularRuleContext } from '../types'
import { resolveImportPath } from '../utils/resolveImportPath'
import { parse } from '@vue/compiler-sfc'

const defaultOptions = {
  ignores: [] as string[],
}

export const storesLocation = createRule<VueModularRuleModule>({
  create(context: VueModularRuleContext) {
    const options = parseRuleOptions(context, defaultOptions)
    const projectOptions = parseProjectOptions(context)

    const filename = context.filename
    const resolvedFilename = resolveImportPath(filename, filename, projectOptions.rootPath, projectOptions.rootAlias) || filename

    if (isIgnored(resolvedFilename, options.ignores)) return {}

    return {
      Program(node) {
        // Ignore files that are in the shared stores folder already
        const isSharedStoresFolder = resolvedFilename.startsWith(`${projectOptions.sharedPath}/${projectOptions.storesFolderName}/`)
        if (isSharedStoresFolder) return

        // Ignore files that are in a feature stores folder already
        const isFeatureStoresFolder =
          resolvedFilename.startsWith(projectOptions.featuresPath) && resolvedFilename.includes(`/${projectOptions.storesFolderName}/`)
        if (isFeatureStoresFolder) return

        // AST parsing to detect defineStore usage
        const { descriptor } = parse(context.sourceCode.text)
        const usesDefineStore =
          descriptor.scriptSetup?.content.includes('defineStore') || descriptor.script?.content.includes('defineStore')
        if (!usesDefineStore) return

        // If we reach here, the file is a store but is not in an allowed location
        context.report({
          node,
          messageId: 'moveToStores',
          data: { filename: context.filename, storesFolderName: projectOptions.storesFolderName },
        })
      },
    }
  },
  name: 'stores-location',
  recommended: false,
  level: 'error',
  meta: {
    type: 'suggestion',
    docs: {
      description: `Enforce that stores located under shared/stores or features/*/stores`,
      category: 'Store Rules',
    },
    defaultOptions: [defaultOptions],
    schema: [
      {
        type: 'object',
        properties: {
          ignores: { type: 'array', items: { type: 'string' } },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      moveToStores: 'Move store file to shared/{{storesFolderName}} or features/feature/{{storesFolderName}}: {{filename}}',
    },
  },
})
