import type { VueModularProjectOptions, VueModularRuleContext } from '../types'

export function getProjectOptionsFromContext(
  context: Readonly<VueModularRuleContext<string, readonly unknown[]>>,
): VueModularProjectOptions | undefined {
  const settings = (context.settings as Record<string, unknown> | undefined) ?? undefined
  const vm = settings?.['vue-modular'] as { projectOptions?: VueModularProjectOptions } | undefined
  return vm?.projectOptions ?? (context.projectOptions as VueModularProjectOptions | undefined)
}
