import { describe, it } from 'vitest'
import { featureImports } from '../../src/rules/feature-imports'
import { getRuleTester } from '../test-utils'

const ruleTester = getRuleTester()

describe('feature-imports', () => {
  it('test cases for feature-imports rule', () => {
    ruleTester.run('feature-imports', featureImports, {
      valid: [
        {
          code: `import { sharedUtil } from 'src/shared/utils'`,
          filename: 'src/features/auth/components/LoginForm.vue',
        },
        // non-feature files are ignored
        {
          code: `import { something } from 'src/features/payments/utils/api'`,
          filename: 'src/app/main.ts',
        },
        // same-feature relative import allowed
        {
          code: `import helper from '../utils/helper'`,
          filename: 'src/features/auth/components/LoginForm.vue',
        },
        // unresolved external import should be ignored (resolvedPath falsy)
        {
          code: `import external from 'external-package'`,
          filename: 'src/features/auth/components/LoginForm.vue',
        },
        // ignored feature via options should skip rule (hit isIgnored early return)
        {
          code: `import { something } from '@/features/legacy-pay/components/x'`,
          filename: 'src/features/legacy-pay/components/x.ts',
          options: [{ ignores: ['src/features/legacy-pay/**'] }],
        },
        // filename that cannot be resolved by resolvePath should hit the early return
        {
          code: `import whatever from '@/features/payments/service'`,
          filename: 'outside/file.ts',
        },
        // alias import from shared layer should be allowed
        {
          code: `import { util } from '@/shared/utils'`,
          filename: 'src/features/auth/components/LoginForm.vue',
        },
        // alias import that targets the same feature should be allowed
        {
          code: `import { helper } from '@/features/auth/utils'`,
          filename: 'src/features/auth/components/LoginForm.vue',
        },
        // a relative import that walks above the project src root should result in a resolvedPath
        // outside the project and therefore normalizedResolved will be falsy -> rule no-op
        {
          code: `import outside from '../../../../outside/thing'`,
          filename: 'src/features/auth/components/LoginForm.vue',
        },
        // import from empty string should be ignored
        {
          code: `import nothing from ''`,
          filename: 'src/features/auth/components/LoginForm.vue',
        },
        // import from whitespace-only string should be ignored
        {
          code: `import nothing from '   '`,
          filename: 'src/features/auth/components/LoginForm.vue',
        },
        // resolvedPath falsy (external) -> no report
        { code: `import external from 'left-pad'`, filename: 'src/features/auth/components/Login.ts' },

        // shared import -> allowed
        { code: `import { util } from '@/shared/utils'`, filename: 'src/features/auth/components/Login.ts' },

        // same-feature import -> allowed
        { code: `import { helper } from '@/features/auth/utils'`, filename: 'src/features/auth/components/Login.ts' },
      ],
      invalid: [
        {
          code: `import { charge } from '@/features/payments/utils/api'`,
          filename: 'src/features/auth/components/Login.ts',
          errors: [{ messageId: 'forbiddenImport' }],
        },
        {
          code: `import svc from '@/features/payments/service'`,
          filename: 'src/features/auth/index.ts',
          errors: [{ messageId: 'forbiddenImport' }],
        },
        // absolute-style import (starts with '/') mapped under src should also be reported
        {
          code: `import { charge } from '/features/payments/utils/api'`,
          filename: 'src/features/auth/components/Login.ts',
          errors: [{ messageId: 'forbiddenImport' }],
        },
        // cross-feature import -> forbidden
        {
          code: `import svc from '@/features/payments/service'`,
          filename: 'src/features/auth/components/Login.ts',
          errors: [{ messageId: 'forbiddenImport' }],
        },
      ],
    })
  })
})
