import meta from './meta.js'

import noCrossFeatureImports from './rules/no-cross-feature-imports.js'
import noCrossModuleImports from './rules/no-cross-module-imports.js'
import enforceSrcStructure from './rules/enforce-src-structure.js'
import enforceAppStructure from './rules/enforce-app-structure.js'
import enforceModuleExports from './rules/enforce-module-exports.js'
import enforceFeatureExports from './rules/enforce-feature-exports.js'
import enforceImportBoundaries from './rules/enforce-import-boundaries.js'
import enforceNamingConvention from './rules/enforce-naming-convention.js'
import fileComponentNaming from './rules/file-component-naming.js'
import noBusinessLogicInUiKit from './rules/no-business-logic-in-ui-kit.js'
import noOrphanedFiles from './rules/no-orphaned-files.js'
import noDeepNesting from './rules/no-deep-nesting.js'
import enforceSfcOrder from './rules/enforce-sfc-order.js'
import createConfigs from './configs.js'

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
    'file-component-naming': fileComponentNaming,
    'enforce-import-boundaries': enforceImportBoundaries,
    'no-business-logic-in-ui-kit': noBusinessLogicInUiKit,
    'no-orphaned-files': noOrphanedFiles,
    'no-deep-nesting': noDeepNesting,
    'enforce-sfc-order': enforceSfcOrder,
  },
  processors: {},
  configs: {},
  utils: {},
}

plugin.configs = createConfigs(plugin)

export default plugin
