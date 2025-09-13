// no external resolvePath required here
import path from 'path'
import { resolvePath } from './resolvePath'

// Check if an import path is absolute (starts with / or \)
function isAbsoluteImport(importPath: string) {
  return importPath.startsWith('/') || importPath.startsWith('\\')
}

// Check if an import path uses the configured alias (e.g. '@' or '~')
function isAliasImport(importPath: string, alias: string) {
  return importPath === alias || importPath.startsWith(`${alias}/`)
}

// Check if an import path is relative (./ or ../)
function isRelativeImport(importPath: string) {
  return importPath.startsWith('./') || importPath.startsWith('../') || importPath === '.' || importPath === '..'
}

// Resolve an import path to an absolute path within the project structure
export function resolveImportPath(from: string, to: string, src: string, alias: string): string | null {
  if (!from || !to) return null
  // Handle relative imports: resolve against the file's directory under src
  if (isRelativeImport(to)) {
    const fromAbs = path.resolve(src, from)
    const base = path.dirname(fromAbs)
    const resolved = path.resolve(base, to)
    return resolvePath(resolved, src, alias)
  }

  // Handle alias imports like '@/store'
  if (isAliasImport(to, alias)) {
    if (to === alias) return resolvePath(path.resolve(src), src, alias)
    const rel = to.slice((alias + '/').length)
    const resolved = path.resolve(src, rel)
    return resolvePath(resolved, src, alias)
  }

  // Handle absolute imports like '/api' -> map under src
  if (isAbsoluteImport(to)) {
    const rel = to.replace(/^\/+/, '')
    const resolved = path.resolve(src, rel)
    return resolvePath(resolved, src, alias)
  }

  return null
}
