import { minimatch } from 'minimatch'
import path from 'path'

// Utility to parse rule options with defaults and normalization
export const parseRuleOptions = (context, defaultOptions) => {
  const options = context.options && context.options[0] ? context.options[0] : {}
  const parsed = {}

  for (const [key, value] of Object.entries(defaultOptions)) {
    parsed[key] = options[key] !== undefined ? options[key] : value

    if (Array.isArray(parsed[key])) {
      parsed[key] = parsed[key].map((item) => String(item).trim())
    } else if (typeof parsed[key] === 'string') {
      parsed[key] = String(parsed[key]).trim()
    }
  }

  return parsed
}

// Utility to convert strings to PascalCase
export function toPascalCase(name) {
  return String(name)
    .replace(/(^|[-_\s]+)([a-zA-Z0-9])/g, (_m, _g, ch) => ch.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, '')
}

// Utility to check if a file is a Vue component based on its path
export function isComponent(filename) {
  if (!filename) return false
  const lower = String(filename).toLowerCase()
  return lower.endsWith('.vue') || lower.includes('.component.') || lower.includes('.comp.')
}

// Utility to check if a file matches any ignore patterns
export function isFileIgnored(filename, ignorePatterns) {
  const rel = path.relative(process.cwd(), filename)
  return ignorePatterns.some((pattern) => minimatch(filename, pattern) || minimatch(rel, pattern))
}

// Utility to check if a file is outside the specified src directory
export function isOutsideSrc(filename, src) {
  if (!src) return false
  const rel = path.relative(process.cwd(), filename)
  const parts = rel.split(path.sep)
  return !parts.includes(src)
}

// Utility to check if a file is likely a test file based on its path
export function isTestFile(filename) {
  if (!filename) return false
  const lower = String(filename).toLowerCase()
  return lower.includes('/test/') || lower.includes('/tests/') || lower.includes('.spec.') || lower.includes('.test.')
}

// Utility to convert strings to camelCase
export function toCamelCase(name) {
  const s = String(name)
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (s.length === 0) return ''
  const [first, ...rest] = s
  if (rest.length === 0) return first.charAt(0).toLowerCase() + first.slice(1)
  return first.toLowerCase() + rest.map((w) => w[0].toUpperCase() + w.slice(1)).join('')
}

// Utility to ensure a function runs only once per ESLint execution context
export const runOnce = (ruleId) => {
  if (!global.__eslintVueModularRunId) {
    global.__eslintVueModularRunId = `${process.pid}_${process.cwd()}`
  }

  if (!global.__eslintVueModularState) {
    global.__eslintVueModularState = new Map()
  }

  const eslintRunId = global.__eslintVueModularRunId
  if (!global.__eslintVueModularState.has(eslintRunId)) {
    global.__eslintVueModularState.set(eslintRunId, new Set())
  }

  const seen = global.__eslintVueModularState.get(eslintRunId)
  if (seen.has(ruleId)) return false

  seen.add(ruleId)
  return true
}
