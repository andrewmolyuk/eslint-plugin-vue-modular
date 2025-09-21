import { describe, it } from 'vitest'
import { internalImportsRelative } from '../../src/rules/internal-imports-relative'
import { getRuleTester } from '../test-utils'

const ruleTester = getRuleTester()

describe('internal-imports-relative', () => {
  it('test cases for internal-imports-relative rule', () => {
    ruleTester.run('internal-imports-relative', internalImportsRelative, {
      valid: [
        // Filename not resolvable by resolvePath -> early return (covers !filename branch)
        { filename: 'file.ts', code: "<script>import external from 'left-pad'</script>" },
        // Relative import within the same feature
        {
          filename: '/project/src/features/featureA/fileA.ts',
          code: "<script>import x from './fileB'</script>",
        },
        // Relative import within the same feature (subfolder)
        {
          filename: '/project/src/features/featureA/sub/fileA.ts',
          code: "<script>import x from '../fileB'</script>",
        },
        // Import from a file outside app/features/shared (should not report)
        {
          filename: '/project/src/other/fileA.ts',
          code: "<script>import x from './fileB'</script>",
        },
        // Import to a file outside app/features/shared (should not report)
        {
          filename: '/project/src/features/featureA/fileA.ts',
          code: "<script>import x from '../../other/fileB'</script>",
        },
        // Import between different features (should not report)
        {
          filename: '/project/src/features/featureA/fileA.ts',
          code: "<script>import x from '../featureB/fileB'</script>",
        },
        // Import between different app files (should not report)
        {
          filename: '/project/src/app/fileA.ts',
          code: "<script>import x from '../app/fileB'</script>",
        },
        // Import between different shared files (should not report)
        {
          filename: '/project/src/shared/fileA.ts',
          code: "<script>import x from '../shared/fileB'</script>",
        },
        // Defensive: empty import path (covers the importPath falsy/string guard)
        { filename: '/project/src/features/featureA/fileA.ts', code: "<script>import x from ''</script>" },
        // Alias import to another feature (different feature segments) should be allowed (early return)
        { filename: '/project/src/features/featureA/fileA.ts', code: "<script>import x from '@/features/featureB/fileB'</script>" },
        // External package -> resolver returns null -> ignored (covers !resolvedPath branch)
        { filename: '/project/src/features/featureA/fileA.ts', code: "<script>import external from 'left-pad'</script>" },
        // Ignored via options -> early return (covers isIgnored branch)
        {
          filename: '/project/src/features/featureA/fileA.ts',
          code: "<script setup>import { cn } from '@/shared/utils/cn'</script>",
          options: [{ ignores: ['src/features/**'] }],
        },
        // Import from app to feature using alias (should not report)
        {
          filename: 'apps/web/src/app/App.vue',
          code: "<script setup>import { iButton } from '@/shared/ui'</script>",
        },
      ],
      invalid: [
        // Alias import within the same feature
        {
          filename: '/project/src/features/featureA/fileA.ts',
          code: "<script>import x from '@/features/featureA/fileB'</script>",
          errors: [{ messageId: 'useRelativeImport' }],
        },
        // Alias import within the same feature (subfolder)
        {
          filename: '/project/src/features/featureA/sub/fileA.ts',
          code: "<script>import * as A from '@/features/featureA/fileB'</script>",
          errors: [{ messageId: 'useRelativeImport' }],
        },
        // Alias import inside shared but filename comes from apps/web/src -> should still report
        {
          filename: 'apps/web/src/shared/ui/button/iButton.vue',
          code: "<script setup>import { cn } from '@/shared/utils/cn'</script>",
          errors: [{ messageId: 'useRelativeImport' }],
        },
        // Relative import within the same feature but too deep -> should report useAliasImport
        {
          filename: '/project/src/features/featureA/sub/sub2/fileA.ts',
          code: "<script>import x from '../aaa/bbb/fileB'</script>",
          errors: [{ messageId: 'useAliasImport' }],
        },
        // Relative import within the app but too deep -> should report useAliasImport
        {
          filename: 'src/app/sub1/sub2/fileA.ts',
          code: "<script>import x from '../aaa/bbb/fileB'</script>",
          errors: [{ messageId: 'useAliasImport' }],
        },
        // Relative import within shared but too deep -> should report useAliasImport
        {
          filename: '/project/src/shared/ui/button/iButton.vue',
          code: "<script setup>import { cn } from '../../utils/cn'</script>",
          errors: [{ messageId: 'useAliasImport' }],
        },
      ],
    })
  })
})
