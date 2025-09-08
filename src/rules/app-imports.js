import path from 'path'
import { parseRuleOptions, isIgnored, getImports, resolveImportPath, isRelativeImport } from '../utils'
import { resolvePath } from '../utils/resolvers.js'

const defaultOptions = {
  app: 'src/app',
  shared: 'src/shared',
  features: 'src/features',
  ignore: [],
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        "Restrict imports inside the 'app/' layer: app files should only import from 'shared/' and the public API of 'features/'. The app router may import feature route files.",
      category: 'Best Practices',
      recommended: false,
    },
    defaultOptions: [defaultOptions],
    schema: [
      {
        type: 'object',
        properties: {
          app: { type: 'string' },
          shared: { type: 'string' },
          features: { type: 'string' },
          ignore: { type: 'array', items: { type: 'string' } },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      forbiddenOther: "App files may only import from '{{allowed}}' (target: '{{target}}').",
      forbiddenDeepFeature: "App files should import a feature's public API only. Deep import into '{{targetFeature}}' is not allowed.",
    },
  },

  create(context) {
    const { app, shared, features, ignore } = parseRuleOptions(context, defaultOptions)
    const processed = new Set()

    const processImport = (filename, isRouter, impSpec, reportNode) => {
      if (!impSpec || typeof impSpec !== 'string') return

      // resolve relative imports, otherwise use spec as-is
      let resolved = isRelativeImport(impSpec) ? resolveImportPath(filename, impSpec) : impSpec
      if (isRelativeImport(impSpec) && !resolved) {
        // fallback: resolve relative path by joining with filename dir and normalizing via resolvePath
        const joined = path.join(path.dirname(filename), impSpec)
        resolved = resolvePath(joined) || resolved
      }
      if (!resolved) return

      // normalize to forward slashes (keep as string for simple matching)
      const norm = String(resolved).replace(/\\+/g, '/').replace(/^\/+/, '')

      // quick checks: shared path or features path
      const featuresName = String(features).split('/').filter(Boolean).pop()
      const sharedName = String(shared).split('/').filter(Boolean).pop()

      // If import is from shared, it's allowed
      if (norm === shared || norm === `src/${sharedName}` || norm.startsWith(`${shared}/`) || norm.startsWith(`src/${sharedName}/`)) return

      // Detect a features import by either normalized path or raw spec
      const featureRe = new RegExp(`(?:^|/)${featuresName}/([^/]+)`) // captures the feature name
      const match = String(norm).match(featureRe) || String(impSpec).match(featureRe)
      if (match) {
        const targetFeature = match[1]
        if (!targetFeature) return
        if (isIgnored(targetFeature, ignore)) return

        // detect deep import beyond features/<feature>
        const after = String(norm).split(`${featuresName}/${targetFeature}/`)[1]
        if (after && after.length > 0) {
          const afterParts = after.split('/').filter(Boolean)
          const includesRoutes = afterParts.includes('routes') || afterParts.some((s) => s && s.startsWith('routes'))
          if (isRouter && includesRoutes) return

          context.report({ node: reportNode, messageId: 'forbiddenDeepFeature', data: { targetFeature } })
          return
        }

        // public API import allowed
        return
      }

      // Import is not from shared or features -> forbidden
      const allowed = `${shared}, ${features}`
      const parts = String(norm).split('/')
      const target = parts[parts.length - 1] || ''
      if (!isIgnored(target, ignore)) {
        context.report({ node: reportNode, messageId: 'forbiddenOther', data: { allowed, target } })
      }
    }

    return {
      ImportDeclaration(node) {
        try {
          const filename = context.getFilename()
          if (!filename || filename === '<input>' || filename === '<text>') return
          const normalized = path.normalize(filename)
          const parts = normalized.split(path.sep)
          const appIdx = parts.lastIndexOf(app)
          if (appIdx === -1) return
          const base = parts[parts.length - 1] || ''
          const isRouter = base === 'router.ts' || base === 'router.js'
          const imp = node && node.source && node.source.value
          if (imp && !processed.has(imp)) processImport(filename, isRouter, imp, node)
        } catch {
          /* ignore */
        }
      },
      Program(programNode) {
        const filename = context.getFilename()
        if (!filename || filename === '<input>' || filename === '<text>') return

        const normalized = path.normalize(filename)
        const parts = normalized.split(path.sep)
        const appIdx = parts.lastIndexOf(app)
        if (appIdx === -1) return

        const base = parts[parts.length - 1] || ''
        const isRouter = base === 'router.ts' || base === 'router.js'
        // note: don't store fileState, pass filename/isRouter to processImport directly

        // collect imports using utility and process them; report on Program node
        try {
          const imports = getImports(filename) || []
          for (const imp of imports) {
            if (!processed.has(imp)) processImport(filename, isRouter, imp, programNode)
          }
        } catch {
          // ignore collector failures; conservative behavior
        }
      },
    }
  },
}
