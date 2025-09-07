import { describe, it, expect } from 'vitest'
import { toCamelCase, toKebabCase, toPascalCase } from '../../src/utils/strings.js'

describe('strings.js', () => {
  describe('toCamelCase', () => {
    it('converts kebab-case to camelCase', () => {
      expect(toCamelCase('my-string-value')).toBe('myStringValue')
    })

    it('converts snake_case to camelCase', () => {
      expect(toCamelCase('my_string_value')).toBe('myStringValue')
    })

    it('handles mixed separators', () => {
      expect(toCamelCase('my-string_value')).toBe('myStringValue')
    })

    it('returns single word as lowercased', () => {
      expect(toCamelCase('Test')).toBe('test')
    })

    it('handles empty string', () => {
      expect(toCamelCase('')).toBe('')
    })

    it('handles trailing separator', () => {
      expect(toCamelCase('trailing-')).toBe('trailing')
    })

    it('handles multiple consecutive separators', () => {
      expect(toCamelCase('my--string__value')).toBe('myStringValue')
    })
  })

  describe('toKebabCase', () => {
    it('converts camelCase to kebab-case', () => {
      expect(toKebabCase('myStringValue')).toBe('my-string-value')
    })

    it('converts PascalCase to kebab-case', () => {
      expect(toKebabCase('MyStringValue')).toBe('my-string-value')
    })

    it('converts snake_case to kebab-case', () => {
      expect(toKebabCase('my_string_value')).toBe('my-string-value')
    })

    it('converts space separated to kebab-case', () => {
      expect(toKebabCase('my string value')).toBe('my-string-value')
    })

    it('handles empty string', () => {
      expect(toKebabCase('')).toBe('')
    })

    it('handles already kebab-case', () => {
      expect(toKebabCase('my-string-value')).toBe('my-string-value')
    })
  })

  describe('toPascalCase', () => {
    it('converts kebab-case to PascalCase', () => {
      expect(toPascalCase('my-string-value')).toBe('MyStringValue')
    })

    it('converts snake_case to PascalCase', () => {
      expect(toPascalCase('my_string_value')).toBe('MyStringValue')
    })

    it('converts camelCase to PascalCase', () => {
      expect(toPascalCase('myStringValue')).toBe('MyStringValue')
    })

    it('returns single word as capitalized', () => {
      expect(toPascalCase('test')).toBe('Test')
    })

    it('handles empty string', () => {
      expect(toPascalCase('')).toBe('')
    })

    it('handles multiple consecutive separators', () => {
      expect(toPascalCase('my--string__value')).toBe('MyStringValue')
    })
  })
})
