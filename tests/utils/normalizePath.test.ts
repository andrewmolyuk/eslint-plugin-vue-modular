import { describe, it, expect } from 'vitest'
import { normalizePath } from '../../src/utils'

describe('normalizePath', () => {
  const cases: [string, string][] = [
    ['', ''],
    ['   ', ''],
    ['a\\b\\c', 'a/b/c'],
    ['\\\\a\\\\b', 'a/b'],
    ['///a//b', 'a/b'],
    ['/a/b', 'a/b'],
    ['./a/b', 'a/b'],
    ['a/b/../c', 'a/c'],
    ['../../a', '../../a'],
    ['.', '.'],
    ['./', '.'],
    ['a/./b', 'a/b'],
    ['../a', '../a'],
    ['C:\\foo\\bar', 'C:/foo/bar'],
    ['/C:/foo', 'C:/foo'],
    ['a//b///c', 'a/b/c'],
  ]

  it.each(cases)('normalizes "%s" -> "%s"', (input, expected) => {
    expect(normalizePath(input)).toBe(expected)
  })
})
