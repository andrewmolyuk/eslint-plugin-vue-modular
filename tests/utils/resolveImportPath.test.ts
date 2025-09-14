import { describe, it, expect } from 'vitest'
import { resolveImportPath } from '../../src/utils/resolveImportPath'

const alias = '@'
const src = '/project/src'

describe('resolveImportPath', () => {
  it('returns null if from or to is missing', () => {
    expect(resolveImportPath('', './foo', src, alias)).toBeNull()
    expect(resolveImportPath('file.ts', '', src, alias)).toBeNull()
  })

  it('resolves relative import', () => {
    const from = 'components/Button.vue'
    const to = './utils'
    const result = resolveImportPath(from, to, src, alias)
    expect(result).toBe('project/src/components/utils')
  })

  it('resolves parent relative import', () => {
    const from = 'components/Button.vue'
    const to = '../mixins'
    const result = resolveImportPath(from, to, src, alias)
    expect(result).toBe('project/src/mixins')
  })

  it('resolves alias import', () => {
    const from = 'components/Button.vue'
    const to = '@/store'
    const result = resolveImportPath(from, to, src, alias)
    expect(result).toBe('project/src/store')
  })

  it('resolves absolute import', () => {
    const from = 'components/Button.vue'
    const to = '/api'
    const result = resolveImportPath(from, to, src, alias)
    expect(result).toBe('project/src/api')
  })

  it('returns null for unknown import type', () => {
    const from = 'components/Button.vue'
    const to = 'external-package'
    const result = resolveImportPath(from, to, src, alias)
    expect(result).toBeNull()
  })

  it('alias equal returns src root', () => {
    const from = 'components/Button.vue'
    const to = '@'
    const result = resolveImportPath(from, to, src, alias)
    expect(result).toBe('project/src')
  })

  it('handles "." and ".." as relative imports', () => {
    expect(resolveImportPath('foo/bar.ts', '.', src, alias)).toBe('project/src/foo')
    expect(resolveImportPath('foo/bar.ts', '..', src, alias)).toBe('project/src')
  })
  it('resolve local file import', () => {
    const from = 'src/shared/lib/util.ts'
    const to = './helper'
    const result = resolveImportPath(from, to, src, alias)
    expect(result).toBe('project/src/shared/lib/helper')
  })
})
