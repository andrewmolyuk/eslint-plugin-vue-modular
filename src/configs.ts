import { rules } from './rules'

const PLUGIN_ID = 'vue-modular'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createConfigs(plugin: any) {
  // build 'all' map: every rule -> 'error'
  const all = Object.keys(rules).reduce<Record<string, 'error'>>((acc, id) => {
    acc[`${PLUGIN_ID}/${id}`] = 'error'
    return acc
  }, {})

  // build 'recommended' map: only rules whose meta.docs.recommended === true -> 'warn'
  const recommended = Object.keys(rules).reduce<Record<string, 'warn'>>((acc, id) => {
    // rule shape may vary between TS/JS builds; use any locally
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rule = (rules as any)[id]
    if (rule?.meta?.docs?.recommended) {
      acc[`${PLUGIN_ID}/${id}`] = 'warn'
    }
    return acc
  }, {})

  return {
    all: {
      name: `${PLUGIN_ID}/all`,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      plugins: { [PLUGIN_ID]: plugin } as any,
      rules: all,
    },
    recommended: {
      name: `${PLUGIN_ID}/recommended`,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      plugins: { [PLUGIN_ID]: plugin } as any,
      rules: recommended,
    },
  }
}
