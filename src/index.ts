import type { ESLint, Linter } from 'eslint'

import { meta } from './meta'
import { rules } from './rules'
import { createConfigs } from './configs'

type PluginConfigs = {
  all: Linter.Config[]
  recommended: Linter.Config[]
}

type VueModularPlugin = Omit<ESLint.Plugin, 'rules'> & {
  // rules must match ESLint's Linter.RuleModule shape so consumers can
  // place the plugin into their `plugins` object without type errors.
  rules: ESLint.Plugin['rules']
  configs: PluginConfigs
}

const plugin: VueModularPlugin = {
  meta,
  rules,
  // initialize with an empty shape so `configs` exists on the exported plugin
  configs: { all: [], recommended: [] },
}

// build and assign real configs via helper (still assign after creation)
plugin.configs = createConfigs(plugin)

export default plugin
