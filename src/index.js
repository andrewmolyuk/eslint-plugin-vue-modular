import meta from './meta.js'

import noCrossFeatureImports from './rules/no-cross-feature-imports.js'
import noCrossModuleImports from './rules/no-cross-module-imports.js'
import srcStructure from './rules/src-structure.js'

const plugin = {
  meta,
  rules: {
    'no-cross-feature-imports': noCrossFeatureImports,
    'no-cross-module-imports': noCrossModuleImports,
    'src-structure': srcStructure,
  },
  processors: {},
  configs: {},
}

// Flat config for ESLint v9+
plugin.configs['flat/recommended'] = [
  {
    plugins: {
      'vue-modular': plugin,
    },
    rules: {
      'vue-modular/no-cross-feature-imports': 'error',
      'vue-modular/no-cross-module-imports': 'error',
      'vue-modular/src-structure': 'error',
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
  },
]

// Classic config for legacy support
plugin.configs.recommended = {
  plugins: ['vue-modular'],
  rules: {
    'vue-modular/no-cross-feature-imports': 'error',
    'vue-modular/no-cross-module-imports': 'error',
    'vue-modular/src-structure': 'error',
  },
}

export default plugin
