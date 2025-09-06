// Normalize a file path by converting backslashes to forward slashes.
export function normalizePath(path) {
  return String(path).trim().replace(/\\+/g, '/').replace(/\/+/g, '/').replace(/^\/+/, '')
}

// Resolve a file path to be relative to the specified root directory, replacing the alias with the root if necessary.
export function resolvePath(filename, root = 'src', alias = '@') {
  const f = normalizePath(filename)
  const r = normalizePath(root)
  const a = normalizePath(alias)

  // when filename starts with alias + '/', replace alias with root
  if (f[0] === a && f.length > 1 && f[1] === '/') return r + f.slice(1)

  // when filename includes root, return filename starting from root
  if (f.includes(`${r}`)) return f.slice(f.indexOf(`${r}`))

  // otherwise, return null
  return null
}
