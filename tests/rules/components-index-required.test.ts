import { describe, it, expect, vi, beforeEach } from 'vitest'
import { runRule, setupTest } from '../test-utils'
import { componentsIndexRequired } from '../../src/rules/components-index-required'
import fs from 'fs'

describe('components-index-required rule', () => {
  beforeEach(() => setupTest())

  it('reports a missing index file for a components directory that has files but no index', () => {
    vi.spyOn(fs, 'readdirSync').mockReturnValue(['components-without-index', 'components-with-index'] as unknown as fs.Dirent<
      Buffer<ArrayBufferLike>
    >[])
    vi.spyOn(fs, 'statSync').mockReturnValue({ isDirectory: () => true } as unknown as fs.Stats)
    vi.spyOn(fs, 'existsSync').mockImplementation((p) => String(p).includes('components-with-index'))

    const context = runRule(componentsIndexRequired, 'filename.ts')

    expect(context.report).toHaveBeenCalledTimes(1)
    expect(context.report).toHaveBeenCalledWith(
      expect.objectContaining({
        messageId: 'missingIndex',
        data: expect.objectContaining({ indexPath: 'components-without-index/index.ts', index: 'index.ts' }),
      }),
    )
  })

  it('does not report when every components directory contains the expected index file', () => {
    vi.spyOn(fs, 'readdirSync').mockReturnValue(['components-a', 'components-b'] as unknown as fs.Dirent<Buffer<ArrayBufferLike>>[])
    vi.spyOn(fs, 'statSync').mockReturnValue({ isDirectory: () => true } as unknown as fs.Stats)
    vi.spyOn(fs, 'existsSync').mockReturnValue(true)

    const context = runRule(componentsIndexRequired, 'filename.ts')

    expect(context.report).not.toHaveBeenCalled()
  })

  it('respects ignore option and does not report for ignored components dirs', () => {
    vi.spyOn(fs, 'readdirSync').mockReturnValue(['ignored-components', 'normal-components'] as unknown as fs.Dirent<
      Buffer<ArrayBufferLike>
    >[])
    vi.spyOn(fs, 'statSync').mockReturnValue({ isDirectory: () => true } as unknown as fs.Stats)
    vi.spyOn(fs, 'existsSync').mockReturnValue(false)

    const context = runRule(componentsIndexRequired, 'filename.ts', [{ ignores: ['ignored-components'], index: 'index.ts' }])

    expect(context.report).toHaveBeenCalledTimes(1)
    expect(context.report).toHaveBeenCalledWith(
      expect.objectContaining({
        messageId: 'missingIndex',
        data: expect.objectContaining({ indexPath: 'normal-components/index.ts', index: 'index.ts' }),
      }),
    )
  })

  it('does nothing when runOnce returns false', () => {
    vi.spyOn(fs, 'readdirSync').mockReturnValue(['components-without-index'] as unknown as fs.Dirent<Buffer<ArrayBufferLike>>[])
    vi.spyOn(fs, 'statSync').mockReturnValue({ isDirectory: () => true } as unknown as fs.Stats)
    vi.spyOn(fs, 'existsSync').mockReturnValue(false)

    const context1 = runRule(componentsIndexRequired, 'filename1.ts')
    const context2 = runRule(componentsIndexRequired, 'filename2.ts')

    expect(context1.report).toHaveBeenCalledTimes(1)
    expect(context2.report).not.toHaveBeenCalled()
  })

  it('handles fs errors gracefully (does not throw)', () => {
    vi.spyOn(fs, 'readdirSync').mockImplementation(() => {
      throw new Error('boom')
    })

    expect(() => {
      runRule(componentsIndexRequired, 'filename.ts')
    }).not.toThrow()
  })
})
