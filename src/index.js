import meta from './meta.js'

import noCrossFeatureImports from './rules/no-cross-feature-imports.js'
import noCrossModuleImports from './rules/no-cross-module-imports.js'
import enforceSrcStructure from './rules/enforce-src-structure.js'
import enforceAppStructure from './rules/enforce-app-structure.js'
import enforceModuleExports from './rules/enforce-module-exports.js'
import enforceFeatureExports from './rules/enforce-feature-exports.js'
import enforceImportBoundaries from './rules/enforce-import-boundaries.js'
import enforceNamingConvention from './rules/enforce-naming-convention.js'
import noBusinessLogicInUiKit from './rules/no-business-logic-in-ui-kit.js'
import noOrphanedFiles from './rules/no-orphaned-files.js'
import noDeepNesting from './rules/no-deep-nesting.js'

// Import utilities
import { isTestFile } from './utils/import-boundaries.js'

const plugin = {
  meta,
  rules: {
    'no-cross-feature-imports': noCrossFeatureImports,
    'no-cross-module-imports': noCrossModuleImports,
    'enforce-src-structure': enforceSrcStructure,
    'enforce-app-structure': enforceAppStructure,
    'enforce-module-exports': enforceModuleExports,
    'enforce-feature-exports': enforceFeatureExports,
    'enforce-naming-convention': enforceNamingConvention,
    'enforce-import-boundaries': enforceImportBoundaries,
    'no-business-logic-in-ui-kit': noBusinessLogicInUiKit,
    'no-orphaned-files': noOrphanedFiles,
    'no-deep-nesting': noDeepNesting,
  },
  processors: {},
  configs: {},
  utils: {
    isTestFile,
  },
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
      'vue-modular/no-business-logic-in-ui-kit': 'error',
      'vue-modular/enforce-import-boundaries': 'error',
      'vue-modular/enforce-src-structure': 'error',
      'vue-modular/enforce-app-structure': 'error',
      'vue-modular/enforce-module-exports': 'error',
      'vue-modular/enforce-feature-exports': 'error',
      'vue-modular/no-orphaned-files': 'error',
      'vue-modular/no-deep-nesting': 'warn',
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
  },
]

// Strict config with all rules enabled
plugin.configs['flat/strict'] = [
  {
    plugins: {
      'vue-modular': plugin,
    },
    rules: {
      'vue-modular/no-cross-feature-imports': 'error',
      'vue-modular/no-cross-module-imports': 'error',
      'vue-modular/no-business-logic-in-ui-kit': 'error',
      'vue-modular/enforce-import-boundaries': 'error',
      'vue-modular/enforce-src-structure': 'error',
      'vue-modular/enforce-app-structure': 'error',
      'vue-modular/enforce-module-exports': 'error',
      'vue-modular/enforce-feature-exports': 'error',
      'vue-modular/enforce-naming-convention': 'error',
      'vue-modular/no-orphaned-files': 'error',
      'vue-modular/no-deep-nesting': 'error',
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
    'vue-modular/no-business-logic-in-ui-kit': 'error',
    'vue-modular/enforce-import-boundaries': 'error',
    'vue-modular/enforce-src-structure': 'error',
    'vue-modular/enforce-app-structure': 'error',
    'vue-modular/enforce-module-exports': 'error',
    'vue-modular/enforce-feature-exports': 'error',
    'vue-modular/no-orphaned-files': 'error',
    'vue-modular/no-deep-nesting': 'warn',
  },
}

// Strict config with all rules enabled (legacy)
plugin.configs.strict = {
  plugins: ['vue-modular'],
  rules: {
    'vue-modular/no-cross-feature-imports': 'error',
    'vue-modular/no-cross-module-imports': 'error',
    'vue-modular/enforce-src-structure': 'error',
    'vue-modular/enforce-app-structure': 'error',
    'vue-modular/enforce-module-exports': 'error',
    'vue-modular/enforce-feature-exports': 'error',
    'vue-modular/enforce-import-boundaries': 'error',
    'vue-modular/enforce-naming-convention': 'error',
    'vue-modular/no-orphaned-files': 'error',
    'vue-modular/no-deep-nesting': 'error',
  },
}

export default plugin
