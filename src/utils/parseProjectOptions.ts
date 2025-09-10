import { VueModularProjectOptions, VueModularRuleContext } from 'src/types'
import { defaultProjectOptions } from 'src/projectOptions'

// Utility to parse project options with defaults and normalization
export const parseProjectOptions = (context: VueModularRuleContext): VueModularProjectOptions => {
  const options: Partial<VueModularProjectOptions> =
    context.settings && context.settings['vue-modular'] ? context.settings['vue-modular'] : {}

  Object.keys(defaultProjectOptions).forEach((key) => {
    if (options[key as keyof VueModularProjectOptions] === undefined) {
      options[key as keyof VueModularProjectOptions] = defaultProjectOptions[key as keyof VueModularProjectOptions]
    }
  })

  return options as VueModularProjectOptions
}
