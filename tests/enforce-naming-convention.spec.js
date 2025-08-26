import { describe, it, beforeEach } from 'vitest'
import { RuleTester } from 'eslint'
import plugin from '../src/index.js'

describe('vue-modular/enforce-naming-convention rule', () => {
  let ruleTester

  beforeEach(() => {
    ruleTester = new RuleTester({
      languageOptions: { ecmaVersion: 2022, sourceType: 'module' },
      plugins: { 'vue-modular': plugin },
    })
    if (global.__eslintVueModularState) delete global.__eslintVueModularState
  })

  it('basic cases', () => {
    ruleTester.run('enforce-naming-convention', plugin.rules['enforce-naming-convention'], {
      valid: [
        { code: "export default { name: 'UserCard' }", filename: '/src/components/UserCard.js' },
        { code: "export default { name: 'LoginView' }", filename: '/src/views/LoginView.js' },
        { code: 'export default { }', filename: '/src/components/Anonymous.js' },
      ],
      invalid: [
        {
          code: "export default { name: 'user-card' }",
          filename: '/src/components/user-card.js',
          errors: [{ messageId: 'badStyle' }],
        },
        {
          code: "export default { name: 'UserCard' }",
          filename: '/src/components/user-card.js',
          errors: [{ messageId: 'fileMismatch' }],
        },
      ],
    })
  })
})
