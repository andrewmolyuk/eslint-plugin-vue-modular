import { describe, it } from 'vitest'
import { fileTsNaming } from '../../src/rules/file-ts-naming'
import { RuleTester } from 'eslint'

const ruleTester = new RuleTester()

describe('file-ts-naming', () => {
  it('should pass for camelCase .ts filename', () => {
    ruleTester.run('file-ts-naming', fileTsNaming, {
      valid: [
        { code: '{}', filename: 'src/utils/Types.d.ts' },
        { code: '{}', filename: 'app/my-file.ts', options: [{ ignores: ['**/my-file.ts'] }] },
        { code: '{}', filename: 'src/utils/my-file.js', options: [{ ignores: [] }] },
        { code: '{}', filename: 'src/utils/myFile.tsx', options: [{ ignores: [] }] },
        { code: '{}', filename: 'src/utils/myLongFilename.ts', options: [{ ignores: [] }] },
        { code: '{}', filename: 'src/utils/MyFileName.test.ts', options: [{ ignores: ['**/*.test.ts'] }] },
        { code: '{}', filename: 'src/utils/test-file-name.spec.ts', options: [{ ignores: ['**/*.spec.ts'] }] },
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
          filename: 'src/utils/MyFile.tsx',
          options: [{ ignores: [] }],
          errors: [{ messageId: 'filenameNotCamel', data: { filename: 'MyFile.tsx', expected: 'myFile.tsx' } }],
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
