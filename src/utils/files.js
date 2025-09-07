import fs from 'fs'
import { parse } from '@vue/compiler-sfc'
import { resolvePath } from './resolvers.js'
import { minimatch } from 'minimatch'

// Check if a file is a Vue component
export function isComponent(filename, src = 'src', alias = '@') {
  const f = resolvePath(filename, src, alias)
  if (!f) return false
  const lower = f.toLowerCase()
  return lower.endsWith('.vue') && lower.includes('/components/')
}

// Check if a file is a store file
export function isStore(filename, src = 'src', alias = '@') {
  const f = resolvePath(filename, src, alias)
  if (!f) return false
  const lower = f.toLowerCase()
  return (lower.endsWith('.ts') || lower.endsWith('.js')) && lower.includes('/stores/')
}

// Check if a file is a service file
export function isService(filename, src = 'src', alias = '@') {
  const f = resolvePath(filename, src, alias)
  if (!f) return false
  const lower = f.toLowerCase()
  return (lower.endsWith('.ts') || lower.endsWith('.js')) && lower.includes('/services/')
}

// Check if a file is a Vue Composable file
export function isComposable(filename, src = 'src', alias = '@') {
  const f = resolvePath(filename, src, alias)
  if (!f) return false
  const lower = f.toLowerCase()
  return (lower.endsWith('.ts') || lower.endsWith('.js')) && lower.includes('/composables/')
}

// Check if a file is a Vue View component
export function isView(filename, view = 'views', src = 'src', alias = '@') {
  const f = resolvePath(filename, src, alias)
  if (!f) return false
  const lower = f.toLowerCase()
  return lower.endsWith('.vue') && lower.includes(`/${String(view).toLowerCase()}/`)
}

// Check if a file is an index file
export function isIndex(filename, index = 'index.ts', src = 'src', alias = '@') {
  const f = resolvePath(filename, src, alias)
  if (!f) return false
  const lower = f.toLowerCase()
  return lower.endsWith(`/${index.toLowerCase()}`)
}

// Check if a file is a layout file
export function isLayout(filename, layouts = 'src/app/layouts', src = 'src', alias = '@') {
  const f = resolvePath(filename, src, alias)
  if (!f) return false
  const l = resolvePath(layouts, src, alias)
  if (!l) return false

  // layout must be a .vue file in the layouts directory
  return f.toLowerCase().endsWith('.vue') && f.toLowerCase().startsWith(`${l.toLowerCase()}/`)
}

// Check if a file is a Single File Component (SFC)
export function isSFC(filename) {
  const f = resolvePath(filename)
  if (!f) return false
  const content = fs.readFileSync(f, 'utf-8')
  if (!content.includes('<template')) return false
  const { descriptor } = parse(content)
  return !!descriptor.template
}

// Check if a file is ignored based on ignore patterns
export function isIgnored(filename, patterns = []) {
  if (!filename) return false
  const f = resolvePath(filename)
  if (!f) return false

  return patterns.some((pattern) => {
    // If pattern contains glob characters, use minimatch
    if (['*', '?', '[', '/'].some((char) => pattern.includes(char))) {
      return minimatch(f, pattern, { dot: true })
    }

    // Otherwise, treat as substring match
    return f.includes(pattern)
  })
}
