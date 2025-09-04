import path from 'path'
import { describe, it, expect } from 'vitest'
import { parseRuleOptions, toPascalCase, isComponent, isFileIgnored, isOutsideSrc, isTestFile, toCamelCase } from '../src/utils.js'

describe('src/utils', () => {
  describe('parseRuleOptions', () => {
    it('returns defaults when no options provided', () => {
      const ctx = { options: [] }
      const defaults = { src: 'src', ignore: [] }
      const parsed = parseRuleOptions(ctx, defaults)
      expect(parsed).toEqual(defaults)
    })

    it('parses and trims options and arrays', () => {
      const ctx = { options: [{ src: ' app ', ignore: ['  **/ignored.vue  ', 'abs.vue'] }] }
      const defaults = { src: 'src', ignore: [] }
      const parsed = parseRuleOptions(ctx, defaults)
      expect(parsed.src).toBe('app')
      expect(parsed.ignore).toEqual(['**/ignored.vue', 'abs.vue'])
    })
  })

  describe('toPascalCase', () => {
    it('converts various separators to PascalCase', () => {
      expect(toPascalCase('user-card')).toBe('UserCard')
      expect(toPascalCase('login_form')).toBe('LoginForm')
      expect(toPascalCase('alreadyPascal')).toBe('AlreadyPascal')
      expect(toPascalCase('mixed CASE-name')).toBe('MixedCASEName')
      expect(toPascalCase('123-number')).toBe('123Number')
    })
  })

  describe('toCamelCase', () => {
    it('converts various separators to camelCase', () => {
      expect(toCamelCase('user-card')).toBe('userCard')
      expect(toCamelCase('login_form')).toBe('loginForm')
      expect(toCamelCase('AlreadyCamel')).toBe('alreadyCamel')
      expect(toCamelCase('mixed CASE-name')).toBe('mixedCASEName')
      expect(toCamelCase('123-number')).toBe('123Number')
      expect(toCamelCase('foo--bar_baz')).toBe('fooBarBaz')
      expect(toCamelCase('')).toBe('')
    })
  })

  describe('isComponent', () => {
    it('detects .vue and common component indicators', () => {
      expect(isComponent('/some/path/File.vue')).toBe(true)
      expect(isComponent('my.component.js')).toBe(true)
      expect(isComponent('my.comp.ts')).toBe(true)
      expect(isComponent('not-a-component.txt')).toBe(false)
      expect(isComponent('')).toBe(false)
      expect(isComponent(null)).toBe(false)
    })
  })

  describe('isFileIgnored', () => {
    it('matches relative glob patterns and absolute patterns', () => {
      const filename = path.join(process.cwd(), 'src', 'components', 'ignored-file.vue')
      expect(isFileIgnored(filename, ['**/ignored-file.vue'])).toBe(true)
      expect(isFileIgnored(filename, [filename])).toBe(true)
      expect(isFileIgnored(filename, ['**/other.vue'])).toBe(false)
    })
  })

  describe('isOutsideSrc', () => {
    it('returns false when inside src and true when outside', () => {
      const inSrc = path.join(process.cwd(), 'src', 'components', 'Foo.vue')
      const outSrc = path.join(process.cwd(), 'other', 'components', 'Foo.vue')
      expect(isOutsideSrc(inSrc, 'src')).toBe(false)
      expect(isOutsideSrc(outSrc, 'src')).toBe(true)
      expect(isOutsideSrc(inSrc, '')).toBe(false)
      expect(isOutsideSrc(inSrc, undefined)).toBe(false)
    })
  })

  describe('isTestFile', () => {
    it('detects test files by folder or filename', () => {
      expect(isTestFile(path.join(process.cwd(), 'src', 'tests', 'Foo.spec.js'))).toBe(true)
      expect(isTestFile(path.join(process.cwd(), 'src', 'test', 'Foo.js'))).toBe(true)
      expect(isTestFile(path.join(process.cwd(), 'src', 'components', 'Foo.test.ts'))).toBe(true)
      expect(isTestFile(path.join(process.cwd(), 'src', 'components', 'Foo.spec.vue'))).toBe(true)
      expect(isTestFile(path.join(process.cwd(), 'src', 'components', 'NotATest.vue'))).toBe(false)
      expect(isTestFile('')).toBe(false)
      expect(isTestFile(null)).toBe(false)
      expect(isTestFile(undefined)).toBe(false)
    })
  })
})
