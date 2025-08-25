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
        // module -> module forbidden (deep import case)
        {
          code: "import mod from '@/modules/billing/internal/secret'",
          filename: '/src/modules/inventory/pages/List.vue',
          errors: [{ messageId: 'deepModuleImport' }],
        },
        // deep import from feature (cross-feature)
        {
          code: "import f from '@/features/auth/internal/util'",
          filename: '/src/features/ui/components/Button.vue',
          errors: [{ messageId: 'featureToFeatureImport' }],
        },
        // feature -> feature forbidden
        {
          code: "import other from '@/features/notifications/components/Toast.vue'",
          filename: '/src/features/search/components/SearchBar.vue',
          errors: [{ messageId: 'featureToFeatureImport' }],
        },
        // feature -> module forbidden
        {
          code: "import m from '@/modules/auth'",
          filename: '/src/features/search/index.js',
          errors: [{ messageId: 'featureToModuleImport' }],
        },
        // app deep import
        {
          code: "import s from '@/modules/billing/internal/secret'",
          filename: '/src/app/main.js',
          errors: [{ messageId: 'appDeepImport' }],
        },
        // module/feature importing into app forbidden
        {
          code: "import something from '@/app/utils'",
          filename: '/src/modules/auth/index.js',
          errors: [{ messageId: 'layerImportAppForbidden' }],
        },
        // composables/components shouldn't import domain internals (example)
        {
          code: "import mod from '@/modules/auth/internal/helper'",
          filename: '/src/composables/useFoo.js',
          errors: [{ messageId: 'forbiddenLayerImport' }],
        },
        // services -> forbidden target (e.g., trying to import a component)
        {
          code: "import C from '@/components/Button.vue'",
          filename: '/src/services/payment/api.js',
          errors: [{ messageId: 'forbiddenLayerImport' }],
        },
        // stores importing forbidden target (e.g., modules)
        {
          code: "import M from '@/modules/auth'",
          filename: '/src/stores/app.store.js',
          errors: [{ messageId: 'forbiddenLayerImport' }],
        },
        // entities importing forbidden target
        {
          code: "import s from '@/services/api'",
          filename: '/src/entities/User.ts',
          errors: [{ messageId: 'forbiddenLayerImport' }],
        },
      ],
    })
  })
})
