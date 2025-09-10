import { describe, it, expect, vi } from 'vitest'

// Ensure any package.json reads during module import are stubbed
vi.mock('fs', async () => {
  const fs = await vi.importActual('fs')
  return {
    ...fs,
    readFileSync: () => JSON.stringify({ name: 'eslint-plugin-vue-modular' }),
  }
})

import { runRule, mockFile } from '../../!JS/tests/helpers.js'
import { fileTsNaming } from '../../src/rules/file-ts-naming'

describe('rules/file-ts-naming', () => {
  it('accepts camelCase .ts file', () => {
    const ctx = runRule(fileTsNaming, '/home/cgs/project/src/myFile.ts')
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('accepts camelCase .tsx in nested folder', () => {
    const ctx = runRule(fileTsNaming, '/home/cgs/project/src/components/myComponent.tsx')
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('ignores files specified in options', () => {
    // ensure any package.json reads are mocked via project helper
    mockFile('package.json', JSON.stringify({ name: 'eslint-plugin-vue-modular' }))
    const ctx = runRule(fileTsNaming, '/home/cgs/project/src/shims-vue.d.ts', [{ ignores: ['shims-vue.d.ts'] }])
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('reports dashed filenames', () => {
    const ctx = runRule(fileTsNaming, '/home/cgs/project/src/my-file.ts')
    expect(ctx.report).toHaveBeenCalled()
    const call = ctx.report.mock.calls[0][0]
    expect(call.messageId).toBe('filenameNotCamel')
    expect(call.data.filename).toBe('my-file.ts')
    expect(call.data.expected).toBe('myFile')
  })

  it('reports PascalCase filenames', () => {
    const ctx = runRule(fileTsNaming, '/home/cgs/project/src/MyFile.ts')
    expect(ctx.report).toHaveBeenCalled()
    const call = ctx.report.mock.calls[0][0]
    expect(call.messageId).toBe('filenameNotCamel')
    expect(call.data.filename).toBe('MyFile.ts')
    expect(call.data.expected).toBe('myFile')
  })

  it('reports underscored filenames', () => {
    const ctx = runRule(fileTsNaming, '/home/cgs/project/src/my_file.ts')
    expect(ctx.report).toHaveBeenCalled()
    const call = ctx.report.mock.calls[0][0]
    expect(call.messageId).toBe('filenameNotCamel')
    expect(call.data.filename).toBe('my_file.ts')
    expect(call.data.expected).toBe('myFile')
  })
})
