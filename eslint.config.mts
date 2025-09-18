// @ts-check
import eslint from '@eslint/js'
import prettierPluginRecommended from 'eslint-plugin-prettier/recommended'
import * as tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import markdownPlugin from 'eslint-plugin-markdown'
import jsoncPlugin from 'eslint-plugin-jsonc'

export default [
  // Ignore built files and dependencies
  { ignores: ['dist/**', 'coverage/**', 'node_modules/**'] },

  // Prettier plugin configuration
  prettierPluginRecommended,

  // Base recommended configuration
  eslint.configs.recommended,

  // TypeScript ESLint plugin configuration
  {
    files: ['**/*.ts'],
    plugins: { '@typescript-eslint': tsPlugin },
    // merge rules from both presets (fall back to empty objects)
    rules: {
      ...(tsPlugin.configs.strict && tsPlugin.configs.strict.rules ? tsPlugin.configs.strict.rules : {}),
      ...(tsPlugin.configs.stylistic && tsPlugin.configs.stylistic.rules ? tsPlugin.configs.stylistic.rules : {}),
    },
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        process: 'readonly',
        global: 'readonly',
        __dirname: 'readonly',
        Buffer: 'readonly',
        structuredClone: 'readonly',
      },
    },
  },

  // Markdown files: run ESLint over fenced code blocks
  {
    files: ['**/*.md', '**/*.md/*'],
    plugins: { markdown: markdownPlugin },
    processor: 'markdown/markdown',
  },

  // JSONC plugin - lint JSON files
  ...jsoncPlugin.configs['flat/recommended-with-jsonc'],
]
