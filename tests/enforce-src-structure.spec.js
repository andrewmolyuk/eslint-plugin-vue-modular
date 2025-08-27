import { describe, it, expect, beforeEach, vi } from 'vitest'
import fs from 'fs'
import srcStructureRule, { resetSession } from '../src/rules/enforce-src-structure.js'
import { setupTestWithReset, createContext, runRule } from './test-utils.js'

describe('enforce-src-structure rule', () => {
  beforeEach(setupTestWithReset(resetSession))

  it('should not report when all entries are allowed', () => {
    // Mock fs.readdirSync to return allowed entries
    vi.spyOn(fs, 'readdirSync').mockReturnValue(['app', 'components', 'main.ts'])

    const context = runRule(srcStructureRule)

    expect(context.report).not.toHaveBeenCalled()
  })

  it('should report disallowed entries', () => {
    // Mock fs.readdirSync to return some disallowed entries
    vi.spyOn(fs, 'readdirSync').mockReturnValue(['app', 'bad-folder', 'main.ts'])

    const context = runRule(srcStructureRule)

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

    const context = runRule(srcStructureRule, createContext('/project/src/foo.js', [{ allowed: ['foo', 'bar'] }]))

    expect(context.report).not.toHaveBeenCalled()
  })

  it('should respect custom src option', () => {
    // Mock fs.readdirSync to return custom entries
    vi.spyOn(fs, 'readdirSync').mockReturnValue(['foo', 'bar'])

    const context = runRule(srcStructureRule, createContext('/project/customsrc/foo.js', [{ src: 'customsrc', allowed: ['foo', 'bar'] }]))

    expect(context.report).not.toHaveBeenCalled()
  })

  it('should do nothing if not in src folder', () => {
    // Mock fs.readdirSync (shouldn't be called)
    const mockReaddir = vi.spyOn(fs, 'readdirSync').mockReturnValue(['foo', 'bar'])

    const context = runRule(srcStructureRule, createContext('/project/otherdir/foo.js'))

    // fs.readdirSync should not have been called since we're not in src
    expect(mockReaddir).not.toHaveBeenCalled()
    expect(context.report).not.toHaveBeenCalled()
  })

  it('should only run once per lint session', () => {
    // Mock fs.readdirSync to return disallowed entries
    vi.spyOn(fs, 'readdirSync').mockReturnValue(['app', 'bad-folder'])

    const context = createContext('/project/src/App.vue')

    // Run the rule twice with the same context (simulating multiple files in src)
    const rule1 = srcStructureRule.create(context)
    const rule2 = srcStructureRule.create(context)

    // Execute both Program visitors
    if (rule1.Program) {
      rule1.Program()
    }
    if (rule2.Program) {
      rule2.Program()
    }

    // Should only report once, not twice
    expect(context.report).toHaveBeenCalledTimes(1)
  })

  it('should handle fs errors gracefully', () => {
    // Mock fs.readdirSync to throw an error
    vi.spyOn(fs, 'readdirSync').mockImplementation(() => {
      throw new Error('Permission denied')
    })

    const context = runRule(srcStructureRule)

    // Should not throw and should not report anything
    expect(context.report).not.toHaveBeenCalled()
  })
})
