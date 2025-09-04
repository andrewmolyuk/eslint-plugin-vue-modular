import createConfigs from './configs.js'
import meta from './meta.js'

import fileComponentNaming from './rules/file-component-naming.js'
import fileTsNaming from './rules/file-ts-naming.js'
import folderKebabCase from './rules/folder-kebab-case.js'
import featureIndexRequired from './rules/feature-index-required.js'
import componentsIndexRequired from './rules/components-index-required.js'
import sharedUiIndexRequired from './rules/shared-ui-index-required.js'
import noDirectFeatureImports from './rules/no-direct-feature-imports.js'
import featureImportsFromSharedOnly from './rules/feature-imports-from-shared-only.js'
import noSharedImportsFromFeatures from './rules/no-shared-imports-from-features.js'

const plugin = {
  meta,
  rules: {
    'file-component-naming': fileComponentNaming,
    'file-ts-naming': fileTsNaming,
    'folder-kebab-case': folderKebabCase,
    'feature-index-required': featureIndexRequired,
    'components-index-required': componentsIndexRequired,
    'shared-ui-index-required': sharedUiIndexRequired,
    'no-direct-feature-imports': noDirectFeatureImports,
    'feature-imports-from-shared-only': featureImportsFromSharedOnly,
    'no-shared-imports-from-features': noSharedImportsFromFeatures,
  },
  processors: {},
  configs: {},
  utils: {},
}

plugin.configs = createConfigs(plugin)

export default plugin
