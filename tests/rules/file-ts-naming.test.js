import path from 'path'
import { describe, it, beforeEach, expect } from 'vitest'
import rule from '@/rules/file-ts-naming.js'
import { tester, setupTest } from '../helpers.js'

describe('vue-modular/file-ts-naming (compact)', () => {
  beforeEach(setupTest)

  it('valid camelCase TypeScript filenames', () => {
    tester.run('file-ts-naming', rule, {
      valid: [
        { code: '// noop', filename: '/src/utils/useAuth.ts' },
        { code: '// noop', filename: '/src/api/userApi.ts' },
        { code: '// noop', filename: '/src/hooks/useProductForm.tsx' },
      ],
      invalid: [],
    })
  })

  it('invalid non-camelCase filenames', () => {
    tester.run('file-ts-naming', rule, {
      valid: [],
      invalid: [
        { code: '// noop', filename: '/src/utils/UseAuth.ts', errors: [{ messageId: 'filenameNotCamel' }] },
        { code: '// noop', filename: '/src/api/user_api.ts', errors: [{ messageId: 'filenameNotCamel' }] },
        { code: '// noop', filename: '/src/components/My-Component.ts', errors: [{ messageId: 'filenameNotCamel' }] },
      ],
    })
  })

  it('respects ignore patterns (glob and absolute)', () => {
    tester.run('file-ts-naming', rule, {
      valid: [
        { code: '// noop', filename: '/src/utils/ignored-file.ts', options: [{ ignore: ['**/ignored-file.ts'] }] },
        { code: '// noop', filename: '/src/utils/abs-ignored.ts', options: [{ ignore: ['/src/utils/abs-ignored.ts'] }] },
      ],
      invalid: [],
    })
  })

  it('respects src scoping', () => {
    tester.run('file-ts-naming', rule, {
      valid: [{ code: '// noop', filename: '/other/utils/useAuth.ts', options: [{ src: 'src' }] }],
      invalid: [],
    })

    tester.run('file-ts-naming', rule, {
      valid: [],
      invalid: [
        { code: '// noop', filename: '/app/utils/UseAuth.ts', options: [{ src: 'app' }], errors: [{ messageId: 'filenameNotCamel' }] },
      ],
    })
  })

  it('ignores non-.ts/.tsx filenames and empty filename', () => {
    tester.run('file-ts-naming', rule, {
      valid: [
        { code: '// noop', filename: '/src/utils/not-a-ts.txt' },
        { code: '// noop', filename: '' },
        { code: '// noop', filename: '/src/utils/script.js' },
      ],
      invalid: [],
    })
  })

  it('directly verifies create() branches for ignore matching and test files', () => {
    const relFilename = path.join(process.cwd(), 'src', 'utils', 'ignored-by-rel.ts')
    const ctxRel = { getFilename: () => relFilename, options: [{ ignore: ['src/utils/ignored-by-rel.ts'] }] }
    expect(rule.create(ctxRel)).toEqual({})

    const absFilename = path.join(process.cwd(), 'src', 'utils', 'abs-ignored.ts')
    const ctxAbs = { getFilename: () => absFilename, options: [{ ignore: [absFilename] }] }
    expect(rule.create(ctxAbs)).toEqual({})

    const testFile = path.join(process.cwd(), 'src', 'utils', 'useAuth.test.ts')
    const ctxTest = { getFilename: () => testFile, options: [{}] }
    expect(rule.create(ctxTest)).toEqual({})

    const emptyCtx = { getFilename: () => '', options: [{}] }
    expect(rule.create(emptyCtx)).toEqual({})
  })
})
