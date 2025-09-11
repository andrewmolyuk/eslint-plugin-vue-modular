import { describe, it, expect, vi, beforeEach } from 'vitest'
import { runRule, setupTest } from '../test-utils'
import { featureIndexRequired } from '../../src/rules/feature-index-required'
import fs from 'fs'

describe('feature-index-required rule', () => {
  beforeEach(() => setupTest())

  it('reports a missing index file for a feature directory that has files but no index', () => {
    vi.spyOn(fs, 'readdirSync').mockReturnValue(['feature-without-index', 'feature-with-index'] as unknown as fs.Dirent<
      Buffer<ArrayBufferLike>
    >[])
    vi.spyOn(fs, 'statSync').mockReturnValue({ isDirectory: () => true } as unknown as fs.Stats)
    vi.spyOn(fs, 'existsSync').mockImplementation((p) => String(p).includes('feature-with-index'))

    const context = runRule(featureIndexRequired, 'filename.ts')

    expect(context.report).toHaveBeenCalledTimes(1)
    expect(context.report).toHaveBeenCalledWith(
      expect.objectContaining({
        messageId: 'missingIndex',
        data: expect.objectContaining({ feature: 'feature-without-index', index: 'index.ts' }),
      }),
    )
  })

  it('does not report when every feature directory contains the expected index file', () => {
    vi.spyOn(fs, 'readdirSync').mockReturnValue(['feature-a', 'feature-b'] as unknown as fs.Dirent<Buffer<ArrayBufferLike>>[])
    vi.spyOn(fs, 'statSync').mockReturnValue({ isDirectory: () => true } as unknown as fs.Stats)
    vi.spyOn(fs, 'existsSync').mockReturnValue(true)

    const context = runRule(featureIndexRequired, 'filename.ts')

    expect(context.report).not.toHaveBeenCalled()
  })

  it('respects ignore option and does not report for ignored feature dirs', () => {
    vi.spyOn(fs, 'readdirSync').mockReturnValue(['ignored-feature', 'normal-feature'] as unknown as fs.Dirent<Buffer<ArrayBufferLike>>[])
    vi.spyOn(fs, 'statSync').mockReturnValue({ isDirectory: () => true } as unknown as fs.Stats)
    vi.spyOn(fs, 'existsSync').mockReturnValue(false)

    const context = runRule(featureIndexRequired, 'filename.ts', [{ ignores: ['ignored-feature'], index: 'index.ts' }])

    expect(context.report).toHaveBeenCalledTimes(1)
    expect(context.report).toHaveBeenCalledWith(
      expect.objectContaining({
        messageId: 'missingIndex',
        data: expect.objectContaining({ feature: 'normal-feature', index: 'index.ts' }),
      }),
    )
  })

  it('does nothing when runOnce returns false', () => {
    vi.spyOn(fs, 'readdirSync').mockReturnValue(['feature-without-index'] as unknown as fs.Dirent<Buffer<ArrayBufferLike>>[])
    vi.spyOn(fs, 'statSync').mockReturnValue({ isDirectory: () => true } as unknown as fs.Stats)
    vi.spyOn(fs, 'existsSync').mockReturnValue(false)

    const context1 = runRule(featureIndexRequired, 'filename1.ts')
    const context2 = runRule(featureIndexRequired, 'filename2.ts')

    expect(context1.report).toHaveBeenCalledTimes(1)
    expect(context2.report).not.toHaveBeenCalled()
  })

  it('handles fs errors gracefully (does not throw)', () => {
    vi.spyOn(fs, 'readdirSync').mockImplementation(() => {
      throw new Error('boom')
    })

    expect(() => {
      runRule(featureIndexRequired, 'filename.ts')
    }).not.toThrow()
  })
})
