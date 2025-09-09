import fs from 'fs'
import path from 'path'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setupTest, runRule } from '../helpers.js'
import rule from '@/rules/shared-ui-index-required.js'

const mockFileSystem = (hasIndex = true, indexFilename = 'index.ts') => {
  vi.spyOn(fs, 'existsSync').mockImplementation((p) => {
    const s = String(p)
    // simulate shared/ui path: '/shared/ui'
    if (s.includes(`${path.sep}shared${path.sep}ui`)) {
      if (s.endsWith(indexFilename)) return hasIndex
      return true
    }
    return false
  })
}

describe('vue-modular/shared-ui-index-required', () => {
  beforeEach(setupTest)

  it('reports when shared/ui index missing', () => {
    mockFileSystem(false)
    const filename = path.join(process.cwd(), 'src', 'shared', 'ui', 'Button.vue')
    const ctx = runRule(rule, filename, [{ shared: 'shared', index: 'index.ts' }])
    expect(ctx.report).toHaveBeenCalled()
  })

  it('does not report when shared/ui index present', () => {
    mockFileSystem(true)
    const filename = path.join(process.cwd(), 'src', 'shared', 'ui', 'Button.vue')
    const ctx = runRule(rule, filename, [{ shared: 'shared', index: 'index.ts' }])
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('does nothing when not under shared/ui', () => {
    mockFileSystem(false)
    const filename = path.join(process.cwd(), 'src', 'shared', 'components', 'Button.vue')
    const ctx = runRule(rule, filename, [{ shared: 'shared', index: 'index.ts' }])
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('does nothing when configured shared segment is not in filename path', () => {
    mockFileSystem(false)
    const filename = path.join(process.cwd(), 'src', 'features', 'auth', 'ui', 'Button.vue')
    const ctx = runRule(rule, filename, [{ shared: 'shared', index: 'index.ts' }])
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('runs only once per session', () => {
    mockFileSystem(false)
    const filename = path.join(process.cwd(), 'src', 'shared', 'ui', 'Button.vue')
    const first = runRule(rule, filename, [{ shared: 'shared', index: 'index.ts' }])
    const second = runRule(rule, filename, [{ shared: 'shared', index: 'index.ts' }])

    expect(first.report).toHaveBeenCalled()
    expect(second.report).not.toHaveBeenCalled()
  })

  it('does nothing for virtual filenames', () => {
    mockFileSystem(false)
    const ctx = runRule(rule, '<input>', [{ shared: 'shared', index: 'index.ts' }])
    expect(ctx.report).not.toHaveBeenCalled()
  })
})
