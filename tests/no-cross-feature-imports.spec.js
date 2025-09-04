import { describe, it, expect, beforeEach } from 'vitest'
import plugin from '../src/index.js'
import { createRuleTester } from './utils'

describe('vue-modular/no-cross-feature-imports rule', () => {
  let ruleTester

  beforeEach(() => {
    ruleTester = createRuleTester()
  })

  it('should prevent cross-feature imports from src/features', () => {
    ruleTester.run('vue-modular/no-cross-feature-imports', plugin.rules['no-cross-feature-imports'], {
      valid: [
        // ✅ Components can import from feature entry points
        {
          code: "import userApi from '@/features/user';",
          filename: '/project/src/components/UserList.js',
        },
        // ✅ Same feature internal imports by relative paths
        {
          code: "import userService from './services/userService.js';",
          filename: '/project/src/features/user/components/UserProfile.js',
        },
        // ✅ Same feature internal imports by relative paths
        {
          code: "import userTypes from '../types/userTypes.js';",
          filename: '/project/src/features/user/components/UserProfile.js',
        },
        // ✅ External imports are allowed
        {
          code: "import lodash from 'lodash';",
          filename: '/project/src/components/UserList.js',
        },
        // ✅ Non-feature imports are allowed
        {
          code: "import utils from '@/utils/helpers.js';",
          filename: '/project/src/components/UserList.js',
        },
      ],
      invalid: [
        // ❌ Components cannot import deep into features via @ alias
        {
          code: "import userService from '@/features/user/services/userService.js';",
          filename: '/project/src/components/UserList.js',
          errors: [{ messageId: 'crossFeatureImport' }],
        },
        // ❌ Features cannot import deep into other features via relative path
        {
          code: "import productService from '../../product/services/productService.js';",
          filename: '/project/src/features/user/components/UserProfile.js',
          errors: [{ messageId: 'crossFeatureImport' }],
        },
      ],
    })

    expect(true).toBe(true) // Dummy assertion for Vitest
  })

  it('allows importing a module feature entry via alias and disallows deep alias imports into other module features', () => {
    ruleTester.run('vue-modular/no-cross-feature-imports', plugin.rules['no-cross-feature-imports'], {
      valid: [
        // ✅ Module internal files can import other internal features inside the same module
        {
          code: "import helper from '@/modules/auth/features/login/helpers/utils';",
          filename: '/project/modules/auth/features/login/index.js',
        },
        // ✅ App-layer may import module public API
        {
          code: "import AuthModule from '@/modules/auth';",
          filename: '/project/src/app/router/index.js',
        },
        // ✅ Files within a module can import their own module's public API
        {
          code: "import ErrorModule from '@/modules/error';",
          filename: '/project/src/modules/error/ui/error-page.vue',
        },
        // ✅ Files within a module can import their own module's public API (different structure)
        {
          code: "import AuthModule from '@/modules/auth';",
          filename: '/project/src/modules/auth/components/LoginForm.vue',
        },
      ],
      invalid: [
        // ❌ App-layer or components cannot import internal module feature files directly
        {
          code: "import LoginFeature from '@/modules/auth/features/login';",
          filename: '/project/src/app/router/index.js',
          errors: [{ messageId: 'crossFeatureImport' }],
        },
        // ❌ Components cannot import internal module feature files directly
        {
          code: "import LoginFeature from '@/modules/auth/features/login';",
          filename: '/project/src/components/App.js',
          errors: [{ messageId: 'crossFeatureImport' }],
        },
        // ❌ Components may NOT import module public API directly (must be app layer)
        {
          code: "import AuthModule from '@/modules/auth';",
          filename: '/project/src/components/App.js',
          errors: [{ messageId: 'crossFeatureImport' }],
        },
        // ❌ Deep import into another module feature via @ alias
        {
          code: "import secret from '@/modules/payments/features/checkout/secret';",
          filename: '/project/modules/auth/features/login/index.js',
          errors: [{ messageId: 'crossFeatureImport' }],
        },
      ],
    })

    expect(true).toBe(true) // Dummy assertion for Vitest
  })

  it('should prevent cross-feature imports from modules/<module>/features', () => {
    ruleTester.run('vue-modular/no-cross-feature-imports', plugin.rules['no-cross-feature-imports'], {
      valid: [
        // ✅ Components can import from module feature entry points
        {
          code: "import authApi from '../../modules/auth/features/login';",
          filename: '/project/src/components/App.js',
        },
        // ✅ Module features can import internally
        {
          code: "import loginForm from './components/LoginForm.js';",
          filename: '/project/modules/auth/features/login/pages/LoginPage.js',
        },
      ],
      invalid: [
        // ❌ Components cannot import deep into module features
        {
          code: "import loginValidator from '../../modules/auth/features/login/utils/validator.js';",
          filename: '/project/src/components/App.js',
          errors: [{ messageId: 'crossFeatureImport' }],
        },
      ],
    })

    expect(true).toBe(true) // Dummy assertion for Vitest
  })

  it('should work with custom configuration', () => {
    ruleTester.run('vue-modular/no-cross-feature-imports', plugin.rules['no-cross-feature-imports'], {
      valid: [
        // ✅ Custom configuration with different paths
        {
          code: "import userApi from '@/components/user';",
          filename: '/project/source/pages/UserList.js',
          options: [{ srcPath: 'source', featuresPath: 'components' }],
        },
      ],
      invalid: [
        // ❌ Deep import with custom configuration
        {
          code: "import userService from '@/components/user/services/userService.js';",
          filename: '/project/source/pages/UserList.js',
          options: [{ srcPath: 'source', featuresPath: 'components' }],
          errors: [{ messageId: 'crossFeatureImport' }],
        },
      ],
    })

    expect(true).toBe(true) // Dummy assertion for Vitest
  })
})
