import { normalizePath } from '.'

// Resolve a file path to be relative to the specified root directory, replacing the alias with the root if necessary.
export function resolvePath(path: string, rootPath: string, rootAlias: string): string | null {
  const normalizedPath = normalizePath(path)
  const normalizedRoot = normalizePath(rootPath)
  const normalizedAlias = normalizePath(rootAlias)

  // when filename starts with alias + '/', replace alias with root
  if (normalizedPath.startsWith(`${normalizedAlias}/`)) return normalizedRoot + normalizedPath.slice(normalizedAlias.length)

  // when filename includes root, return filename starting from the last occurrence of root
  const rootIndex = normalizedPath.lastIndexOf(`${normalizedRoot}`)
  if (rootIndex !== -1) return normalizedPath.slice(rootIndex)

  // otherwise, return null
  return null
}
