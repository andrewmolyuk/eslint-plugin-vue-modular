import { describe, it, expect } from 'vitest'
import { normalizePath, resolvePath } from '../../src/utils/resolvers'

// Tests for normalizePath
describe('normalizePath', () => {
  it('should convert backslashes to forward slashes', () => {
    expect(normalizePath('src\\components\\Button.vue')).toBe('src/components/Button.vue')
  })

  it('should trim whitespace from the path', () => {
    expect(normalizePath('  /src/components/Button.vue  ')).toBe('src/components/Button.vue')
  })

  it('should collapse multiple backslashes and slashes', () => {
    expect(normalizePath('src\\\\\\components////Button.vue')).toBe('src/components/Button.vue')
  })

  it('should handle empty string', () => {
    expect(normalizePath('')).toBe('')
  })

  it('should handle only slashes', () => {
    expect(normalizePath('////src')).toBe('src')
  })

  it('should handle only backslashes', () => {
    expect(normalizePath('\\\\\\app')).toBe('app')
  })

  it('should handle mixed slashes and backslashes', () => {
    expect(normalizePath('\\//\\//root')).toBe('root')
  })
})

// Tests for resolvePath
describe('resolvePath', () => {
  it('should replace alias with root when path starts with alias', () => {
    expect(resolvePath('@/components/Button.vue')).toBe('src/components/Button.vue')
  })

  it('should replace custom alias and root', () => {
    expect(resolvePath('#/utils/helpers.js', 'app', '#')).toBe('app/utils/helpers.js')
  })

  it('should return path starting from root if root is included', () => {
    expect(resolvePath('src/components/Button.vue')).toBe('src/components/Button.vue')
    expect(resolvePath('foo/src/components/Button.vue')).toBe('src/components/Button.vue')
  })

  it('should handle custom root', () => {
    expect(resolvePath('app/utils/helpers.js', 'app')).toBe('app/utils/helpers.js')
    expect(resolvePath('foo/app/utils/helpers.js', 'app')).toBe('app/utils/helpers.js')
  })

  it('should return null if path does not start with alias or include root', () => {
    expect(resolvePath('components/Button.vue')).toBeNull()
    expect(resolvePath('foo/bar/baz.js')).toBeNull()
  })

  it('should normalize slashes and backslashes', () => {
    expect(resolvePath('\\@\\components\\Button.vue')).toBe('src/components/Button.vue')
    expect(resolvePath('src\\\\components//Input.vue')).toBe('src/components/Input.vue')
  })

  it('should handle empty filename', () => {
    expect(resolvePath('')).toBeNull()
  })

  it('should handle alias without trailing slash', () => {
    expect(resolvePath('@components/Button.vue')).toBeNull()
  })
  it('should handle multiple nested root', () => {
    expect(resolvePath('$/app/foo/bar/app.js', 'app', '$')).toBe('app/app/foo/bar/app.js')
    expect(resolvePath('app/app/foo/bar/baz.js', 'app')).toBe('app/app/foo/bar/baz.js')
  })
})
