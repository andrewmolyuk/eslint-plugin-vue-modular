/**
 * @fileoverview Simplified import boundaries enforcement
 * This is a proposed refactor to reduce complexity
 */
import path from 'node:path'
import { isTestFile, applyAliases } from '../utils/import-boundaries.js'

const defaultOptions = {
  src: 'src',
  modulesDir: 'modules',
  featuresDir: 'features',
  aliases: {},
  allow: [],
  ignoreTypeImports: true,
}

/**
 * Layer hierarchy and access rules (simplified configuration-driven approach)
 */
const LAYER_RULES = {
  // Each layer can import from layers listed in 'canImport'
  app: {
    canImport: ['shared', 'components', 'composables', 'services', 'stores', 'entities'],
    // Special rules for modules/features - only public API
    restrictedImports: {
      module: 'publicApiOnly',
      feature: 'publicApiOnly',
    },
  },
  module: {
    canImport: ['shared', 'entities', 'services', 'stores', 'components', 'composables'],
    restrictedImports: {
      module: 'forbidden', // modules are isolated
      feature: 'publicApiOnly',
    },
  },
  feature: {
    canImport: ['shared', 'entities', 'services', 'stores', 'components', 'composables'],
    restrictedImports: {
      module: 'forbidden',
      feature: 'forbidden', // features are isolated
      app: 'forbidden',
    },
  },
  components: {
    canImport: ['shared', 'entities'],
    restrictedImports: {
      app: 'forbidden',
      module: 'forbidden',
      feature: 'forbidden',
    },
  },
  composables: {
    canImport: ['shared', 'entities', 'services', 'stores'],
    restrictedImports: {
      app: 'forbidden',
      module: 'forbidden',
      feature: 'forbidden',
      components: 'forbidden',
    },
  },
  services: {
    canImport: ['shared', 'entities', 'stores', 'services'],
    restrictedImports: {
      app: 'forbidden',
      module: 'forbidden',
      feature: 'forbidden',
      components: 'forbidden',
      composables: 'forbidden',
    },
  },
  stores: {
    canImport: ['shared', 'entities', 'stores'],
    restrictedImports: {
      app: 'forbidden',
      module: 'forbidden',
      feature: 'forbidden',
      components: 'forbidden',
      composables: 'forbidden',
      services: 'forbidden',
    },
  },
  entities: {
    canImport: ['shared', 'entities'],
    restrictedImports: {
      '*': 'forbidden', // entities can only import shared and other entities
    },
  },
  shared: {
    canImport: ['shared'], // shared can only import other shared
    restrictedImports: {
      '*': 'forbidden',
    },
  },
  test: {
    canImport: ['*'], // tests can import anything
    restrictedImports: {},
  },
}

/**
 * Extract layer information from file path
 */
function getLayerInfo(filePath, options) {
  if (!filePath || isTestFile(filePath)) {
    return { layer: 'test' }
  }

  const parts = path.normalize(filePath).split(path.sep)
  const srcIdx = parts.indexOf(options.src)
  if (srcIdx === -1) return null

  const layerDir = parts[srcIdx + 1]
  if (!layerDir) return null

  // Map directory names to layers
  const layerMap = {
    app: 'app',
    [options.modulesDir]: 'module',
    [options.featuresDir]: 'feature',
    components: 'components',
    composables: 'composables',
    services: 'services',
    stores: 'stores',
    entities: 'entities',
    shared: 'shared',
    lib: 'shared', // alias for shared
  }

  const layer = layerMap[layerDir]
  if (!layer) return { layer: 'other' }

  // For modules and features, extract the name
  if (layer === 'module' || layer === 'feature') {
    return {
      layer,
      name: parts[srcIdx + 2],
      path: filePath,
    }
  }

  return { layer, path: filePath }
}

/**
 * Resolve import path to absolute path
 */
function resolveImportPath(importPath, importerPath, options) {
  // Apply aliases
  const resolved = applyAliases(importPath, options.aliases, options.src)

  // Handle relative imports
  if (resolved.startsWith('./') || resolved.startsWith('../')) {
    return path.normalize(path.resolve(path.dirname(importerPath), resolved))
  }

  // Handle absolute imports (src/...)
  if (resolved.startsWith(options.src)) {
    return path.normalize(path.resolve(process.cwd(), resolved))
  }

  // External import - not our concern
  return null
}

/**
 * Check if import is to public API only
 */
function isPublicApiImport(targetPath, options) {
  const parts = path.normalize(targetPath).split(path.sep)
  const srcIdx = parts.indexOf(options.src)
  if (srcIdx === -1) return false

  const layerDir = parts[srcIdx + 1]
  const entityName = parts[srcIdx + 2]
  const fileName = parts[parts.length - 1]
  const remainingPath = parts.slice(srcIdx + 3)

  // Public API patterns:
  // - src/modules/auth (directory)
  // - src/modules/auth/index.js
  // - src/modules/auth/index.ts
  if ((layerDir === options.modulesDir || layerDir === options.featuresDir) && entityName) {
    return remainingPath.length === 0 || (remainingPath.length === 1 && /^index\.(js|ts)$/.test(fileName))
  }

  return false
}

/**
 * Check if two module/feature imports are from the same entity
 */
function isSameEntity(fromLayer, toLayer) {
  if (fromLayer.layer !== toLayer.layer) return false
  if (!fromLayer.name || !toLayer.name) return false
  return fromLayer.name === toLayer.name
}

/**
 * Main validation logic
 */
function validateImport(fromLayer, toLayer, targetPath, importPath, options) {
  // Allow same-entity imports (same module or same feature)
  if (isSameEntity(fromLayer, toLayer)) {
    return null
  }

  // Handle module-to-module imports (they're always forbidden, but with different messages)
  if (fromLayer.layer === 'module' && toLayer.layer === 'module') {
    if (isPublicApiImport(targetPath, options)) {
      return {
        messageId: 'moduleToModuleImport',
        data: { importPath },
      }
    } else {
      return {
        messageId: 'deepModuleImport',
        data: { importPath },
      }
    }
  }

  // Handle feature-to-feature imports (always forbidden)
  if (fromLayer.layer === 'feature' && toLayer.layer === 'feature') {
    return {
      messageId: 'featureToFeatureImport',
      data: { importPath },
    }
  }

  // Handle feature-to-module imports (always forbidden)
  if (fromLayer.layer === 'feature' && toLayer.layer === 'module') {
    return {
      messageId: 'featureToModuleImport',
      data: { importPath },
    }
  }

  // Handle imports into app layer (forbidden from modules/features)
  if ((fromLayer.layer === 'module' || fromLayer.layer === 'feature') && toLayer.layer === 'app') {
    return {
      messageId: 'layerImportAppForbidden',
      data: { importPath },
    }
  }

  const rules = LAYER_RULES[fromLayer.layer]
  if (!rules) return null // Unknown layer, allow

  // Check for specific restrictions first
  const specificRestriction = rules.restrictedImports[toLayer.layer]
  const wildcardRestriction = rules.restrictedImports['*']

  // Apply specific restriction if it exists
  if (specificRestriction === 'forbidden') {
    return {
      messageId: 'forbiddenLayerImport',
      data: { from: fromLayer.layer, to: toLayer.layer, importPath },
    }
  }

  if (specificRestriction === 'publicApiOnly' && !isPublicApiImport(targetPath, options)) {
    const messageMap = {
      module: fromLayer.layer === 'app' ? 'appDeepImport' : 'deepModuleImport',
      feature: fromLayer.layer === 'app' ? 'appDeepImport' : 'deepFeatureImport',
    }
    return {
      messageId: messageMap[toLayer.layer] || 'forbiddenLayerImport',
      data: { importPath },
    }
  }

  // Check if import is explicitly allowed
  const isExplicitlyAllowed = rules.canImport.includes(toLayer.layer) || rules.canImport.includes('*')

  if (!isExplicitlyAllowed) {
    return {
      messageId: 'forbiddenLayerImport',
      data: { from: fromLayer.layer, to: toLayer.layer, importPath },
    }
  }

  // Apply wildcard restriction only if layer is not explicitly allowed AND no specific restriction exists
  if (!specificRestriction && wildcardRestriction === 'forbidden' && !isExplicitlyAllowed) {
    return {
      messageId: 'forbiddenLayerImport',
      data: { from: fromLayer.layer, to: toLayer.layer, importPath },
    }
  }

  return null // Import is allowed
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce import boundaries between layers according to the project blueprint',
      recommended: false,
    },
    messages: {
      deepModuleImport:
        "Importing internal file from another module is forbidden - import from the module public API instead: '{{importPath}}'",
      deepFeatureImport:
        "Importing internal file from another feature is forbidden - import from the feature public API instead: '{{importPath}}'",
      appDeepImport: "App should import module/feature public API only: '{{importPath}}'",
      moduleToModuleImport: "Importing from another module is forbidden (modules are isolated): '{{importPath}}'",
      featureToFeatureImport: "Importing from another feature is forbidden (features are isolated): '{{importPath}}'",
      featureToModuleImport: "Feature code must not import modules directly: '{{importPath}}'",
      layerImportAppForbidden: "Importing into 'app' from domain code is forbidden: '{{importPath}}'",
      forbiddenLayerImport: "Importing from '{{from}}' to '{{to}}' is forbidden: '{{importPath}}'",
    },
    defaultOptions: [defaultOptions],
    schema: [
      {
        type: 'object',
        properties: {
          src: { type: 'string', description: 'Source root folder' },
          modulesDir: { type: 'string', description: 'Modules folder name under src' },
          featuresDir: { type: 'string', description: 'Features folder name under src' },
          aliases: { type: 'object', description: 'Path aliases map' },
          allow: { type: 'array', items: { type: 'string' }, description: 'Allow-list of import patterns' },
          ignoreTypeImports: { type: 'boolean', description: 'Ignore TypeScript type-only imports' },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = { ...defaultOptions, ...(context.options[0] || {}) }

    function isAllowedByList(importPath) {
      return options.allow.some((pattern) => {
        if (pattern === importPath) return true
        if (pattern.endsWith('/*')) {
          return importPath.startsWith(pattern.slice(0, -1))
        }
        return false
      })
    }

    function checkImport(node, importPath) {
      if (!importPath || isAllowedByList(importPath)) return

      // Ignore type imports if configured
      if (options.ignoreTypeImports && node.importKind === 'type') return

      const importerPath = context.getFilename()
      if (!importerPath || importerPath === '<input>') return

      // Resolve the target path
      const targetPath = resolveImportPath(importPath, importerPath, options)
      if (!targetPath) return // External import

      // Get layer information
      const fromLayer = getLayerInfo(importerPath, options)
      const toLayer = getLayerInfo(targetPath, options)

      if (!fromLayer || !toLayer) return

      // Validate the import
      const violation = validateImport(fromLayer, toLayer, targetPath, importPath, options)
      if (violation) {
        context.report({
          node,
          messageId: violation.messageId,
          data: violation.data,
        })
      }
    }

    return {
      ImportDeclaration(node) {
        checkImport(node, node.source?.value)
      },
      ImportExpression(node) {
        if (node.source?.type === 'Literal') {
          checkImport(node, node.source.value)
        }
      },
      CallExpression(node) {
        // Handle require('...')
        if (node.callee?.name === 'require' && node.arguments?.[0]?.type === 'Literal') {
          checkImport(node, node.arguments[0].value)
        }
      },
    }
  },
}
