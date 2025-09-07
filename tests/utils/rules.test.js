import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { parseRuleOptions, runOnce } from '@/utils/rules'

describe('parseRuleOptions', () => {
  it('returns defaults when no options provided', () => {
    const context = {}
    const defaults = { foo: 'bar', arr: ['a', 'b'] }
    expect(parseRuleOptions(context, defaults)).toEqual({ foo: 'bar', arr: ['a', 'b'] })
  })

  it('overrides defaults with provided options', () => {
    const context = { options: [{ foo: 'baz', arr: ['x', 'y'] }] }
    const defaults = { foo: 'bar', arr: ['a', 'b'] }
    expect(parseRuleOptions(context, defaults)).toEqual({ foo: 'baz', arr: ['x', 'y'] })
  })

  it('trims string and array values', () => {
    const context = { options: [{ foo: '  baz  ', arr: [' x ', ' y '] }] }
    const defaults = { foo: 'bar', arr: ['a', 'b'] }
    expect(parseRuleOptions(context, defaults)).toEqual({ foo: 'baz', arr: ['x', 'y'] })
  })

  it('handles missing keys in options', () => {
    const context = { options: [{}] }
    const defaults = { foo: 'bar', arr: ['a', 'b'] }
    expect(parseRuleOptions(context, defaults)).toEqual({ foo: 'bar', arr: ['a', 'b'] })
  })

  it('handles non-array, non-string values', () => {
    const context = { options: [{ num: 42 }] }
    const defaults = { num: 0 }
    expect(parseRuleOptions(context, defaults)).toEqual({ num: 42 })
  })
})

describe('runOnce', () => {
  const ruleId = 'test-rule'

  beforeEach(() => {
    delete global.__eslintVueModularRunId
    delete global.__eslintVueModularState
  })

  afterEach(() => {
    delete global.__eslintVueModularRunId
    delete global.__eslintVueModularState
  })

  it('returns true on first run for a rule', () => {
    expect(runOnce(ruleId)).toBe(true)
  })

  it('returns false on subsequent runs for the same rule', () => {
    expect(runOnce(ruleId)).toBe(true)
    expect(runOnce(ruleId)).toBe(false)
  })

  it('returns true for different rule ids', () => {
    expect(runOnce('rule1')).toBe(true)
    expect(runOnce('rule2')).toBe(true)
    expect(runOnce('rule1')).toBe(false)
    expect(runOnce('rule2')).toBe(false)
  })

  it('creates global state and run id if not present', () => {
    expect(global.__eslintVueModularRunId).toBeUndefined()
    expect(global.__eslintVueModularState).toBeUndefined()
    runOnce(ruleId)
    expect(global.__eslintVueModularRunId).toBeDefined()
    expect(global.__eslintVueModularState).toBeDefined()
  })
})
