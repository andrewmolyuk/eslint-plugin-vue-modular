import { describe, it, expect, beforeEach } from 'vitest'
import { getImports } from '../../src/utils/imports.js'
import { mockFile, setupTest } from '../utils.js'

const filename = 'src/mock/path/MyComponent.vue'
const scriptImports = `
  <script>
    import { test } from './foo.js'
    import * from '@/bar.js'
    import baz from '../baz.js'
  </script>`

const scriptSetupImports = `
  <script setup>
    import { test } from './bar.js'
  </script>`

beforeEach(() => {
  setupTest(filename)
})

describe('getImports', () => {
  it('returns null if file does not exist', () => {
    expect(getImports('/mock/path/MyComponent.vue')).toBeNull()
  })

  it('returns null if file is not a Vue SFC', () => {
    expect(getImports('/mock/path/MyComponent.ts')).toBeNull()
  })

  it('returns import paths from script section', () => {
    mockFile(filename, scriptImports)
    const imports = getImports(filename)
    expect(imports).toEqual(['./foo.js', '@/bar.js', '../baz.js'])
  })

  it('uses custom src and alias arguments', () => {
    mockFile(filename, scriptImports)
    getImports(filename, 'customSrc', '$')
  })

  it('returns import paths from script setup section', () => {
    mockFile(filename, scriptSetupImports)
    const imports = getImports(filename)
    expect(imports).toEqual(['./bar.js'])
  })

  it('returns import paths from both script and script setup sections', () => {
    mockFile(filename, scriptImports + scriptSetupImports)
    const imports = getImports(filename)
    expect(imports).toEqual(['./foo.js', '@/bar.js', '../baz.js', './bar.js'])
  })
})
