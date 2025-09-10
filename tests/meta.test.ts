import { describe, it, expect, beforeEach } from 'vitest'
import { getMeta } from '../src/meta'
import { mockFile, setupTest } from './test-utils'

beforeEach(() => setupTest())

describe('meta.ts', () => {
  it('reads package.json and exposes name and version', () => {
    mockFile('package.json', '{"name":"test-pkg","version":"1.2.3"}')
    const meta = getMeta()
    expect(meta.name).toBe('test-pkg')
    expect(meta.version).toBe('1.2.3')
  })

  it('throws when package.json contains invalid JSON', () => {
    mockFile('package.json', 'not valid json')
    expect(() => getMeta()).toThrow(SyntaxError)
  })
})
