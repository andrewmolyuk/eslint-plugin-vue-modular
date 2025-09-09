import nodePath from 'node:path'

// Normalize a file path by converting backslashes to forward slashes and
// collapsing '.' and '..' segments. Returns a path without a leading slash.
export function normalizePath(path: string): string {
  const trimmedPath = path.trim().replace(/\\+/g, '/').replace(/\/+/g, '/')
  if (trimmedPath === '') return ''

  // use posix normalize to collapse .. and . segments consistently across OS
  const collapsedPath = nodePath.posix.normalize(trimmedPath)

  // If the path normalizes to '.' keep it as '.'
  if (collapsedPath === '.' || collapsedPath === './') return '.'

  // remove any leading slashes or leading './'
  return collapsedPath.replace(/^\/+/, '').replace(/^\.\//, '')
}
