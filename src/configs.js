const recommendedRules = {
  'vue-modular/no-cross-feature-imports': 'error',
  'vue-modular/no-cross-module-imports': 'error',
  'vue-modular/no-business-logic-in-ui-kit': 'error',
  'vue-modular/enforce-import-boundaries': 'error',
  'vue-modular/enforce-src-structure': 'error',
  'vue-modular/enforce-app-structure': 'error',
  'vue-modular/enforce-module-exports': 'error',
  'vue-modular/enforce-feature-exports': 'error',
  'vue-modular/no-orphaned-files': 'error',
  'vue-modular/enforce-sfc-order': 'error',
}

const allRules = {
  ...recommendedRules,
  'vue-modular/enforce-naming-convention': 'error',
  'vue-modular/file-component-naming': 'error',
  'vue-modular/no-deep-nesting': 'error',
}

const createConfigs = (plugin) => {
  const flatPluginBlock = {
    plugins: {
      'vue-modular': plugin,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
  }

  const legacyPluginBlock = {
    plugins: ['vue-modular'],
  }

  return {
    'flat/recommended': [
      {
        ...flatPluginBlock,
        rules: recommendedRules,
      },
    ],

    'flat/strict': [
      {
        ...flatPluginBlock,
        rules: allRules,
      },
    ],

    recommended: {
      ...legacyPluginBlock,
      rules: recommendedRules,
    },

    strict: {
      ...legacyPluginBlock,
      rules: allRules,
    },
  }
}

export default createConfigs
