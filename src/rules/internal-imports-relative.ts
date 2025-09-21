import { createRule, parseRuleOptions, parseProjectOptions, resolvePath, isIgnored } from '../utils'
import type { VueModularRuleModule, VueModularRuleContext } from '../types'
import { resolveImportPath } from '../utils'

const defaultOptions = {
  ignores: [] as string[],
}

export const internalImportsRelative = createRule<VueModularRuleModule>({
  create(context: VueModularRuleContext) {
    const options = parseRuleOptions(context, defaultOptions as unknown as Record<string, unknown>) as typeof defaultOptions
    const projectOptions = parseProjectOptions(context)
    const filename = resolvePath(context.filename, projectOptions.rootPath, projectOptions.rootAlias)

    if (!filename) return {}
    if (isIgnored(filename, options.ignores)) return {}

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value as string
        if (!importPath || typeof importPath !== 'string') return

        const resolvedPath = resolveImportPath(filename, importPath, projectOptions.rootPath, projectOptions.rootAlias)
        if (!resolvedPath) return

        const alias = projectOptions.rootAlias
        const isAliasImport = importPath === alias || importPath.startsWith(`${alias}/`)

        // Only care about imports within the same feature or same shared folder
        const fromFeature = filename.startsWith(projectOptions.featuresPath)
        const toFeature = resolvedPath.startsWith(projectOptions.featuresPath)
        if (fromFeature && toFeature) {
          const fromFeatureSegment = filename.slice(projectOptions.featuresPath.length).split('/')[1]
          const toFeatureSegment = resolvedPath.slice(projectOptions.featuresPath.length).split('/')[1]
          if (fromFeatureSegment && toFeatureSegment && fromFeatureSegment === toFeatureSegment && !isAliasImport) return
          if (fromFeatureSegment && toFeatureSegment && fromFeatureSegment !== toFeatureSegment && isAliasImport) return
        }

        // Care about app and shared folders as well
        const fromApp = filename.startsWith(projectOptions.appPath)
        const toApp = resolvedPath.startsWith(projectOptions.appPath)
        if (fromApp && toApp && !isAliasImport) return
        if (fromApp && !toApp && isAliasImport) return

        const fromShared = filename.startsWith(projectOptions.sharedPath)
        const toShared = resolvedPath.startsWith(projectOptions.sharedPath)
        if (fromShared && toShared && !isAliasImport) return
        if (fromShared && !toShared && isAliasImport) return

        // If import is outside of app, features, or shared, ignore
        if (!fromApp && !fromFeature && !fromShared) return
        if (!toApp && !toFeature && !toShared) return

        if (isAliasImport) {
          context.report({ node, messageId: 'useRelativeImport', data: { file: filename, target: importPath } })
        }
      },
    }
  },
  name: 'internal-imports-relative',
  recommended: false,
  level: 'error',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Use relative imports for same-feature or nearby file imports.',
      category: 'Dependency',
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
      useRelativeImport: 'Use relative import for same-feature or nearby file imports ({{ file }} -> {{ target }}).',
    },
  },
})
