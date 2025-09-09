import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as bp from '@babel/parser'
import * as sfc from '@vue/compiler-sfc'
import { getImports, isAbsoluteImport, isAliasImport, isRelativeImport, getImportDepth, resolveImportPath } from '@/utils/imports.js'
import { mockFile, setupTest } from '../helpers.js'

const filename = 'src/mock/path/MyComponent.vue'

beforeEach(() => {
  setupTest(filename)
})

describe('imports.js', () => {
  // Tests for getImports
  describe('getImports', () => {
    it('returns null if file does not exist', () => {
      expect(getImports('/mock/path/MyComponent.vue')).toBeNull()
    })

    it('returns null if file is not a Vue SFC', () => {
      expect(getImports('/mock/path/MyComponent.ts')).toBeNull()
    })

    it('returns import paths from script section', () => {
      const scripts = `
      <script>
        import * as foo from './foo.js'
        import bar from '@/bar.js'
      </script>`
      mockFile(filename, scripts)
      const imports = getImports(filename)
      expect(imports).toEqual(['./foo.js', '@/bar.js'])
    })

    it('uses custom src and alias arguments', () => {
      const scripts = `
      <script>
        import * as foo from './foo.js'
        import bar from '$/bar.js'
      </script>`
      mockFile(filename, scripts)
      getImports(filename, 'customSrc', '$')
    })

    it('returns import paths from script setup section', () => {
      const scriptSetup = `
      <script setup>
        import { baz } from './baz.js'
        export { qux } from './qux.js'
        export const quux = 42
      </script>`
      mockFile(filename, scriptSetup)
      const imports = getImports(filename)
      expect(imports).toEqual(['./baz.js', './qux.js'])
    })

    it('returns import paths from both script and script setup sections', () => {
      const scripts = `
      <script>
        import * as foo from './foo.js'
        import bar from '@/bar.js'
      </script>
      <script setup>
        import { baz } from './baz.js'
        export { qux } from './qux.js'
        export const quux = 42
      </script>`
      mockFile(filename, scripts)
      const imports = getImports(filename)
      expect(imports).toEqual(['./foo.js', '@/bar.js', './baz.js', './qux.js'])
    })

    it('includes re-exports from script section (export * from / export { .. } from)', () => {
      const reexports = `
      <script>
        export * from './utils.js'
        export { thing } from '@/lib.js'
      </script>`
      mockFile(filename, reexports)
      const imports = getImports(filename)
      expect(imports).toEqual(['./utils.js', '@/lib.js'])
    })

    it('handles dynamic imports in plain <script>', () => {
      const dynamicScript = `
      <script>
        import('./lazy.js')
        import('./other.js').then(() => {})
      </script>`
      mockFile(filename, dynamicScript)
      const imports = getImports(filename)
      expect(imports).toEqual(['./lazy.js', './other.js'])
    })

    it('handles dynamic imports in <script setup>', () => {
      const dynamicSetup = `
      <script setup>
        import('./setup-lazy.js')
        import('./setup-other.js').then(() => {})
      </script>`
      mockFile(filename, dynamicSetup)
      const imports = getImports(filename)
      expect(imports).toEqual(['./setup-lazy.js', './setup-other.js'])
    })

    it('gracefully handles parser errors (malformed script)', () => {
      const bad = `
      <script>
        this is not valid javascript %%
      </script>`
      mockFile(filename, bad)
      const imports = getImports(filename)
      expect(imports).toEqual([])
    })

    it('handles await import inside async function', () => {
      const awaited = `
      <script>
        (async function(){
          await import('./awaited.js')
        })()
      </script>`
      mockFile(filename, awaited)
      const imports = getImports(filename)
      expect(imports).toEqual(['./awaited.js'])
    })

    it('returns empty array for empty <script> content', () => {
      const empty = `
      <script></script>`
      mockFile(filename, empty)
      const imports = getImports(filename)
      expect(imports).toEqual([])
    })

    it('returns null if SFC parse returns no descriptor (scoped spy)', async () => {
      mockFile(filename, `<script></script>`)
      const spy = vi.spyOn(sfc, 'parse').mockImplementation(() => ({ descriptor: null }))
      try {
        const result = getImports(filename)
        expect(result).toBeNull()
      } finally {
        spy.mockRestore()
      }
    })

    it('deduplicates imports across script and script setup', () => {
      const dup = `
      <script>
        import x from './dup.js'
      </script>
      <script setup>
        import y from './dup.js'
      </script>`
      mockFile(filename, dup)
      const imports = getImports(filename)
      expect(imports).toEqual(['./dup.js'])
    })

    it('executes CallExpression dynamic-import path (covers argument-based extraction)', async () => {
      mockFile(filename, `<script>{}</script>`)
      const ast = {
        type: 'File',
        program: {
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'CallExpression',
                callee: { type: 'Import' },
                arguments: [{ type: 'StringLiteral', value: './call-path.js' }],
              },
            },
          ],
        },
      }

      const spy = vi.spyOn(bp, 'parse').mockImplementation(() => ast)
      try {
        const imports = getImports(filename)
        expect(imports).toEqual(['./call-path.js'])
      } finally {
        spy.mockRestore()
      }
    })

    it('executes ImportExpression dynamic-import path (covers node.source extraction)', async () => {
      mockFile(filename, `<script>{}</script>`)
      const ast = {
        type: 'File',
        program: {
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'ImportExpression',
                source: { type: 'StringLiteral', value: './importexpr-path.js' },
              },
            },
          ],
        },
      }

      const spy = vi.spyOn(bp, 'parse').mockImplementation(() => ast)
      try {
        const imports = getImports(filename)
        expect(imports).toEqual(['./importexpr-path.js'])
      } finally {
        spy.mockRestore()
      }
    })
  })

  // Tests for isAbsoluteImport
  describe('isAbsoluteImport', () => {
    it('returns true for paths starting with / or \\', () => {
      expect(isAbsoluteImport('/src/components/Button.vue')).toBe(true)
      expect(isAbsoluteImport('\\src\\components\\Button.vue')).toBe(true)
    })

    it('returns false for non-absolute paths', () => {
      expect(isAbsoluteImport('@/components/Button.vue')).toBe(false)
      expect(isAbsoluteImport('./utils/helpers.js')).toBe(false)
      expect(isAbsoluteImport('src/components/Button.vue')).toBe(false)
      expect(isAbsoluteImport('lodash')).toBe(false)
    })
    it('returns false for empty or non-string input', () => {
      expect(isAbsoluteImport('')).toBe(false)
      expect(isAbsoluteImport(null)).toBe(false)
      expect(isAbsoluteImport(undefined)).toBe(false)
      expect(isAbsoluteImport(42)).toBe(false)
    })
  })

  // Tests for isAliasImport
  describe('isAliasImport', () => {
    it('returns true for path equal to alias', () => {
      expect(isAliasImport('@', '@')).toBe(true)
      expect(isAliasImport('~', '~')).toBe(true)
    })

    it('returns true for path starting with alias + /', () => {
      expect(isAliasImport('@/components/Button.vue', '@')).toBe(true)
      expect(isAliasImport('~/utils/helpers.js', '~')).toBe(true)
    })

    it('returns false for path not starting with alias', () => {
      expect(isAliasImport('/src/components/Button.vue', '@')).toBe(false)
      expect(isAliasImport('./utils/helpers.js', '~')).toBe(false)
      expect(isAliasImport('src/components/Button.vue', '@')).toBe(false)
    })

    it('returns false for empty or non-string input', () => {
      expect(isAliasImport('', '@')).toBe(false)
      expect(isAliasImport(null, '@')).toBe(false)
      expect(isAliasImport(undefined, '@')).toBe(false)
      expect(isAliasImport(42, '@')).toBe(false)
    })
  })

  // Tests for isRelativeImport
  describe('isRelativeImport', () => {
    it('returns true for paths starting with ./ or ../', () => {
      expect(isRelativeImport('./utils/helpers.js')).toBe(true)
      expect(isRelativeImport('../services/api.js')).toBe(true)
      expect(isRelativeImport('.')).toBe(true)
      expect(isRelativeImport('..')).toBe(true)
    })

    it('returns false for non-relative paths', () => {
      expect(isRelativeImport('@/components/Button.vue')).toBe(false)
      expect(isRelativeImport('/src/components/Button.vue')).toBe(false)
      expect(isRelativeImport('src/components/Button.vue')).toBe(false)
      expect(isRelativeImport('lodash')).toBe(false)
    })

    it('returns false for empty or non-string input', () => {
      expect(isRelativeImport('')).toBe(false)
      expect(isRelativeImport(null)).toBe(false)
      expect(isRelativeImport(undefined)).toBe(false)
      expect(isRelativeImport(42)).toBe(false)
    })
  })

  // Tests for getImportDepth
  describe('getImportDepth', () => {
    it('returns correct depth for relative imports within same feature', () => {
      const from = '/project/src/features/user/components/UserProfile.js'
      const to = '/project/src/features/user/services/userService.js'
      expect(getImportDepth(from, to)).toBe(2) // ../services/userService.js
    })

    it('returns correct depth for relative imports across features', () => {
      const from = '/project/src/features/user/components/UserProfile.js'
      const to = '/project/src/features/product/services/productService.js'
      expect(getImportDepth(from, to)).toBe(4) // ../../product/services/productService.js
    })

    it('returns correct depth for alias imports within same feature', () => {
      const from = '/project/src/features/user/components/UserProfile.js'
      const to = '/project/src/features/user/services/userService.js'
      expect(getImportDepth(from, to)).toBe(2) // @/features/user/services/userService.js
    })

    it('returns correct depth for alias imports across features', () => {
      const from = '/project/src/features/user/components/UserProfile.js'
      const to = '/project/src/features/product/services/productService.js'
      expect(getImportDepth(from, to)).toBe(4) // @/features/product/services/productService.js
    })

    it('returns null if from or to is missing', () => {
      expect(getImportDepth(null, '/project/src/features/user/services/userService.js')).toBeNull()
      expect(getImportDepth('/project/src/features/user/components/UserProfile.js', null)).toBeNull()
    })

    it('returns null if from or to cannot be resolved', () => {
      expect(getImportDepth('/project/test/components/Button.js', '/project/src/features/user/services/userService.js')).toBeNull()
      expect(getImportDepth('/project/src/features/user/components/UserProfile.js', '/project/ui/utils/helpers.js')).toBeNull()
    })

    it('handles custom src and alias arguments', () => {
      const from = '/myapp/app/features/user/components/UserProfile.js'
      const to = '/myapp/app/features/user/services/userService.js'
      expect(getImportDepth(from, to, 'app', '#')).toBe(2) // #/features/user/services/userService.js
    })
  })

  // Tests for resolveImportPath
  describe('resolveImportPath', () => {
    it('resolves relative import paths correctly', () => {
      const from = '/project/src/features/user/components/UserProfile.js'
      const to = '../services/userService.js'
      expect(resolveImportPath(from, to)).toBe('src/features/user/services/userService.js')
      expect(resolveImportPath(from, './UserProfileHelper.js')).toBe('src/features/user/components/UserProfileHelper.js')
      expect(resolveImportPath(from, '../../../UserProfileHelper.js')).toBe('src/UserProfileHelper.js')
      expect(resolveImportPath(from, '../../../../UserProfileHelper.js')).toBeNull()
    })

    it('resolves alias import paths correctly', () => {
      const from = '/project/src/features/user/components/UserProfile.js'
      const to = '@/features/user/services/userService.js'
      expect(resolveImportPath(from, to)).toBe('src/features/user/services/userService.js')
    })

    it('resolves absolute import paths as relative to src', () => {
      const from = 'home/project/src/features/user/components/UserProfile.js'
      const to = '/home/src/features/user/services/userService.js'
      expect(resolveImportPath(from, to)).toBe('src/features/user/services/userService.js')
    })

    it('returns null if from cannot be resolved by resolvePath', () => {
      const from = '/project/test/components/Button.js'
      const to = './relative.js'
      expect(resolveImportPath(from, to)).toBeNull()
    })

    it('returns null if from or to is missing', () => {
      expect(resolveImportPath(null, '@/features/user/services/userService.js')).toBeNull()
      expect(resolveImportPath('/project/src/features/user/components/UserProfile.js', null)).toBeNull()
    })

    it('returns null if to is not relative, alias, or absolute path', () => {
      const from = '/project/src/features/user/components/UserProfile.js'
      expect(resolveImportPath(from, 'lodash')).toBeNull()
      expect(resolveImportPath(from, 'http://example.com/module.js')).toBeNull()
    })

    it('handles custom src and alias arguments', () => {
      const from = '/myapp/app/features/user/components/UserProfile.js'
      const to = '#/features/user/services/userService.js'
      expect(resolveImportPath(from, to, 'app', '#')).toBe('app/features/user/services/userService.js')
    })
  })
})
