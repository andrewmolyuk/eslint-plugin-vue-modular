import { describe, it, expect } from 'vitest'
import { resolvePath } from '../../src/utils'

describe('resolvePath', () => {
  it('replaces single-character alias at start with root when followed by "/"', () => {
    const root = '/project/src'
    const alias = '@'
    const filename = '@/components/Button.vue'

    const result = resolvePath(filename, root, alias)
    expect(result).toBe('project/src/components/Button.vue')
  })

  it('returns the substring starting from root when filename contains the root path', () => {
    const root = '/src'
    const alias = '@'
    const filename = '/some/other/path/project/src/components/Button.vue'

    const result = resolvePath(filename, root, alias)
    expect(result).toBe('src/components/Button.vue')
  })

  it('returns the root when filename equals the root', () => {
    const root = '/project/src'
    const alias = '@'
    const filename = '/project/src'

    const result = resolvePath(filename, root, alias)
    expect(result).toBe('project/src')
  })

  it('returns null when filename does not start with alias + "/" and does not include root', () => {
    const root = '/project/src'
    const alias = '@'
    const filename = '/unrelated/path/file.vue'

    const result = resolvePath(filename, root, alias)
    expect(result).toBeNull()
  })

  it('treat multi-character alias correctly', () => {
    const root = '/project/src'
    const alias = '@alias'
    const filename = '@alias/components/Button.vue'

    const result = resolvePath(filename, root, alias)
    expect(result).toBe('project/src/components/Button.vue')
  })

  it('does not replace when alias char is present but not followed by "/"', () => {
    const root = '/project/src'
    const alias = '@'
    const filename = '@file' // second character is not '/'

    const result = resolvePath(filename, root, alias)
    expect(result).toBeNull()
  })
})
