import rule from '@/rules/service-filename-no-suffix.js'
import { runRule, setupTest } from '../utils.js'
import path from 'path'
import fs from 'fs'
import { describe, it, beforeEach, afterEach, vi, expect } from 'vitest'

const mockFile = (filePath, content) => {
  vi.spyOn(fs, 'existsSync').mockImplementation((p) => String(p) === filePath)
  vi.spyOn(fs, 'readFileSync').mockImplementation(() => content)
}

describe('vue-modular/service-filename-no-suffix', () => {
  beforeEach(setupTest)
  afterEach(() => vi.restoreAllMocks())

  it('reports when .ts filename uses -service suffix', () => {
    const file = path.join(process.cwd(), 'src', 'features', 'f', 'services', 'user-service.ts')
    mockFile(file, '')
    const ctx = runRule(rule, file, [{ src: 'src', ignore: [], suffix: '-service' }])
    expect(ctx.report).toHaveBeenCalled()
    expect(ctx.report).toHaveBeenCalledWith(expect.objectContaining({ messageId: 'noSuffix' }))
  })

  it('allows when .ts filename does not use suffix', () => {
    const file = path.join(process.cwd(), 'src', 'features', 'f', 'services', 'user.ts')
    mockFile(file, '')
    const ctx = runRule(rule, file, [{ src: 'src', ignore: [], suffix: '-service' }])
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('respects custom suffix option', () => {
    const file = path.join(process.cwd(), 'src', 'features', 'f', 'services', 'user-svc.ts')
    mockFile(file, '')
    const ctx = runRule(rule, file, [{ src: 'src', ignore: [], suffix: '-svc' }])
    expect(ctx.report).toHaveBeenCalled()
  })

  it('ignores non-ts files', () => {
    const file = path.join(process.cwd(), 'src', 'features', 'f', 'services', 'user-service.js')
    const ctx = runRule(rule, file, [{ src: 'src', ignore: [], suffix: '-service' }])
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('handles missing filename (falsy) gracefully', () => {
    // runRule has a default filename parameter, so pass an explicit empty string
    // to simulate a falsy filename returned by context.getFilename()
    const ctx = runRule(rule, '', [{ src: 'src', ignore: [], suffix: '-service' }])
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('ignores files inside test folders', () => {
    const file = path.join(process.cwd(), 'tests', 'features', 'f', 'user-service.ts')
    const ctx = runRule(rule, file, [{ src: 'src', ignore: [], suffix: '-service' }])
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('respects ignore patterns and returns early', () => {
    const file = path.join(process.cwd(), 'src', 'features', 'f', 'services', 'user-service.ts')
    const ctx = runRule(rule, file, [{ src: 'src', ignore: [file], suffix: '-service' }])
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('returns early for files outside configured src', () => {
    const file = path.join(process.cwd(), 'lib', 'user-service.ts')
    const ctx = runRule(rule, file, [{ src: 'src', ignore: [], suffix: '-service' }])
    expect(ctx.report).not.toHaveBeenCalled()
  })
})
