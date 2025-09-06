import { resolvePath } from './resolvers.js'

// Check if a file is inside the app directory
export function isInApp(filename, app = 'src/app', src = 'src', alias = '@') {
  const f = resolvePath(filename, src, alias)
  return f && f.startsWith(resolvePath(app, src, alias))
}

// Check if a file is inside the feature directory
export function isInFeature(filename, feature = 'src/features', src = 'src', alias = '@') {
  const f = resolvePath(filename, src, alias)
  return f && f.startsWith(resolvePath(feature, src, alias))
}

// Check if a file is inside the shared directory
export function isInShared(filename, shared = 'src/shared', src = 'src', alias = '@') {
  const f = resolvePath(filename, src, alias)
  return f && f.startsWith(resolvePath(shared, src, alias))
}

// Check if a file is inside a specific directory
export function isInPath(filename, path, src = 'src', alias = '@') {
  const f = resolvePath(filename, src, alias)
  return f && f.startsWith(resolvePath(path, src, alias))
}
