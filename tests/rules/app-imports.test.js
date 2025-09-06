import path from 'path'
import { describe, it, expect, beforeEach } from 'vitest'
import { setupTest, runRule } from '../utils.js'
import rule from '../../src/rules/app-imports.js'

describe('app-imports', () => {
  beforeEach(setupTest)

  const opts = [{ app: 'app', shared: 'shared', features: 'features' }]

  it('allows importing from shared', () => {
    const filename = path.join(process.cwd(), 'src', 'app', 'main.js')
    const imports = [path.join(process.cwd(), 'src', 'shared', 'lib')]
    const ctx = runRule(rule, filename, opts, imports)
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it("allows importing a feature's public API (features/<feature>)", () => {
    const filename = path.join(process.cwd(), 'src', 'app', 'main.js')
    const imports = [path.join(process.cwd(), 'src', 'features', 'payments')]
    const ctx = runRule(rule, filename, opts, imports)
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('forbids deep import into a feature (features/<feature>/... )', () => {
    const filename = path.join(process.cwd(), 'src', 'app', 'main.js')
    const imports = [path.join(process.cwd(), 'src', 'features', 'payments', 'components', 'button.js')]
    const ctx = runRule(rule, filename, opts, imports)
    expect(ctx.report).toHaveBeenCalled()
  })

  it('allows app/router.ts to import feature route files', () => {
    const filename = path.join(process.cwd(), 'src', 'app', 'router.ts')
    const imports = [path.join(process.cwd(), 'src', 'features', 'payments', 'routes', 'index.js')]
    const ctx = runRule(rule, filename, opts, imports)
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('allows app/router.ts to import feature routes.ts files', () => {
    const filename = path.join(process.cwd(), 'src', 'app', 'router.ts')
    const imports = [path.join(process.cwd(), 'src', 'features', 'payments', 'routes.ts')]
    const ctx = runRule(rule, filename, opts, imports)
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('forbids imports from other layers (e.g., utils)', () => {
    const filename = path.join(process.cwd(), 'src', 'app', 'main.js')
    const imports = [path.join(process.cwd(), 'src', 'utils', 'helpers.js')]
    const ctx = runRule(rule, filename, opts, imports)
    expect(ctx.report).toHaveBeenCalled()
  })

  it('ignores virtual filenames and test files', () => {
    const ctx1 = runRule(rule, '<input>', opts, [path.join(process.cwd(), 'src', 'features', 'payments', 'components', 'button.js')])
    expect(ctx1.report).not.toHaveBeenCalled()

    const testFilename = path.join(process.cwd(), 'tests', 'app', 'main.test.js')
    const ctx2 = runRule(rule, testFilename, opts, [path.join(process.cwd(), 'src', 'features', 'payments', 'components', 'button.js')])
    expect(ctx2.report).not.toHaveBeenCalled()
  })

  it('ignores non-string imports', () => {
    const filename = path.join(process.cwd(), 'src', 'app', 'main.js')
    const imports = [null, 123, {}]
    const ctx = runRule(rule, filename, opts, imports)
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('resolves relative imports and respects ignore option', () => {
    const filename = path.join(process.cwd(), 'src', 'app', 'main.js')
    // from src/app main.js, ../features/payments/... resolves to src/features/payments/...
    const imports = ['../features/payments/components/button.js']
    // without ignore -> should report
    const ctx1 = runRule(rule, filename, opts, imports)
    expect(ctx1.report).toHaveBeenCalled()

    // with ignore on payments -> should not report
    const optsIgnore = [{ app: 'app', shared: 'shared', features: 'features', ignore: ['payments'] }]
    const ctx2 = runRule(rule, filename, optsIgnore, imports)
    expect(ctx2.report).not.toHaveBeenCalled()
  })

  it('does nothing when filename does not include configured app segment', () => {
    const filename = path.join(process.cwd(), 'src', 'other', 'main.js')
    const imports = [path.join(process.cwd(), 'src', 'features', 'payments', 'components', 'button.js')]
    const ctx = runRule(rule, filename, opts, imports)
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('ignores imports that point to the features folder itself (no feature name)', () => {
    const filename = path.join(process.cwd(), 'src', 'app', 'main.js')
    // import that ends at the features folder (no specific feature)
    const imports = [path.join(process.cwd(), 'src', 'features')]
    const ctx = runRule(rule, filename, opts, imports)
    // should not report (the rule returns early when no feature name follows)
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('reports forbidden import when target segment is an empty string (trailing slash)', () => {
    const filename = path.join(process.cwd(), 'src', 'app', 'main.js')
    // create an import path with a trailing slash so the last segment is ''
    const imports = [path.join(process.cwd(), 'src', 'utils') + path.sep]
    const ctx = runRule(rule, filename, opts, imports)
    expect(ctx.report).toHaveBeenCalled()
  })

  it('handles filenames with a trailing slash (empty base segment)', () => {
    // append a trailing slash to make the final path segment an empty string
    const filename = path.join(process.cwd(), 'src', 'app', 'main.js') + path.sep
    const imports = [path.join(process.cwd(), 'src', 'shared', 'lib')]
    const ctx = runRule(rule, filename, opts, imports)
    // should not report (shared import is allowed)
    expect(ctx.report).not.toHaveBeenCalled()
  })
})
