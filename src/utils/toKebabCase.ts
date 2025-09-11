// Utility to convert a string to kebab-case
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
}
