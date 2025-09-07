import path from 'path'
import { describe, it, expect, beforeEach } from 'vitest'
import { toPascalCase, isComponent, isFileIgnored, isOutsideSrc, isTestFile, toCamelCase, toKebabCase } from '../src/utils.js'
import { parseRuleOptions, runOnce } from '../src/utils/rules.js'

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

    describe('toKebabCase', () => {
      it('converts various inputs to kebab-case', () => {
        expect(toKebabCase('UserCard')).toBe('user-card')
        expect(toKebabCase('userCard')).toBe('user-card')
        expect(toKebabCase('login_form')).toBe('login-form')
        expect(toKebabCase('Mixed CASE-name')).toBe('mixed-case-name')
        expect(toKebabCase('123Number')).toBe('123-number')
        expect(toKebabCase('already-kebab')).toBe('already-kebab')
        expect(toKebabCase('foo--bar_baz')).toBe('foo-bar-baz')
        expect(toKebabCase('')).toBe('')
      })
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

  describe('runOnce', () => {
    beforeEach(() => {
      // ensure a clean global state between tests
      try {
        delete global.__eslintVueModularRunId
        delete global.__eslintVueModularState
      } catch {
        /* ignore */
      }
    })

    it('returns true first time and false afterwards for the same rule id', () => {
      expect(runOnce('test-rule-1')).toBe(true)
      expect(runOnce('test-rule-1')).toBe(false)
      expect(runOnce('test-rule-2')).toBe(true)
      expect(runOnce('test-rule-2')).toBe(false)
    })

    it('is scoped by the eslint run id (different run ids allow same rule again)', () => {
      // first run
      expect(runOnce('scoped-rule')).toBe(true)
      expect(runOnce('scoped-rule')).toBe(false)

      // simulate a new eslint run id
      const prevRunId = global.__eslintVueModularRunId
      try {
        global.__eslintVueModularRunId = `${process.pid}_newscope`
        // new map is created internally for the new run id
        expect(runOnce('scoped-rule')).toBe(true)
      } finally {
        if (prevRunId === undefined) delete global.__eslintVueModularRunId
        else global.__eslintVueModularRunId = prevRunId
      }
    })

    it('allows two different rules to run once each in the same session', () => {
      // both different rule ids should be allowed the first time
      expect(runOnce('rule-a')).toBe(true)
      expect(runOnce('rule-b')).toBe(true)

      // subsequent calls for both should return false
      expect(runOnce('rule-a')).toBe(false)
      expect(runOnce('rule-b')).toBe(false)
    })
  })
})
