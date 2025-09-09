import prettierPluginRecommended from 'eslint-plugin-prettier/recommended'
import jsonPlugin from '@eslint/json'
import markdownPlugin from '@eslint/markdown'

export default [
  // ignore common build and dependency folders
  { ignores: ['node_modules/**', 'dist/**', '.git/**', 'examples/**', '**/*.d.ts'] },
  prettierPluginRecommended,
  jsonPlugin.configs.recommended,
  ...markdownPlugin.configs.recommended,
  {
    files: ['**/*.js'],
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
  {
    files: ['tests/**/*.js'],
    // tests run under vitest/jest-like globals
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
    rules: {},
  },
]
