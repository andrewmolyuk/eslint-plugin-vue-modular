import fs from 'fs'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setupTest, runRule } from '../helpers.js'
import rule from '@/rules/folder-kebab-case.js'

const mockFileSystem = () => {
  vi.spyOn(fs, 'readdirSync').mockImplementation((dir) => {
    if (dir.endsWith('src'))
      return [
        { name: 'MyFolder', isDirectory: () => true },
        { name: 'another-folder', isDirectory: () => true },
        { name: 'NotKebabCase', isDirectory: () => true },
      ]
    if (dir.endsWith('MyFolder')) return [{ name: 'SubFolder', isDirectory: () => true }]
    if (dir.endsWith('SubFolder')) return []
    if (dir.endsWith('another-folder')) return []
    if (dir.endsWith('NotKebabCase')) return []
    return []
  })
  vi.spyOn(fs, 'existsSync').mockReturnValue(true)
}

describe('vue-modular/folder-kebab-case', () => {
  beforeEach(setupTest)

  it('reports non-kebab folder names using spied fs', () => {
    mockFileSystem()
    const ctx = runRule(rule)
    expect(ctx.report).toHaveBeenCalledTimes(3)
  })

  it('handles fs errors gracefully (readdirSync throws)', () => {
    // reinstall spies after setupTest clears mocks
    vi.spyOn(fs, 'existsSync').mockReturnValue(true)
    vi.spyOn(fs, 'readdirSync').mockImplementation(() => {
      throw new Error('simulated fs error')
    })
    const ctx = runRule(rule)
    expect(ctx.report).toHaveBeenCalledTimes(0)
  })

  it('respects ignore patterns', () => {
    mockFileSystem()
    const ctx = runRule(rule, 'index.js', [{ ignore: ['**/NotKebabCase'] }])
    expect(ctx.report).toHaveBeenCalledTimes(2)
  })

  it('respects src option', () => {
    mockFileSystem()
    const ctx = runRule(rule, 'index.js', [{ src: 'src/MyFolder' }])
    expect(ctx.report).toHaveBeenCalled(1)
  })

  it('does not report when src folder does not exist', () => {
    mockFileSystem()
    vi.spyOn(fs, 'existsSync').mockReturnValue(false)
    const ctx = runRule(rule)
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('runs only once per session', () => {
    mockFileSystem()

    const first = runRule(rule)
    const second = runRule(rule)

    expect(first.report).toHaveBeenCalled()
    expect(second.report).not.toHaveBeenCalled()
  })
})
