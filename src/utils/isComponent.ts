import { resolvePath, normalizePath } from '.'

// Check if a file is a Vue component
export function isComponent(filename: string, rootPath: string, rootAlias: string, componentsFolderName: string) {
  const resolvedFilename = resolvePath(filename, rootPath, rootAlias)
  if (!resolvedFilename) return false

  // normalize path separators so Windows-style backslashes are handled
  const normalizedFilename = normalizePath(resolvedFilename)

  // check file extension is .vue
  const lower = normalizedFilename.toLowerCase()
  if (!lower.endsWith('.vue')) return false

  // check last part of path is 'components'
  const parts = normalizedFilename.split('/')
  return parts.length >= 2 && parts[parts.length - 2] === componentsFolderName
}
