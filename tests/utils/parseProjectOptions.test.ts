import { describe, it, expect, beforeEach } from 'vitest'
import { parseProjectOptions } from '../../src/utils/parseProjectOptions'
import { defaultProjectOptions } from '../../src/projectOptions'
import { setupTest } from '../test-utils'

describe('parseProjectOptions', () => {
  beforeEach(() => setupTest())

  it('returns the first option when options array is present', () => {
    const context = { settings: { 'vue-modular': { rootPath: 'my-app', rootAlias: 'alias' } } }
    const expectedOptions = structuredClone(defaultProjectOptions)
    expectedOptions.rootPath = 'my-app'
    expectedOptions.rootAlias = 'alias'

    expect(parseProjectOptions(context)).toEqual(expectedOptions)
  })
  it('returns default object when options array is empty', () => {
    const context = { options: [] }
    expect(parseProjectOptions(context)).toEqual(defaultProjectOptions)
  })

  it('returns default object when options is undefined', () => {
    const context = {}
    expect(parseProjectOptions(context)).toEqual(defaultProjectOptions)
  })

  it('returns default object when options[0] is falsy', () => {
    const context = { options: [null] }
    expect(parseProjectOptions(context)).toEqual(defaultProjectOptions)
  })

  it('returns default object when options[0] is undefined', () => {
    const context = { options: [undefined] }
    expect(parseProjectOptions(context)).toEqual(defaultProjectOptions)
  })
})
