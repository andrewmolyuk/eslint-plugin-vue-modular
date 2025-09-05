const recommendedRules = {
  'vue-modular/file-component-naming': 'error',
  'vue-modular/file-ts-naming': 'error',
  'vue-modular/folder-kebab-case': 'error',
  'vue-modular/feature-index-required': 'error',
  'vue-modular/components-index-required': 'error',
  'vue-modular/shared-ui-index-required': 'error',
  'vue-modular/no-direct-feature-imports': 'error',
  'vue-modular/feature-imports-from-shared-only': 'error',
  'vue-modular/no-shared-imports-from-features': 'error',
  'vue-modular/sfc-order': 'error',
  'vue-modular/sfc-required': 'error',
  'vue-modular/service-filename-no-suffix': 'error',
  'vue-modular/store-filename-no-suffix': 'error',
  'vue-modular/routes-feature-location': 'error',
  'vue-modular/app-imports': 'error',
}

const allRules = {
  ...recommendedRules,
}

const createConfigs = (plugin) => {
  const flatPluginBlock = {
    plugins: { 'vue-modular': plugin },
    languageOptions: { ecmaVersion: 2022, sourceType: 'module' },
  }

  const legacyPluginBlock = {
    plugins: ['vue-modular'],
  }

  return {
    recommended: [{ ...flatPluginBlock, rules: recommendedRules }],
    all: [{ ...flatPluginBlock, rules: allRules }],
    'legacy/recommended': { ...legacyPluginBlock, rules: recommendedRules },
    'legacy/all': { ...legacyPluginBlock, rules: allRules },
  }
}

export default createConfigs
