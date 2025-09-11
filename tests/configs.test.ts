import { describe, it, expect } from 'vitest'
import { createConfigs } from '../src/configs'
import { rules } from '../src/rules'
import { VueModularPlugin, VueModularRuleModule } from '../src/types'
import { defaultProjectOptions } from '../src/projectOptions'
import { ESLint } from 'eslint'

const PLUGIN_ID = 'vue-modular'

describe('createConfigs', () => {
  it('builds "all" and "recommended" configs with proper names and plugin registration', () => {
    const plugin = {}
    const configs = createConfigs(plugin as VueModularPlugin)

    expect(configs).toHaveProperty('all')
    expect(configs).toHaveProperty('recommended')

    expect(Array.isArray(configs.all)).toBe(true)
    expect(Array.isArray(configs.recommended)).toBe(true)

    const allConfig = configs.all[0]
    const recommendedConfig = configs.recommended[0]

    expect(allConfig.name).toBe(`${PLUGIN_ID}/all`)
    expect(recommendedConfig.name).toBe(`${PLUGIN_ID}/recommended`)

    expect(allConfig.plugins).toHaveProperty(PLUGIN_ID)
    expect((allConfig.plugins as Record<string, ESLint.Plugin>)[PLUGIN_ID]).toBe(plugin)
    expect((recommendedConfig.plugins as Record<string, ESLint.Plugin>)[PLUGIN_ID]).toBe(plugin)
  })

  it('maps every rule into the "all" config with the correct key and level', () => {
    const plugin = {}
    const configs = createConfigs(plugin as VueModularPlugin)
    const allConfig = configs.all[0]

    const expectedAll = Object.keys(rules).reduce<Record<string, VueModularRuleModule['level']>>((acc, key) => {
      const rule = (rules as Record<string, VueModularRuleModule>)[key]
      acc[`${PLUGIN_ID}/${rule.name}`] = rule.level
      return acc
    }, {})

    expect(allConfig.rules).toEqual(expectedAll)
  })

  it('includes only recommended rules in the "recommended" config', () => {
    const plugin = {}
    const configs = createConfigs(plugin as VueModularPlugin)
    const recommendedConfig = configs.recommended[0]

    const expectedRecommended = Object.keys(rules)
      .filter((key) => (rules as Record<string, VueModularRuleModule>)[key].recommended)
      .reduce<Record<string, VueModularRuleModule['level']>>((acc, key) => {
        const rule = (rules as Record<string, VueModularRuleModule>)[key]
        acc[`${PLUGIN_ID}/${rule.name}`] = rule.level
        return acc
      }, {})

    expect(recommendedConfig.rules).toEqual(expectedRecommended)
  })

  it('copies defaultProjectOptions into settings (deep equal but not the same reference)', () => {
    const plugin = {}
    const configs = createConfigs(plugin as VueModularPlugin)
    const allConfig = configs.all[0]

    expect(allConfig).toHaveProperty('settings')
    expect(allConfig.settings).toHaveProperty(PLUGIN_ID)
    expect(allConfig.settings?.[PLUGIN_ID]).toEqual(defaultProjectOptions)
    expect(allConfig.settings?.[PLUGIN_ID]).not.toBe(defaultProjectOptions)
  })
})
