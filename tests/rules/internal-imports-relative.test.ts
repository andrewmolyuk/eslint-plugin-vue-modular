import { describe, it } from 'vitest'
import { internalImportsRelative } from '../../src/rules/internal-imports-relative'
import { getRuleTester } from '../test-utils'

const ruleTester = getRuleTester()

describe('internal-imports-relative', () => {
  it('test cases for internal-imports-relative rule', () => {
    ruleTester.run('internal-imports-relative', internalImportsRelative, {
      valid: [
        // Filename not resolvable by resolvePath -> early return (covers !filename branch)
        { filename: 'file.ts', code: `import external from 'left-pad'` },
        // Relative import within the same feature
        {
          filename: '/project/src/features/featureA/fileA.ts',
          code: "import x from './fileB'",
        },
        // Relative import within the same feature (subfolder)
        {
          filename: '/project/src/features/featureA/sub/fileA.ts',
          code: "import x from '../fileB'",
        },
        // Import from a file outside app/features/shared (should not report)
        {
          filename: '/project/src/other/fileA.ts',
          code: "import x from './fileB'",
        },
        // Import to a file outside app/features/shared (should not report)
        {
          filename: '/project/src/features/featureA/fileA.ts',
          code: "import x from '../../other/fileB'",
        },
        // Import between different features (should not report)
        {
          filename: '/project/src/features/featureA/fileA.ts',
          code: "import x from '../featureB/fileB'",
        },
        // Import between different app files (should not report)
        {
          filename: '/project/src/app/fileA.ts',
          code: "import x from '../app/fileB'",
        },
        // Import between different shared files (should not report)
        {
          filename: '/project/src/shared/fileA.ts',
          code: "import x from '../shared/fileB'",
        },
        // Defensive: empty import path (covers the importPath falsy/string guard)
        { filename: '/project/src/features/featureA/fileA.ts', code: `import x from ''` },
        // Alias import to another feature (different feature segments) should be allowed (early return)
        { filename: '/project/src/features/featureA/fileA.ts', code: `import x from '@/features/featureB/fileB'` },
        // External package -> resolver returns null -> ignored (covers !resolvedPath branch)
        { filename: '/project/src/features/featureA/fileA.ts', code: `import external from 'left-pad'` },
        // Ignored via options -> early return (covers isIgnored branch)
        {
          filename: '/project/src/features/featureA/fileA.ts',
          code: `import x from '@/shared/utils'`,
          options: [{ ignores: ['src/features/**'] }],
        },
      ],
      invalid: [
        // Alias import within the same feature
        {
          filename: '/project/src/features/featureA/fileA.ts',
          code: "import x from '@/features/featureA/fileB'",
          errors: [{ messageId: 'useRelativeImport' }],
        },
        // Alias import within the same feature (subfolder)
        {
          filename: '/project/src/features/featureA/sub/fileA.ts',
          code: "import x from '@/features/featureA/fileB'",
          errors: [{ messageId: 'useRelativeImport' }],
        },
      ],
    })
  })
})
