import { createRule, parseRuleOptions, parseProjectOptions, resolvePath, isIgnored } from '../utils'
import type { VueModularRuleModule, VueModularRuleContext } from '../types'
import { resolveImportPath } from '../utils/resolveImportPath'

const defaultOptions = {
  ignores: [] as string[],
}

export const appImports = createRule<VueModularRuleModule>({
  create(context: VueModularRuleContext) {
    const options = parseRuleOptions(context, defaultOptions)
    const projectOptions = parseProjectOptions(context)
    const filename = resolvePath(context.filename, projectOptions.rootPath, projectOptions.rootAlias)
    if (!filename) return {}
    if (isIgnored(filename, options.ignores)) return {}

    // only run for files inside appPath
    const isInApp = filename.startsWith(projectOptions.appPath)
    if (!isInApp) return {}

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value as string
        const resolvedPath = resolveImportPath(filename, importPath, projectOptions.rootPath, projectOptions.rootAlias)
        if (!resolvedPath) return

        // Allow relative imports within app/
        if (resolvedPath.startsWith(projectOptions.appPath)) return

        // Special case: allow app/router.ts to import feature route files
        const isRouterFile = filename === `${projectOptions.appPath}/router.ts`
        if (isRouterFile) {
          // allow imports from feature route files (features/*/routes.ts)
          const isRouteFile = resolvedPath.endsWith('/routes.ts') || resolvedPath.endsWith('/routes')
          if (resolvedPath.startsWith(projectOptions.featuresPath) && isRouteFile) return
        }

        // Allow imports from shared
        if (resolvedPath.startsWith(projectOptions.sharedPath)) return

        // Allow imports from features from Public API from the root of the feature (features/*/index.ts)
        if (resolvedPath.startsWith(projectOptions.featuresPath)) {
          const featureSegment = resolvedPath.slice(projectOptions.featuresPath.length).split('/')[1]
          const isFeatureRootImport =
            resolvedPath === `${projectOptions.featuresPath}/${featureSegment}/index.ts` ||
            resolvedPath === `${projectOptions.featuresPath}/${featureSegment}` ||
            resolvedPath === `${projectOptions.featuresPath}/${featureSegment}/index`
          if (isFeatureRootImport) return
        }

        // If we reach here, it's a forbidden import
        context.report({ node, messageId: 'forbiddenImport', data: { file: filename, target: importPath } })
      },
    }
  },
  name: 'app-imports',
  recommended: false,
  level: 'error',
  meta: {
    type: 'problem',
    docs: {
      description: 'app/ folder can import from shared/ and features/ (exception: app/router.ts may import feature route files)',
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
      forbiddenImport: "App file '{{file}}' must not import from '{{target}}'.",
    },
  },
})
