import path from 'path'

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
        srcPath: 'src',
        modulesPath: 'modules',
      },
    ],
    schema: [
      {
        type: 'object',
        description: 'Configuration options for the no-cross-module-imports rule',
        properties: {
          srcPath: {
            type: 'string',
            description: 'Name of the source directory',
          },
          modulesPath: {
            type: 'string',
            description: 'Name of the modules directory',
          },
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
    const srcPath = options.srcPath || 'src'
    const modulesPath = options.modulesPath || 'modules'

    function getModuleInfo(importPath, filename) {
      // Handle @ alias imports
      if (importPath.startsWith('@/')) {
        const aliasPath = importPath.replace('@/', '')

        // Check for modules/<modulename>/<something>
        const modulesMatch = aliasPath.match(new RegExp(`^${modulesPath}/([^/]+)/(.+)`))
        if (modulesMatch) {
          const [, moduleName, subPath] = modulesMatch
          return {
            type: 'src',
            moduleName,
            subPath,
            fullPath: importPath,
            allowedPath: `@/${modulesPath}/${moduleName}`,
          }
        }
        return null
      }

      // Handle relative imports
      if (importPath.startsWith('./') || importPath.startsWith('../')) {
        const currentDir = path.dirname(filename)
        const resolvedPath = path.resolve(currentDir, importPath)

        // Check for modules/<modulename>/<something>
        const modulesMatch = resolvedPath.match(new RegExp(`/${srcPath}/${modulesPath}/([^/]+)/(.+)`))
        if (modulesMatch) {
          const [, moduleName, subPath] = modulesMatch
          return {
            type: 'src',
            moduleName,
            subPath,
            fullPath: resolvedPath,
            allowedPath: `@/${modulesPath}/${moduleName}`,
          }
        }
        return null
      }

      return null
    }

    function isWithinSameModule(moduleInfo, filename) {
      const currentDir = path.dirname(filename)
      const moduleBasePath = `/${srcPath}/${modulesPath}/${moduleInfo.moduleName}/`
      return currentDir.includes(moduleBasePath)
    }

    return {
      ImportDeclaration(node) {
        const source = node.source.value
        const filename = context.getFilename()

        // Skip external imports (no path separators) and non-module imports
        if (!source.includes('/')) {
          return
        }

        const moduleInfo = getModuleInfo(source, filename)
        if (!moduleInfo) {
          return // Not a module import, skip
        }

        // Check if we're importing from outside the module
        const isWithinSame = isWithinSameModule(moduleInfo, filename)
        if (!isWithinSame) {
          context.report({
            node: node.source,
            messageId: 'crossModuleImport',
            data: {
              importPath: source,
              moduleName: moduleInfo.moduleName,
              allowedPath: moduleInfo.allowedPath,
            },
          })
        }
      },
    }
  },
}
