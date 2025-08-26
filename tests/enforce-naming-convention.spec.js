import { describe, it, beforeEach } from 'vitest'
import { RuleTester } from 'eslint'
import plugin from '../src/index.js'

describe('vue-modular/enforce-naming-convention rule', () => {
  let ruleTester

  beforeEach(() => {
    ruleTester = new RuleTester({
      languageOptions: { ecmaVersion: 2022, sourceType: 'module' },
      plugins: { 'vue-modular': plugin },
    })
    if (global.__eslintVueModularState) delete global.__eslintVueModularState
  })

  it('basic component cases (legacy mode)', () => {
    ruleTester.run('enforce-naming-convention', plugin.rules['enforce-naming-convention'], {
      valid: [
        {
          code: "export default { name: 'UserCard' }",
          filename: '/src/components/UserCard.js',
          options: [{ enforceFileTypeConventions: false }],
        },
        {
          code: "export default { name: 'LoginView' }",
          filename: '/src/views/LoginView.js',
          options: [{ enforceFileTypeConventions: false }],
        },
        {
          code: 'export default { }',
          filename: '/src/components/Anonymous.js',
          options: [{ enforceFileTypeConventions: false }],
        },
      ],
      invalid: [
        {
          code: "export default { name: 'user-card' }",
          filename: '/src/components/user-card.js',
          options: [{ enforceFileTypeConventions: false }],
          errors: [{ messageId: 'badStyle' }],
        },
        {
          code: "export default { name: 'UserCard' }",
          filename: '/src/components/user-card.js',
          options: [{ enforceFileTypeConventions: false }],
          errors: [{ messageId: 'fileMismatch' }],
        },
      ],
    })
  })

  it('view naming conventions', () => {
    ruleTester.run('enforce-naming-convention', plugin.rules['enforce-naming-convention'], {
      valid: [
        {
          code: "export default { name: 'LoginView' }",
          filename: '/src/views/LoginView.vue',
        },
        {
          code: "export default { name: 'UserListView' }",
          filename: '/src/modules/users/views/UserListView.vue',
        },
        {
          code: 'export default { }',
          filename: '/src/views/DashboardView.vue',
        },
      ],
      invalid: [
        {
          code: "export default { name: 'Login' }",
          filename: '/src/views/Login.vue',
          errors: [{ messageId: 'namingConvention' }],
        },
        {
          code: "export default { name: 'LoginPage' }",
          filename: '/src/views/LoginPage.vue',
          errors: [{ messageId: 'namingConvention' }],
        },
      ],
    })
  })

  it('component naming conventions', () => {
    ruleTester.run('enforce-naming-convention', plugin.rules['enforce-naming-convention'], {
      valid: [
        {
          code: "export default { name: 'UserTable' }",
          filename: '/src/components/UserTable.vue',
        },
        {
          code: "export default { name: 'LoginForm' }",
          filename: '/src/modules/auth/components/LoginForm.vue',
        },
      ],
      invalid: [
        {
          code: "export default { name: 'userTable' }",
          filename: '/src/components/UserTable.vue',
          errors: [{ messageId: 'namingConvention' }, { messageId: 'namingConvention' }],
        },
        {
          code: "export default { name: 'user-table' }",
          filename: '/src/components/UserTable.vue',
          errors: [{ messageId: 'namingConvention' }, { messageId: 'namingConvention' }],
        },
      ],
    })
  })

  it('store naming conventions', () => {
    ruleTester.run('enforce-naming-convention', plugin.rules['enforce-naming-convention'], {
      valid: [
        {
          code: 'export default { }',
          filename: '/src/stores/useAuthStore.ts',
        },
        {
          code: 'export default { }',
          filename: '/src/modules/users/stores/useUserStore.ts',
        },
      ],
      invalid: [
        {
          code: 'export default { }',
          filename: '/src/stores/authStore.ts',
          errors: [{ messageId: 'namingConvention' }],
        },
        {
          code: 'export default { }',
          filename: '/src/stores/useAuth.ts',
          errors: [{ messageId: 'namingConvention' }],
        },
      ],
    })
  })

  it('composable naming conventions', () => {
    ruleTester.run('enforce-naming-convention', plugin.rules['enforce-naming-convention'], {
      valid: [
        {
          code: 'export default { }',
          filename: '/src/composables/useApi.ts',
        },
        {
          code: 'export default { }',
          filename: '/src/modules/auth/composables/useLogin.ts',
        },
      ],
      invalid: [
        {
          code: 'export default { }',
          filename: '/src/composables/api.ts',
          errors: [{ messageId: 'namingConvention' }],
        },
        {
          code: 'export default { }',
          filename: '/src/composables/apiHelper.ts',
          errors: [{ messageId: 'namingConvention' }],
        },
      ],
    })
  })

  it('service naming conventions', () => {
    ruleTester.run('enforce-naming-convention', plugin.rules['enforce-naming-convention'], {
      valid: [
        {
          code: 'export default { }',
          filename: '/src/services/auth.api.ts',
        },
        {
          code: 'export default { }',
          filename: '/src/modules/users/services/users.api.ts',
        },
      ],
      invalid: [
        {
          code: 'export default { }',
          filename: '/src/services/authService.ts',
          errors: [{ messageId: 'namingConvention' }],
        },
        {
          code: 'export default { }',
          filename: '/src/services/auth.ts',
          errors: [{ messageId: 'namingConvention' }],
        },
      ],
    })
  })

  it('file type detection', () => {
    ruleTester.run('enforce-naming-convention', plugin.rules['enforce-naming-convention'], {
      valid: [
        // Files that don't match specific patterns should not trigger violations
        {
          code: 'export default { }',
          filename: '/src/utils/helpers.ts',
        },
        {
          code: 'export default { }',
          filename: '/src/shared/constants.js',
        },
      ],
      invalid: [
        // But should still detect patterns based on filename in composables directory
        {
          code: 'export default { }',
          filename: '/src/composables/helper.ts', // Detected as composable without 'use' prefix
          errors: [{ messageId: 'namingConvention' }],
        },
      ],
    })
  })
})
