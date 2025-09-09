import { describe, it, expect } from 'vitest'
import { isInApp, isInFeature, isInShared, isInPath } from '@/utils/location.js'

describe('location.js', () => {
  // Tests for isInApp
  describe('isInApp', () => {
    it('returns true for file inside app directory', () => {
      expect(isInApp('src/app/foo.js')).toBe(true)
      expect(isInApp('src/app/bar/baz.js')).toBe(true)
    })

    it('returns false for file outside app directory', () => {
      expect(isInApp('src/features/foo.js')).toBe(false)
      expect(isInApp('src/shared/foo.js')).toBe(false)
      expect(isInApp('src/foo.js')).toBe(false)
    })
  })

  // Tests for isInFeature
  describe('isInFeature', () => {
    it('returns true for file inside feature directory', () => {
      expect(isInFeature('src/features/foo.js')).toBe(true)
      expect(isInFeature('src/features/bar/baz.js')).toBe(true)
    })

    it('returns false for file outside feature directory', () => {
      expect(isInFeature('src/app/foo.js')).toBe(false)
      expect(isInFeature('src/shared/foo.js')).toBe(false)
      expect(isInFeature('src/foo.js')).toBe(false)
    })
  })

  // Tests for isInShared
  describe('isInShared', () => {
    it('returns true for file inside shared directory', () => {
      expect(isInShared('src/shared/foo.js')).toBe(true)
      expect(isInShared('src/shared/bar/baz.js')).toBe(true)
    })

    it('returns false for file outside shared directory', () => {
      expect(isInShared('src/app/foo.js')).toBe(false)
      expect(isInShared('src/features/foo.js')).toBe(false)
      expect(isInShared('src/foo.js')).toBe(false)
    })
  })

  // Tests for isInPath
  describe('isInPath', () => {
    it('returns true for file inside specified directory', () => {
      expect(isInPath('src/custom/foo.js', '@/custom')).toBe(true)
      expect(isInPath('@/custom/bar/baz.js', 'src/custom')).toBe(true)
    })

    it('returns false for file outside specified directory', () => {
      expect(isInPath('src/app/foo.js', 'src/custom')).toBe(false)
      expect(isInPath('src/features/foo.js', 'src/custom')).toBe(false)
      expect(isInPath('src/foo.js', 'src/custom')).toBe(false)
    })
  })
})
