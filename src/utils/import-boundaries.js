import path from 'node:path'

export const defaultOptions = {
  src: 'src',
  modulesDir: 'modules',
  featuresDir: 'features',
  aliases: {},
}

export function applyAliases(importPath, aliases, defaultSrc) {
  for (const [k, v] of Object.entries(aliases || {})) {
    if (importPath === k || importPath.startsWith(k + '/')) {
      return importPath.replace(k, v)
    }
  }
  if (importPath.startsWith('@/')) {
    return importPath.replace('@', defaultSrc)
  }
  return importPath
}

export function resolveToAbsolute(importPath, filename, opts) {
  if (!importPath) return null
  if (importPath.startsWith('./') || importPath.startsWith('../')) {
    return path.normalize(path.resolve(path.dirname(filename), importPath))
  }
  if (importPath.startsWith(opts.src)) {
    return path.normalize(path.resolve(process.cwd(), importPath))
  }
  return null
}

export function getLayerForPath(filePath, opts) {
  if (!filePath) return null
  const parts = path.normalize(filePath).split(path.sep)
  const srcIdx = parts.indexOf(opts.src)
  if (srcIdx === -1) return null
  const next = parts[srcIdx + 1]
  if (!next) return null
  if (next === 'app') return { layer: 'app' }
  if (next === opts.modulesDir) return { layer: 'module', name: parts[srcIdx + 2] }
  if (next === opts.featuresDir) return { layer: 'feature', name: parts[srcIdx + 2] }
  if (next === 'shared' || next === 'lib') return { layer: 'shared' }
  return { layer: 'other' }
}

export function isDeepModuleImport(importPath, filename, opts) {
  // handle alias-based imports like 'src/modules/<name>/...'
  const importAfterAlias = importPath.startsWith('@/') ? importPath.replace('@/', '') : importPath
  const modulesRegex = new RegExp(`^${opts.modulesDir}/([^/]+)/(.+)`)
  const m = importAfterAlias.match(modulesRegex)
  if (m) {
    const [, moduleName, subPath] = m
    return {
      type: 'src',
      moduleName,
      subPath,
      fullPath: importPath,
      allowedPath: `${opts.src}/${opts.modulesDir}/${moduleName}`,
    }
  }

  // relative imports: resolve and test
  if (importPath.startsWith('./') || importPath.startsWith('../')) {
    const resolved = resolveToAbsolute(importPath, filename, opts)
    if (!resolved) return null
    const relMatch = resolved.match(new RegExp(`/${opts.src}/${opts.modulesDir}/([^/]+)/(.+)`))
    if (relMatch) {
      const [, moduleName, subPath] = relMatch
      return {
        type: 'src',
        moduleName,
        subPath,
        fullPath: resolved,
        allowedPath: `${opts.src}/${opts.modulesDir}/${moduleName}`,
      }
    }
  }

  return null
}

export function isDeepFeatureImport(importPath, filename, opts) {
  // alias style
  const importAfterAlias = importPath.startsWith('@/') ? importPath.replace('@/', '') : importPath
  const featuresRegex = new RegExp(`^${opts.featuresDir}/([^/]+)(?:/(.+))?$`)
  const m = importAfterAlias.match(featuresRegex)
  if (m) {
    const [, featureName, subPath] = m
    if (!subPath) return null
    return { type: 'src', featureName, subPath, fullPath: importPath, allowedPath: `${opts.src}/${opts.featuresDir}/${featureName}` }
  }

  // modules/<module>/features/<feature>/...
  const modulesFeaturesRegex = new RegExp(`^${opts.modulesDir}/([^/]+)/${opts.featuresDir}/([^/]+)(?:/(.+))?$`)
  const mm = importAfterAlias.match(modulesFeaturesRegex)
  if (mm) {
    const [, moduleName, featureName, subPath] = mm
    if (!subPath) return null
    return { type: 'modules', moduleName, featureName, subPath, fullPath: importPath, allowedPath: `${opts.src}/${opts.modulesDir}/${moduleName}/${opts.featuresDir}/${featureName}` }
  }

  // relative resolution
  if (importPath.startsWith('./') || importPath.startsWith('../')) {
    const resolved = resolveToAbsolute(importPath, filename, opts)
    if (!resolved) return null
    const rel = resolved.match(new RegExp(`/${opts.src}/${opts.featuresDir}/([^/]+)(?:/(.+))?$`))
    if (rel) {
      const [, featureName, subPath] = rel
      if (!subPath) return null
      return { type: 'src', featureName, subPath, fullPath: resolved, allowedPath: `${opts.src}/${opts.featuresDir}/${featureName}` }
    }
    const rel2 = resolved.match(new RegExp(`/${opts.modulesDir}/([^/]+)/${opts.featuresDir}/([^/]+)(?:/(.+))?$`))
    if (rel2) {
      const [, moduleName, featureName, subPath] = rel2
      if (!subPath) return null
      return { type: 'modules', moduleName, featureName, subPath, fullPath: resolved, allowedPath: `${opts.src}/${opts.modulesDir}/${moduleName}/${opts.featuresDir}/${featureName}` }
    }
  }

  return null
}

export function getModulePublicImport(importPath, opts) {
  if (!importPath.startsWith('@/')) return null
  const aliasPath = importPath.replace('@/', '')
  const m = aliasPath.match(new RegExp(`^${opts.modulesDir}/([^/]+)(?:/index(?:\.(?:js|ts|jsx|tsx))?)?$`))
  if (m) return m[1]
  return null
}

export function isWithinSameModule(filename, moduleName, opts) {
  return filename.includes(`/${opts.src}/${opts.modulesDir}/${moduleName}/`)
}

export function isWithinSameFeature(filename, featureInfo, opts) {
  if (featureInfo.type === 'src') {
    return filename.includes(`/${opts.src}/${opts.featuresDir}/${featureInfo.featureName}/`)
  }
  if (featureInfo.type === 'modules') {
    return filename.includes(`/${opts.modulesDir}/${featureInfo.moduleName}/`)
  }
  return false
}
