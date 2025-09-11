// Converts a string to camelCase
export function toCamelCase(str: string): string {
  if (!str) return ''

  // Trim and normalize separators (spaces, hyphens, underscores) to single spaces
  let s = String(str).trim()
  s = s.replace(/[-_]+/g, ' ')
  s = s.replace(/\s+/g, ' ')

  // Insert spaces before camel-case transitions like "fooBar" -> "foo Bar"
  s = s.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
  // Split sequences like "XMLHttp" into "XML Http"
  s = s.replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')

  const parts = s.split(' ').filter(Boolean)
  if (parts.length === 0) return ''

  const first = parts[0].toLowerCase()
  const rest = parts.slice(1).map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())

  return [first, ...rest].join('')
}
