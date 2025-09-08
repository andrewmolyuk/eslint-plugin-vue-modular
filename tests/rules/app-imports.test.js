import path from 'path'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as utils from '@/utils'
import { setupTest, runRule, mockFile } from '../helpers.js'
import rule from '@/rules/app-imports.js'

describe('app-imports', () => {
  beforeEach(setupTest)

  const opts = [{ app: 'app', shared: 'shared', features: 'features' }]

  it('allows importing from shared', () => {
    const filename = path.join(process.cwd(), 'src', 'app', 'main.js')
    // create a mock file with a script that imports from shared
    mockFile('src/app/main.js', "<script>import lib from 'src/shared/lib'</script>")
    const ctx = runRule(rule, filename, opts)
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it("allows importing a feature's public API (features/<feature>)", () => {
    const filename = path.join(process.cwd(), 'src', 'app', 'main.js')
    mockFile('src/app/main.js', "<script>import payments from 'src/features/payments'</script>")
    const ctx = runRule(rule, filename, opts)
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('forbids deep import into a feature (features/<feature>/... )', () => {
    const filename = path.join(process.cwd(), 'src', 'app', 'main.js')
    const ctx = runRule(rule, filename, opts, ['src/features/payments/components/button.js'])
    expect(ctx.report).toHaveBeenCalled()
  })

  it('allows app/router.ts to import feature route files', () => {
    const filename = path.join(process.cwd(), 'src', 'app', 'router.ts')
    mockFile('src/app/router.ts', "<script>import routes from 'src/features/payments/routes/index.js'</script>")
    const ctx = runRule(rule, filename, opts)
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('allows app/router.ts to import feature routes.ts files', () => {
    const filename = path.join(process.cwd(), 'src', 'app', 'router.ts')
    mockFile('src/app/router.ts', "<script>import routes from 'src/features/payments/routes.ts'</script>")
    const ctx = runRule(rule, filename, opts)
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('forbids imports from other layers (e.g., utils)', () => {
    const filename = path.join(process.cwd(), 'src', 'app', 'main.js')
    const ctx = runRule(rule, filename, opts, ['src/utils/helpers.js'])
    expect(ctx.report).toHaveBeenCalled()
  })

  it('ignores virtual filenames', () => {
    const ctx = runRule(rule, '<input>', opts)
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('ignores non-string imports', () => {
    const filename = path.join(process.cwd(), 'src', 'app', 'main.js')
    // create file with no imports (non-string imports are irrelevant when using getImports)
    mockFile('src/app/main.js', '<script>/* no imports */</script>')
    const ctx = runRule(rule, filename, opts)
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('resolves relative imports and respects ignore option', () => {
    const filename = path.join(process.cwd(), 'src', 'app', 'main.js')
    // from src/app main.js, ../features/payments/... resolves to src/features/payments/...
    const ctx1 = runRule(rule, filename, opts, ['../features/payments/components/button.js'])
    expect(ctx1.report).toHaveBeenCalled()

    // with ignore on payments (glob pattern) -> should still report because rule checks the feature token
    const optsIgnoreGlob = [{ app: 'app', shared: 'shared', features: 'features', ignore: ['/payments/'] }]
    const ctx2 = runRule(rule, filename, optsIgnoreGlob, ['../features/payments/components/button.js'])
    expect(ctx2.report).toHaveBeenCalled()
  })

  it('honors ignore when feature token is matched (covers isIgnored return)', () => {
    const filename = path.join(process.cwd(), 'src', 'app', 'main.js')
    const imports = ['../features/payments/components/button.js']
    const optsIgnore = [{ app: 'app', shared: 'shared', features: 'features', ignore: ['payments'] }]

    // stub isIgnored so the rule's feature-token check returns true
    const spy = vi.spyOn(utils, 'isIgnored').mockImplementation((name, patterns) => {
      return name === 'payments' && Array.isArray(patterns) && patterns.includes('payments')
    })

    const ctx = runRule(rule, filename, optsIgnore, imports)
    expect(ctx.report).not.toHaveBeenCalled()
    spy.mockRestore()
  })

  it('does nothing when filename does not include configured app segment', () => {
    const filename = path.join(process.cwd(), 'src', 'other', 'main.js')
    mockFile('src/other/main.js', "<script>import btn from 'src/features/payments/components/button.js'</script>")
    const ctx = runRule(rule, filename, opts)
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('ignores imports that point to the features folder itself (no feature name)', () => {
    const filename = path.join(process.cwd(), 'src', 'app', 'main.js')
    // import that ends at the features folder (no specific feature)
    mockFile('src/app/main.js', "<script>import f from 'src/features'</script>")
    const ctx = runRule(rule, filename, opts)
    // should not report (the rule returns early when no feature name follows)
    expect(ctx.report).not.toHaveBeenCalled()
  })

  it('reports forbidden import when target segment is an empty string (trailing slash)', () => {
    const filename = path.join(process.cwd(), 'src', 'app', 'main.js')
    // create an import path with a trailing slash so the last segment is ''
    const ctx = runRule(rule, filename, opts, ['src/utils/'])
    expect(ctx.report).toHaveBeenCalled()
  })

  it('handles filenames with a trailing slash (empty base segment)', () => {
    // append a trailing slash to make the final path segment an empty string
    const filename = path.join(process.cwd(), 'src', 'app', 'main.js') + path.sep
    mockFile('src/app/main.js/', "<script>import lib from 'src/shared/lib'</script>")
    const ctx = runRule(rule, filename, opts)
    // should not report (shared import is allowed)
    expect(ctx.report).not.toHaveBeenCalled()
  })
})
