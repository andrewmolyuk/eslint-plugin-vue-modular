import { createRule, parseRuleOptions, parseProjectOptions, resolvePath, isIgnored } from '../utils'
import type { ExportAllDeclaration } from 'estree'
import type { VueModularRuleModule, VueModularRuleContext } from '../types'
import { resolveImportPath } from '../utils/resolveImportPath'

const defaultOptions = {
  ignores: [] as string[],
}

export const sharedImports = createRule<VueModularRuleModule>({
  create(context: VueModularRuleContext) {
    const options = parseRuleOptions(context, defaultOptions)
    const projectOptions = parseProjectOptions(context)
    const filename = resolvePath(context.filename, projectOptions.rootPath, projectOptions.rootAlias)
    if (!filename) return {}
    if (isIgnored(filename, options.ignores)) return {}

    // only run for files inside sharedPath
    const isInShared = filename.startsWith(projectOptions.sharedPath)
    if (!isInShared) return {}

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value as string
        const resolvedPath = resolveImportPath(filename, importPath, projectOptions.rootPath, projectOptions.rootAlias)
        if (!resolvedPath) return

        // Report if resolved path is outside of sharedPath
        if (!resolvedPath.startsWith(projectOptions.sharedPath)) {
          context.report({
            node,
            messageId: 'forbiddenImport',
            data: { file: filename, target: importPath },
          })
        }
      },

      // support export from '...'
      ExportAllDeclaration(node: ExportAllDeclaration) {
        const importPath = node.source && (node.source.value as string)
        if (!importPath) return
        const resolvedPath = resolveImportPath(filename, importPath, projectOptions.rootPath, projectOptions.rootAlias)
        if (!resolvedPath) return

        // Report if resolved path is outside of sharedPath
        if (!resolvedPath.startsWith(projectOptions.sharedPath)) {
          context.report({
            node,
            messageId: 'forbiddenImport',
            data: { file: filename, target: importPath },
          })
        }
      },
    }
  },
  name: 'shared-imports',
  recommended: true,
  level: 'error',
  meta: {
    type: 'problem',
    docs: {
      description: 'Shared layer must not import from Features or Views',
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
      forbiddenImport: "Shared file '{{file}}' must not import from '{{target}}'.",
    },
  },
})
