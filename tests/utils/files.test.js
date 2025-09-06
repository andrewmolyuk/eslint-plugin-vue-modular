import { describe, it, expect, vi } from 'vitest'
import { isComponent, isStore, isService, isComposable, isView, isIndex, isLayout, isSFC, isIgnored } from '../../src/utils/files.js'
import { resolvePath } from '../../src/utils/resolvers.js'
import fs from 'fs'

// Mock resolvePath and fs.readFileSync for isolation
vi.mock('../../src/utils/resolvers.js', () => ({
  resolvePath: vi.fn((filename) => (filename ? filename : null)),
  normalizePath: vi.fn((filename) => filename),
}))
vi.mock('fs', () => {
  const readFileSync = vi.fn()
  return {
    // provide both a default export (for `import fs from 'fs'`) and a named export
    default: { readFileSync },
    readFileSync,
  }
})
// Ensure minimatch is a simple callable default in tests
vi.mock('minimatch', () => {
  return {
    default: vi.fn((file, pattern) => {
      // very small subset behavior to satisfy tests
      if (pattern === '**/*.js') return file.endsWith('.js')
      if (pattern === '**/bar.js') return file.endsWith('/bar.js')
      return file.includes(pattern)
    }),
  }
})

describe('js utils', () => {
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
      resolvePath.mockReturnValueOnce(null)
      expect(isComponent('')).toBe(false)
    })
  })

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
      resolvePath.mockReturnValueOnce(null)
      expect(isStore('')).toBe(false)
    })
  })

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
      resolvePath.mockReturnValueOnce(null)
      expect(isService('')).toBe(false)
    })
  })

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
      resolvePath.mockReturnValueOnce(null)
      expect(isComposable('')).toBe(false)
    })
  })

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
      resolvePath.mockReturnValueOnce(null)
      expect(isView('')).toBe(false)
    })
    it('supports custom view folder', () => {
      expect(isView('/src/pages/Foo.vue', 'pages')).toBe(true)
    })
  })

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
      resolvePath.mockReturnValueOnce(null)
      expect(isIndex('')).toBe(false)
    })
  })

  describe('isLayout', () => {
    it('returns true for .vue file in layouts dir', () => {
      resolvePath.mockImplementation((filename) => filename)
      expect(isLayout('src/app/layouts/MainLayout.vue')).toBe(true)
    })
    it('returns false for .vue file not in layouts dir', () => {
      resolvePath.mockImplementation((filename) => filename)
      expect(isLayout('src/views/MainLayout.vue')).toBe(false)
    })
    it('returns false for non-vue file in layouts dir', () => {
      resolvePath.mockImplementation((filename) => filename)
      expect(isLayout('src/app/layouts/MainLayout.js')).toBe(false)
    })
    it('returns false if resolvePath returns null for file', () => {
      resolvePath.mockImplementationOnce(() => null)
      expect(isLayout('')).toBe(false)
    })
    it('returns false if resolvePath returns null for layouts', () => {
      resolvePath.mockImplementationOnce(() => 'src/app/layouts')
      resolvePath.mockImplementationOnce(() => null)
      expect(isLayout('src/app/layouts/MainLayout.vue')).toBe(false)
    })
  })

  describe('isSFC', () => {
    it('returns true for .vue file with <template>', () => {
      resolvePath.mockImplementation((filename) => filename)
      fs.readFileSync.mockReturnValue('<template><div/></template>')
      expect(isSFC('src/components/Foo.vue')).toBe(true)
    })
    it('returns false for file without <template>', () => {
      resolvePath.mockImplementation((filename) => filename)
      fs.readFileSync.mockReturnValue('<script></script>')
      expect(isSFC('src/components/Foo.vue')).toBe(false)
    })
    it('returns false if resolvePath returns null', () => {
      resolvePath.mockImplementationOnce(() => null)
      expect(isSFC('')).toBe(false)
    })
  })

  describe('isIgnored', () => {
    it('returns true if filename matches a pattern', () => {
      expect(isIgnored('foo/bar.js', ['bar'])).toBe(true)
      expect(isIgnored('foo/bar.js', ['**/*.js'])).toBe(true)
      expect(isIgnored('src/app/foo/bar.js', ['**/bar.js'])).toBe(true)
    })
    it('returns false if filename does not match any pattern', () => {
      expect(isIgnored('foo/bar.js', ['baz'])).toBe(false)
    })
    it('returns false if filename is falsy', () => {
      expect(isIgnored('', ['bar'])).toBe(false)
    })
  })
})
