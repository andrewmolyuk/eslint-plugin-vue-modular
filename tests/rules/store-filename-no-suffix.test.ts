import { describe, it } from 'vitest'
import { storeFilenameNoSuffix } from '../../src/rules/store-filename-no-suffix'
import { getRuleTester } from '../test-utils'

const ruleTester = getRuleTester()

describe('store-filename-no-suffix', () => {
  it('flags files with Store suffix inside stores directories', () => {
    ruleTester.run('store-filename-no-suffix', storeFilenameNoSuffix, {
      valid: [
        { code: '// ok', filename: 'src/shared/stores/auth.ts' },
        { code: '// ok', filename: 'src/features/auth/useAuth.ts' },
        { code: '// ok', filename: 'src/features/auth/stores/tokenStore.ts', options: [{ ignores: ['**/tokenStore.ts'] }] },
        { code: '// ok', filename: 'src/shared/stores/authStore.js' },
        { code: '// ok', filename: 'authStore.ts' },
        { code: '// ok', filename: 'src/shared/stores/authStore.test.ts' },
      ],
      invalid: [
        {
          code: '// bad',
          filename: 'src/shared/stores/authStore.ts',
          errors: [{ messageId: 'noStoreSuffix', data: { filename: 'authStore.ts' } }],
        },
        {
          code: '// bad',
          filename: 'src/features/user/stores/userStore.ts',
          errors: [{ messageId: 'noStoreSuffix', data: { filename: 'userStore.ts' } }],
        },
      ],
    })
  })
})
