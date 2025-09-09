// Utility to convert a string to camelCase
export function toCamelCase(name) {
  return name.replace(/[-_]+(.)?/g, (_, c) => (c ? c.toUpperCase() : '')).replace(/^(.)/, (c) => c.toLowerCase())
}

// Utility to convert a string to kebab-case
export function toKebabCase(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .toLowerCase()
}

// Utility to convert a string to PascalCase
export function toPascalCase(name) {
  const camel = toCamelCase(name)
  return camel.charAt(0).toUpperCase() + camel.slice(1)
}
