import { createRule, parseRuleOptions, parseProjectOptions, resolvePath, isIgnored } from '../utils'
import type { VueModularRuleModule, VueModularRuleContext } from '../types'
import { resolveImportPath } from 'src/utils/resolveImportPath'

const defaultOptions = {
  ignores: [] as string[],
}

export const featureImportsFromSharedOnly = createRule<VueModularRuleModule>({
  create(context: VueModularRuleContext) {
    const options = parseRuleOptions(context, defaultOptions as unknown as Record<string, unknown>) as typeof defaultOptions
    const projectOptions = parseProjectOptions(context)
    const filename = resolvePath(context.filename, projectOptions.rootPath, projectOptions.rootAlias)
    if (!filename) return {}
    if (isIgnored(filename, options.ignores)) return {}

    return {
      ImportDeclaration(node) {
        const isFeatureFile = filename.startsWith(projectOptions.featuresPath)
        if (!isFeatureFile) return

        const importPath = node.source.value as string
        const resolvedPath = resolveImportPath(filename, importPath, projectOptions.rootPath, projectOptions.rootAlias)
        if (!resolvedPath) return

        // Check if the resolved path is within the 'shared' layer
        const isSharedImport = resolvedPath.startsWith(projectOptions.sharedPath)
        if (isSharedImport) return

        // Check if the resolved path is within the same feature
        const featureSegment = filename.slice(projectOptions.featuresPath.length).split('/')[1]
        const isSameFeatureImport = resolvedPath.startsWith(`${projectOptions.featuresPath}/${featureSegment}`)
        if (isSameFeatureImport) return

        context.report({
          node,
          messageId: 'forbiddenImport',
          data: { feature: filename, target: importPath },
        })
      },
    }
  },
  name: 'feature-imports-from-shared-only',
  recommended: true,
  level: 'error',
  meta: {
    type: 'problem',
    docs: {
      description: 'Features should only import from shared layer or their own internal files',
      category: 'Dependency',
      recommended: false,
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
      forbiddenImport: "Feature '{{feature}}' must not import from '{{target}}'.",
    },
  },
})
