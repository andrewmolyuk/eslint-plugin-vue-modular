import fs from 'fs'
import path from 'path'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setupTest, runRule } from '../utils.js'
import rule from '../../src/rules/feature-index-required.js'

const mockFileSystem = (hasIndex = true, indexFilename = 'index.ts') => {
  // make existsSync return true for directories and conditionally for index files
  vi.spyOn(fs, 'existsSync').mockImplementation((p) => {
    const s = String(p)
    // simulate feature folder path containing '/features/auth'
    if (s.includes(`${path.sep}features${path.sep}auth`)) {
      if (s.endsWith(indexFilename)) {
        return hasIndex
      }
      return true
    }
    return false
  })
}

describe('vue-modular/feature-index-required', () => {
  beforeEach(setupTest)

  it('reports when index.ts missing', () => {
    mockFileSystem(false)
    const filename = path.join(process.cwd(), 'src', 'features', 'auth', 'components', 'LoginForm.vue')
    const ctx = runRule(rule, filename, [{ features: 'features', ignore: [] }])
    expect(ctx.report).toHaveBeenCalled()
  })

  it('does not report when index.ts present', () => {
    mockFileSystem(true)
    const filename = path.join(process.cwd(), 'src', 'features', 'auth', 'components', 'LoginForm.vue')
    const ctx = runRule(rule, filename, [{ features: 'features', ignore: [] }])
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('runs only once per session', () => {
    mockFileSystem(false)
    const filename = path.join(process.cwd(), 'src', 'features', 'auth', 'components', 'LoginForm.vue')
    const first = runRule(rule, filename, [{ features: 'features', ignore: [] }])
    const second = runRule(rule, filename, [{ features: 'features', ignore: [] }])

    expect(first.report).toHaveBeenCalled()
    expect(second.report).not.toHaveBeenCalled()
  })

  it('does nothing for virtual filenames', () => {
    mockFileSystem(false)
    const ctx = runRule(rule, '<input>', [{ features: 'features', ignore: [] }])
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('returns early when featureName missing (path ends with features)', () => {
    mockFileSystem(false)
    const filename = path.join(process.cwd(), 'src', 'features')
    const ctx = runRule(rule, filename, [{ features: 'features', ignore: [] }])
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('respects ignore option', () => {
    mockFileSystem(false)
    const filename = path.join(process.cwd(), 'src', 'features', 'auth', 'components', 'LoginForm.vue')
    const ctx = runRule(rule, filename, [{ features: 'features', ignore: ['auth'] }])
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('does nothing when configured features folder is not in filename path', () => {
    mockFileSystem(false)
    const filename = path.join(process.cwd(), 'src', 'other', 'auth', 'components', 'LoginForm.vue')
    const ctx = runRule(rule, filename, [{ features: 'features', ignore: [] }])
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('respects custom index filename option', () => {
    // simulate that 'main.ts' is present and default index.ts is missing
    mockFileSystem(true, 'main.ts')
    const filename = path.join(process.cwd(), 'src', 'features', 'auth', 'components', 'LoginForm.vue')
    // configure the rule to expect 'main.ts' as the feature index
    const ctx = runRule(rule, filename, [{ features: 'features', ignore: [], index: 'main.ts' }])
    // when main.ts exists, there should be no report
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('reports when configured custom index is missing', () => {
    // simulate that 'main.ts' is missing
    mockFileSystem(false, 'main.ts')
    const filename = path.join(process.cwd(), 'src', 'features', 'auth', 'components', 'LoginForm.vue')
    // configure the rule to expect 'main.ts' as the feature index
    const ctx = runRule(rule, filename, [{ features: 'features', ignore: [], index: 'main.ts' }])
    // when main.ts does not exist, the rule should report
    expect(ctx.report).toHaveBeenCalled()
  })
})
