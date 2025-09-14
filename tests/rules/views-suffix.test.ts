import { describe, it } from 'vitest'
import { viewsSuffix } from '../../src/rules/views-suffix'
import { getRuleTester } from '../test-utils'

const ruleTester = getRuleTester()

describe('views-suffix', () => {
  it('enforces View.vue suffix for files in views folder', () => {
    ruleTester.run('views-suffix', viewsSuffix, {
      valid: [
        { code: '{}', filename: 'src/features/auth/views/LoginView.vue' },
        { code: '{}', filename: 'src/views/HomeView.vue' },
        // filename that cannot be resolved to project root should be skipped
        { code: '{}', filename: 'LoginView.vue' },
        // default ignore patterns should skip the rule
        { code: '{}', filename: 'src/features/auth/views/LoginView.test.vue', options: [{ ignores: ['**/*.test.vue'] }] },
        // files not in a views folder should be ignored by this rule
        { code: '{}', filename: 'src/features/auth/components/Login.vue' },
      ],
      invalid: [
        {
          code: '{}',
          filename: 'src/features/auth/views/Login.vue',
          errors: [{ messageId: 'invalidSuffix', data: { filename: 'Login.vue' } }],
        },
        {
          code: '{}',
          filename: 'src/views/Home.vue',
          errors: [{ messageId: 'invalidSuffix', data: { filename: 'Home.vue' } }],
        },
      ],
    })
  })
})
