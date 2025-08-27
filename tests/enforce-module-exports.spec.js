import { describe, it, expect, beforeEach, vi } from 'vitest'
import fs from 'fs'
import moduleStructureRule from '../src/rules/enforce-module-exports.js'
import { setupTest, runRule } from './test-utils.js'

describe('enforce-module-exports rule', () => {
  beforeEach(setupTest)

  it('reports when modules directory is missing', () => {
    vi.spyOn(fs, 'readdirSync').mockReturnValue(['components', 'main.ts'])

    const context = runRule(moduleStructureRule)

    expect(context.report).toHaveBeenCalledWith(expect.objectContaining({ messageId: 'missingModulesDir' }))
  })

  it('reports modules missing index files', () => {
    vi.spyOn(fs, 'readdirSync').mockImplementation((p) => {
      if (p.endsWith('/src')) return ['modules']
      if (p.endsWith('/src/modules')) return ['auth', 'users']
      if (p.endsWith('/src/modules/auth')) return ['views', 'components']
      if (p.endsWith('/src/modules/users')) return ['index.ts']
      return []
    })

    const context = runRule(moduleStructureRule)

    expect(context.report).toHaveBeenCalledWith(expect.objectContaining({ messageId: 'missingIndex' }))
  })

  it('passes when all modules have index files', () => {
    vi.spyOn(fs, 'readdirSync').mockImplementation((p) => {
      if (p.endsWith('/src')) return ['modules']
      if (p.endsWith('/src/modules')) return ['auth', 'users']
      if (p.endsWith('/src/modules/auth')) return ['index.js']
      if (p.endsWith('/src/modules/users')) return ['index.ts']
      return []
    })

    const context = runRule(moduleStructureRule)

    expect(context.report).not.toHaveBeenCalled()
  })
})
