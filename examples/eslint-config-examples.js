// ESLint Configuration Examples for eslint-plugin-vue-modular

// ========================================
// FLAT CONFIG (ESLint v9+) - RECOMMENDED
// ========================================

// Example 1: Basic flat config using the recommended preset
import vueModular from 'eslint-plugin-vue-modular'

export default [
  {
    files: ['**/*.js', '**/*.vue', '**/*.ts'],
    plugins: {
      'vue-modular': vueModular,
    },
    rules: {
      'vue-modular/no-cross-feature-imports': 'error',
      'vue-modular/enforce-src-structure': 'error',
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
  },
]

// Example 2: Using the built-in recommended config
export const withRecommended = [
  ...vueModular.configs['flat/recommended'],
  // Add your other configs here
]

// Example 3: Custom configuration with specific options
export const customConfig = [
  {
    files: ['**/*.js', '**/*.vue', '**/*.ts'],
    plugins: {
      'vue-modular': vueModular,
    },
    rules: {
      'vue-modular/no-cross-feature-imports': [
        'error',
        {
          featurePattern: 'src/features/*',
          allowedPatterns: ['src/features/*/index.js', 'src/features/*/index.ts'],
        },
      ],
      'vue-modular/enforce-src-structure': [
        'error',
        {
          allowed: ['app', 'features', 'components', 'utils', 'main.ts'],
          src: 'src',
        },
      ],
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
  },
]

// Example 4: Multiple configurations for different file types
export const multipleConfigs = [
  // Configuration for Vue files
  {
    files: ['**/*.vue'],
    plugins: {
      'vue-modular': vueModular,
    },
    rules: {
      'vue-modular/no-cross-feature-imports': 'error',
      'vue-modular/enforce-src-structure': 'error',
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
  },
  // Configuration for JavaScript/TypeScript files
  {
    files: ['**/*.js', '**/*.ts'],
    plugins: {
      'vue-modular': vueModular,
    },
    rules: {
      'vue-modular/no-cross-feature-imports': 'warn',
      'vue-modular/enforce-src-structure': 'error',
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
  },
]

// ========================================
// LEGACY CONFIG (ESLint v8 and below)
// ========================================

// Example 5: Legacy .eslintrc.js format
module.exports = {
  plugins: ['vue-modular'],
  extends: ['plugin:vue-modular/recommended'],
  rules: {
    'vue-modular/no-cross-feature-imports': 'error',
    'vue-modular/enforce-src-structure': 'error',
  },
  env: {
    es2022: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
}

// Example 6: Legacy configuration with custom options
module.exports = {
  plugins: ['vue-modular'],
  rules: {
    'vue-modular/no-cross-feature-imports': [
      'error',
      {
        featurePattern: 'src/features/*',
        allowedPatterns: ['src/features/*/index.js', 'src/features/*/index.ts'],
      },
    ],
    'vue-modular/enforce-src-structure': [
      'error',
      {
        allowed: ['app', 'features', 'components', 'utils', 'main.ts'],
        src: 'src',
      },
    ],
  },
  env: {
    es2022: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
}
