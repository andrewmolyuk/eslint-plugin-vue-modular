import { describe, it, expect, beforeEach } from 'vitest'
import { RuleTester } from 'eslint'
import plugin from '../src/index.js'

describe('vue-modular/no-cross-module-imports rule', () => {
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

    // Clean up global state after each test
    if (global.__eslintVueModularState) {
      delete global.__eslintVueModularState
    }
  })

  it('should allow same module imports', () => {
    ruleTester.run('no-cross-module-imports', plugin.rules['no-cross-module-imports'], {
      valid: [
        // Same module imports are allowed
        {
          code: "import Button from './components/Button'",
          filename: '/src/modules/admin/pages/Users.vue',
        },
        {
          code: "import userService from '../services/userService'",
          filename: '/src/modules/admin/components/UserList.vue',
        },
        // @ alias within same module is allowed
        {
          code: "import Button from '@/modules/admin/components/Button'",
          filename: '/src/modules/admin/pages/Users.vue',
        },
        // Importing module public API (index) is allowed
        {
          code: "import AdminModule from '@/modules/admin'",
          filename: '/src/modules/admin/pages/Users.vue',
        },
        // Shared folders are allowed (not considered modules)
        {
          code: "import utils from '@/shared/utils'",
          filename: '/src/modules/admin/pages/Users.vue',
        },
        // Non-module imports are allowed
        {
          code: "import service from '@/services/api'",
          filename: '/src/modules/admin/pages/Users.vue',
        },
        {
          code: "import store from '@/store/index'",
          filename: '/src/modules/user/components/Profile.vue',
        },
        // Node modules are always allowed
        {
          code: "import Vue from 'vue'",
          filename: '/src/modules/admin/pages/Users.vue',
        },
        {
          code: "import { computed } from 'vue'",
          filename: '/src/modules/user/components/Profile.vue',
        },
        // Relative imports going up but staying in same module
        {
          code: "import userStore from '../../store/user'",
          filename: '/src/modules/admin/components/forms/UserForm.vue',
        },
      ],
      invalid: [],
    })
  })

  it('should prevent cross-module imports', () => {
    ruleTester.run('no-cross-module-imports', plugin.rules['no-cross-module-imports'], {
      valid: [],
      invalid: [
        // Cross-module @ alias imports
        {
          code: "import UserProfile from '@/modules/user/components/UserProfile'",
          filename: '/src/modules/admin/pages/Dashboard.vue',
          errors: [{ messageId: 'crossModuleImport' }],
        },
        {
          code: "import adminService from '@/modules/admin/services/admin'",
          filename: '/src/modules/user/components/Profile.vue',
          errors: [{ messageId: 'crossModuleImport' }],
        },
        // Multiple modules involved
        {
          code: "import paymentService from '@/modules/billing/services/payment'",
          filename: '/src/modules/inventory/components/ProductList.vue',
          errors: [{ messageId: 'crossModuleImport' }],
        },
        // Cross-module relative imports (skip the problematic ones for now)
        {
          code: "import dashboardWidget from '../../admin/components/Widget'",
          filename: '/src/modules/user/pages/Profile.vue',
          errors: [{ messageId: 'crossModuleImport' }],
        },
      ],
    })
  })
})
