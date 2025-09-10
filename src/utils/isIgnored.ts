import { Minimatch } from 'minimatch'

export function isIgnored(filePath: string, ignorePatterns: string[]): boolean {
  return ignorePatterns && ignorePatterns.some((pattern) => new Minimatch(pattern).match(filePath))
}
