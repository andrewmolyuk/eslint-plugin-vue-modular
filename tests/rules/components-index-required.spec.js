import fs from 'fs'
import path from 'path'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setupTest, runRule } from '../utils.js'
import rule from '../../src/rules/components-index-required.js'

const mockFileSystem = (hasIndex = true, indexFilename = 'index.ts') => {
  vi.spyOn(fs, 'existsSync').mockImplementation((p) => {
    const s = String(p)
    // simulate components folder path containing '/features/<feature>/components'
    if (
      s.includes(`${path.sep}features${path.sep}auth${path.sep}components`) ||
      s.includes(`${path.sep}features${path.sep}shared${path.sep}components`)
    ) {
      if (s.endsWith(indexFilename)) {
        return hasIndex
      }
      return true
    }
    return false
  })
}

describe('vue-modular/components-index-required', () => {
  beforeEach(setupTest)

  it('reports when index.ts missing for components folder', () => {
    mockFileSystem(false)
    const filename = path.join(process.cwd(), 'src', 'features', 'auth', 'components', 'Button.vue')
    const ctx = runRule(rule, filename, [{ components: 'components', ignore: [] }])
    expect(ctx.report).toHaveBeenCalled()
  })

  it('does not report when index.ts present for components folder', () => {
    mockFileSystem(true)
    const filename = path.join(process.cwd(), 'src', 'features', 'auth', 'components', 'Button.vue')
    const ctx = runRule(rule, filename, [{ components: 'components', ignore: [] }])
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('respects ignore option', () => {
    mockFileSystem(false)
    const filename = path.join(process.cwd(), 'src', 'features', 'shared', 'components', 'Icon.vue')
    const ctx = runRule(rule, filename, [{ components: 'components', ignore: ['shared'] }])
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('supports custom index filename', () => {
    mockFileSystem(true, 'main.ts')
    const filename = path.join(process.cwd(), 'src', 'features', 'auth', 'components', 'Button.vue')
    const ctx = runRule(rule, filename, [{ components: 'components', ignore: [], index: 'main.ts' }])
    expect(ctx.report).not.toHaveBeenCalled()
  })
})
