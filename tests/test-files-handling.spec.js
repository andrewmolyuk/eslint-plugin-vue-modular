import { describe, it, beforeEach, expect } from 'vitest'
import plugin from '../src/index.js'
import { createRuleTester } from './utils'

describe('Test files handling', () => {
  let ruleTester

  beforeEach(() => {
    ruleTester = createRuleTester()
  })

  describe('enforce-import-boundaries', () => {
    it('should allow test files to import from anywhere', () => {
      ruleTester.run('enforce-import-boundaries', plugin.rules['enforce-import-boundaries'], {
        valid: [
          // ✅ Test files in tests/ directory can import module internals
          {
            code: "import userService from '@/modules/user/services/userService'",
            filename: '/project/tests/user.test.js',
          },
          {
            code: "import { UserComponent } from '@/modules/user/components/UserProfile'",
            filename: '/project/tests/unit/user-module.spec.js',
          },
          // ✅ Test files with .test. pattern can import feature internals
          {
            code: "import loginValidator from '@/features/auth/validators/loginValidator'",
            filename: '/project/src/features/auth/login.test.js',
          },
          {
            code: "import { searchHelpers } from '@/features/search/utils/helpers'",
            filename: '/project/src/utils/search.spec.ts',
          },
          // ✅ Test files with .spec. pattern can import app internals
          {
            code: "import appConfig from '@/app/config/settings'",
            filename: '/project/src/app/app.spec.js',
          },
          // ✅ Test files in __tests__ directory can import anything
          {
            code: "import { StoreModule } from '@/stores/user'",
            filename: '/project/src/modules/auth/__tests__/auth-store.test.js',
          },
          {
            code: "import componentHelpers from '@/components/Button/helpers'",
            filename: '/project/src/__tests__/components.spec.js',
          },
          // ✅ Top-level tests folder (sibling to src) can import anything
          {
            code: "import { getAllModules } from '@/modules/admin/internal/utils'",
            filename: '/project/tests/integration/admin.test.js',
          },
        ],
        invalid: [],
      })
    })
  })

  describe('no-cross-module-imports', () => {
    it('should allow test files to import across modules', () => {
      ruleTester.run('no-cross-module-imports', plugin.rules['no-cross-module-imports'], {
        valid: [
          // ✅ Test files can import deep into other modules
          {
            code: "import userService from '@/modules/user/services/userService'",
            filename: '/project/tests/admin.test.js',
          },
          {
            code: "import { AdminComponent } from '../../modules/admin/components/AdminPanel'",
            filename: '/project/src/modules/user/user.spec.js',
          },
          // ✅ Files with test patterns can cross module boundaries
          {
            code: "import billingUtils from '@/modules/billing/utils/calculator'",
            filename: '/project/src/modules/user/billing.test.ts',
          },
        ],
        invalid: [],
      })
    })
  })

  describe('no-cross-feature-imports', () => {
    it('should allow test files to import across features', () => {
      ruleTester.run('no-cross-feature-imports', plugin.rules['no-cross-feature-imports'], {
        valid: [
          // ✅ Test files can import deep into other features
          {
            code: "import authValidator from '@/features/auth/validators/loginValidator'",
            filename: '/project/tests/search.test.js',
          },
          {
            code: "import { SearchComponent } from '../../features/search/components/SearchBar'",
            filename: '/project/src/features/auth/auth.spec.js',
          },
          // ✅ Files with test patterns can cross feature boundaries
          {
            code: "import notificationHelpers from '@/features/notifications/utils/helpers'",
            filename: '/project/src/features/user/notifications.test.ts',
          },
        ],
        invalid: [],
      })
    })
  })

  describe('isTestFile utility', () => {
    it('should correctly identify test files', () => {
      const { isTestFile } = plugin.utils || {}

      if (isTestFile) {
        // Files in tests/ directory
        expect(isTestFile('/project/tests/user.js')).toBe(true)
        expect(isTestFile('/project/tests/unit/auth.js')).toBe(true)
        expect(isTestFile('/project/src/tests/helpers.js')).toBe(true)

        // Files with .test. pattern
        expect(isTestFile('/project/src/components/Button.test.js')).toBe(true)
        expect(isTestFile('/project/src/utils/helpers.test.ts')).toBe(true)

        // Files with .spec. pattern
        expect(isTestFile('/project/src/components/Button.spec.js')).toBe(true)
        expect(isTestFile('/project/src/utils/helpers.spec.ts')).toBe(true)

        // Files in __tests__ directory
        expect(isTestFile('/project/src/__tests__/setup.js')).toBe(true)
        expect(isTestFile('/project/src/components/__tests__/Button.js')).toBe(true)

        // Non-test files
        expect(isTestFile('/project/src/components/Button.js')).toBe(false)
        expect(isTestFile('/project/src/utils/helpers.js')).toBe(false)
        expect(isTestFile('/project/src/stores/user.js')).toBe(false)
        expect(isTestFile('/project/src/modules/auth/index.js')).toBe(false)
      }
    })
  })
})
