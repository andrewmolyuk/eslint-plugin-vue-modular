import { describe, it } from 'vitest'
import { crossImportsAbsolute } from '../../src/rules/cross-imports-absolute'
import { getRuleTester } from '../test-utils'

const ruleTester = getRuleTester()

describe('cross-imports-absolute', () => {
  it('test cases for cross-imports-absolute rule', () => {
    ruleTester.run('cross-imports-absolute', crossImportsAbsolute, {
      valid: [
        // alias import from shared -> allowed
        { code: `import { util } from '@/shared/utils'`, filename: 'src/features/auth/components/Login.ts' },
        // filename not resolvable by resolvePath -> early return (covers !filename branch)
        { code: `import external from 'left-pad'`, filename: 'file.ts' },
        // ignored via options -> early return (covers isIgnored branch)
        {
          code: `import { util } from '@/shared/utils'`,
          filename: 'src/features/auth/components/Login.ts',
          options: [{ ignores: ['src/features/**'] }],
        },
        // alias import from same feature -> allowed
        { code: `import { helper } from '@/features/auth/utils'`, filename: 'src/features/auth/components/Login.ts' },
        // relative import within same feature -> allowed
        { code: `import helper from '../utils/helper'`, filename: 'src/features/auth/components/LoginForm.vue' },
        // app importing shared via alias -> allowed
        { code: `import layout from '@/app/layouts/MainLayout'`, filename: 'src/app/main.ts' },
        // external package -> resolver returns null -> ignored
        { code: `import external from 'left-pad'`, filename: 'src/features/auth/components/Login.ts' },
        // shared -> shared import (covers fromShared && toShared branch)
        { code: `import { util } from '../utils/helper'`, filename: 'src/shared/components/Button.vue' },
        // empty import path to trigger defensive check
        { code: `import x from ''`, filename: 'src/features/auth/Login.ts' },
        // explicit shared to shared with alias (covers fromShared && toShared)
        { code: `import { config } from '@/shared/config'`, filename: 'src/shared/components/Input.vue' },
        // direct shared to shared with relative path
        { code: `import { helper } from './helper'`, filename: 'src/shared/services/api.ts' },
      ],
      invalid: [
        // feature -> another feature using non-alias absolute path
        {
          code: `import { util } from '../../shared/utils'`,
          filename: 'src/features/auth/Login.ts',
          errors: [{ messageId: 'useAlias' }],
        },
        // app -> feature using relative/absolute non-alias
        {
          code: `import svc from '../features/payments/service'`,
          filename: 'src/app/main.ts',
          errors: [{ messageId: 'useAlias' }],
        },
        // shared -> feature (non-aliased) should be reported (covers fromShared && toFeature branch)
        {
          code: `import z from '../../features/auth/utils'`,
          filename: 'src/shared/lib/file.ts',
          errors: [{ messageId: 'useAlias' }],
        },
      ],
    })
  })
})
