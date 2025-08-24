import { describe, it, expect, beforeEach, vi } from 'vitest'
import fs from 'fs'
import moduleStructureRule from '../src/rules/module-structure.js'

describe('module-structure rule', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    if (global.__eslintVueModularState) {
      delete global.__eslintVueModularState
    }
  })

  const createContext = (filename = '/project/src/App.vue', options = [{}]) => ({
    options,
    getFilename: () => filename,
    report: vi.fn(),
    settings: {},
  })

  it('reports when modules directory is missing', () => {
    vi.spyOn(fs, 'readdirSync').mockReturnValue(['components', 'main.ts'])

    const context = createContext()
    const rule = moduleStructureRule.create(context)
    if (rule.Program) rule.Program()

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

    const context = createContext()
    const rule = moduleStructureRule.create(context)
    if (rule.Program) rule.Program()

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

    const context = createContext()
    const rule = moduleStructureRule.create(context)
    if (rule.Program) rule.Program()

    expect(context.report).not.toHaveBeenCalled()
  })
})
