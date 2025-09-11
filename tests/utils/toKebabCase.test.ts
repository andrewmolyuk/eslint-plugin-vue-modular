import { describe, test, expect } from 'vitest'
import { toKebabCase } from '../../src/utils/toKebabCase'

describe('toKebabCase', () => {
  const cases = [
    ['camelCase', 'camel-case'],
    ['PascalCase', 'pascal-case'],
    ['already-kebab-case', 'already-kebab-case'],
    ['snake_case', 'snake-case'],
    ['with spaces and  multiple   spaces', 'with-spaces-and-multiple-spaces'],
    ['XMLHttpRequest', 'xmlhttp-request'],
    ['version1Number2', 'version1-number2'],
    ['foo2Bar', 'foo2-bar'],
    ['ABCDef', 'abcdef'],
    ['mixed_SEParator Test', 'mixed-separator-test'],
    ['', ''],
    [' leading', 'leading'],
    ['trailing ', 'trailing'],
    ['__foo__bar  baz', 'foo-bar-baz'],
    ['a_B', 'a-b'],
  ]

  test.each(cases)('converts %s to %s', (input, expected) => {
    expect(toKebabCase(input)).toBe(expected)
  })
})
