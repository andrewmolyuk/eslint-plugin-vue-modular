import { describe, it, expect, beforeEach, vi } from 'vitest'
import fs from 'fs'
import moduleStructureRule from '../src/rules/enforce-module-exports.js'
import { setupTest, runRule, createMockFileSystem } from './test-utils.js'

describe('enforce-module-exports rule', () => {
  beforeEach(setupTest)

  it('reports when modules directory is missing', () => {
    vi.spyOn(fs, 'readdirSync').mockReturnValue(['components', 'main.ts'])

    const context = runRule(moduleStructureRule)

    expect(context.report).toHaveBeenCalledWith(expect.objectContaining({ messageId: 'missingModulesDir' }))
  })

  it('reports modules missing index files', () => {
    const mockFileSystem = createMockFileSystem({
      '**/src': ['modules'],
      '**/src/modules': ['auth', 'users'],
      '**/src/modules/auth': ['views', 'components'],
      '**/src/modules/users': ['index.ts'],
    })
    vi.spyOn(fs, 'readdirSync').mockImplementation(mockFileSystem)

    const context = runRule(moduleStructureRule)

    expect(context.report).toHaveBeenCalledWith(expect.objectContaining({ messageId: 'missingIndex' }))
  })

  it('passes when all modules have index files', () => {
    const mockFileSystem = createMockFileSystem({
      '**/src': ['modules'],
      '**/src/modules': ['auth', 'users'],
      '**/src/modules/auth': ['index.js'],
      '**/src/modules/users': ['index.ts'],
    })
    vi.spyOn(fs, 'readdirSync').mockImplementation(mockFileSystem)

    const context = runRule(moduleStructureRule)

    expect(context.report).not.toHaveBeenCalled()
  })
})
