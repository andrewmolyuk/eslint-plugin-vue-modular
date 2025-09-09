import { rules } from './rules'
import type { Linter } from 'eslint'
import { VueModularProjectOptions } from './types'

const PLUGIN_ID = 'vue-modular'

export function createConfigs(plugin: Record<string, unknown>): {
  all: Linter.Config[]
  recommended: Linter.Config[]
} {
  // build 'all' map: every rule -> 'error'
  const all = Object.keys(rules ?? {}).reduce<Record<string, 'error'>>((acc, id) => {
    acc[`${PLUGIN_ID}/${id}`] = 'error'
    return acc
  }, {})

  // build 'recommended' map: only rules whose meta.docs.recommended === true -> 'warn'
  const recommended = Object.keys(rules ?? {}).reduce<Record<string, 'warn'>>((acc, id) => {
    // rule shape may vary between TS/JS builds; use any locally
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rule = (rules as any)[id]
    if (rule?.meta?.docs?.recommended) {
      acc[`${PLUGIN_ID}/${id}`] = 'warn'
    }
    return acc
  }, {})

  // default project options used when consumer does not provide projectOptions
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

  const allConfig = {
    name: `${PLUGIN_ID}/all`,
    plugins: { [PLUGIN_ID]: plugin },
    settings: { [PLUGIN_ID]: { projectOptions: defaultProjectOptions } },
    rules: all,
  } as unknown as Linter.Config

  const recommendedConfig = {
    name: `${PLUGIN_ID}/recommended`,
    plugins: { [PLUGIN_ID]: plugin },
    settings: { [PLUGIN_ID]: { projectOptions: defaultProjectOptions } },
    rules: recommended,
  } as unknown as Linter.Config

  return {
    all: [allConfig],
    recommended: [recommendedConfig],
  }
}
