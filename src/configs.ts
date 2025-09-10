import { rules } from './rules'
import type { Linter } from 'eslint'
import { VueModularProjectOptions, VueModularPlugin, VueModularPluginConfigs } from './types'

const PLUGIN_ID = 'vue-modular'

const defaultProjectOptions: VueModularProjectOptions = {
  rootPath: 'src',
  rootAlias: '@',
  appPath: 'src/app',
  layoutsPath: 'src/app/layouts',
  featuresPath: 'src/features',
  sharedPath: 'src/shared',
  componentsFolderName: 'components',
  viewsFolderName: 'views',
  uiFolderName: 'ui',
}

export function createConfigs(plugin: VueModularPlugin): VueModularPluginConfigs {
  const all = Object.keys(rules).reduce((acc, rule) => {
    return {
      ...acc,
      [`${PLUGIN_ID}/${rules[rule].name}`]: rules[rule].level,
    }
  }, {} as Linter.RulesRecord)

  const recommended = Object.keys(rules)
    .filter((rule) => rules[rule].recommended)
    .reduce((acc, rule) => {
      return {
        ...acc,
        [`${PLUGIN_ID}/${rules[rule].name}`]: rules[rule].level,
      }
    }, {} as Linter.RulesRecord)

  const allConfig: Linter.Config<Linter.RulesRecord> = {
    name: `${PLUGIN_ID}/all`,
    plugins: { [PLUGIN_ID]: plugin },
    settings: { [PLUGIN_ID]: { ...defaultProjectOptions } },
    rules: all,
  }

  const recommendedConfig: Linter.Config<Linter.RulesRecord> = {
    name: `${PLUGIN_ID}/recommended`,
    plugins: { [PLUGIN_ID]: plugin },
    settings: { [PLUGIN_ID]: { ...defaultProjectOptions } },
    rules: recommended,
  }

  return {
    all: [allConfig],
    recommended: [recommendedConfig],
  }
}
