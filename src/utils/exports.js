import fs from 'fs'
import { parse } from '@vue/compiler-sfc'
import { parse as babelParse } from '@babel/parser'
import { resolvePath } from './resolvers.js'

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
      // include exportDefaultFrom so we can handle `export default from 'x'` syntax
      plugins: ['typescript', 'jsx', 'classProperties', 'decorators-legacy', 'exportDefaultFrom'],
    })

    // simple AST walk to find export declarations
    walk(ast, (node) => {
      if ((node.type === 'ExportAllDeclaration' || node.type === 'ExportNamedDeclaration') && node.source && node.source.value) {
        if (!results.includes(node.source.value)) results.push(node.source.value)
        return
      }
      if (node.type === 'ExportDefaultDeclaration' && node.declaration) {
        // handle `export default from 'x'` (not common, but valid)
        if (node.declaration.type === 'Identifier' && node.declaration.name && node.source && node.source.value) {
          if (!results.includes(node.source.value)) results.push(node.source.value)
          return
        }
      }
    })
  } catch {
    // ignore parse errors
  }
}

// Utilities for extracting import statements from Vue single-file components (SFCs)
export function getImports(filename, src = 'src', alias = '@') {
  const f = resolvePath(filename, src, alias)
  if (!f) return null

  const content = fs.readFileSync(f, 'utf-8')
  const { descriptor } = parse(content, { filename: f })
  if (!descriptor) return null

  // If the component has no <script> and no <script setup> content,
  // treat it as having no exports information and return null.
  const hasScriptContent =
    (descriptor.script && descriptor.script.content && descriptor.script.content.trim().length > 0) ||
    (descriptor.scriptSetup && descriptor.scriptSetup.content && descriptor.scriptSetup.content.trim().length > 0)
  if (!hasScriptContent) return null

  const results = []

  if (descriptor.script && descriptor.script.content) collectFromCode(descriptor.script.content, results)
  if (descriptor.scriptSetup && descriptor.scriptSetup.content) collectFromCode(descriptor.scriptSetup.content, results)

  return results
}
