import type { RuleContext, SharedConfigurationSettings } from '@typescript-eslint/utils/dist/ts-eslint'

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
