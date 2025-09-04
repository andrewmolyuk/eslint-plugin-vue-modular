const recommendedRules = {
  'vue-modular/file-component-naming': 'error',
  'vue-modular/file-ts-naming': 'error',
  'vue-modular/folder-kebab-case': 'error',
  'vue-modular/feature-index-required': 'error',
  'vue-modular/components-index-required': 'error',
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
