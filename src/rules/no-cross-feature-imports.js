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
        src: 'src',
        modulesDir: 'modules',
        featuresDir: 'features',
      },
    ],
    schema: [
      {
        type: 'object',
        description: 'Configuration options for the no-cross-feature-imports rule',
        properties: {
          // canonical names
          src: { type: 'string', description: 'The name of the source directory' },
          modulesDir: { type: 'string', description: 'The name of the modules directory' },
          featuresDir: { type: 'string', description: 'The name of the features directory within src or modules' },
          // legacy/alias names (kept for backwards compatibility)
          srcPath: { type: 'string', description: 'Legacy: srcPath (alias for src)' },
          modulesPath: { type: 'string', description: 'Legacy: modulesPath (alias for modulesDir)' },
          featuresPath: { type: 'string', description: 'Legacy: featuresPath (alias for featuresDir)' },
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
    // prefer legacy keys when tests provide both canonical defaults and legacy overrides
    const src = options.srcPath || options.src || 'src'
    const modulesDir = options.modulesPath || options.modulesDir || 'modules'
    const featuresDir = options.featuresPath || options.featuresDir || 'features'
    const filename = context.getFilename()

    const opts = { src, modulesDir, featuresDir }

    return {
      ImportDeclaration(node) {
        const source = node.source.value

        const modulePublicName = getModulePublicImport(source, opts)
        if (modulePublicName) {
          const isAppLayerFile = filename.includes(`/${src}/app/`)
          if (!isAppLayerFile) {
            context.report({
              node: node.source,
              messageId: 'crossFeatureImport',
              data: { importPath: source, featureName: modulePublicName, allowedPath: `@/${modulesDir}/${modulePublicName}` },
            })
            return
          }
          return
        }

        const featureInfo = isDeepFeatureImport(source, filename, opts)
        if (!featureInfo) return
        if (!isWithinSameFeature(filename, featureInfo, opts)) {
          context.report({
            node: node.source,
            messageId: 'crossFeatureImport',
            data: { importPath: source, featureName: featureInfo.featureName, allowedPath: featureInfo.allowedPath },
          })
        }
      },
    }
  },
}
