import { describe, it, expect } from 'vitest'
import { toCamelCase } from '../../src/utils'

describe('toCamelCase', () => {
  const cases = [
    ['HelloWorld', 'helloWorld'],
    ['hello-world', 'helloWorld'],
    ['hello_world', 'helloWorld'],
    ['Hello_World', 'helloWorld'],
    ['hello world', 'helloWorld'],
    ['Hello World', 'helloWorld'],
    ['mixed-Separator Test', 'mixedSeparatorTest'],
    ['XMLHttpRequest', 'xmlHttpRequest'],
    ['version1Number2', 'version1Number2'],
    ['foo2Bar', 'foo2Bar'],
    ['ABCDef', 'abcDef'],
    ['with spaces and  multiple   spaces', 'withSpacesAndMultipleSpaces'],
    ['', ''],
    [' leading', 'leading'],
    ['trailing ', 'trailing'],
    ['__foo__bar  baz', 'fooBarBaz'],
    ['a_B', 'aB'],
    ['FOO-BAR', 'fooBar'],
    ['---', ''],
  ]

  cases.forEach(([input, expected]) =>
    it(`converts "${input}" to "${expected}"`, () => {
      expect(toCamelCase(input)).toBe(expected)
    }),
  )
})
