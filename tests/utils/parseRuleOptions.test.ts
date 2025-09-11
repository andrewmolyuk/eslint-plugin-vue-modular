import { describe, it, expect } from 'vitest'
import { parseRuleOptions } from '../../src/utils/parseRuleOptions'
import { VueModularRuleContext } from '../../src/types'

describe('parseRuleOptions', () => {
  it('returns the first option when options array is present', () => {
    const context = { options: [{ foo: 'bar' }] } as VueModularRuleContext
    expect(parseRuleOptions(context, {})).toEqual({ foo: 'bar' })
  })

  it('returns empty object when options array is empty', () => {
    const context = { options: [] } as unknown as VueModularRuleContext
    expect(parseRuleOptions(context, {})).toEqual({})
  })

  it('returns empty object when options is undefined', () => {
    const context = {} as VueModularRuleContext
    expect(parseRuleOptions(context, {})).toEqual({})
  })

  it('returns empty object when options[0] is falsy', () => {
    const context = { options: [null] } as VueModularRuleContext
    expect(parseRuleOptions(context, {})).toEqual({})
  })

  it('returns empty object when options[0] is undefined', () => {
    const context = { options: [undefined] } as VueModularRuleContext
    expect(parseRuleOptions(context, {})).toEqual({})
  })
})
