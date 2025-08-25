import { describe, it, expect, beforeEach, vi } from 'vitest'
import fs from 'fs'
import featureStructureRule from '../src/rules/enforce-feature-exports.js'

describe('enforce-feature-exports rule', () => {
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

  it('reports when features directory is missing', () => {
    vi.spyOn(fs, 'readdirSync').mockReturnValue(['components', 'main.ts'])

    const context = createContext()
    const rule = featureStructureRule.create(context)
    if (rule.Program) rule.Program()

    expect(context.report).toHaveBeenCalledWith(expect.objectContaining({ messageId: 'missingFeaturesDir' }))
  })

  it('reports features missing index files', () => {
    vi.spyOn(fs, 'readdirSync').mockImplementation((p) => {
      if (p.endsWith('/src')) return ['features']
      if (p.endsWith('/src/features')) return ['search', 'file-upload']
      if (p.endsWith('/src/features/search')) return ['components']
      if (p.endsWith('/src/features/file-upload')) return ['index.ts']
      return []
    })

    const context = createContext()
    const rule = featureStructureRule.create(context)
    if (rule.Program) rule.Program()

    expect(context.report).toHaveBeenCalledWith(expect.objectContaining({ messageId: 'missingIndex' }))
  })

  it('passes when all features have index files', () => {
    vi.spyOn(fs, 'readdirSync').mockImplementation((p) => {
      if (p.endsWith('/src')) return ['features']
      if (p.endsWith('/src/features')) return ['search', 'file-upload']
      if (p.endsWith('/src/features/search')) return ['index.js']
      if (p.endsWith('/src/features/file-upload')) return ['index.ts']
      return []
    })

    const context = createContext()
    const rule = featureStructureRule.create(context)
    if (rule.Program) rule.Program()

    expect(context.report).not.toHaveBeenCalled()
  })
})
