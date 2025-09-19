import { createRule, parseRuleOptions, parseProjectOptions, resolvePath, isIgnored } from '../utils'
import type { VueModularRuleModule, VueModularRuleContext } from '../types'
import { resolveImportPath } from '../utils/resolveImportPath'

const defaultOptions = {
  ignores: [] as string[],
}

// Enforce that when importing across layers (e.g., feature -> feature or feature -> shared)
// the import must use the project root alias (e.g. '@' by default) or be relative when inside
// the same module. This rule reports imports that reference other parts of the project using
// non-aliased absolute or other non-allowed forms.
export const crossImportsAbsolute = createRule<VueModularRuleModule>({
  create(context: VueModularRuleContext) {
    const options = parseRuleOptions(context, defaultOptions as unknown as Record<string, unknown>) as typeof defaultOptions
    const projectOptions = parseProjectOptions(context)
    const filename = resolvePath(context.filename, projectOptions.rootPath, projectOptions.rootAlias)
    if (!filename) return {}
    if (isIgnored(filename, options.ignores)) return {}

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value as string
        // Defensive: AST nodes without a string source are extremely rare in our tests
        if (!importPath || typeof importPath !== 'string') return

        let resolvedPath = resolveImportPath(filename, importPath, projectOptions.rootPath, projectOptions.rootAlias)
        if (!resolvedPath) return

        // If import is within same logical area (same feature or both in shared), allow
        const fromApp = filename.startsWith(projectOptions.appPath)
        const toApp = resolvedPath.startsWith(projectOptions.appPath)
        if (fromApp && toApp) return

        const fromFeature = filename.startsWith(projectOptions.featuresPath)
        const toFeature = resolvedPath.startsWith(projectOptions.featuresPath)
        // same feature -> allow (could be relative or alias)
        if (fromFeature && toFeature) {
          const fromFeatureSegment = filename.slice(projectOptions.featuresPath.length).split('/')[1]
          const toFeatureSegment = resolvedPath.slice(projectOptions.featuresPath.length).split('/')[1]
          if (fromFeatureSegment && toFeatureSegment && fromFeatureSegment === toFeatureSegment) return
        }

        const fromShared = filename.startsWith(projectOptions.sharedPath)
        const toShared = resolvedPath.startsWith(projectOptions.sharedPath)
        if (fromShared && toShared) return

        // Determine if this import is a non-aliased absolute import (e.g. '/features/..' or 'src/features/...')
        const alias = projectOptions.rootAlias
        const isAliasImport = importPath === alias || importPath.startsWith(`${alias}/`)

        if (!isAliasImport) {
          context.report({ node, messageId: 'useAlias', data: { file: filename, target: importPath, alias } })
        }
      },
    }
  },
  name: 'cross-imports-alias',
  recommended: false,
  level: 'error',
  meta: {
    type: 'problem',
    docs: {
      description: 'Cross-layer imports must use the project root alias (e.g. @/) instead of non-aliased absolute paths',
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
      useAlias: "File '{{file}}' must import cross-layer resources using the alias '{{alias}}' (found '{{target}}').",
    },
  },
})
