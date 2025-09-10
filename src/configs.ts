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
  const all = Object.keys(rules).map((rule) => {
    return {
      [`${PLUGIN_ID}/${rules[rule].name}`]: rules[rule].meta.docs.level === 'warn' ? 'warn' : 'error',
    }
  }
  // const all = Object.keys(rules ?? {}).reduce<Record<string, 'error' | 'warn'>>((acc, id) => {
  //   const rule = rules![id]
  //   acc[`${PLUGIN_ID}/${id}`] = rule?.meta?.docs?.level === 'warn' ? 'warn' : 'error'
  //   return acc
  // }, {})

  const recommended = Object.keys(rules ?? {}).reduce<Record<string, 'warn'>>((acc, id) => {
    const rule = rules![id]
    if (rule?.meta?.docs?.recommended) {
      acc[`${PLUGIN_ID}/${id}`] = 'warn'
    }
    return acc
  }, {})

  const allConfig: Linter.Config = {
    name: `${PLUGIN_ID}/all`,
    plugins: { [PLUGIN_ID]: plugin },
    settings: { [PLUGIN_ID]: { ...defaultProjectOptions } },
    rules: all,
  }

  const recommendedConfig: Linter.Config = {
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
