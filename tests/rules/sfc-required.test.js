import fs from 'fs'
import path from 'path'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setupTest, runRule } from '../helpers.js'
import rule from '@/rules/sfc-required.js'

const mockFileSystem = (filePath, content) => {
  vi.spyOn(fs, 'existsSync').mockImplementation((p) => String(p) === filePath)
  vi.spyOn(fs, 'readFileSync').mockImplementation(() => content)
}

describe('vue-modular/sfc-required', () => {
  beforeEach(setupTest)
  afterEach(() => vi.restoreAllMocks())

  const opts = [{ src: 'src', ignore: [] }]

  it('reports when .vue has neither <template> nor <script>', () => {
    const file = path.join(process.cwd(), 'src', 'features', 'auth', 'components', 'NoBlocks.vue')
    mockFileSystem(file, '<style>.a{}</style')
    const ctx = runRule(rule, file, opts)
    expect(ctx.report).toHaveBeenCalled()
    expect(ctx.report).toHaveBeenCalledWith(expect.objectContaining({ messageId: 'missingSfcBlock' }))
  })

  it('allows when .vue contains <template>', () => {
    const file = path.join(process.cwd(), 'src', 'features', 'auth', 'components', 'WithTemplate.vue')
    mockFileSystem(file, '<template><div/></template>')
    const ctx = runRule(rule, file, opts)
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('allows when .vue contains <script setup>', () => {
    const file = path.join(process.cwd(), 'src', 'features', 'auth', 'components', 'WithScript.vue')
    mockFileSystem(file, '<script setup>const a = 1</script>')
    const ctx = runRule(rule, file, opts)
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('skips non-.vue files', () => {
    const filename = path.join(process.cwd(), 'src', 'features', 'auth', 'components', 'Button.js')
    const ctx = runRule(rule, filename, opts)
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('ignores virtual inputs', () => {
    const ctx = runRule(rule, '<input>', opts)
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('ignores test files', () => {
    const testFilename = path.join(process.cwd(), 'tests', 'some', 'comp.test.js')
    const ctx = runRule(rule, testFilename, opts)
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('ignores files outside configured src', () => {
    const filename = path.join(process.cwd(), 'lib', 'some', 'Comp.vue')
    const ctx = runRule(rule, filename, opts)
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('respects ignore patterns', () => {
    const file = path.join(process.cwd(), 'src', 'legacy', 'Thing.vue')
    const ctx = runRule(rule, file, [{ src: 'src', ignore: ['**/legacy/**'] }])
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('skips content check if readFileSync throws', () => {
    const file = path.join(process.cwd(), 'src', 'features', 'auth', 'components', 'Broken.vue')
    vi.spyOn(fs, 'existsSync').mockImplementation((p) => String(p) === file)
    vi.spyOn(fs, 'readFileSync').mockImplementation(() => {
      throw new Error('boom')
    })
    const ctx = runRule(rule, file, opts)
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('returns early when rule already ran (runOnce)', () => {
    const file = path.join(process.cwd(), 'src', 'features', 'auth', 'components', 'Once.vue')
    const context = {
      options: opts,
      getFilename: () => file,
      report: vi.fn(),
      settings: {},
    }

    // first create should return an instance with Program
    const first = rule.create(context)
    expect(typeof first.Program).toBe('function')

    // second create during same process should return an empty object (early return)
    const second = rule.create(context)
    expect(second).toEqual({})
  })

  it('returns early when getFilename yields no filename', () => {
    const context = {
      options: opts,
      getFilename: () => undefined,
      report: vi.fn(),
      settings: {},
    }
    const inst = rule.create(context)
    if (inst.Program) inst.Program()
    expect(context.report).not.toHaveBeenCalled()
  })

  it('returns early when file does not exist on disk (existsSync false)', () => {
    const file = path.join(process.cwd(), 'src', 'features', 'auth', 'components', 'Missing.vue')
    vi.spyOn(fs, 'existsSync').mockImplementation(() => false)
    const readSpy = vi.spyOn(fs, 'readFileSync').mockImplementation(() => '')
    const ctx = runRule(rule, file, opts)
    expect(ctx.report).not.toHaveBeenCalled()
    expect(readSpy).not.toHaveBeenCalled()
  })
})
