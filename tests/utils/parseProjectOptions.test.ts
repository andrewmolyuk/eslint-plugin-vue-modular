import { describe, it, expect, beforeEach } from 'vitest'
import { parseProjectOptions } from '../../src/utils/parseProjectOptions'
import { defaultProjectOptions } from '../../src/projectOptions'
import type { VueModularRuleContext } from '../../src/types'
import { setupTest } from '../test-utils'

describe('parseProjectOptions', () => {
  beforeEach(() => setupTest())

  it('returns the first option when options array is present', () => {
    const context = { settings: { 'vue-modular': { rootPath: 'my-app', rootAlias: 'alias' } } } as VueModularRuleContext
    const expectedOptions = structuredClone(defaultProjectOptions)
    expectedOptions.rootPath = 'my-app'
    expectedOptions.rootAlias = 'alias'

    expect(parseProjectOptions(context)).toEqual(expectedOptions)
  })
  it('returns default object when options array is empty', () => {
    const context: VueModularRuleContext = { options: [] } as unknown as VueModularRuleContext
    expect(parseProjectOptions(context)).toEqual(defaultProjectOptions)
  })

  it('returns default object when options is undefined', () => {
    const context: VueModularRuleContext = {} as VueModularRuleContext
    expect(parseProjectOptions(context)).toEqual(defaultProjectOptions)
  })

  it('returns default object when options[0] is falsy', () => {
    const context: VueModularRuleContext = { options: [null] } as VueModularRuleContext
    expect(parseProjectOptions(context)).toEqual(defaultProjectOptions)
  })

  it('returns default object when options[0] is undefined', () => {
    const context: VueModularRuleContext = { options: [undefined] } as VueModularRuleContext
    expect(parseProjectOptions(context)).toEqual(defaultProjectOptions)
  })
})
