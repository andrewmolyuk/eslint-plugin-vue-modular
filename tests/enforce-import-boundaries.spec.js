import { describe, it, beforeEach } from 'vitest'
import { RuleTester } from 'eslint'
import plugin from '../src/index.js'

describe('vue-modular/enforce-import-boundaries rule', () => {
  let ruleTester

  beforeEach(() => {
    ruleTester = new RuleTester({
      languageOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
      plugins: {
        'vue-modular': plugin,
      },
    })

    if (global.__eslintVueModularState) delete global.__eslintVueModularState
  })

  it('basic cases', () => {
    ruleTester.run('enforce-import-boundaries', plugin.rules['enforce-import-boundaries'], {
      valid: [
        // import from same module internals
        { code: "import x from './components/x'", filename: '/src/modules/admin/pages/Users.vue' },
        // import module public api
        { code: "import Admin from '@/modules/admin'", filename: '/src/modules/admin/pages/Users.vue' },
        // shared imports allowed
        { code: "import utils from '@/shared/utils'", filename: '/src/modules/admin/pages/Users.vue' },
        // allow-list exception
        {
          code: "import ex from '@/modules/allowed/special'",
          filename: '/src/modules/admin/pages/Users.vue',
          options: [{ allow: ['@/modules/allowed/*'] }],
        },
        // (Type-only import tests require a TS parser; skipped here)
      ],
      invalid: [
        // deep import into other module
        {
          code: "import thing from '@/modules/billing/internal/thing'",
          filename: '/src/modules/inventory/pages/List.vue',
          errors: [{ messageId: 'deepModuleImport' }],
        },
        // deep import from feature
        {
          code: "import f from '@/features/auth/internal/util'",
          filename: '/src/features/ui/components/Button.vue',
          errors: [{ messageId: 'deepFeatureImport' }],
        },
        // app deep import
        {
          code: "import s from '@/modules/billing/internal/secret'",
          filename: '/src/app/main.js',
          errors: [{ messageId: 'appDeepImport' }],
        },
      ],
    })
  })
})
