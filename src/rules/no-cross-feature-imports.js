import path from 'path'

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Prevent imports from deep inside feature folders from outside the feature',
      recommended: true,
    },
    fixable: null,
    defaultOptions: [
      {
        srcPath: 'src',
        modulesPath: 'modules',
        featuresPath: 'features',
      },
    ],
    schema: [
      {
        type: 'object',
        description: 'Configuration options for the no-cross-feature-imports rule',
        properties: {
          srcPath: {
            type: 'string',
            description: 'The name of the source directory',
          },
          modulesPath: {
            type: 'string',
            description: 'The name of the modules directory',
          },
          featuresPath: {
            type: 'string',
            description: 'The name of the features directory within src or modules',
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      crossFeatureImport:
        'Cannot import "{{importPath}}" from outside feature "{{featureName}}". Only imports from "{{allowedPath}}" are allowed.',
    },
  },

  create(context) {
    const options = context.options[0] || {}
    const srcPath = options.srcPath || 'src'
    const modulesPath = options.modulesPath || 'modules'
    const featuresPath = options.featuresPath || 'features'
    const filename = context.getFilename()

    /**
     * Checks if a path represents a deep feature import
     * @param {string} importPath - The import path to check
     * @returns {object|null} - Feature info if it's a deep import, null otherwise
     */
    const isDeepFeatureImport = (importPath) => {
      // Handle @ alias imports
      if (importPath.startsWith('@/')) {
        const aliasPath = importPath.replace('@/', '')

        // Check for src/features/<featurename> or src/features/<featurename>/<something>
        const srcFeaturesMatch = aliasPath.match(new RegExp(`^${featuresPath}/([^/]+)(?:/(.+))?$`))
        if (srcFeaturesMatch) {
          const [, featureName, subPath] = srcFeaturesMatch
          // If there's no subPath, this is the feature public API import (index) - allowed
          if (!subPath) return null
          return {
            type: 'src',
            featureName,
            subPath,
            fullPath: importPath,
            allowedPath: `@/${featuresPath}/${featureName}`,
          }
        }
        // Check for alias pointing to modules/<module>/features/<featurename>/<something>
        // Check for modules/<module>/features/<feature> (with optional subpath)
        const modulesFeaturesAliasMatch = aliasPath.match(new RegExp(`^${modulesPath}/([^/]+)/${featuresPath}/([^/]+)(?:/(.+))?$`))
        if (modulesFeaturesAliasMatch) {
          const [, moduleName, featureName, subPath] = modulesFeaturesAliasMatch
          return {
            type: 'modules',
            moduleName,
            featureName,
            subPath,
            fullPath: importPath,
            allowedPath: `@/${modulesPath}/${moduleName}/${featuresPath}/${featureName}`,
          }
        }
        return null
      }

      // Handle relative imports
      if (importPath.startsWith('./') || importPath.startsWith('../')) {
        const currentDir = path.dirname(filename)
        const resolvedPath = path.resolve(currentDir, importPath)

        // Check for src/features/<featurename> or src/features/<featurename>/<something>
        const srcFeaturesMatch = resolvedPath.match(new RegExp(`/${srcPath}/${featuresPath}/([^/]+)(?:/(.+))?$`))
        if (srcFeaturesMatch) {
          const [, featureName, subPath] = srcFeaturesMatch
          // No subPath => public API import
          if (!subPath) return null
          return {
            type: 'src',
            featureName,
            subPath,
            fullPath: resolvedPath,
            allowedPath: `@/${featuresPath}/${featureName}`,
          }
        }

        // Check for modules/<modulename>/features/<featurename> (with optional subpath)
        const modulesFeaturesMatch = resolvedPath.match(new RegExp(`/${modulesPath}/([^/]+)/${featuresPath}/([^/]+)(?:/(.+))?$`))
        if (modulesFeaturesMatch) {
          const [, moduleName, featureName, subPath] = modulesFeaturesMatch
          // If there's no subPath, this is a module feature root import via relative path -> allow
          if (!subPath) return null
          return {
            type: 'modules',
            moduleName,
            featureName,
            subPath,
            fullPath: resolvedPath,
            allowedPath: `${modulesPath}/${moduleName}/${featuresPath}/${featureName}`,
          }
        }
        return null
      }

      return null
    }

    /**
     * Detects imports that target a module public API (module root / index)
     * Returns moduleName or null
     */
    const getModulePublicImport = (importPath) => {
      if (!importPath.startsWith('@/')) return null
      const aliasPath = importPath.replace('@/', '')
      // match '@/modules/<name>' or '@/modules/<name>/index' (optional extension)
      const m = aliasPath.match(new RegExp(`^${modulesPath}/([^/]+)(?:/index(?:\\.(?:js|ts|jsx|tsx))?)?$`))
      if (m) return m[1]
      return null
    }

    /**
     * Checks if the current file is inside the same feature
     * @param {object} featureInfo - Feature information from isDeepFeatureImport
     * @returns {boolean} - True if current file is in the same feature
     */
    const isWithinSameFeature = (featureInfo) => {
      const currentPath = filename

      if (featureInfo.type === 'src') {
        // Only files inside the same global feature folder may import its internals
        return currentPath.includes(`/${srcPath}/${featuresPath}/${featureInfo.featureName}/`)
      } else if (featureInfo.type === 'modules') {
        // Any file inside the same module (modules/<module>/...) may import its internal features
        return currentPath.includes(`/${modulesPath}/${featureInfo.moduleName}/`)
      }

      return false
    }

    return {
      ImportDeclaration(node) {
        const source = node.source.value

        // First, detect module public API imports (e.g. '@/modules/auth')
        const modulePublicName = getModulePublicImport(source)
        if (modulePublicName) {
          // Only app-layer files under src/app/ are allowed to import module public APIs
          const isAppLayerFile = filename.includes(`/${srcPath}/app/`)
          if (!isAppLayerFile) {
            context.report({
              node: node.source,
              messageId: 'crossFeatureImport',
              data: {
                importPath: source,
                featureName: modulePublicName,
                allowedPath: `@/${modulesPath}/${modulePublicName}`,
              },
            })
            return
          }
          return
        }

        // Otherwise check if this is a deep feature import
        const featureInfo = isDeepFeatureImport(source)
        if (!featureInfo) {
          return // Not a feature import, skip
        }

        // Check if we're importing from outside the feature
        if (!isWithinSameFeature(featureInfo)) {
          context.report({
            node: node.source,
            messageId: 'crossFeatureImport',
            data: {
              importPath: source,
              featureName: featureInfo.featureName,
              allowedPath: featureInfo.allowedPath,
            },
          })
        }
      },
    }
  },
}
