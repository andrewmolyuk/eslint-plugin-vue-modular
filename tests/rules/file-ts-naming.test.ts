import { describe, it } from 'vitest'
import { fileTsNaming } from '../../src/rules/file-ts-naming'
import { RuleTester } from 'eslint'

const ruleTester = new RuleTester()

describe('file-ts-naming', () => {
  it('should pass for camelCase .ts filename', () => {
    ruleTester.run('file-ts-naming', fileTsNaming, {
      valid: [
        { code: '{}', filename: 'app/my-file.js', options: [{ ignores: ['**/my-file.js'] }] },
        { code: '{}', filename: 'src/utils/my-file.js', options: [{ ignores: [] }] },
        { code: '{}', filename: 'src/utils/myFile.ts', options: [{ ignores: [] }] },
        { code: '{}', filename: 'src/utils/myLongFilename.ts', options: [{ ignores: [] }] },
      ],
      invalid: [
        {
          code: '{}',
          filename: 'src/utils/my-file.ts',
          options: [{ ignores: [] }],
          errors: [{ messageId: 'filenameNotCamel', data: { filename: 'my-file.ts', expected: 'myFile.ts' } }],
        },
        {
          code: '{}',
          filename: 'src/utils/MyFile.ts',
          options: [{ ignores: [] }],
          errors: [{ messageId: 'filenameNotCamel', data: { filename: 'MyFile.ts', expected: 'myFile.ts' } }],
        },
        {
          code: '{}',
          filename: 'src/utils/my_file.ts',
          options: [{ ignores: [] }],
          errors: [{ messageId: 'filenameNotCamel', data: { filename: 'my_file.ts', expected: 'myFile.ts' } }],
        },
        {
          code: '{}',
          filename: 'src/utils/My_Long-Filename.ts',
          options: [{ ignores: [] }],
          errors: [{ messageId: 'filenameNotCamel', data: { filename: 'My_Long-Filename.ts', expected: 'myLongFilename.ts' } }],
        },
      ],
    })
  })
})
