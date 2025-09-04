import { describe, it, beforeEach } from 'vitest'
import plugin from '../src/index.js'
import { createRuleTester } from './utils'

describe('vue-modular/enforce-import-boundaries rule', () => {
  let ruleTester

  beforeEach(() => {
    ruleTester = createRuleTester()
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
        // ✅ shared-to-shared imports should be allowed
        { code: "import cn from '@/shared/cn'", filename: '/src/shared/ui/toggle/Toggle.vue' },
        { code: "import utils from '@/shared/utils'", filename: '/src/shared/components/Button.vue' },
        // ✅ Global services can import other global services
        { code: "import { authService } from '@/services/auth'", filename: '/src/services/user/api.js' },
        { code: "import apiClient from '@/services/http'", filename: '/src/services/auth/index.js' },
        { code: "import logger from '@/services/logging'", filename: '/src/services/analytics/tracker.js' },
        // ✅ Global stores can import other global stores
        { code: "import { useAuthStore } from '@/stores/auth'", filename: '/src/stores/user.js' },
        { code: "import appStore from '@/stores/app'", filename: '/src/stores/settings.js' },
        { code: "import { useUserStore } from '@/stores/user'", filename: '/src/stores/notifications.js' },
        // ✅ Services can still import stores, entities, shared
        { code: "import { useAppStore } from '@/stores/app'", filename: '/src/services/auth/index.js' },
        { code: "import { User } from '@/entities/User'", filename: '/src/services/user/api.js' },
        { code: "import utils from '@/shared/utils'", filename: '/src/services/http/client.js' },
        // ✅ Stores can still import entities, shared
        { code: "import { User } from '@/entities/User'", filename: '/src/stores/user.js' },
        { code: "import constants from '@/shared/constants'", filename: '/src/stores/app.js' },
        // ✅ Components can import stores (common pattern in Vue.js apps)
        { code: "import { useTransactionsStore } from '@/stores/transactions'", filename: '/src/components/TransactionList.vue' },
        { code: "import { useAuthStore } from '@/stores/auth'", filename: '/src/components/UserProfile.vue' },
        // ✅ Components can import other components
        { code: "import CommonDialog from '@/components/CommonDialog.vue'", filename: '/src/components/UserForm.vue' },
        { code: "import Button from '@/components/ui/Button.vue'", filename: '/src/components/FormActions.vue' },
        // ✅ Components can import services (common pattern in Vue.js apps)
        { code: "import authService from '@/services/auth'", filename: '/src/components/SidebarUser.vue' },
        { code: "import apiClient from '@/services/api'", filename: '/src/components/DataTable.vue' },
        // ✅ App layer can import module public APIs
        { code: "import LoginModule from '@/modules/login'", filename: '/src/app/router/routes.ts' },
        { code: "import ErrorModule from '@/modules/error'", filename: '/src/app/router/routes.ts' },
        { code: "import DebugModule from '@/modules/debug'", filename: '/src/app/main.ts' },
        // ✅ App layer can import from other app layer files
        { code: "import routes from './routes'", filename: '/src/app/router/router.ts' },
        { code: "import config from '@/app/config/database'", filename: '/src/app/main.ts' },
        { code: "import router from './router'", filename: '/src/app/index.ts' },
        { code: "import AppVue from './App.vue'", filename: '/src/app/index.ts' },
        { code: "import defaultLayout from './ui/default-layout.vue'", filename: '/src/app/layouts/index.ts' },
        { code: "import appHeader from './app-header.vue'", filename: '/src/app/layouts/ui/default-layout.vue' },
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
        // ❌ services -> forbidden layers (modules, features, composables, components, app)
        {
          code: "import mod from '@/modules/auth'",
          filename: '/src/services/user/api.js',
          errors: [{ messageId: 'forbiddenLayerImport' }],
        },
        {
          code: "import feat from '@/features/search'",
          filename: '/src/services/search/api.js',
          errors: [{ messageId: 'forbiddenLayerImport' }],
        },
        {
          code: "import comp from '@/composables/useAuth'",
          filename: '/src/services/auth/client.js',
          errors: [{ messageId: 'forbiddenLayerImport' }],
        },
        // stores importing forbidden target (e.g., modules)
        {
          code: "import M from '@/modules/auth'",
          filename: '/src/stores/app.store.js',
          errors: [{ messageId: 'forbiddenLayerImport' }],
        },
        // ❌ stores -> forbidden layers (services, modules, features, composables, components, app)
        {
          code: "import service from '@/services/api'",
          filename: '/src/stores/user.js',
          errors: [{ messageId: 'forbiddenLayerImport' }],
        },
        {
          code: "import feat from '@/features/notifications'",
          filename: '/src/stores/notifications.js',
          errors: [{ messageId: 'forbiddenLayerImport' }],
        },
        {
          code: "import comp from '@/composables/useLocalStorage'",
          filename: '/src/stores/settings.js',
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
