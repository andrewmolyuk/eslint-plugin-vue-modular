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

// Parse script blocks with @babel/parser to extract any imports
const collectFromCode = (code, results) => {
  try {
    const ast = babelParse(code, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx', 'classProperties', 'decorators-legacy', 'dynamicImport'],
    })

    // simple AST walk to find import and export declarations
    walk(ast, (node) => {
      // static imports: import x from 'y', import * as x from 'y', import {x} from 'y'
      if (node.type === 'ImportDeclaration' && node.source && node.source.value) {
        if (!results.includes(node.source.value)) results.push(node.source.value)
        return
      }
      // dynamic imports: import('x') -- handle both CallExpression and ImportExpression shapes
      if (node.type === 'ImportExpression' || (node.type === 'CallExpression' && node.callee && node.callee.type === 'Import')) {
        const arg = node.arguments && node.arguments[0]
        const val = (arg && arg.type === 'StringLiteral' && arg.value) || (node.source && node.source.value)
        if (val) {
          if (!results.includes(val)) results.push(val)
          return
        }
      }
      // re-exports: export * from 'x', export { .. } from 'x'
      if ((node.type === 'ExportAllDeclaration' || node.type === 'ExportNamedDeclaration') && node.source && node.source.value) {
        if (!results.includes(node.source.value)) results.push(node.source.value)
        return
      }
    })
  } catch {
    // ignore parse errors
  }
}

export function getImports(filename, src = 'src', alias = '@') {
  const f = resolvePath(filename, src, alias)
  if (!f) return null

  const content = fs.readFileSync(f, 'utf-8')
  const { descriptor } = parse(content, { filename: f })
  if (!descriptor) return null

  const results = []

  if (descriptor.script && descriptor.script.content) collectFromCode(descriptor.script.content, results)
  if (descriptor.scriptSetup && descriptor.scriptSetup.content) collectFromCode(descriptor.scriptSetup.content, results)

  return results
}

// Check if an import path is absolute (starts with / or \)
export function isAbsoluteImport(importPath) {
  if (!importPath || typeof importPath !== 'string') return false
  return importPath.startsWith('/') || importPath.startsWith('\\')
}

// Check if an import path uses the configured alias (e.g. '@' or '~')
export function isAliasImport(importPath, alias = '@') {
  if (!importPath || typeof importPath !== 'string') return false
  return importPath === alias || importPath.startsWith(`${alias}/`)
}

// Check if an import path is relative (./ or ../)
export function isRelativeImport(importPath) {
  if (!importPath || typeof importPath !== 'string') return false
  return importPath.startsWith('./') || importPath.startsWith('../') || importPath === '.' || importPath === '..'
}

// Calculate the "depth" of an import from one file to another
export function getImportDepth(from, to, src = 'src', alias = '@') {
  if (!from || !to) return null
  const fromPath = resolvePath(from, src, alias)
  const toPath = resolvePath(to, src, alias)
  if (!fromPath || !toPath) return null

  const fromParts = fromPath.split('/').filter((p) => p && p !== src)
  const toParts = toPath.split('/').filter((p) => p && p !== src)

  // Remove filename parts
  fromParts.pop()
  toParts.pop()

  // remove common leading parts
  while (fromParts.length && toParts.length && fromParts[0] === toParts[0]) {
    fromParts.shift()
    toParts.shift()
  }

  // depth is number of up moves (fromParts) plus down moves (toParts)
  return fromParts.length + toParts.length
}

// Resolve an import path to an absolute path within the project structure
export function resolveImportPath(from, to, src = 'src', alias = '@') {
  if (!from || !to) return null
  const fromPath = resolvePath(from, src, alias)
  if (!fromPath) return null

  if (isRelativeImport(to)) {
    const base = fromPath.split('/').slice(0, -1).join('/')
    return resolvePath(`${base}/${to}`, src, alias)
  }
  if (isAliasImport(to, alias) || isAbsoluteImport(to)) {
    return resolvePath(to, src, alias)
  }
  return null
}
