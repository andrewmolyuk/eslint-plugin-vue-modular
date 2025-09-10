import { meta } from './meta'
import { rules } from './rules'
import { createConfigs } from './configs'
import { VueModularPlugin } from './types'
import { Linter } from 'eslint'

const plugin: VueModularPlugin = {
  meta,
  rules,
  configs: { all: [] as Linter.Config[], recommended: [] as Linter.Config[] },
}

// build and assign real configs via helper (still assign after creation)
const configs = createConfigs(plugin)
plugin.configs.all = configs.all
plugin.configs.recommended = configs.recommended

export default plugin
