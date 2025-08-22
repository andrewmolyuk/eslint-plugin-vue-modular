import eslintPlugin from 'eslint-plugin-eslint-plugin'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default [
  eslintPlugin.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    plugins: {
      'eslint-plugin-eslint-plugin': eslintPlugin,
    },
    rules: {
      ...eslintPlugin.configs.recommended.rules,
      quotes: ['error', 'single', { avoidEscape: true }],
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
  },
  {
    files: ['tests/**/*.js'],
    plugins: {},
    rules: {},
  },
]
