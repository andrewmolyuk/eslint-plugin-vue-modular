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

        // Check for src/features/<featurename>/<something>
        const srcFeaturesMatch = aliasPath.match(new RegExp(`^${featuresPath}/([^/]+)/(.+)`))
        if (srcFeaturesMatch) {
          const [, featureName, subPath] = srcFeaturesMatch
          return {
            type: 'src',
            featureName,
            subPath,
            fullPath: importPath,
            allowedPath: `${srcPath}/${featuresPath}/${featureName}`,
          }
        }
        return null
      }

      // Handle relative imports
      if (importPath.startsWith('./') || importPath.startsWith('../')) {
        const currentDir = path.dirname(filename)
        const resolvedPath = path.resolve(currentDir, importPath)

        // Check for src/features/<featurename>/<something>
        const srcFeaturesMatch = resolvedPath.match(new RegExp(`/${srcPath}/${featuresPath}/([^/]+)/(.+)`))
        if (srcFeaturesMatch) {
          const [, featureName, subPath] = srcFeaturesMatch
          return {
            type: 'src',
            featureName,
            subPath,
            fullPath: resolvedPath,
            allowedPath: `${srcPath}/${featuresPath}/${featureName}`,
          }
        }

        // Check for modules/<modulename>/features/<featurename>/<something>
        const modulesFeaturesMatch = resolvedPath.match(new RegExp(`/${modulesPath}/([^/]+)/${featuresPath}/([^/]+)/(.+)`))
        if (modulesFeaturesMatch) {
          const [, moduleName, featureName, subPath] = modulesFeaturesMatch
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
     * Checks if the current file is inside the same feature
     * @param {object} featureInfo - Feature information from isDeepFeatureImport
     * @returns {boolean} - True if current file is in the same feature
     */
    const isWithinSameFeature = (featureInfo) => {
      const currentPath = filename

      if (featureInfo.type === 'src') {
        // Check if current file is within the same src feature
        return currentPath.includes(`/${srcPath}/${featuresPath}/${featureInfo.featureName}/`)
      } else if (featureInfo.type === 'modules') {
        // Check if current file is within the same module feature
        return currentPath.includes(`/${modulesPath}/${featureInfo.moduleName}/${featuresPath}/${featureInfo.featureName}/`)
      }

      return false
    }

    return {
      ImportDeclaration(node) {
        const source = node.source.value

        // Check if this is a deep feature import
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
