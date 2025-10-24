import { describe, it } from 'vitest'
import { appImports } from '../../src/rules/app-imports'
import { getRuleTester } from '../test-utils'

const ruleTester = getRuleTester()

describe('app-imports', () => {
  it('enforces allowed imports for app folder', () => {
    ruleTester.run('app-imports', appImports, {
      valid: [
        // imports from shared folder
        { code: "import x from '@/shared/utils'", filename: 'src/app/main.ts' },
        // imports from features folder
        { code: "import r from '@/features/auth'", filename: 'src/app/main.ts' },
        // router may import feature route files
        { code: "import r from '@/features/auth/routes'", filename: 'src/app/router.ts' },
        // unresolvable filename should be skipped
        { code: "import r from '@/features/auth/routes'", filename: 'app/main.ts' },
        // file outside app should be skipped
        { code: "import r from '@/shared/utils'", filename: 'src/features/auth/main.ts' },
        // default ignored patterns should skip rule checks
        { code: "import r from 'external/lib'", filename: 'src/app/main.test.ts' },
        // imports from feature public api (root)
        { code: "import fm from '@/features/auth'", filename: 'src/app/main.ts' },
        { code: "import fm from '@/features/auth/index'", filename: 'src/app/main.ts' },
        { code: "import fm from '@/features/auth/index.ts'", filename: 'src/app/main.ts' },
        { code: "import x from '@/utils/local'", filename: 'src/app/main.ts', options: [{ ignores: ['**/app/main.ts'] }] },
        // allow relative imports within app/
        { code: "import x from './local'", filename: 'src/app/main.ts' },
        { code: "import x from '../app/local'", filename: 'src/app/main.ts' },
        { code: "import x from '@/app/local'", filename: 'src/app/main.ts' },
      ],
      invalid: [
        {
          code: "import x from '@/utils/local'",
          filename: 'src/app/main.ts',
          errors: [{ messageId: 'forbiddenImport', data: { file: 'src/app/main.ts', target: '@/utils/local' } }],
        },
        {
          code: "import x from '../outside'",
          filename: 'src/app/main.ts',
          errors: [{ messageId: 'forbiddenImport', data: { file: 'src/app/main.ts', target: '../outside' } }],
        },
        {
          code: "import lib from '@/lib/some'",
          filename: 'src/app/router.ts',
          errors: [{ messageId: 'forbiddenImport', data: { file: 'src/app/router.ts', target: '@/lib/some' } }],
        },
        {
          code: "import m from '@/features/auth/someFile'",
          filename: 'src/app/main.ts',
          errors: [{ messageId: 'forbiddenImport', data: { file: 'src/app/main.ts', target: '@/features/auth/someFile' } }],
        },
      ],
    })
  })
})
