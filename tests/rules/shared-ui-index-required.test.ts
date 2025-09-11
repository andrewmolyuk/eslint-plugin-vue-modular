import { describe, it, expect, vi, beforeEach } from 'vitest'
import { runRule, setupTest } from '../test-utils'
import { sharedIndexRequired } from '../../src/rules/shared-ui-index-required'
import fs from 'fs'

describe('shared-ui-index-required rule', () => {
  beforeEach(() => setupTest())

  it('reports a missing shared ui index file when it does not exist', () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(false)

    const context = runRule(sharedIndexRequired, 'filename.ts')

    expect(context.report).toHaveBeenCalledTimes(1)
    expect(context.report).toHaveBeenCalledWith(
      expect.objectContaining({
        messageId: 'missingIndex',
        data: expect.objectContaining({ index: 'index.ts', indexPath: 'src/shared/ui' }),
      }),
    )
  })

  it('does not report when the shared ui index exists', () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(true)

    const context = runRule(sharedIndexRequired, 'filename.ts')

    expect(context.report).not.toHaveBeenCalled()
  })

  it('respects ignore option and does not report when index path matches ignore patterns', () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(false)

    // pattern matches the shared ui index path used by the rule
    const ignorePattern = ['**/src/shared/ui']

    const context = runRule(sharedIndexRequired, 'filename.ts', [{ ignores: ignorePattern, index: 'index.ts' }])

    expect(context.report).not.toHaveBeenCalled()
  })

  it('does nothing when runOnce returns false', () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(false)

    const context1 = runRule(sharedIndexRequired, 'filename1.ts')
    const context2 = runRule(sharedIndexRequired, 'filename2.ts')

    expect(context1.report).toHaveBeenCalledTimes(1)
    expect(context2.report).not.toHaveBeenCalled()
  })

  it('handles fs errors gracefully (does not throw)', () => {
    vi.spyOn(fs, 'existsSync').mockImplementation(() => {
      throw new Error('boom')
    })

    expect(() => {
      runRule(sharedIndexRequired, 'filename.ts')
    }).not.toThrow()
  })
})
