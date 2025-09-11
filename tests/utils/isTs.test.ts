import { describe, it, expect } from 'vitest'
import { isTs } from '../../src/utils/isTs'

describe('isTs', () => {
  const cases: [string, boolean][] = [
    ['index.ts', true],
    ['component.tsx', true],
    ['types.d.ts', true], // .d.ts should be recognized as TypeScript
    ['/absolute/path/to/module.ts', true],
    ['nested/name/component.vue.ts', true], // last extension matters
    ['archive.tar.ts', true],
    ['file.js', false],
    ['script.jsx', false],
    ['archive.tar.gz', false],
    ['README', false],
    ['.gitignore', false],
    ['UPPER.TS', false], // extname is case-sensitive, should be false
    ['', false], // empty string => no extension
  ]

  cases.forEach(([filename, expected]) => {
    it(`returns ${expected} for "${filename}"`, () => {
      expect(isTs(filename)).toBe(expected)
    })
  })
})
