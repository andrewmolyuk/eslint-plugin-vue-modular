import type { ESLint } from 'eslint'

import { meta } from './meta'
import { rules } from './rules'
import { createConfigs } from './configs'

type VueModularPlugin = Omit<ESLint.Plugin, 'rules'> & {
  rules: Record<string, unknown>
  configs?: Record<string, unknown>
}

const plugin: VueModularPlugin = {
  meta,
  rules,
}

// assign `configs` after plugin is created to avoid temporal-dead-zone issues
// build configs via helper
plugin.configs = createConfigs(plugin)

export default plugin
