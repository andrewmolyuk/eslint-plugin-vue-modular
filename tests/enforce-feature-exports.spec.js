import { describe, it, expect, beforeEach, vi } from 'vitest'
import fs from 'fs'
import featureStructureRule from '../src/rules/enforce-feature-exports.js'
import { setupTest, runRule, createMockFileSystem } from './utils'

describe('enforce-feature-exports rule', () => {
  beforeEach(setupTest)

  it('does not report when features directory is missing (features optional)', () => {
    vi.spyOn(fs, 'readdirSync').mockReturnValue(['components', 'main.ts'])

    const context = runRule(featureStructureRule)

    expect(context.report).not.toHaveBeenCalled()
  })

  it('reports features missing index files', () => {
    const mockFileSystem = createMockFileSystem({
      '**/src': ['features'],
      '**/src/features': ['search', 'file-upload'],
      '**/src/features/search': ['components'],
      '**/src/features/file-upload': ['index.ts'],
    })
    vi.spyOn(fs, 'readdirSync').mockImplementation(mockFileSystem)

    const context = runRule(featureStructureRule)

    expect(context.report).toHaveBeenCalledWith(expect.objectContaining({ messageId: 'missingIndex' }))
  })

  it('passes when all features have index files', () => {
    const mockFileSystem = createMockFileSystem({
      '**/src': ['features'],
      '**/src/features': ['search', 'file-upload'],
      '**/src/features/search': ['index.js'],
      '**/src/features/file-upload': ['index.ts'],
    })
    vi.spyOn(fs, 'readdirSync').mockImplementation(mockFileSystem)

    const context = runRule(featureStructureRule)

    expect(context.report).not.toHaveBeenCalled()
  })
})
