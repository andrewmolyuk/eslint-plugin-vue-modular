import { describe, it, expect, beforeEach, vi } from 'vitest'
import fs from 'fs'
import appStructureRule from '../src/rules/enforce-app-structure.js'
import { setupTest, runRule, createMockFileSystem } from './test-utils.js'

describe('enforce-app-structure rule', () => {
  beforeEach(setupTest)

  it('reports missing app dir', () => {
    vi.spyOn(fs, 'readdirSync').mockReturnValue(['components', 'modules'])

    const context = runRule(appStructureRule)

    expect(context.report).toHaveBeenCalledWith(expect.objectContaining({ messageId: 'missingApp' }))
  })

  it('reports missing required entries', () => {
    const mockFileSystem = createMockFileSystem({
      '**/src': ['app'],
      '**/src/app': ['router'],
    })
    vi.spyOn(fs, 'readdirSync').mockImplementation(mockFileSystem)

    const context = runRule(appStructureRule)

    expect(context.report).toHaveBeenCalled()
  })
})
