/**
 * String utilities for tests
 */
export function toPascalCase(name) {
  return String(name)
    .replace(/(^|[-_\s]+)([a-zA-Z0-9])/g, (_m, _g, ch) => ch.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, '')
}
