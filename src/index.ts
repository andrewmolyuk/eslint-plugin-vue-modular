import type { ESLint } from 'eslint'

import { meta } from './meta'
import { rules } from './rules'

type VueModularPlugin = Omit<ESLint.Plugin, 'rules'> & {
  rules: Record<string, unknown>
}

const plugin: VueModularPlugin = {
  meta,
  rules,
}

export default plugin
