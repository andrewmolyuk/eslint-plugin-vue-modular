import rule from '../../src/rules/store-filename-no-suffix.js'
import { runRule, setupTest } from '../utils.js'
import path from 'path'
import fs from 'fs'
import { describe, it, beforeEach, afterEach, vi, expect } from 'vitest'

const mockFile = (filePath, content) => {
  vi.spyOn(fs, 'existsSync').mockImplementation((p) => String(p) === filePath)
  vi.spyOn(fs, 'readFileSync').mockImplementation(() => content)
}

describe('vue-modular/store-filename-no-suffix', () => {
  beforeEach(setupTest)
  afterEach(() => vi.restoreAllMocks())

  it('reports when .ts filename uses -store suffix', () => {
    const file = path.join(process.cwd(), 'src', 'features', 'f', 'stores', 'user-store.ts')
    mockFile(file, '')
    const ctx = runRule(rule, file, [{ src: 'src', ignore: [], suffix: '-store' }])
    expect(ctx.report).toHaveBeenCalled()
    expect(ctx.report).toHaveBeenCalledWith(expect.objectContaining({ messageId: 'noSuffix' }))
  })

  it('allows when .ts filename does not use suffix', () => {
    const file = path.join(process.cwd(), 'src', 'features', 'f', 'stores', 'user.ts')
    mockFile(file, '')
    const ctx = runRule(rule, file, [{ src: 'src', ignore: [], suffix: '-store' }])
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('respects custom suffix option', () => {
    const file = path.join(process.cwd(), 'src', 'features', 'f', 'stores', 'user-svc.ts')
    mockFile(file, '')
    const ctx = runRule(rule, file, [{ src: 'src', ignore: [], suffix: '-svc' }])
    expect(ctx.report).toHaveBeenCalled()
  })

  it('ignores non-ts files', () => {
    const file = path.join(process.cwd(), 'src', 'features', 'f', 'stores', 'user-store.js')
    const ctx = runRule(rule, file, [{ src: 'src', ignore: [], suffix: '-store' }])
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('handles missing filename (falsy) gracefully', () => {
    const ctx = runRule(rule, '', [{ src: 'src', ignore: [], suffix: '-store' }])
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('ignores files inside test folders', () => {
    const file = path.join(process.cwd(), 'tests', 'features', 'f', 'user-store.ts')
    const ctx = runRule(rule, file, [{ src: 'src', ignore: [], suffix: '-store' }])
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('respects ignore patterns and returns early', () => {
    const file = path.join(process.cwd(), 'src', 'features', 'f', 'stores', 'user-store.ts')
    const ctx = runRule(rule, file, [{ src: 'src', ignore: [file], suffix: '-store' }])
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('returns early for files outside configured src', () => {
    const file = path.join(process.cwd(), 'lib', 'user-store.ts')
    const ctx = runRule(rule, file, [{ src: 'src', ignore: [], suffix: '-store' }])
    expect(ctx.report).not.toHaveBeenCalled()
  })
})
