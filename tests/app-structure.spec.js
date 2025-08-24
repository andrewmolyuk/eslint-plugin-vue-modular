import { describe, it, expect, beforeEach, vi } from 'vitest'
import fs from 'fs'
import appStructureRule from '../src/rules/app-structure.js'

describe('app-structure rule', () => {
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

  it('reports when app directory is missing', () => {
    vi.spyOn(fs, 'readdirSync').mockReturnValue(['components', 'main.ts'])

    const context = createContext()
    const rule = appStructureRule.create(context)
    if (rule.Program) rule.Program()

    expect(context.report).toHaveBeenCalledWith(expect.objectContaining({ messageId: 'missingApp' }))
  })

  it('reports missing required entries in app', () => {
    // src contains app
    vi.spyOn(fs, 'readdirSync').mockImplementation((p) => {
      if (p.endsWith('/src')) return ['app', 'components']
      if (p.endsWith('/src/app')) return ['router']
      if (p.endsWith('/src/app/router')) return ['index.js']
      return []
    })

    const context = createContext()
    const rule = appStructureRule.create(context)
    if (rule.Program) rule.Program()

    // Should report missing stores/layouts
    expect(context.report).toHaveBeenCalled()
  })

  it('passes when app structure is valid', () => {
    vi.spyOn(fs, 'readdirSync').mockImplementation((p) => {
      if (p.endsWith('/src')) return ['app', 'components']
      if (p.endsWith('/src/app')) return ['router', 'stores', 'layouts', 'App.vue']
      if (p.endsWith('/src/app/router')) return ['index.ts']
      return []
    })

    const context = createContext()
    const rule = appStructureRule.create(context)
    if (rule.Program) rule.Program()

    expect(context.report).not.toHaveBeenCalled()
  })
})
