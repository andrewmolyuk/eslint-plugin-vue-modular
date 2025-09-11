// Converts a string to camelCase
export function toCamelCase(str: string): string {
  return str.replace(/[-_]+(.)?/g, (_, chr) => (chr ? chr.toUpperCase() : '')).replace(/^(.)/, (match) => match.toLowerCase())
}
