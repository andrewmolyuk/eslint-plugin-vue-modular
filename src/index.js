import meta from './meta.js'

import noCrossFeatureImports from './rules/no-cross-feature-imports.js'
import noCrossModuleImports from './rules/no-cross-module-imports.js'
import srcStructure from './rules/enforce-src-structure.js'
import appStructure from './rules/enforce-app-structure.js'
import enforceModuleExports from './rules/enforce-module-exports.js'
import featureStructure from './rules/enforce-feature-exports.js'
import enforceImportBoundaries from './rules/enforce-import-boundaries.js'

const plugin = {
  meta,
  rules: {
    'no-cross-feature-imports': noCrossFeatureImports,
    'no-cross-module-imports': noCrossModuleImports,
    'enforce-src-structure': srcStructure,
    'enforce-app-structure': appStructure,
    'enforce-module-exports': enforceModuleExports,
    'enforce-feature-exports': featureStructure,
    'enforce-import-boundaries': enforceImportBoundaries,
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
      'vue-modular/enforce-src-structure': 'error',
      'vue-modular/enforce-app-structure': 'error',
      'vue-modular/enforce-module-exports': 'error',
      'vue-modular/enforce-feature-exports': 'error',
      'vue-modular/enforce-import-boundaries': 'error',
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
    'vue-modular/enforce-src-structure': 'error',
    'vue-modular/enforce-app-structure': 'error',
    'vue-modular/enforce-module-exports': 'error',
    'vue-modular/enforce-feature-exports': 'error',
    'vue-modular/enforce-import-boundaries': 'error',
  },
}

export default plugin
