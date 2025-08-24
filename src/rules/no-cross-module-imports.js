import path from 'path'
import { isDeepModuleImport, isWithinSameModule, defaultOptions, applyAliases, resolveToAbsolute } from '../utils/import-boundaries.js'

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Prevent imports from deep inside module folders from outside the module',
      recommended: true,
    },
    fixable: null,
    defaultOptions: [
      {
        src: 'src',
        modulesDir: 'modules',
      },
    ],
    schema: [
      {
        type: 'object',
        description: 'Configuration options for the no-cross-module-imports rule',
        properties: {
          // canonical names
          src: { type: 'string', description: 'Name of the source directory' },
          modulesDir: { type: 'string', description: 'Name of the modules directory' },
          // legacy names
          srcPath: { type: 'string', description: 'Legacy: srcPath (alias for src)' },
          modulesPath: { type: 'string', description: 'Legacy: modulesPath (alias for modulesDir)' },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      crossModuleImport:
        'Cannot import "{{importPath}}" from outside module "{{moduleName}}". Only imports from "{{allowedPath}}" are allowed.',
    },
  },
  create(context) {
    const options = context.options[0] || {}
    const src = options.src || options.srcPath || 'src'
    const modulesDir = options.modulesDir || options.modulesPath || 'modules'

    const filename = context.getFilename()

    return {
      ImportDeclaration(node) {
        const source = node.source.value
        if (!source.includes('/')) return

        // normalize input to helper expectations
        const opts = { src, modulesDir }
        const aliased = applyAliases(source, options.aliases || {}, opts.src)
        const maybe = isDeepModuleImport(aliased, filename, opts)
        if (!maybe) return

        const within = isWithinSameModule(filename, maybe.moduleName, opts)
        if (!within) {
          context.report({
            node: node.source,
            messageId: 'crossModuleImport',
            data: { importPath: source, moduleName: maybe.moduleName, allowedPath: maybe.allowedPath },
          })
        }
      },
    }
  },
}
