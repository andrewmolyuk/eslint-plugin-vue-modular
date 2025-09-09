// @ts-check
import eslint from '@eslint/js'
import markdown from '@eslint/markdown'
import jsonPlugin from '@eslint/json'
import prettierPluginRecommended from 'eslint-plugin-prettier/recommended'
import tsPlugin from 'typescript-eslint'

/* prettier and typescript-eslint configs are intentionally omitted here; enable them when needed */

export default [
  { ignores: ['**/*.js', 'node_modules/**', 'dist/**', '.git/**', '**/*.d.ts'] },
  // Base recommendations
  eslint.configs.recommended,

  // Markdown plugin configuration
  ...(Array.isArray(markdown.configs && markdown.configs.processor) ? markdown.configs.processor : []),

  // JSON plugin configuration
  jsonPlugin.configs.recommended,

  // Prettier plugin configuration
  prettierPluginRecommended,

  // TypeScript plugin configuration
  ...tsPlugin.configs.recommended,

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
    files: ['tests/**/*.spec.ts'],
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
