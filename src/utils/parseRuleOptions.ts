import { VueModularRuleContext } from 'src/types'

// Utility to parse rule options with defaults and normalization
export const parseRuleOptions = (context: VueModularRuleContext) => {
  return context.options && context.options[0] ? context.options[0] : {}
}
