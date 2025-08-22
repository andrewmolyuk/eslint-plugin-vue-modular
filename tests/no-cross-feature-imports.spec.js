import { describe, it, expect, beforeEach } from 'vitest'
import { RuleTester } from 'eslint'
import plugin from '../src/index.js'

describe('vue-modular/no-cross-feature-imports rule', () => {
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
  })

  it('should prevent cross-feature imports from src/features', () => {
    ruleTester.run('vue-modular/no-cross-feature-imports', plugin.rules['no-cross-feature-imports'], {
      valid: [
        // ✅ Import from feature's entry point is allowed
        {
          code: "import userApi from '@/features/user';",
          filename: '/project/src/components/UserList.js',
        },
        // ✅ Import from same feature is allowed
        {
          code: "import userService from './services/userService.js';",
          filename: '/project/src/features/user/components/UserProfile.js',
        },
        // ✅ Import from same feature using relative path is allowed
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
        // ❌ Import from deep inside another feature via @ alias
        {
          code: "import userService from '@/features/user/services/userService.js';",
          filename: '/project/src/components/UserList.js',
          errors: [{ messageId: 'crossFeatureImport' }],
        },
        // ❌ Import from deep inside another feature via relative path
        {
          code: "import productService from '../../product/services/productService.js';",
          filename: '/project/src/features/user/components/UserProfile.js',
          errors: [{ messageId: 'crossFeatureImport' }],
        },
      ],
    })

    expect(true).toBe(true) // Dummy assertion for Vitest
  })

  it('should prevent cross-feature imports from modules/<module>/features', () => {
    ruleTester.run('vue-modular/no-cross-feature-imports', plugin.rules['no-cross-feature-imports'], {
      valid: [
        // ✅ Import from module feature's entry point is allowed
        {
          code: "import authApi from '../../modules/auth/features/login';",
          filename: '/project/src/components/App.js',
        },
        // ✅ Import within same module feature is allowed
        {
          code: "import loginForm from './components/LoginForm.js';",
          filename: '/project/modules/auth/features/login/pages/LoginPage.js',
        },
      ],
      invalid: [
        // ❌ Import from deep inside module feature
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
