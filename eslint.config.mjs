// @ts-check
import eslint from '@eslint/js'
import prettierPluginRecommended from 'eslint-plugin-prettier/recommended'
import tseslint from 'typescript-eslint'
import markdownPlugin from 'eslint-plugin-markdown'
import jsoncPlugin from 'eslint-plugin-jsonc'

export default [
  // Prettier plugin configuration
  prettierPluginRecommended,

  // Base recommended configuration
  eslint.configs.recommended,

  // TypeScript ESLint plugin configuration
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,

  // Global overrides for TypeScript files
  {
    files: ['**/*.ts'],
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

  // Markdown files: run ESLint over fenced code blocks
  {
    files: ['**/*.md', '**/*.md/*'],
    plugins: { markdown: markdownPlugin },
    processor: 'markdown/markdown',
    // disable all @typescript-eslint rules inside markdown code blocks
    rules: Object.fromEntries(
      Object.keys(/** @type {any} */ (tseslint.plugin && /** @type {any} */ (tseslint.plugin).rules) || {}).map((r) => [
        `@typescript-eslint/${r}`,
        'off',
      ]),
    ),
  },

  // JSONC plugin - lint JSON files
  ...jsoncPlugin.configs['flat/recommended-with-jsonc'],
]
