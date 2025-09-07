import path from 'path'
import { describe, it, expect, beforeEach } from 'vitest'
import { setupTest, runRule } from '../utils.js'
import rule from '@/rules/no-direct-feature-imports.js'

describe('vue-modular/no-direct-feature-imports', () => {
  beforeEach(setupTest)

  it('reports when importing directly from another feature', () => {
    const filename = path.join(process.cwd(), 'src', 'features', 'auth', 'components', 'Button.vue')
    const imports = [path.join(process.cwd(), 'src', 'features', 'payments', 'utils', 'api.js')]
    const ctx = runRule(rule, filename, [{ features: 'features' }], imports)
    expect(ctx.report).toHaveBeenCalled()
  })

  it('does not report when importing from shared', () => {
    const filename = path.join(process.cwd(), 'src', 'features', 'auth', 'components', 'Button.vue')
    const imports = [path.join(process.cwd(), 'src', 'shared', 'utils', 'api.js')]
    const ctx = runRule(rule, filename, [{ features: 'features' }], imports)
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('does not report when importing from same feature deep when allowed', () => {
    const filename = path.join(process.cwd(), 'src', 'features', 'auth', 'components', 'Button.vue')
    const imports = [path.join(process.cwd(), 'src', 'features', 'auth', 'utils', 'helper.js')]
    const ctx = runRule(rule, filename, [{ features: 'features' }], imports)
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('ignores virtual filenames and test files', () => {
    const ctx1 = runRule(rule, '<input>', [{ features: 'features', imports: ['src/features/other/x.js'] }])
    expect(ctx1.report).not.toHaveBeenCalled()

    const filename = path.join(process.cwd(), 'tests', 'features', 'auth', 'components', 'Button.test.js')
    const ctx2 = runRule(rule, filename, [{ features: 'features' }], ['src/features/other/x.js'])
    expect(ctx2.report).not.toHaveBeenCalled()
  })

  it('does nothing when no imports option is provided', () => {
    const filename = path.join(process.cwd(), 'src', 'features', 'auth', 'components', 'Button.vue')
    const ctx = runRule(rule, filename, [{ features: 'features' }], undefined)
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('ignores non-string imports', () => {
    const filename = path.join(process.cwd(), 'src', 'features', 'auth', 'components', 'Button.vue')
    const imports = [null, 123, {}]
    const ctx = runRule(rule, filename, [{ features: 'features' }], imports)
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('ignores imports that reference features segment only (no target feature)', () => {
    const filename = path.join(process.cwd(), 'src', 'features', 'auth', 'components', 'Button.vue')
    const imports = [path.join(process.cwd(), 'src', 'features')]
    const ctx = runRule(rule, filename, [{ features: 'features' }], imports)
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('does nothing when filename ends with the configured features segment (no source feature)', () => {
    const filename = path.join(process.cwd(), 'src', 'features')
    const imports = [path.join(process.cwd(), 'src', 'features', 'payments', 'utils', 'api.js')]
    const ctx = runRule(rule, filename, [{ features: 'features' }], imports)
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('does nothing when configured features folder is not in filename path', () => {
    const filename = path.join(process.cwd(), 'src', 'other', 'auth', 'components', 'Button.vue')
    const imports = [path.join(process.cwd(), 'src', 'features', 'payments', 'utils', 'api.js')]
    const ctx = runRule(rule, filename, [{ features: 'features' }], imports)
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('respects ignore option for target features', () => {
    const filename = path.join(process.cwd(), 'src', 'features', 'auth', 'components', 'Button.vue')
    const imports = [path.join(process.cwd(), 'src', 'features', 'payments', 'utils', 'api.js')]
    const ctx = runRule(rule, filename, [{ features: 'features', ignore: ['payments'] }], imports)
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('reports when a relative import resolves to another feature', () => {
    const filename = path.join(process.cwd(), 'src', 'features', 'auth', 'components', 'Button.vue')
    // from .../features/auth/components, ../../payments/... resolves to .../features/payments/...
    const imports = ['../../payments/utils/api.js']
    const ctx = runRule(rule, filename, [{ features: 'features' }], imports)
    expect(ctx.report).toHaveBeenCalled()
  })

  it('resolves relative imports and respects ignore option', () => {
    const filename = path.join(process.cwd(), 'src', 'features', 'auth', 'components', 'Button.vue')
    const imports = ['../../payments/utils/api.js']
    const ctx = runRule(rule, filename, [{ features: 'features', ignore: ['payments'] }], imports)
    expect(ctx.report).not.toHaveBeenCalled()
  })
})
