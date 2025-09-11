import { describe, it } from 'vitest'
import { fileComponentNaming } from '../../src/rules/file-component-naming'
import { RuleTester } from 'eslint'

const ruleTester = new RuleTester()

describe('file-component-naming', () => {
  it('should pass for PascalCase .vue filename', () => {
    ruleTester.run('file-component-naming', fileComponentNaming, {
      valid: [
        { code: '{}', filename: 'src/test/bad-file-type.vue' },
        { code: '{}', filename: 'app/MyFile.vue', options: [{ ignores: ['**/my-file.ts'] }] },
        { code: '{}', filename: 'src/components/MyFile.vue', options: [{ ignores: [] }] },
        { code: '{}', filename: 'src/utils/myFile.tsx', options: [{ ignores: [] }] },
        { code: '{}', filename: 'src/components/MyLongFilename.vue', options: [{ ignores: [] }] },
        { code: '{}', filename: 'src/components/MyFileName.test.vue', options: [{ ignores: ['**/*.test.vue'] }] },
        { code: '{}', filename: 'src/components/test-file-name.spec.vue', options: [{ ignores: ['**/*.spec.vue'] }] },
      ],
      invalid: [
        {
          code: '{}',
          filename: 'src/components/my-file.vue',
          options: [{ ignores: [] }],
          errors: [{ messageId: 'filenameNotPascal', data: { filename: 'my-file.vue', expected: 'MyFile.vue' } }],
        },
        {
          code: '{}',
          filename: 'src/components/my_file.vue',
          options: [{ ignores: [] }],
          errors: [{ messageId: 'filenameNotPascal', data: { filename: 'my_file.vue', expected: 'MyFile.vue' } }],
        },
        {
          code: '{}',
          filename: 'src/components/My_Long-Filename.vue',
          options: [{ ignores: [] }],
          errors: [{ messageId: 'filenameNotPascal', data: { filename: 'My_Long-Filename.vue', expected: 'MyLongFilename.vue' } }],
        },
      ],
    })
  })
})
