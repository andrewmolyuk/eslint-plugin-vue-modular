import path from 'path'
import fs from 'fs'
import { vi, describe, it, expect, beforeEach } from 'vitest'

import rule from '@/rules/routes-feature-location.js'
import { setupTest, runRule } from '../helpers.js'

describe('routes-feature-location', () => {
  beforeEach(() => {
    setupTest()
  })

  it('reports when feature has views with *View.vue files but no routes file', () => {
    const featureDir = path.join(process.cwd(), 'src', 'features', 'payments')
    const filename = path.join(featureDir, 'components', 'PaymentCard.vue')

    vi.spyOn(fs, 'existsSync').mockImplementation((p) => {
      if (p === path.join(featureDir, 'views')) return true
      if (p === path.join(featureDir, 'routes.ts')) return false
      return false
    })

    vi.spyOn(fs, 'readdirSync').mockImplementation((p) => {
      if (p === path.join(featureDir, 'views')) return ['ListView.vue', 'DetailView.vue']
      return []
    })

    const context = runRule(rule, filename, [{ features: 'features', views: 'views', routes: 'routes.ts' }])
    expect(context.report).toHaveBeenCalled()
  })

  it('does not report when feature has no views folder', () => {
    const featureDir = path.join(process.cwd(), 'src', 'features', 'payments')
    const filename = path.join(featureDir, 'components', 'PaymentCard.vue')

    vi.spyOn(fs, 'existsSync').mockImplementation(() => false)
    vi.spyOn(fs, 'readdirSync').mockImplementation(() => [])

    const context = runRule(rule, filename, [{ features: 'features', views: 'views', routes: 'routes.ts' }])
    expect(context.report).not.toHaveBeenCalled()
  })

  it('does not report when views folder exists but contains no *View.vue files', () => {
    const featureDir = path.join(process.cwd(), 'src', 'features', 'payments')
    const filename = path.join(featureDir, 'components', 'PaymentCard.vue')

    vi.spyOn(fs, 'existsSync').mockImplementation((p) => p === path.join(featureDir, 'views'))
    vi.spyOn(fs, 'readdirSync').mockImplementation((p) => {
      if (p === path.join(featureDir, 'views')) return ['helper.js', 'not_a_view.vue']
      return []
    })

    const context = runRule(rule, filename, [{ features: 'features', views: 'views', routes: 'routes.ts' }])
    expect(context.report).not.toHaveBeenCalled()
  })

  it('returns early (no report) when reading views folder throws', () => {
    const featureDir = path.join(process.cwd(), 'src', 'features', 'payments')
    const filename = path.join(featureDir, 'components', 'PaymentCard.vue')

    vi.spyOn(fs, 'existsSync').mockImplementation((p) => p === path.join(featureDir, 'views'))
    vi.spyOn(fs, 'readdirSync').mockImplementation(() => {
      throw new Error('read error')
    })

    const context = runRule(rule, filename, [{ features: 'features', views: 'views', routes: 'routes.ts' }])
    expect(context.report).not.toHaveBeenCalled()
  })

  it('does nothing when configured features folder is not in filename path', () => {
    // simulate that views exists and contains View files, but filename path doesn't include features segment
    const featureDir = path.join(process.cwd(), 'src', 'other', 'payments')
    const filename = path.join(featureDir, 'components', 'PaymentCard.vue')

    vi.spyOn(fs, 'existsSync').mockImplementation((p) => {
      if (p === path.join(featureDir, 'views')) return true
      if (p === path.join(featureDir, 'routes.ts')) return false
      return false
    })

    vi.spyOn(fs, 'readdirSync').mockImplementation((p) => {
      if (p === path.join(featureDir, 'views')) return ['ListView.vue']
      return []
    })

    const context = runRule(rule, filename, [{ features: 'features', views: 'views', routes: 'routes.ts' }])
    expect(context.report).not.toHaveBeenCalled()
  })

  it('does nothing when featureName missing (path ends with features)', () => {
    const filename = path.join(process.cwd(), 'src', 'features')

    // existsSync should return false for routes and views queries
    vi.spyOn(fs, 'existsSync').mockImplementation(() => false)
    vi.spyOn(fs, 'readdirSync').mockImplementation(() => [])

    const context = runRule(rule, filename, [{ features: 'features', views: 'views', routes: 'routes.ts' }])
    expect(context.report).not.toHaveBeenCalled()
  })

  it('runs only once per session', () => {
    const featureDir = path.join(process.cwd(), 'src', 'features', 'payments')
    const filename = path.join(featureDir, 'components', 'PaymentCard.vue')

    vi.spyOn(fs, 'existsSync').mockImplementation((p) => {
      if (p === path.join(featureDir, 'views')) return true
      if (p === path.join(featureDir, 'routes.ts')) return false
      return false
    })

    vi.spyOn(fs, 'readdirSync').mockImplementation((p) => {
      if (p === path.join(featureDir, 'views')) return ['ListView.vue']
      return []
    })

    const first = runRule(rule, filename, [{ features: 'features', views: 'views', routes: 'routes.ts' }])
    const second = runRule(rule, filename, [{ features: 'features', views: 'views', routes: 'routes.ts' }])

    expect(first.report).toHaveBeenCalled()
    expect(second.report).not.toHaveBeenCalled()
  })

  it('respects viewSuffix when provided with extension (View.vue)', () => {
    const featureDir = path.join(process.cwd(), 'src', 'features', 'payments')
    const filename = path.join(featureDir, 'components', 'PaymentCard.vue')

    vi.spyOn(fs, 'existsSync').mockImplementation((p) => {
      if (p === path.join(featureDir, 'views')) return true
      if (p === path.join(featureDir, 'routes.ts')) return false
      return false
    })

    vi.spyOn(fs, 'readdirSync').mockImplementation((p) => {
      if (p === path.join(featureDir, 'views')) return ['ListView.vue']
      return []
    })

    const context = runRule(rule, filename, [{ features: 'features', views: 'views', routes: 'routes.ts', viewSuffix: 'View.vue' }])
    expect(context.report).toHaveBeenCalled()
  })

  it('does nothing for virtual filenames', () => {
    vi.spyOn(fs, 'existsSync').mockImplementation(() => false)
    vi.spyOn(fs, 'readdirSync').mockImplementation(() => [])

    const ctx = runRule(rule, '<input>', [{ features: 'features', views: 'views', routes: 'routes.ts' }])
    expect(ctx.report).not.toHaveBeenCalled()
  })
})
