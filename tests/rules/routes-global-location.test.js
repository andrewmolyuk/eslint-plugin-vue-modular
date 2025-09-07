import path from 'path'
import fs from 'fs'
import { vi, describe, it, expect, beforeEach } from 'vitest'

import rule from '@/rules/routes-global-location.js'
import { setupTest, runRule } from '../helpers.js'

describe('routes-global-location', () => {
  beforeEach(() => {
    setupTest()
  })

  it('reports when global routes file is missing', () => {
    const projectRoot = process.cwd()
    const filename = path.join(projectRoot, 'src', 'app', 'index.js')
    const expectedRoutes = path.join(projectRoot, 'src', 'app', 'routes.ts')

    vi.spyOn(fs, 'existsSync').mockImplementation((p) => (p === expectedRoutes ? false : false))

    const ctx = runRule(rule, filename, [{ app: 'src/app', routes: 'routes.ts' }])
    expect(ctx.report).toHaveBeenCalled()
  })

  it('does not report when global routes file exists', () => {
    const projectRoot = process.cwd()
    const filename = path.join(projectRoot, 'src', 'app', 'index.js')
    const expectedRoutes = path.join(projectRoot, 'src', 'app', 'routes.ts')

    vi.spyOn(fs, 'existsSync').mockImplementation((p) => (p === expectedRoutes ? true : false))

    const ctx = runRule(rule, filename, [{ app: 'src/app', routes: 'routes.ts' }])
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('runs only once per session', () => {
    const projectRoot = process.cwd()
    const filename = path.join(projectRoot, 'src', 'app', 'index.js')
    const expectedRoutes = path.join(projectRoot, 'src', 'app', 'routes.ts')

    vi.spyOn(fs, 'existsSync').mockImplementation((p) => (p === expectedRoutes ? false : false))

    const first = runRule(rule, filename, [{ app: 'src/app', routes: 'routes.ts' }])
    const second = runRule(rule, filename, [{ app: 'src/app', routes: 'routes.ts' }])

    expect(first.report).toHaveBeenCalled()
    expect(second.report).not.toHaveBeenCalled()
  })

  it('does nothing for virtual filenames', () => {
    vi.spyOn(fs, 'existsSync').mockImplementation(() => false)

    const ctx = runRule(rule, '<input>', [{ app: 'src/app', routes: 'routes.ts' }])
    expect(ctx.report).not.toHaveBeenCalled()
  })
})
