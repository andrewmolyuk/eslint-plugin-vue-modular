import { describe, it, expect } from 'vitest'
import { toPascalCase } from '../../src/utils/toPascalCase'

describe('toPascalCase', () => {
  const cases = [
    ['', ''],
    ['foo', 'Foo'],
    ['foo-bar', 'FooBar'],
    ['foo_bar', 'FooBar'],
    ['foo bar', 'FooBar'],
    ['foo--bar', 'FooBar'],
    ['foo-bar-baz', 'FooBarBaz'],
    ['FooBar', 'FooBar'],
    ['fooBar', 'FooBar'],
    ['FOO-BAR', 'FooBar'],
    ['123', '123'],
  ]

  cases.forEach(([input, expected]) =>
    it(`converts "${input}" to "${expected}"`, () => {
      expect(toPascalCase(input)).toBe(expected)
    }),
  )
})
