import { describe, it, expect } from 'vitest'
import { isComponent, isStore, isService, isComposable, isView, isIndex, isLayout, isSFC, isIgnored } from '@/utils/files.js'
import { mockFile } from '../helpers.js'

describe('files.js', () => {
  // Tests for isComponent
  describe('isComponent', () => {
    it('returns true for .vue file in /components/', () => {
      expect(isComponent('/src/components/Foo.vue')).toBe(true)
    })
    it('returns false for .vue file not in /components/', () => {
      expect(isComponent('/src/views/Foo.vue')).toBe(false)
    })
    it('returns false for non-vue file', () => {
      expect(isComponent('/src/components/Foo.js')).toBe(false)
    })
    it('returns false if resolvePath returns null', () => {
      expect(isComponent('')).toBe(false)
    })
  })

  // Tests for isStore
  describe('isStore', () => {
    it('returns true for .ts file in /stores/', () => {
      expect(isStore('/src/stores/foo.ts')).toBe(true)
    })
    it('returns true for .js file in /stores/', () => {
      expect(isStore('/src/stores/foo.js')).toBe(true)
    })
    it('returns false for .vue file in /stores/', () => {
      expect(isStore('/src/stores/foo.vue')).toBe(false)
    })
    it('returns false for .ts file not in /stores/', () => {
      expect(isStore('/src/services/foo.ts')).toBe(false)
    })
    it('returns false if resolvePath returns null', () => {
      expect(isStore('')).toBe(false)
    })
  })

  // Tests for isService
  describe('isService', () => {
    it('returns true for .ts file in /services/', () => {
      expect(isService('/src/services/foo.ts')).toBe(true)
    })
    it('returns true for .js file in /services/', () => {
      expect(isService('/src/services/foo.js')).toBe(true)
    })
    it('returns false for .vue file in /services/', () => {
      expect(isService('/src/services/foo.vue')).toBe(false)
    })
    it('returns false for .ts file not in /services/', () => {
      expect(isService('/src/stores/foo.ts')).toBe(false)
    })
    it('returns false if resolvePath returns null', () => {
      expect(isService('')).toBe(false)
    })
  })

  // Tests for isComposable
  describe('isComposable', () => {
    it('returns true for .ts file in /composables/', () => {
      expect(isComposable('/src/composables/foo.ts')).toBe(true)
    })
    it('returns true for .js file in /composables/', () => {
      expect(isComposable('/src/composables/foo.js')).toBe(true)
    })
    it('returns false for .vue file in /composables/', () => {
      expect(isComposable('/src/composables/foo.vue')).toBe(false)
    })
    it('returns false for .ts file not in /composables/', () => {
      expect(isComposable('/src/services/foo.ts')).toBe(false)
    })
    it('returns false if resolvePath returns null', () => {
      expect(isComposable('')).toBe(false)
    })
  })

  // Tests for isView
  describe('isView', () => {
    it('returns true for .vue file in /views/', () => {
      expect(isView('/src/views/Foo.vue')).toBe(true)
    })
    it('returns false for .vue file not in /views/', () => {
      expect(isView('/src/components/Foo.vue')).toBe(false)
    })
    it('returns false for non-vue file in /views/', () => {
      expect(isView('/src/views/Foo.js')).toBe(false)
    })
    it('returns false if resolvePath returns null', () => {
      expect(isView('')).toBe(false)
    })
    it('supports custom view folder', () => {
      expect(isView('/src/pages/Foo.vue', 'pages')).toBe(true)
    })
  })

  // Tests for isIndex
  describe('isIndex', () => {
    it('returns true for index.ts file', () => {
      expect(isIndex('/src/foo/index.ts')).toBe(true)
    })
    it('returns false for non-index file', () => {
      expect(isIndex('/src/foo/bar.ts')).toBe(false)
    })
    it('returns true for custom index file', () => {
      expect(isIndex('/src/foo/main.js', 'main.js')).toBe(true)
    })
    it('returns false if resolvePath returns null', () => {
      expect(isIndex('')).toBe(false)
    })
  })

  // Tests for isLayout
  describe('isLayout', () => {
    it('returns true for .vue file in layouts dir', () => {
      expect(isLayout('src/app/layouts/MainLayout.vue')).toBe(true)
    })
    it('returns false for .vue file not in layouts dir', () => {
      expect(isLayout('src/views/MainLayout.vue')).toBe(false)
    })
    it('returns false for non-vue file in layouts dir', () => {
      expect(isLayout('src/app/layouts/MainLayout.js')).toBe(false)
    })
    it('returns false if resolvePath returns null for file', () => {
      expect(isLayout('')).toBe(false)
    })
    it('returns false if provided layouts path does not resolve', () => {
      // pass a layouts path without 'src' so resolvePath(layouts) returns null
      expect(isLayout('src/app/layouts/MainLayout.vue', 'app/layouts')).toBe(false)
    })
  })

  // Tests for isSFC
  describe('isSFC', () => {
    it('returns true for .vue file with <template>', () => {
      mockFile('src/components/Foo.vue', '<template><div/></template>')
      expect(isSFC('src/components/Foo.vue')).toBe(true)
    })
    it('returns false for file without <template>', () => {
      mockFile('src/components/Foo.vue', '<script></script>')
      expect(isSFC('src/components/Foo.vue')).toBe(false)
    })
    it('returns false if resolvePath returns null', () => {
      expect(isSFC('')).toBe(false)
    })
  })

  // Tests for isIgnored
  describe('isIgnored', () => {
    it('returns true if filename matches a pattern', () => {
      expect(isIgnored('src/foo/bar.js', ['bar'])).toBe(true)
      expect(isIgnored('src/foo/bar.js', ['**/*.js'])).toBe(true)
      expect(isIgnored('src/app/foo/bar.js', ['**/bar.js'])).toBe(true)
    })
    it('returns false if filename does not match any pattern', () => {
      expect(isIgnored('foo/bar.js', ['baz'])).toBe(false)
    })
    it('returns false if filename is falsy', () => {
      expect(isIgnored('', ['bar'])).toBe(false)
    })
    it('returns false if resolvePath returns null', () => {
      expect(isIgnored('foo/bar.js', ['bar'])).toBe(false)
    })
  })
})
