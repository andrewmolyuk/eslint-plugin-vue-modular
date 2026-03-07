import type { ESLint, Linter, Rule } from 'eslint'

type BaseRuleMeta = Rule.RuleMetaData
type BaseRuleDocs = Exclude<BaseRuleMeta['docs'], undefined>

export interface VueModularRuleMetaDocs extends BaseRuleDocs {
  category?: string
}

export interface VueModularRuleMeta extends Omit<BaseRuleMeta, 'docs'> {
  docs?: VueModularRuleMetaDocs
}

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
  storesFolderName: string
  componentsFolderName: string
  viewsFolderName: string
  uiFolderName: string
}

export interface VueModularRuleOptions extends Record<string, unknown> {
  ignores: string[]
}

export interface VueModularRuleModule extends Omit<Rule.RuleModule, 'meta' | 'create'> {
  name: string
  recommended: boolean
  level: 'error' | 'warn'
  meta?: VueModularRuleMeta
  create(context: VueModularRuleContext): Rule.RuleListener
}

export interface VueModularRuleContext extends Rule.RuleContext {
  settings: {
    'vue-modular': VueModularProjectOptions
  }
}
