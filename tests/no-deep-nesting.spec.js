import { describe, it, beforeEach } from 'vitest'
import { setupRuleTester } from './utils'
import noDeepNestingRule from '../src/rules/no-deep-nesting.js'

describe('no-deep-nesting rule', () => {
  let ruleTester

  beforeEach(() => {
    ruleTester = setupRuleTester()
  })

  it('should allow files within default depth limit (3 levels)', () => {
    ruleTester.run('no-deep-nesting', noDeepNestingRule, {
      valid: [
        // Valid: 1 level deep in modules
        {
          code: 'export default {}',
          filename: '/project/src/modules/auth/index.ts',
        },
        // Valid: 2 levels deep in modules
        {
          code: 'export default {}',
          filename: '/project/src/modules/auth/components/LoginForm.vue',
        },
        // Valid: 3 levels deep (max default) in modules
        {
          code: 'export default {}',
          filename: '/project/src/modules/auth/components/forms/LoginForm.vue',
        },
        // Valid: 1 level deep in features
        {
          code: 'export default {}',
          filename: '/project/src/features/search/index.js',
        },
        // Valid: 2 levels deep in features
        {
          code: 'export default {}',
          filename: '/project/src/features/search/components/SearchBar.vue',
        },
        // Valid: 3 levels deep (max default) in features
        {
          code: 'export default {}',
          filename: '/project/src/features/search/components/filters/DateFilter.vue',
        },
        // Valid: Files not in modules or features are ignored
        {
          code: 'export default {}',
          filename: '/project/src/components/ui/forms/inputs/TextInput.vue',
        },
        // Valid: Files outside src are ignored
        {
          code: 'export default {}',
          filename: '/project/docs/modules/auth/components/forms/examples/LoginExample.vue',
        },
      ],
      invalid: [],
    })
  })

  it('should flag files exceeding default depth limit', () => {
    ruleTester.run('no-deep-nesting', noDeepNestingRule, {
      valid: [],
      invalid: [
        // Invalid: 4 levels deep in modules (exceeds default of 3)
        {
          code: 'export default {}',
          filename: '/project/src/modules/auth/components/forms/fields/PasswordField.vue',
          errors: [
            {
              messageId: 'deepNesting',
              data: {
                basePath: 'modules',
                actualDepth: 4,
                maxDepth: 3,
                suggestion: 'Consider extracting nested functionality into separate services or components within the auth module',
              },
            },
          ],
        },
        // Invalid: 5 levels deep in modules
        {
          code: 'export default {}',
          filename: '/project/src/modules/user/profile/settings/security/TwoFactorAuth.vue',
          errors: [
            {
              messageId: 'deepNesting',
              data: {
                basePath: 'modules',
                actualDepth: 4,
                maxDepth: 3,
                suggestion: 'Consider extracting nested functionality into separate services or components within the user module',
              },
            },
          ],
        },
        // Invalid: 4 levels deep in features
        {
          code: 'export default {}',
          filename: '/project/src/features/search/filters/advanced/date/DateRangePicker.vue',
          errors: [
            {
              messageId: 'deepNesting',
              data: {
                basePath: 'features',
                actualDepth: 4,
                maxDepth: 3,
                suggestion: 'Consider breaking down the search feature into smaller, more focused features',
              },
            },
          ],
        },
      ],
    })
  })

  it('should respect custom maxDepth configuration', () => {
    ruleTester.run('no-deep-nesting', noDeepNestingRule, {
      valid: [
        // Valid: 2 levels with maxDepth: 2
        {
          code: 'export default {}',
          filename: '/project/src/modules/auth/components/LoginForm.vue',
          options: [{ maxDepth: 2 }],
        },
      ],
      invalid: [
        // Invalid: 3 levels with maxDepth: 2
        {
          code: 'export default {}',
          filename: '/project/src/modules/auth/components/forms/LoginForm.vue',
          options: [{ maxDepth: 2 }],
          errors: [
            {
              messageId: 'deepNesting',
              data: {
                basePath: 'modules',
                actualDepth: 3,
                maxDepth: 2,
                suggestion: 'Consider extracting nested functionality into separate services or components within the auth module',
              },
            },
          ],
        },
      ],
    })
  })

  it('should respect custom paths configuration', () => {
    ruleTester.run('no-deep-nesting', noDeepNestingRule, {
      valid: [
        // Valid: Deep nesting in modules ignored when only checking 'components'
        {
          code: 'export default {}',
          filename: '/project/src/modules/auth/components/forms/fields/PasswordField.vue',
          options: [{ paths: ['components'] }],
        },
      ],
      invalid: [
        // Invalid: Deep nesting in components when checking 'components'
        {
          code: 'export default {}',
          filename: '/project/src/components/ui/forms/inputs/advanced/DateTimePicker.vue',
          options: [{ paths: ['components'] }],
          errors: [
            {
              messageId: 'deepNesting',
              data: {
                basePath: 'components',
                actualDepth: 4,
                maxDepth: 3,
                suggestion: 'Consider restructuring to stay within 3 levels of nesting',
              },
            },
          ],
        },
      ],
    })
  })

  it('should handle edge cases correctly', () => {
    ruleTester.run('no-deep-nesting', noDeepNestingRule, {
      valid: [
        // Valid: File directly in modules folder
        {
          code: 'export default {}',
          filename: '/project/src/modules/index.ts',
        },
        // Valid: File directly in features folder
        {
          code: 'export default {}',
          filename: '/project/src/features/index.js',
        },
        // Valid: Path with unusual structure but within limits
        {
          code: 'export default {}',
          filename: '/project/src/modules/auth-module/auth.service.ts',
        },
      ],
      invalid: [],
    })
  })

  it('should handle both maxDepth and paths options together', () => {
    ruleTester.run('no-deep-nesting', noDeepNestingRule, {
      valid: [
        // Valid: Within custom limits
        {
          code: 'export default {}',
          filename: '/project/src/services/api/client.ts',
          options: [{ maxDepth: 1, paths: ['services'] }],
        },
      ],
      invalid: [
        // Invalid: Exceeds custom maxDepth for custom path
        {
          code: 'export default {}',
          filename: '/project/src/services/api/endpoints/auth.ts',
          options: [{ maxDepth: 1, paths: ['services'] }],
          errors: [
            {
              messageId: 'deepNesting',
              data: {
                basePath: 'services',
                actualDepth: 2,
                maxDepth: 1,
                suggestion: 'Consider restructuring to stay within 1 levels of nesting',
              },
            },
          ],
        },
      ],
    })
  })

  it('should provide appropriate suggestions for different base paths', () => {
    ruleTester.run('no-deep-nesting', noDeepNestingRule, {
      valid: [],
      invalid: [
        // Modules suggestion
        {
          code: 'export default {}',
          filename: '/project/src/modules/auth/components/forms/fields/PasswordField.vue',
          errors: [
            {
              messageId: 'deepNesting',
              data: {
                basePath: 'modules',
                actualDepth: 4,
                maxDepth: 3,
                suggestion: 'Consider extracting nested functionality into separate services or components within the auth module',
              },
            },
          ],
        },
        // Features suggestion
        {
          code: 'export default {}',
          filename: '/project/src/features/search/components/filters/advanced/DateFilter.vue',
          errors: [
            {
              messageId: 'deepNesting',
              data: {
                basePath: 'features',
                actualDepth: 4,
                maxDepth: 3,
                suggestion: 'Consider breaking down the search feature into smaller, more focused features',
              },
            },
          ],
        },
        // Generic suggestion for custom paths
        {
          code: 'export default {}',
          filename: '/project/src/custom/deep/nested/structure/more/file.ts',
          options: [{ paths: ['custom'] }],
          errors: [
            {
              messageId: 'deepNesting',
              data: {
                basePath: 'custom',
                actualDepth: 4,
                maxDepth: 3,
                suggestion: 'Consider restructuring to stay within 3 levels of nesting',
              },
            },
          ],
        },
      ],
    })
  })
})
