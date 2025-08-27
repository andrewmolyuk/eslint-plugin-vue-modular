import path from 'node:path'
import { isTestFile } from '../utils/import-boundaries.js'

const defaultOptions = {
  src: 'src',
  modulesDir: 'modules',
  featuresDir: 'features',
  aliases: {},
  allow: [],
  ignoreTypeImports: true,
}

function getLayerForFile(filePath, options) {
  if (!filePath) return null

  // Check if this is a test file first
  if (isTestFile(filePath)) {
    return { layer: 'test' }
  }

  const parts = path.normalize(filePath).split(path.sep)
  const srcIdx = parts.indexOf(options.src)
  if (srcIdx === -1) return null
  const next = parts[srcIdx + 1]
  if (!next) return null
  // map common layer folder names to layer identifiers
  if (next === 'app') return { layer: 'app' }
  if (next === options.modulesDir) return { layer: 'module', name: parts[srcIdx + 2] }
  if (next === options.featuresDir) return { layer: 'feature', name: parts[srcIdx + 2] }
  if (next === 'composables') return { layer: 'composables' }
  if (next === 'components') return { layer: 'components' }
  if (next === 'services') return { layer: 'services' }
  if (next === 'stores') return { layer: 'stores' }
  if (next === 'entities') return { layer: 'entities' }
  if (next === 'shared' || next === 'lib') return { layer: 'shared' }
  return { layer: 'other' }
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce import boundaries between app/modules/features/shared according to the project blueprint',
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
    const opts = Object.assign({}, defaultOptions, context.options && context.options[0])

    function isAllowedByList(importPath) {
      return (opts.allow || []).some((pat) => {
        if (pat === importPath) return true
        // simple startsWith glob
        if (pat.endsWith('/*')) {
          return importPath.startsWith(pat.slice(0, -1))
        }
        return false
      })
    }

    function isPublicApiImportFor(targetPath, baseDir) {
      // true if targetPath equals baseDir or points to index.js/index.ts in that dir
      try {
        const rel = path.relative(path.resolve(process.cwd(), opts.src, baseDir), targetPath)
        if (rel === '' || rel === '.') return true
        if (rel === 'index.js' || rel === 'index.ts') return true
        return false
      } catch {
        return false
      }
    }

    function checkImport(node, importPathRaw) {
      if (!importPathRaw || isAllowedByList(importPathRaw)) return

      // ignore types if option set and node is TS import type
      if (opts.ignoreTypeImports && node.importKind === 'type') return

      const importerFilename = context.getFilename()
      if (!importerFilename || importerFilename === '<input>') return

      // Allow test files to import from anywhere without restrictions
      if (isTestFile(importerFilename)) return

      // Apply aliases manually
      let resolved = importPathRaw
      for (const [k, v] of Object.entries(opts.aliases || {})) {
        if (importPathRaw === k || importPathRaw.startsWith(k + '/')) {
          resolved = importPathRaw.replace(k, v)
          break
        }
      }

      // support common @/ alias mapping to src when not configured
      if (resolved.startsWith('@/')) {
        resolved = resolved.replace('@', opts.src)
      }

      // only handle src-local paths
      if (!resolved.startsWith(opts.src) && !resolved.startsWith('./') && !resolved.startsWith('../')) return

      // try to resolve to absolute path if possible
      let targetPath = resolved
      if (resolved.startsWith('./') || resolved.startsWith('../')) {
        targetPath = path.normalize(path.resolve(path.dirname(importerFilename), resolved))
      } else {
        // treat as project-local absolute like 'src/modules/foo'
        targetPath = path.normalize(path.resolve(context.getCwd ? context.getCwd() : process.cwd(), resolved))
      }

      const importerLayer = getLayerForFile(importerFilename, opts)
      const targetLayer = getLayerForFile(targetPath, opts)
      if (!importerLayer || !targetLayer) return

      // allow same-layer or same-module/feature internal imports
      if (importerLayer.layer === targetLayer.layer) {
        if (importerLayer.layer === 'module' || importerLayer.layer === 'feature') {
          if (importerLayer.name && targetLayer.name && importerLayer.name === targetLayer.name) return
        } else {
          return
        }
      }

      // now enforce matrix rules
      const from = importerLayer.layer
      const to = targetLayer.layer

      // app -> module/feature: public API only
      if (from === 'app' && (to === 'module' || to === 'feature')) {
        // only allow importing the module/feature public API (index file)
        const isPublic =
          isPublicApiImportFor(targetPath, path.join(opts.modulesDir, targetLayer.name)) ||
          isPublicApiImportFor(targetPath, path.join(opts.featuresDir, targetLayer.name))
        if (!isPublic) {
          context.report({
            node,
            messageId: 'appDeepImport',
            data: { importPath: importPathRaw },
          })
        }
        return
      }

      // module -> module: distinguish deep internal imports vs root imports
      if (from === 'module' && to === 'module') {
        const rel = path.relative(path.resolve(process.cwd(), opts.src, opts.modulesDir, targetLayer.name), targetPath)
        if (rel && !rel.startsWith('..') && rel !== '' && rel !== 'index.js' && rel !== 'index.ts') {
          // deep internal import
          context.report({
            node,
            messageId: 'deepModuleImport',
            data: { importPath: importPathRaw },
          })
        } else {
          // importing module root/public API from another module is also forbidden by isolation
          context.report({
            node,
            messageId: 'moduleToModuleImport',
            data: { importPath: importPathRaw },
          })
        }
        return
      }

      // feature -> feature: forbidden
      if (from === 'feature' && to === 'feature') {
        context.report({
          node,
          messageId: 'featureToFeatureImport',
          data: { importPath: importPathRaw },
        })
        return
      }

      // feature -> module: forbidden
      if (from === 'feature' && to === 'module') {
        context.report({
          node,
          messageId: 'featureToModuleImport',
          data: { importPath: importPathRaw },
        })
        return
      }

      // module/feature importing into app: forbidden
      if ((from === 'module' || from === 'feature') && to === 'app') {
        context.report({
          node,
          messageId: 'layerImportAppForbidden',
          data: { importPath: importPathRaw },
        })
        return
      }

      // module -> feature: allow only public API (index)
      if (from === 'module' && to === 'feature') {
        const isPublic = isPublicApiImportFor(targetPath, path.join(opts.featuresDir, targetLayer.name))
        if (!isPublic) {
          context.report({
            node,
            messageId: 'deepFeatureImport',
            data: { importPath: importPathRaw },
          })
        }
        return
      }

      // (duplicate module->module handling removed)

      // composables/components rules: cannot import app/modules/features
      if ((from === 'composables' || from === 'components') && (to === 'app' || to === 'module' || to === 'feature')) {
        context.report({
          node,
          messageId: 'forbiddenLayerImport',
          data: { from, to, importPath: importPathRaw },
        })
        return
      }

      // Layer access control rules
      if (from === 'services') {
        const allowedLayers = ['services', 'stores', 'entities', 'shared']
        if (!allowedLayers.includes(to)) {
          context.report({
            node,
            messageId: 'forbiddenLayerImport',
            data: { from, to, importPath: importPathRaw },
          })
        }
        return
      }

      if (from === 'stores') {
        const allowedLayers = ['stores', 'entities', 'shared']
        if (!allowedLayers.includes(to)) {
          context.report({
            node,
            messageId: 'forbiddenLayerImport',
            data: { from, to, importPath: importPathRaw },
          })
        }
        return
      }

      if (from === 'entities') {
        const allowedLayers = ['entities', 'shared']
        if (!allowedLayers.includes(to)) {
          context.report({
            node,
            messageId: 'forbiddenLayerImport',
            data: { from, to, importPath: importPathRaw },
          })
        }
        return
      }

      if (from === 'shared') {
        if (to !== 'shared') {
          context.report({
            node,
            messageId: 'forbiddenLayerImport',
            data: { from, to, importPath: importPathRaw },
          })
        }
        return
      }

      // default: allow
    }

    return {
      ImportDeclaration(node) {
        checkImport(node, node.source && node.source.value)
      },
      ImportExpression(node) {
        if (node.source && node.source.type === 'Literal') checkImport(node, node.source.value)
      },
      CallExpression(node) {
        // handle require('...')
        if (node.callee && node.callee.name === 'require' && node.arguments && node.arguments[0] && node.arguments[0].type === 'Literal') {
          checkImport(node, node.arguments[0].value)
        }
      },
    }
  },
}
