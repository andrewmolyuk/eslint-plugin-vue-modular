import path from 'path'
import { describe, it, expect, beforeEach } from 'vitest'
import { setupTest, runRule } from '../helpers.js'
import rule from '@/rules/no-shared-imports-from-features.js'

describe('vue-modular/no-shared-imports-from-features', () => {
  beforeEach(setupTest)

  it('reports when shared imports from a feature', () => {
    const filename = path.join(process.cwd(), 'src', 'shared', 'utils', 'index.js')
    const imports = [path.join(process.cwd(), 'src', 'features', 'payments', 'utils', 'api.js')]
    const ctx = runRule(rule, filename, [{ shared: 'shared', features: 'features' }], imports)
    expect(ctx.report).toHaveBeenCalled()
  })

  it('reports when shared imports from views', () => {
    const filename = path.join(process.cwd(), 'src', 'shared', 'utils', 'index.js')
    const imports = [path.join(process.cwd(), 'src', 'views', 'Home', 'index.js')]
    const ctx = runRule(rule, filename, [{ shared: 'shared', views: 'views' }], imports)
    expect(ctx.report).toHaveBeenCalled()
  })

  it('does not report when shared imports from shared', () => {
    const filename = path.join(process.cwd(), 'src', 'shared', 'utils', 'index.js')
    const imports = [path.join(process.cwd(), 'src', 'shared', 'services', 'api.js')]
    const ctx = runRule(rule, filename, [{ shared: 'shared' }], imports)
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('respects ignore option for features', () => {
    const filename = path.join(process.cwd(), 'src', 'shared', 'utils', 'index.js')
    const imports = [path.join(process.cwd(), 'src', 'features', 'payments', 'utils', 'api.js')]
    const ctx = runRule(rule, filename, [{ shared: 'shared', features: 'features', ignore: ['payments'] }], imports)
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('ignores virtual filenames', () => {
    const ctx = runRule(rule, '<input>', [{ shared: 'shared' }], ['src/features/other/x.js'])
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('ignores non-string imports', () => {
    const filename = path.join(process.cwd(), 'src', 'shared', 'utils', 'index.js')
    const imports = [null, 123, {}]
    const ctx = runRule(rule, filename, [{ shared: 'shared' }], imports)
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('ignores imports that reference features segment only (no target feature)', () => {
    const filename = path.join(process.cwd(), 'src', 'shared', 'utils', 'index.js')
    const imports = [path.join(process.cwd(), 'src', 'features')]
    const ctx = runRule(rule, filename, [{ shared: 'shared', features: 'features' }], imports)
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('reports when importing views segment only (no target)', () => {
    const filename = path.join(process.cwd(), 'src', 'shared', 'utils', 'index.js')
    const imports = [path.join(process.cwd(), 'src', 'views')]
    const ctx = runRule(rule, filename, [{ shared: 'shared', views: 'views' }], imports)
    expect(ctx.report).toHaveBeenCalled()
  })

  it('does nothing when filename does not contain the shared segment', () => {
    const filename = path.join(process.cwd(), 'src', 'other', 'utils', 'index.js')
    const imports = [path.join(process.cwd(), 'src', 'features', 'payments', 'utils', 'api.js')]
    const ctx = runRule(rule, filename, [{ shared: 'shared', features: 'features' }], imports)
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('reports when a relative import resolves to a feature', () => {
    const filename = path.join(process.cwd(), 'src', 'shared', 'utils', 'lib', 'index.js')
    // from src/shared/utils/lib, ../../features/payments/... resolves to src/features/payments/...
    const imports = ['../../features/payments/utils/api.js']
    const ctx = runRule(rule, filename, [{ shared: 'shared', features: 'features' }], imports)
    expect(ctx.report).toHaveBeenCalled()
  })
})
