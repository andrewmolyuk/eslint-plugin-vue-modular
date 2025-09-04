import { describe, it, beforeEach, expect } from 'vitest'
import { RuleTester } from 'eslint'
import path from 'path'
import plugin from '../src/index.js'
import rule from '../src/rules/file-component-naming.js'

describe('vue-modular/file-component-naming (compact)', () => {
  let ruleTester

  beforeEach(() => {
    ruleTester = new RuleTester({ languageOptions: { ecmaVersion: 2022, sourceType: 'module' }, plugins: { 'vue-modular': plugin } })
  })
  it('valid PascalCase filenames', () => {
    ruleTester.run('file-component-naming', plugin.rules['file-component-naming'], {
      valid: [
        { code: 'export default {}', filename: '/src/components/UserCard.vue' },
        { code: 'export default {}', filename: '/src/modules/auth/components/LoginForm.vue' },
        { code: 'export default {}', filename: '/src/shared/ui/BaseButton.vue' },
      ],
      invalid: [],
    })
  })

  it('invalid non-PascalCase filenames', () => {
    ruleTester.run('file-component-naming', plugin.rules['file-component-naming'], {
      valid: [],
      invalid: [
        { code: 'export default {}', filename: '/src/components/user-card.vue', errors: [{ messageId: 'filenameNotPascal' }] },
        { code: 'export default {}', filename: '/src/shared/ui/attractive-icon.vue', errors: [{ messageId: 'filenameNotPascal' }] },
        { code: 'export default {}', filename: '/src/modules/users/components/userList.vue', errors: [{ messageId: 'filenameNotPascal' }] },
      ],
    })
  })

  it('respects ignore patterns (glob and absolute)', () => {
    ruleTester.run('file-component-naming', plugin.rules['file-component-naming'], {
      valid: [
        { code: 'export default {}', filename: '/src/components/ignored-file.vue', options: [{ ignore: ['**/ignored-file.vue'] }] },
        {
          code: 'export default {}',
          filename: '/src/components/absolute-ignored.vue',
          options: [{ ignore: ['/src/components/absolute-ignored.vue'] }],
        },
      ],
      invalid: [],
    })
  })

  it('respects src scoping', () => {
    // file outside configured src should be ignored
    ruleTester.run('file-component-naming', plugin.rules['file-component-naming'], {
      valid: [{ code: 'export default {}', filename: '/other/components/user-card.vue', options: [{ src: 'src' }] }],
      invalid: [],
    })

    // file inside custom src should be checked
    ruleTester.run('file-component-naming', plugin.rules['file-component-naming'], {
      valid: [],
      invalid: [
        {
          code: 'export default {}',
          filename: '/app/components/user-card.vue',
          options: [{ src: 'app' }],
          errors: [{ messageId: 'filenameNotPascal' }],
        },
      ],
    })
  })

  it('ignores non-.vue filenames and empty filename', () => {
    ruleTester.run('file-component-naming', plugin.rules['file-component-naming'], {
      valid: [
        { code: 'export default {}', filename: '/src/components/not-a-vue.txt' },
        { code: 'export default {}', filename: '' },
      ],
      invalid: [],
    })
  })

  it('directly verifies create() branches for ignore matching (relative vs absolute)', () => {
    const relFilename = path.join(process.cwd(), 'src', 'components', 'ignored-by-rel.vue')
    const ctxRel = { getFilename: () => relFilename, options: [{ ignore: ['src/components/ignored-by-rel.vue'] }] }
    expect(rule.create(ctxRel)).toEqual({})

    const absFilename = path.join(process.cwd(), 'src', 'components', 'abs-ignored.vue')
    const ctxAbs = { getFilename: () => absFilename, options: [{ ignore: [absFilename] }] }
    expect(rule.create(ctxAbs)).toEqual({})
  })
})
