import { describe, it, expect, vi, beforeEach } from 'vitest'
import { runRule, setupTest } from '../test-utils'
import { folderKebabCase } from '../../src/rules/folder-kebab-case'
import fs from 'fs'

// Import the rule after mocking its dependencies
describe('folder-kebab-case', () => {
  beforeEach(() => setupTest())

  it('does nothing when project root does not exist', () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(false)
    const context = runRule(folderKebabCase, 'filename.ts')
    expect(context.report).not.toHaveBeenCalled()
  })

  it('reports non-kebab folder entries', () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(true)
    vi.spyOn(fs, 'readdirSync').mockReturnValue(['FooBar', 'baz-qux'] as unknown as fs.Dirent<Buffer<ArrayBufferLike>>[])
    const context = runRule(folderKebabCase, 'filename.ts')
    expect(context.report).toHaveBeenCalledTimes(1)
  })

  it('does not report when entry is already kebab-case', () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(true)
    vi.spyOn(fs, 'readdirSync').mockReturnValue(['foo-bar', 'baz-qux'] as unknown as fs.Dirent<Buffer<ArrayBufferLike>>[])
    const context = runRule(folderKebabCase, 'filename.ts')
    expect(context.report).not.toHaveBeenCalled()
  })

  it('respects ignores (skips ignored folders)', () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(true)
    vi.spyOn(fs, 'readdirSync').mockReturnValue(['FooBar', 'baz-qux', 'IgnoreMe'] as unknown as fs.Dirent<Buffer<ArrayBufferLike>>[])
    const context = runRule(folderKebabCase, 'filename.ts', [{ ignores: ['**/IgnoreMe'] }])
    expect(context.report).toHaveBeenCalledTimes(1)
  })

  it('handles fs errors gracefully (does not throw)', () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(true)
    vi.spyOn(fs, 'readdirSync').mockImplementation(() => {
      throw new Error('boom')
    })
    const context = runRule(folderKebabCase, 'filename.ts')
    expect(context.report).not.toHaveBeenCalled()
  })

  it('does nothing when runOnce returns false', () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(true)
    vi.spyOn(fs, 'readdirSync').mockReturnValue(['FooBar', 'baz-qux'] as unknown as fs.Dirent<Buffer<ArrayBufferLike>>[])
    const context1 = runRule(folderKebabCase, 'filename1.ts')
    const context2 = runRule(folderKebabCase, 'filename2.ts')
    expect(context1.report).toHaveBeenCalledTimes(1)
    expect(context2.report).not.toHaveBeenCalled()
  })
})
