import createConfigs from './configs.js'
import meta from './meta.js'

import fileComponentNaming from './rules/file-component-naming.js'
import fileTsNaming from './rules/file-ts-naming.js'
import folderKebabCase from './rules/folder-kebab-case.js'
import featureIndexRequired from './rules/feature-index-required.js'
import componentsIndexRequired from './rules/components-index-required.js'

const plugin = {
  meta,
  rules: {
    'file-component-naming': fileComponentNaming,
    'file-ts-naming': fileTsNaming,
    'folder-kebab-case': folderKebabCase,
    'feature-index-required': featureIndexRequired,
    'components-index-required': componentsIndexRequired,
  },
  processors: {},
  configs: {},
  utils: {},
}

plugin.configs = createConfigs(plugin)

export default plugin
