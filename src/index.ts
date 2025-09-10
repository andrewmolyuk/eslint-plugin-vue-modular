import { meta } from './meta'
import { rules } from './rules'
import { createConfigs } from './configs'
import { VueModularPlugin } from './types'

const plugin: VueModularPlugin = {
  meta,
  rules,
  configs: { all: [], recommended: [] },
}

// build and assign real configs via helper (still assign after creation)
plugin.configs = createConfigs(plugin)

export default plugin
