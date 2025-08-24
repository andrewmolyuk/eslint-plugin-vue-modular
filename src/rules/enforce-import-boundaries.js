import path from 'node:path'
import fs from 'node:fs'

const defaultOptions = {
  src: 'src',
  modulesDir: 'modules',
  featuresDir: 'features',
  aliases: {},
  allow: [],
  ignoreTypeImports: true,
}

function resolveAlias(importPath, aliases) {
  for (const [k, v] of Object.entries(aliases || {})) {
    if (importPath === k || importPath.startsWith(k + '/')) {
      return importPath.replace(k, v)
    }
  }
  return importPath
}

function getLayerForFile(filePath, options) {
  if (!filePath) return null
  const parts = path.normalize(filePath).split(path.sep)
  const srcIdx = parts.indexOf(options.src)
  if (srcIdx === -1) return null
  const next = parts[srcIdx + 1]
  if (!next) return null
  if (next === 'app') return { layer: 'app' }
  if (next === options.modulesDir) return { layer: 'module', name: parts[srcIdx + 2] }
  if (next === options.featuresDir) return { layer: 'feature', name: parts[srcIdx + 2] }
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
    defaultOptions: [],
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

    function checkImport(node, importPathRaw) {
      if (!importPathRaw || isAllowedByList(importPathRaw)) return

      // ignore types if option set and node is TS import type
      if (opts.ignoreTypeImports && node.importKind === 'type') return

      const importerFilename = context.getFilename()
      if (!importerFilename || importerFilename === '<input>') return

      let resolved = resolveAlias(importPathRaw, opts.aliases)
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

      // Different module/feature -> allow only public API (index) import
      if (importerLayer.layer === 'module' && targetLayer.layer === 'module' && importerLayer.name !== targetLayer.name) {
        // allowed only if import path points to module root
        const rel = path.relative(path.resolve(process.cwd(), opts.src, opts.modulesDir, targetLayer.name), targetPath)
        if (rel && !rel.startsWith('..') && rel !== '' && rel !== 'index.js' && rel !== 'index.ts') {
          context.report({ node, messageId: 'deepModuleImport', data: { importPath: importPathRaw } })
        }
      }

      // feature <-> feature cross imports
      if (importerLayer.layer === 'feature' && targetLayer.layer === 'feature' && importerLayer.name !== targetLayer.name) {
        const rel = path.relative(path.resolve(process.cwd(), opts.src, opts.featuresDir, targetLayer.name), targetPath)
        if (rel && !rel.startsWith('..') && rel !== '' && rel !== 'index.js' && rel !== 'index.ts') {
          context.report({ node, messageId: 'deepFeatureImport', data: { importPath: importPathRaw } })
        }
      }

      // app importing module/feature internals
      if (importerLayer.layer === 'app' && (targetLayer.layer === 'module' || targetLayer.layer === 'feature')) {
        const base = targetLayer.layer === 'module' ? opts.modulesDir : opts.featuresDir
        const rel = path.relative(path.resolve(process.cwd(), opts.src, base, targetLayer.name), targetPath)
        if (rel && !rel.startsWith('..') && rel !== '' && rel !== 'index.js' && rel !== 'index.ts') {
          context.report({ node, messageId: 'appDeepImport', data: { importPath: importPathRaw } })
        }
      }
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
