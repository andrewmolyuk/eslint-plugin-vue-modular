// getImports(filename: string) => string[]
// isAliasImport(filename: string) => boolean
// isRelativeImport(filename: string) => boolean
// getImportDepth(from: string, to: string) => number
// resolveImportPath(from: string, to: string) => string

import { parse } from '@vue/compiler-sfc'
import { resolvePath } from './resolvers.js'
import fs from 'fs'
import { parse as babelParse } from '@babel/parser'

// Simple recursive walker for AST nodes
function walk(node, cb) {
  if (!node || typeof node !== 'object') return
  cb(node)
  for (const k of Object.keys(node)) {
    const child = node[k]
    if (Array.isArray(child)) child.forEach((c) => walk(c, cb))
    else walk(child, cb)
  }
}

export function getImports(filename, src = 'src', alias = '@') {
  const f = resolvePath(filename, src, alias)
  if (!f) return null

  const content = fs.readFileSync(f, 'utf-8')
  const { descriptor } = parse(content, { filename: f })
  if (!descriptor) return null

  const results = []

  // Parse script blocks with @babel/parser to extract any imports
  const collectFromCode = (code) => {
    try {
      const ast = babelParse(code, {
        sourceType: 'module',
        plugins: ['typescript', 'jsx', 'classProperties', 'decorators-legacy', 'dynamicImport'],
      })

      // simple AST walk to find import and export declarations
      walk(ast, (node) => {
        // static imports: import x from 'y', import * as x from 'y', import {x} from 'y'
        if (node.type === 'ImportDeclaration' && node.source && node.source.value) {
          results.push(node.source.value)
          return
        }
        // dynamic imports: import('x') -- handle both CallExpression and ImportExpression shapes
        if (node.type === 'ImportExpression' || (node.type === 'CallExpression' && node.callee && node.callee.type === 'Import')) {
          const arg = node.arguments && node.arguments[0]
          const val = (arg && arg.type === 'StringLiteral' && arg.value) || (node.source && node.source.value)
          if (val) {
            results.push(val)
            return
          }
        }
        // re-exports: export * from 'x', export { .. } from 'x'
        if ((node.type === 'ExportAllDeclaration' || node.type === 'ExportNamedDeclaration') && node.source && node.source.value) {
          results.push(node.source.value)
          return
        }
      })
    } catch {
      // ignore parse errors
    }
  }

  if (descriptor.script && descriptor.script.content) collectFromCode(descriptor.script.content)
  if (descriptor.scriptSetup && descriptor.scriptSetup.content) collectFromCode(descriptor.scriptSetup.content)

  // Deduplicate while preserving order
  const seen = new Set()
  return results.filter((r) => (seen.has(r) ? false : seen.add(r)))
}

export default getImports
