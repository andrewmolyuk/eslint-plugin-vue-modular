import { describe, it } from 'vitest'
import { serviceFilenameNoSuffix } from '../../src/rules/service-filename-no-suffix'
import { getRuleTester } from '../test-utils'

const ruleTester = getRuleTester()

describe('service-filename-no-suffix', () => {
  it('flags files with Service suffix inside services directories', () => {
    ruleTester.run('service-filename-no-suffix', serviceFilenameNoSuffix, {
      valid: [
        { code: '// ok', filename: 'src/shared/services/auth.ts' },
        { code: '// ok', filename: 'src/features/auth/useAuth.ts' },
        { code: '// ok', filename: 'src/features/auth/services/tokenService.ts', options: [{ ignores: ['**/tokenService.ts'] }] },
        // non-TS files should be ignored by the rule
        { code: '// ok', filename: 'src/shared/services/authService.js' },
        // filenames that cannot be resolved to project root (no 'src' prefix) should be skipped
        { code: '// ok', filename: 'authService.ts' },
        // default ignore patterns (e.g. .test.ts) should skip the rule
        { code: '// ok', filename: 'src/shared/services/authService.test.ts' },
      ],
      invalid: [
        {
          code: '// bad',
          filename: 'src/shared/services/authService.ts',
          errors: [{ messageId: 'noServiceSuffix', data: { filename: 'authService.ts' } }],
        },
        {
          code: '// bad',
          filename: 'src/features/user/services/userService.ts',
          errors: [{ messageId: 'noServiceSuffix', data: { filename: 'userService.ts' } }],
        },
      ],
    })
  })
})
