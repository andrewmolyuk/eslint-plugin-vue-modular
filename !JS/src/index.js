import createConfigs from './configs.js'
import meta from './meta.js'

import fileComponentNaming from './rules/file-component-naming.js'
import fileTsNaming from './rules/file-ts-naming.js'
import folderKebabCase from '../../src/rules/folder-kebab-case.js'
import featureIndexRequired from './rules/feature-index-required.js'
import componentsIndexRequired from './rules/components-index-required.js'
import sharedUiIndexRequired from './rules/shared-ui-index-required.js'
import noDirectFeatureImports from './rules/no-direct-feature-imports.js'
import featureImportsFromSharedOnly from './rules/feature-imports-from-shared-only.js'
import noSharedImportsFromFeatures from './rules/no-shared-imports-from-features.js'
import appImports from './rules/app-imports.js'
import sfcRequired from './rules/sfc-required.js'
import sfcOrder from './rules/sfc-order.js'
import serviceFilenameNoSuffix from './rules/service-filename-no-suffix.js'
import storeFilenameNoSuffix from './rules/store-filename-no-suffix.js'
import routesFeatureLocation from './rules/routes-feature-location.js'
import routesGlobalLocation from './rules/routes-global-location.js'

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
    'app-imports': appImports,
    'sfc-required': sfcRequired,
    'sfc-order': sfcOrder,
    'service-filename-no-suffix': serviceFilenameNoSuffix,
    'store-filename-no-suffix': storeFilenameNoSuffix,
    'routes-feature-location': routesFeatureLocation,
    'routes-global-location': routesGlobalLocation,
  },
  processors: {},
  configs: {},
  utils: {},
}

plugin.configs = createConfigs(plugin)

export default plugin
