import { VueModularRuleContext } from 'src/types'

// Utility to parse rule options with defaults and normalization
export const parseRuleOptions = <T extends Record<string, unknown>>(context: VueModularRuleContext, defaults: T): T => {
  return (context.options && context.options[0] ? context.options[0] : defaults) as T
}
