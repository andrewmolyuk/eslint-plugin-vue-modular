import { fileTsNaming } from './rules/file-ts-naming'
import { VueModularRuleModule } from './types'

export const rules: Record<string, VueModularRuleModule> = {
  'file-ts-naming': fileTsNaming,
}
