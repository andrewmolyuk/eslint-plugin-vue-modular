import { describe, it, expect, beforeEach, vi } from 'vitest'
import fs from 'fs'
import srcStructureRule from '../src/rules/src-structure.js'

describe('src-structure rule', () => {
  beforeEach(() => {
    // Reset any previous mocks
    vi.restoreAllMocks()
  })

  const createContext = (filename = '/project/src/App.vue', options = [{}]) => ({
    options,
    getFilename: () => filename,
    report: vi.fn(),
    settings: {},
  })

  it('should not report when all entries are allowed', () => {
    // Mock fs.readdirSync to return allowed entries
    vi.spyOn(fs, 'readdirSync').mockReturnValue(['app', 'components', 'main.ts'])

    const context = createContext()
    const ruleInstance = srcStructureRule.create(context)

    expect(context.report).not.toHaveBeenCalled()
  })

  it('should report disallowed entries', () => {
    // Mock fs.readdirSync to return some disallowed entries
    vi.spyOn(fs, 'readdirSync').mockReturnValue(['app', 'bad-folder', 'main.ts'])

    const context = createContext()
    const ruleInstance = srcStructureRule.create(context)

    expect(context.report).toHaveBeenCalledWith(
      expect.objectContaining({
        messageId: 'notAllowed',
        data: expect.objectContaining({
          name: 'bad-folder',
        }),
      }),
    )
  })

  it('should respect custom allowed option', () => {
    // Mock fs.readdirSync to return custom entries
    vi.spyOn(fs, 'readdirSync').mockReturnValue(['foo', 'bar'])

    const context = createContext('/project/src/foo.js', [{ allowed: ['foo', 'bar'] }])
    const ruleInstance = srcStructureRule.create(context)

    expect(context.report).not.toHaveBeenCalled()
  })

  it('should respect custom src option', () => {
    // Mock fs.readdirSync to return custom entries
    vi.spyOn(fs, 'readdirSync').mockReturnValue(['foo', 'bar'])

    const context = createContext('/project/customsrc/foo.js', [{ src: 'customsrc', allowed: ['foo', 'bar'] }])
    const ruleInstance = srcStructureRule.create(context)

    expect(context.report).not.toHaveBeenCalled()
  })

  it('should do nothing if not in src folder', () => {
    // Mock fs.readdirSync (shouldn't be called)
    const mockReaddir = vi.spyOn(fs, 'readdirSync').mockReturnValue(['foo', 'bar'])

    const context = createContext('/project/otherdir/foo.js')
    const ruleInstance = srcStructureRule.create(context)

    // fs.readdirSync should not have been called since we're not in src
    expect(mockReaddir).not.toHaveBeenCalled()
    expect(context.report).not.toHaveBeenCalled()
  })

  it('should only run once per lint session', () => {
    // Mock fs.readdirSync to return disallowed entries
    vi.spyOn(fs, 'readdirSync').mockReturnValue(['app', 'bad-folder'])

    const context = createContext('/project/src/App.vue')

    // Run the rule twice with the same context (simulating multiple files in src)
    srcStructureRule.create(context)
    srcStructureRule.create(context)

    // Should only report once, not twice
    expect(context.report).toHaveBeenCalledTimes(1)
  })

  it('should handle fs errors gracefully', () => {
    // Mock fs.readdirSync to throw an error
    vi.spyOn(fs, 'readdirSync').mockImplementation(() => {
      throw new Error('Permission denied')
    })

    const context = createContext()

    // Should not throw and should not report anything
    expect(() => srcStructureRule.create(context)).not.toThrow()
    expect(context.report).not.toHaveBeenCalled()
  })
})
