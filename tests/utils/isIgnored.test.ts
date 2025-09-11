import { describe, it, expect } from 'vitest'
import { isIgnored } from '../../src/utils'

describe('isIgnored', () => {
  it('returns true if filePath matches any ignore pattern', () => {
    const filePath = 'src/components/Button.vue'
    const ignorePatterns = ['src/components/*']
    expect(isIgnored(filePath, ignorePatterns)).toBe(true)
  })

  it('returns false if filePath does not match any ignore pattern', () => {
    const filePath = 'src/views/Home.vue'
    const ignorePatterns = ['src/components/*']
    expect(isIgnored(filePath, ignorePatterns)).toBe(false)
  })

  it('returns true if filePath matches one of multiple ignore patterns', () => {
    const filePath = 'src/views/Home.vue'
    const ignorePatterns = ['src/components/*', 'src/views/*']
    expect(isIgnored(filePath, ignorePatterns)).toBe(true)
  })

  it('returns false for empty ignorePatterns array', () => {
    const filePath = 'src/components/Button.vue'
    const ignorePatterns: string[] = []
    expect(isIgnored(filePath, ignorePatterns)).toBe(false)
  })

  it('handles glob patterns with wildcards', () => {
    const filePath = 'src/utils/isIgnored.ts'
    const ignorePatterns = ['src/**/*.ts']
    expect(isIgnored(filePath, ignorePatterns)).toBe(true)
  })

  it('handles negated patterns (should not ignore)', () => {
    const filePath = 'src/components/Button.vue'
    const ignorePatterns = ['!src/components/Button.vue']
    expect(isIgnored(filePath, ignorePatterns)).toBe(false)
  })

  it('handles exact match patterns', () => {
    const filePath = 'src/components/Button.vue'
    const ignorePatterns = ['src/components/Button.vue']
    expect(isIgnored(filePath, ignorePatterns)).toBe(true)
  })
})
