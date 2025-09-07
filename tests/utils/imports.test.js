import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as bp from '@babel/parser'
import * as sfc from '@vue/compiler-sfc'
import { getImports } from '../../src/utils/imports.js'
import { mockFile, setupTest } from '../utils.js'

const filename = 'src/mock/path/MyComponent.vue'

beforeEach(() => {
  setupTest(filename)
})

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
