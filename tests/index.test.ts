import { describe, it, expect, vi, beforeEach } from 'vitest'
import { VueModularPlugin } from '../src/types'

describe('src/index.ts', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.restoreAllMocks()
  })

  it('passes a plugin with meta, rules and initial empty configs to createConfigs', async () => {
    const metaValue = { name: 'meta-value' }
    const rulesObj = { 'my-rule': {} }

    interface CapturedCall {
      meta: Record<string, unknown>
      rules: Record<string, unknown>
      configsAllLength: number
      configsRecommendedLength: number
    }
    let capturedCall: CapturedCall | null = null

    const createConfigs = vi.fn((plugin: VueModularPlugin) => {
      // capture state at call time (before index.ts mutates plugin.configs)
      capturedCall = {
        meta: plugin.meta ?? ({} as Record<string, unknown>),
        rules: plugin.rules ?? ({} as Record<string, unknown>),
        configsAllLength: plugin.configs.all.length,
        configsRecommendedLength: plugin.configs.recommended.length,
      }
      return { all: [{ id: 'all' }], recommended: [{ id: 'rec' }] }
    })

    vi.doMock('../src/meta', () => ({ getMeta: () => metaValue }))
    vi.doMock('../src/rules', () => ({ rules: rulesObj }))
    vi.doMock('../src/configs', () => ({ createConfigs }))

    const mod = await import('../src/index')
    const plugin = mod.default

    expect(createConfigs).toHaveBeenCalledTimes(1)
    expect(capturedCall).not.toBeNull()
    if (!capturedCall) throw new Error('capturedCall is null')
    const call: CapturedCall = capturedCall
    expect(call.meta).toBe(metaValue)
    expect(call.rules).toBe(rulesObj)
    expect(call.configsAllLength).toBe(0)
    expect(call.configsRecommendedLength).toBe(0)

    // exported plugin should exist
    expect(plugin).toBeDefined()
  })

  it('exports plugin with meta, rules and configs replaced by createConfigs return', async () => {
    const metaValue = { name: 'meta-2' }
    const rulesObj = { 'rule-2': {} }
    const returnedAll = [{ cfg: 'all-cfg' }]
    const returnedRec = [{ cfg: 'rec-cfg' }]

    const createConfigs = vi.fn(() => ({ all: returnedAll, recommended: returnedRec }))

    vi.doMock('../src/meta', () => ({ getMeta: () => metaValue }))
    vi.doMock('../src/rules', () => ({ rules: rulesObj }))
    vi.doMock('../src/configs', () => ({ createConfigs }))

    const mod = await import('../src/index')
    const plugin = mod.default

    expect(plugin.meta).toBe(metaValue)
    expect(plugin.rules).toBe(rulesObj)
    expect(plugin.configs.all).toBe(returnedAll)
    expect(plugin.configs.recommended).toBe(returnedRec)
    expect(createConfigs).toHaveBeenCalledWith(plugin)
  })
})
