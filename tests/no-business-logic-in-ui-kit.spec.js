import { describe, it, expect, beforeEach } from 'vitest'
import plugin from '../src/index.js'
import { createRuleTester } from './utils'

describe('vue-modular/no-business-logic-in-ui-kit rule', () => {
  let ruleTester

  beforeEach(() => {
    ruleTester = createRuleTester()
  })

  it('flags forbidden imports and side-effect calls inside UI-kit files', () => {
    ruleTester.run('vue-modular/no-business-logic-in-ui-kit', plugin.rules['no-business-logic-in-ui-kit'], {
      valid: [
        // ✅ Non-UI files importing business logic should be ignored
        {
          code: "import userService from '@/services/userService.js';",
          filename: '/project/src/components/App.js',
        },
        // ✅ UI-kit importing external libs
        {
          code: "import lodash from 'lodash';",
          filename: '/project/src/shared/ui/Button.js',
        },
        // ✅ UI-kit importing other UI-kit components
        {
          code: "import Icon from './Icon.vue';",
          filename: '/project/src/shared/ui/Button.js',
        },
        // ✅ UI-kit importing from shared/ui via alias
        {
          code: "import { BaseButton } from '@/shared/ui/BaseButton.vue';",
          filename: '/project/src/shared/ui/Button.js',
        },
        // ✅ UI-kit importing from src/shared (common utilities)
        {
          code: "import cn from '@/shared/cn';",
          filename: '/project/src/shared/ui/Tooltip.js',
        },
        // ✅ UI-kit importing explicitly allowed import via options
        {
          code: "import foo from '@/features/foo';",
          filename: '/project/src/shared/ui/Icon.js',
          options: [{ allowedImports: ['@/features/foo'] }],
        },
      ],
      invalid: [
        // ❌ UI-kit importing from business logic layers
        {
          code: "import userService from '@/services/userService.js';",
          filename: '/project/src/shared/ui/Button.js',
          errors: [{ messageId: 'forbiddenImport' }],
        },
        // ❌ UI-kit importing from features
        {
          code: "import SearchBar from '@/features/search/SearchBar.vue';",
          filename: '/project/src/shared/ui/Button.js',
          errors: [{ messageId: 'forbiddenImport' }],
        },
        // ❌ UI-kit importing from components (business layer)
        {
          code: "import UserCard from '@/components/UserCard.vue';",
          filename: '/project/src/shared/ui/Button.js',
          errors: [{ messageId: 'forbiddenImport' }],
        },
        // ❌ UI-kit performing side-effect (fetch)
        {
          code: 'fetch("/api/data")',
          filename: '/project/src/shared/ui/Widget.js',
          errors: [{ messageId: 'sideEffect' }],
        },
      ],
    })

    expect(true).toBe(true)
  })
})
