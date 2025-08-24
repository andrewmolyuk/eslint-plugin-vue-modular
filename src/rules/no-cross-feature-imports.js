import path from 'path'
import { isDeepFeatureImport, getModulePublicImport, isWithinSameFeature } from '../utils/import-boundaries.js'

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
      create(context) {
        const options = context.options[0] || {}
        const srcPath = options.srcPath || 'src'
        const modulesPath = options.modulesPath || 'modules'
        const featuresPath = options.featuresPath || 'features'
        const filename = context.getFilename()

        const opts = { src: srcPath, modulesDir: modulesPath, featuresDir: featuresPath }

        return {
          ImportDeclaration(node) {
            const source = node.source.value

            const modulePublicName = getModulePublicImport(source, opts)
            if (modulePublicName) {
              const isAppLayerFile = filename.includes(`/${srcPath}/app/`)
              if (!isAppLayerFile) {
                context.report({ node: node.source, messageId: 'crossFeatureImport', data: { importPath: source, featureName: modulePublicName, allowedPath: `@/${modulesPath}/${modulePublicName}` } })
                return
              }
              return
            }

            const featureInfo = isDeepFeatureImport(source, filename, opts)
            if (!featureInfo) return
            if (!isWithinSameFeature(filename, featureInfo, opts)) {
              context.report({ node: node.source, messageId: 'crossFeatureImport', data: { importPath: source, featureName: featureInfo.featureName, allowedPath: featureInfo.allowedPath } })
            }
          },
        }
      },
    }
              allowedPath: featureInfo.allowedPath,
            },
          })
        }
      },
    }
  },
}
