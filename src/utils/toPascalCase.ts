import { toCamelCase } from './toCamelCase'

// Utility to convert a string to PascalCase
export function toPascalCase(str: string): string {
  const camel = toCamelCase(str)
  return camel.charAt(0).toUpperCase() + camel.slice(1)
}
