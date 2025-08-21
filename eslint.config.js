import eslintPlugin from 'eslint-plugin-eslint-plugin';

export default [
  eslintPlugin.configs.recommended,
  {
    plugins: {
      'eslint-plugin-eslint-plugin': eslintPlugin,
    },
    rules: {
      ...eslintPlugin.configs.recommended.rules,
      'quotes': ['error', 'single', { 'avoidEscape': true }],
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
];
