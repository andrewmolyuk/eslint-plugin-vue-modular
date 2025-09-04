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
  const lower = filename.toLowerCase()
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
