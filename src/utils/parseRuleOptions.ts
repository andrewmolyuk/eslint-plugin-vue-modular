import { VueModularRuleContext } from '../types'

// Utility to parse rule options with defaults and normalization
export const parseRuleOptions = <T extends Record<string, unknown>>(context: VueModularRuleContext, defaults: T): T => {
  const provided = context.options && context.options[0] ? (context.options[0] as Partial<T>) : ({} as Partial<T>)
  return Object.assign({}, defaults, provided) as T
}
