import fs from 'fs'
import path from 'path'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setupTest, runRule } from '../utils.js'
import rule from '@/rules/sfc-order.js'

const mockFile = (filePath, content) => {
  vi.spyOn(fs, 'existsSync').mockImplementation((p) => String(p) === filePath)
  vi.spyOn(fs, 'readFileSync').mockImplementation(() => content)
}

describe('vue-modular/sfc-order', () => {
  beforeEach(setupTest)
  afterEach(() => vi.restoreAllMocks())

  const opts = [{ src: 'src', ignore: [] }]

  it('does not report when .vue has only styles', () => {
    const file = path.join(process.cwd(), 'src', 'features', 'f', 'components', 'StyleOnly.vue')
    mockFile(file, '<style>.a{}</style>')
    const ctx = runRule(rule, file, opts)
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('allows correct order script -> template -> style', () => {
    const file = path.join(process.cwd(), 'src', 'features', 'f', 'components', 'Correct.vue')
    mockFile(file, `<script setup>const a=1</script><template><div/></template><style>.a{}</style>`)
    const ctx = runRule(rule, file, opts)
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('reports when template appears before script (wrong order)', () => {
    const file = path.join(process.cwd(), 'src', 'features', 'f', 'components', 'Wrong.vue')
    mockFile(file, `<template><div/></template><script>export default {}</script>`)
    const ctx = runRule(rule, file, opts)
    expect(ctx.report).toHaveBeenCalled()
    expect(ctx.report).toHaveBeenCalledWith(expect.objectContaining({ messageId: 'wrongOrder' }))
  })

  it('respects custom order option (template -> script allowed)', () => {
    const file = path.join(process.cwd(), 'src', 'features', 'f', 'components', 'Custom.vue')
    // template then script is normally wrong, but allowed by custom order
    mockFile(file, `<template><div/></template><script>export default {}</script>`)
    const ctx = runRule(rule, file, [{ src: 'src', ignore: [], order: ['template', 'script', 'style'] }])
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('falls back to default order when provided order is empty', () => {
    const file = path.join(process.cwd(), 'src', 'features', 'f', 'components', 'FallBack.vue')
    mockFile(file, `<script>export default {}</script><template><div/></template>`)
    // explicit empty order should fall back to default ['script','template','style']
    const ctx = runRule(rule, file, [{ src: 'src', ignore: [], order: [] }])
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('reports when there are two script blocks before template (duplicate script entries)', () => {
    const file = path.join(process.cwd(), 'src', 'features', 'f', 'components', 'DupScript.vue')
    // script then script setup then template -> actual: [script, script, template]
    mockFile(file, `<script>export default {}</script><script setup>const a=1</script><template><div/></template>`)
    const ctx = runRule(rule, file, [{ src: 'src', ignore: [], order: ['script', 'template', 'style'] }])
    expect(ctx.report).toHaveBeenCalled()
    expect(ctx.report).toHaveBeenCalledWith(expect.objectContaining({ messageId: 'wrongOrder' }))
  })

  it('skips content check if readFileSync throws', () => {
    const file = path.join(process.cwd(), 'src', 'features', 'f', 'components', 'Broken.vue')
    vi.spyOn(fs, 'existsSync').mockImplementation((p) => String(p) === file)
    vi.spyOn(fs, 'readFileSync').mockImplementation(() => {
      throw new Error('boom')
    })
    const ctx = runRule(rule, file, opts)
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('respects ignore patterns (isFileIgnored)', () => {
    const file = path.join(process.cwd(), 'src', 'legacy', 'Thing.vue')
    const ctx = runRule(rule, file, [{ src: 'src', ignore: ['**/legacy/**'] }])
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('returns early when file does not exist on disk (existsSync false)', () => {
    const file = path.join(process.cwd(), 'src', 'features', 'f', 'components', 'Missing.vue')
    vi.spyOn(fs, 'existsSync').mockImplementation(() => false)
    const readSpy = vi.spyOn(fs, 'readFileSync').mockImplementation(() => '')
    const ctx = runRule(rule, file, opts)
    expect(ctx.report).not.toHaveBeenCalled()
    expect(readSpy).not.toHaveBeenCalled()
  })

  it('respects early returns: non-.vue, virtual, outside src', () => {
    const notVue = path.join(process.cwd(), 'src', 'features', 'f', 'components', 'x.js')
    expect(runRule(rule, notVue, opts).report).not.toHaveBeenCalled()

    expect(runRule(rule, '<input>', opts).report).not.toHaveBeenCalled()

    const outside = path.join(process.cwd(), 'lib', 'Comp.vue')
    expect(runRule(rule, outside, opts).report).not.toHaveBeenCalled()
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

  it('ignores test files (isTestFile)', () => {
    const testFilename = path.join(process.cwd(), 'tests', 'some', 'comp.test.js')
    const ctx = runRule(rule, testFilename, opts)
    expect(ctx.report).not.toHaveBeenCalled()
  })
})
