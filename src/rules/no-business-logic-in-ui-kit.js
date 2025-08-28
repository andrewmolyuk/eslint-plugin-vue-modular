import path from 'node:path'
import { isTestFile, applyAliases } from '../utils/import-boundaries.js'

const DEFAULTS = {
  uiKitPaths: ['src/shared/ui/'],
  allowedImports: [],
  detectSideEffects: true,
}

// Check if a file is in a UI kit directory
function isInUiKitDirectory(filePath, uiKitPaths) {
  return uiKitPaths.some((uiPath) => filePath.includes(`/${uiPath}`) || filePath.includes(uiPath))
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce that UI kit files only import from their own layer or external libraries',
      recommended: true,
    },
    messages: {
      forbiddenImport:
        "UI kit files should not import from business logic layers ('{{source}}'). Only imports from shared/ui, external libraries, or relative paths within the UI kit are allowed.",
      sideEffect: 'Side-effectful operations are not allowed in UI kit files.',
    },
    schema: [
      {
        type: 'object',
        description: 'Options for no-business-logic-in-ui-kit rule',
        properties: {
          uiKitPaths: { type: 'array', description: 'Paths matching UI kit directories' },
          allowedImports: { type: 'array', description: 'Explicitly allowed import module names' },
          detectSideEffects: { type: 'boolean', description: 'Enable side-effect detection' },
        },
        additionalProperties: false,
      },
    ],
    defaultOptions: [DEFAULTS],
  },

  create(context) {
    const options = Object.assign({}, DEFAULTS, context.options[0] || {})
    const filename = context.getFilename()
    if (!filename || filename === '<input>') return {}

    // Allow test files to import from anywhere without restrictions
    if (isTestFile(filename)) return {}

    // Normalize filename to project-relative path following sibling rule patterns
    const normalizeFilename = (filepath) => {
      // Handle test case filenames that start with '/project/'
      if (filepath.startsWith('/project/')) {
        return filepath.replace('/project/', '').replaceAll(path.sep, '/')
      }

      try {
        const cwd = context.getCwd ? context.getCwd() : process.cwd()
        const rel = path.relative(cwd, filepath)
        return rel && !rel.startsWith('..') ? rel.replaceAll(path.sep, '/') : filepath.replaceAll(path.sep, '/')
      } catch {
        return filepath.replaceAll(path.sep, '/')
      }
    }

    const relFilename = normalizeFilename(filename)

    // Check if this file is a UI kit file
    const isUiKit = isInUiKitDirectory(relFilename, options.uiKitPaths)
    if (!isUiKit) return {}

    function reportImport(node, source) {
      context.report({ node, messageId: 'forbiddenImport', data: { source } })
    }

    function isForbiddenImport(source) {
      if (!source) return false

      // Allow explicitly allowed imports
      if (options.allowedImports.includes(source)) return false

      // Apply aliases using common utility
      const resolvedSource = applyAliases(source, {}, 'src')

      // Allow external libraries (bare imports that don't start with resolved paths)
      if (!source.startsWith('.') && !source.startsWith('@/') && !resolvedSource.startsWith('src/')) {
        return false
      }

      // Allow relative imports within the same UI kit directory
      if (source.startsWith('.')) {
        try {
          const abs = path.resolve(path.dirname(filename), source)
          const rel = normalizeFilename(abs)
          // Check if resolved path is still within any UI kit path
          return !isInUiKitDirectory(rel, options.uiKitPaths)
        } catch {
          return true
        }
      }

      // Allow imports from shared/ui and from the top-level shared folder
      // (projects may keep common utilities/constants under `src/shared/`)
      if (resolvedSource.startsWith('src/shared/ui/') || resolvedSource === 'src/shared' || resolvedSource.startsWith('src/shared/')) {
        return false
      }

      // All other src/ imports are forbidden (business logic layers)
      if (resolvedSource.startsWith('src/')) {
        return true
      }

      return false
    }

    function isSideEffectCall(node) {
      if (!node || !node.callee) return false

      if (node.callee.type === 'Identifier') {
        const name = node.callee.name
        return ['fetch', 'axios', 'request'].includes(name)
      }

      if (node.callee.type === 'MemberExpression') {
        const object = node.callee.object
        const prop = node.callee.property
        const objName = object && object.name
        const propName = prop && (prop.name || prop.value)

        // Common side-effect patterns
        return (
          (objName === 'store' && propName === 'dispatch') ||
          (objName === 'router' && propName === 'push') ||
          (objName === 'console' && ['log', 'warn', 'error'].includes(propName)) ||
          (objName === 'localStorage' && ['setItem', 'removeItem', 'clear'].includes(propName)) ||
          (objName === 'sessionStorage' && ['setItem', 'removeItem', 'clear'].includes(propName))
        )
      }

      return false
    }

    return {
      ImportDeclaration(node) {
        const source = node.source && node.source.value
        if (isForbiddenImport(source)) {
          reportImport(node, source)
        }
      },
      CallExpression(node) {
        if (!options.detectSideEffects) return
        if (isSideEffectCall(node)) {
          context.report({ node, messageId: 'sideEffect' })
        }
      },
    }
  },
}
