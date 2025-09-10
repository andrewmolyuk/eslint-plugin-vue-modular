import type { ESLint, Linter, Rule } from 'eslint'

export interface VueModularPluginConfigs {
  all: Linter.Config[]
  recommended: Linter.Config[]
}

export type VueModularPlugin = Omit<ESLint.Plugin, 'rules'> & {
  rules: ESLint.Plugin['rules']
  configs: VueModularPluginConfigs
}

export interface VueModularProjectOptions {
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

export interface VueModularRuleModule extends Rule.RuleModule {
  name: string
  recommended: boolean
  level: 'error' | 'warn'
  create(context: VueModularRuleContext): Rule.RuleListener
}

export interface VueModularRuleContext extends Rule.RuleContext {
  settings: {
    'vue-modular': VueModularProjectOptions
  }
}
