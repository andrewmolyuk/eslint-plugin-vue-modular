import { describe, it, expect, beforeEach, vi } from 'vitest'
import fs from 'fs'
import featureStructureRule from '../src/rules/enforce-feature-exports.js'
import { setupTest, runRule } from './test-utils.js'

describe('enforce-feature-exports rule', () => {
  beforeEach(setupTest)

  it('does not report when features directory is missing (features optional)', () => {
    vi.spyOn(fs, 'readdirSync').mockReturnValue(['components', 'main.ts'])

    const context = runRule(featureStructureRule)

    expect(context.report).not.toHaveBeenCalled()
  })

  it('reports features missing index files', () => {
    vi.spyOn(fs, 'readdirSync').mockImplementation((p) => {
      if (p.endsWith('/src')) return ['features']
      if (p.endsWith('/src/features')) return ['search', 'file-upload']
      if (p.endsWith('/src/features/search')) return ['components']
      if (p.endsWith('/src/features/file-upload')) return ['index.ts']
      return []
    })

    const context = runRule(featureStructureRule)

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

    const context = runRule(featureStructureRule)

    expect(context.report).not.toHaveBeenCalled()
  })
})
