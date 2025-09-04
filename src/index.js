import createConfigs from './configs.js'
import meta from './meta.js'

import fileComponentNaming from './rules/file-component-naming.js'
import fileTsNaming from './rules/file-ts-naming.js'

const plugin = {
  meta,
  rules: {
    'file-component-naming': fileComponentNaming,
    'file-ts-naming': fileTsNaming,
  },
  processors: {},
  configs: {},
  utils: {},
}

plugin.configs = createConfigs(plugin)

export default plugin
