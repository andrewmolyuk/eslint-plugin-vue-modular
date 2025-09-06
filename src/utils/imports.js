// getImports(filename: string) => string[]
// isAliasImport(filename: string) => boolean
// isRelativeImport(filename: string) => boolean
// getImportDepth(from: string, to: string) => number
// resolveImportPath(from: string, to: string) => string

import { parse } from '@vue/compiler-sfc'
import { resolvePath } from './resolvers.js'
import fs from 'fs'

// Get all import paths from a file
export function getImports(filename, src = 'src', alias = '@') {
  const f = resolvePath(filename, src, alias)
  if (!f) return null

  const content = fs.readFileSync(f, 'utf-8')
  const { descriptor } = parse(content)
  const imports = []

  // Collect all import paths from the script sections
  if (descriptor.script && descriptor.script.content) {
    // Parse regular <script> imports
    const scriptContent = descriptor.script.content
    const importRegex = /import\s+.*?from\s+['"](.*?)['"]/g
    let match
    while ((match = importRegex.exec(scriptContent)) !== null) {
      imports.push(match[1])
    }
  }

  if (descriptor.scriptSetup && descriptor.scriptSetup.content) {
    // Parse <script setup> imports
    const setupContent = descriptor.scriptSetup.content
    const importRegex = /import\s+.*?from\s+['"](.*?)['"]/g
    let match
    while ((match = importRegex.exec(setupContent)) !== null) {
      imports.push(match[1])
    }
  }

  return imports
}
