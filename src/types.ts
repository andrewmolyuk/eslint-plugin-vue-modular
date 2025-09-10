import type { ESLint, Linter, Rule } from 'eslint'
import type { RuleContext, SharedConfigurationSettings } from '@typescript-eslint/utils/dist/ts-eslint'

export type VueModularPluginConfigs = {
  all: Linter.Config[]
  recommended: Linter.Config[]
}

export type VueModularPlugin = Omit<ESLint.Plugin, 'rules'> & {
  rules: ESLint.Plugin['rules']
  configs: VueModularPluginConfigs
}

export type VueModularProjectOptions = SharedConfigurationSettings & {
  rootPath: string
  rootAlias: string
  appPath: string
  layoutsPath: string
  featuresPath: string
  sharedPath: string
  componentsFolderName: string
  viewsFolderName: string
  uiFolderName: string
}

export type VueModularRuleContext<MessageIds extends string, Options extends readonly unknown[]> = RuleContext<MessageIds, Options> & {
  projectOptions?: VueModularProjectOptions
}

export interface VueModularRuleModule extends Rule.RuleModule {
  name: string
  recommended: boolean
  level: 'error' | 'warn'
}
