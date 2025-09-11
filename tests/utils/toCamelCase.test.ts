import { describe, it, expect } from 'vitest'
import { toCamelCase } from '../../src/utils'

describe('toCamelCase', () => {
  it('should convert snake_case to camelCase', () => {
    expect(toCamelCase('hello_world')).toBe('helloWorld')
  })

  it('should convert kebab-case to camelCase', () => {
    expect(toCamelCase('hello-world')).toBe('helloWorld')
  })

  it('should handle already camelCase strings', () => {
    expect(toCamelCase('helloWorld')).toBe('helloWorld')
  })

  it('should handle strings with multiple separators', () => {
    expect(toCamelCase('hello_world_test-case')).toBe('helloWorldTestCase')
  })

  it('should handle empty string', () => {
    expect(toCamelCase('')).toBe('')
  })

  it('should handle trailing separator', () => {
    expect(toCamelCase('trailing-')).toBe('trailing')
  })

  it('should handle single word', () => {
    expect(toCamelCase('hello')).toBe('hello')
  })
})
