const recommendedRules = {
  'vue-modular/file-component-naming': 'error',
  'vue-modular/file-ts-naming': 'error',
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
    'flat/recommended': [{ ...flatPluginBlock, rules: recommendedRules }],
    'flat/all': [{ ...flatPluginBlock, rules: allRules }],
    recommended: { ...legacyPluginBlock, rules: recommendedRules },
    all: { ...legacyPluginBlock, rules: allRules },
  }
}

export default createConfigs
