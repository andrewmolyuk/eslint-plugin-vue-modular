import { minimatch } from 'minimatch'

export function isIgnored(filePath: string, ignorePatterns: string[]): boolean {
  if (!ignorePatterns || ignorePatterns.length === 0) return false

  return ignorePatterns.some((pattern) => minimatch(filePath, pattern))
}
