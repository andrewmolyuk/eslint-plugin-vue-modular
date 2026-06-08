import { describe, it } from 'vitest'
import { composableFilenamePrefix } from '../../src/rules/composableFilenamePrefx'
import { getRuleTester } from '../test-utils'

const tester = getRuleTester()

describe('composable-filename-prefix', () => {
  it('test cases for composable-filename-prefix rule', () => {
    tester.run('composable-filename-prefix', composableFilenamePrefix, {
      valid: [
        // корректный префикс
        { code: '', filename: 'src/composables/useLogger.ts' },
        { code: '', filename: 'src/shared/composables/useSearch.ts' },
        { code: '', filename: 'src/features/auth/composables/useAuth.ts' },
        // index всегда разрешён
        { code: '', filename: 'src/composables/index.ts' },
        // файлы вне composables/ не проверяются
        { code: '', filename: 'src/utils/logger.ts' },
        { code: '', filename: 'src/services/authService.ts' },
        // игнорируемые паттерны
        { code: '', filename: 'src/composables/useLogger.spec.ts' },
        { code: '', filename: 'src/composables/useLogger.test.ts' },
        { code: '', filename: 'src/composables/useLogger.d.ts' },
        // кастомный префикс
        {
          code: '',
          filename: 'src/composables/createLogger.ts',
          options: [{ prefix: 'create' }],
        },
      ],
      invalid: [
        // нет префикса
        {
          code: '',
          filename: 'src/composables/logger.ts',
          errors: [{ messageId: 'missingPrefix' }],
        },
        // PascalCase без префикса
        {
          code: '',
          filename: 'src/composables/Logger.ts',
          errors: [{ messageId: 'missingPrefix' }],
        },
        // суффикс Composable без префикса
        {
          code: '',
          filename: 'src/composables/loggerComposable.ts',
          errors: [{ messageId: 'missingPrefix' }],
        },
        // вложенная папка
        {
          code: '',
          filename: 'src/features/auth/composables/auth.ts',
          errors: [{ messageId: 'missingPrefix' }],
        },
        // кастомный префикс — нарушение
        {
          code: '',
          filename: 'src/composables/useLogger.ts',
          options: [{ prefix: 'create' }],
          errors: [{ messageId: 'missingPrefix' }],
        },
      ],
    })
  })
})
