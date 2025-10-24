import { describe, it } from 'vitest'
import { sharedImports } from '../../src/rules/shared-imports'
import { getRuleTester } from '../test-utils'

const ruleTester = getRuleTester()

describe('shared-imports', () => {
  it('test cases for shared-imports rule', () => {
    ruleTester.run('shared-imports', sharedImports, {
      valid: [
        // non-shared files are ignored
        {
          code: `import { something } from '@/features/payments/utils/api'`,
          filename: 'src/app/main.ts',
        },
        // filename that cannot be resolved by resolvePath should hit the early return
        {
          code: `import whatever from '@/features/payments/service'`,
          filename: 'outside/file.ts',
        },
        // import from empty string should be ignored (early return)
        {
          code: `import nothing from ''`,
          filename: 'src/shared/lib/util.ts',
        },
        // export from empty string should be ignored (early return in ExportAllDeclaration)
        {
          code: `export * from ''`,
          filename: 'src/shared/lib/util.ts',
        },
        // export from external package should be ignored (resolvedPath falsy)
        {
          code: `export * from 'left-pad'`,
          filename: 'src/shared/lib/util.ts',
        },
        // shared importing from shared is allowed
        {
          code: `import { util } from '@/shared/utils'`,
          filename: 'src/shared/lib/util.ts',
        },
        // export from shared (should be allowed) - covers ExportAllDeclaration branch where resolvedPath is inside sharedPath
        {
          code: `export * from '@/shared/helpers'`,
          filename: 'src/shared/lib/util.ts',
        },
        // external imports are ignored
        {
          code: `import external from 'left-pad'`,
          filename: 'src/shared/lib/util.ts',
        },
        // relative import inside shared is allowed
        {
          code: `import helper from './helper'`,
          filename: 'src/shared/lib/util.ts',
        },
        // respects ignores option
        {
          code: `import svc from '@/features/payments/service'`,
          filename: 'src/shared/lib/util.ts',
          options: [{ ignores: ['src/shared/lib/**'] }],
        },
      ],
      invalid: [
        {
          code: `import { x } from '@/features/feature-a/some'`,
          filename: 'src/shared/lib/util.ts',
          errors: [{ messageId: 'forbiddenImport' }],
        },
        {
          code: `import svc from '/features/payments/service'`,
          filename: 'src/shared/lib/util.ts',
          errors: [{ messageId: 'forbiddenImport' }],
        },
        {
          code: `export * from '@/features/feature-a/thing'`,
          filename: 'src/shared/index.ts',
          errors: [{ messageId: 'forbiddenImport' }],
        },
      ],
    })
  })
})
