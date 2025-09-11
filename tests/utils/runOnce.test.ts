import { describe, it, expect, beforeEach } from 'vitest'
import { runOnce } from '../../src/utils/runOnce'

interface RunGlobal {
  __eslintVueModularRunId?: string
  __eslintVueModularState?: Map<string, Set<string> | undefined>
}

const g = global as unknown as RunGlobal

describe('runOnce', () => {
  beforeEach(() => {
    delete g.__eslintVueModularRunId
    delete g.__eslintVueModularState
  })

  it('returns true first time and false second time', () => {
    expect(runOnce('rule-a')).toBe(true)
    expect(runOnce('rule-a')).toBe(false)
  })

  it('respects existing state with seen item', () => {
    g.__eslintVueModularRunId = 'test-run-1'
    g.__eslintVueModularState = new Map([['test-run-1', new Set(['seen-rule'])]])

    expect(runOnce('seen-rule')).toBe(false)
    expect(runOnce('other-rule')).toBe(true)
  })

  it('handles missing seen entry by creating it and returning false then true', () => {
    g.__eslintVueModularRunId = 'test-run-2'
    // simulate a Map entry with undefined value
    g.__eslintVueModularState = new Map([['test-run-2', undefined]])

    // first call should create the Set and return false
    expect(runOnce('temp-rule')).toBe(false)
    // second call should then add and return true
    expect(runOnce('temp-rule')).toBe(true)
  })
})
