// @ts-check
import eslint from '@eslint/js'
import prettierPluginRecommended from 'eslint-plugin-prettier/recommended'
import tseslint from 'typescript-eslint'

export default [
  { ignores: ['node_modules/**', 'dist/**', '.git/**', '**/*.d.ts', '.releaserc.cjs'] },
  // Base recommended configuration
  eslint.configs.recommended,

  // TypeScript ESLint plugin configuration
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,

  // Prettier plugin configuration
  prettierPluginRecommended,

  // Global overrides for TypeScript files
  {
    files: ['**/*.ts'],
    // default language options and globals for plugin source files (Node environment)
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        process: 'readonly',
        global: 'readonly',
        module: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        Buffer: 'readonly',
      },
    },
  },

  // Vitest global overrides for test files
  {
    files: ['tests/**/*.test.ts'],
    languageOptions: {
      globals: {
        expect: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
      },
    },
  },
]
