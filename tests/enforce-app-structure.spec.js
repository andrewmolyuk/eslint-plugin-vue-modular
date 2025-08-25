import { describe, it, expect, beforeEach, vi } from 'vitest'
import fs from 'fs'
import appStructureRule from '../src/rules/enforce-app-structure.js'

describe('enforce-app-structure rule', () => {
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

  it('reports missing app dir', () => {
    vi.spyOn(fs, 'readdirSync').mockReturnValue(['components', 'modules'])

    const context = createContext()
    const rule = appStructureRule.create(context)
    if (rule.Program) rule.Program()

    expect(context.report).toHaveBeenCalledWith(expect.objectContaining({ messageId: 'missingApp' }))
  })

  it('reports missing required entries', () => {
    vi.spyOn(fs, 'readdirSync').mockImplementation((p) => {
      if (p.endsWith('/src')) return ['app']
      if (p.endsWith('/src/app')) return ['router']
      return []
    })

    const context = createContext()
    const rule = appStructureRule.create(context)
    if (rule.Program) rule.Program()

    expect(context.report).toHaveBeenCalled()
  })
})
