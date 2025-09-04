import createConfigs from './configs.js'
import meta from './meta.js'

import fileComponentNaming from './rules/file-component-naming.js'

const plugin = {
  meta,
  rules: {
    'file-component-naming': fileComponentNaming,
  },
  processors: {},
  configs: {},
  utils: {},
}

plugin.configs = createConfigs(plugin)

export default plugin
