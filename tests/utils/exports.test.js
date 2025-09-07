import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as sfc from '@vue/compiler-sfc'
import * as bp from '@babel/parser'
import { getImports as getExports } from '../../src/utils/exports.js'
import { mockFile, setupTest } from '../utils.js'

const filename = 'src/mock/path/ExportsComponent.vue'

beforeEach(() => {
  setupTest(filename)
  vi.clearAllMocks()
})

describe('export.js', () => {
  // Test for getExports
  describe('getExports', () => {
    it('returns null when resolver does not find the file', () => {
      // pass a filename that resolvePath can't resolve (no 'src' in it)
      expect(getExports('notfound.vue')).toBeNull()
    })

    it('returns null when SFC descriptor is missing', () => {
      const missingDescPath = 'src/mock/path/nodesc.vue'
      mockFile(missingDescPath, '<template></template>') // minimal content
      // optional: spy on compiler parse if you want to simulate descriptor=null for that filename
      expect(getExports(missingDescPath)).toBeNull()
    })

    it('collects export sources from script and scriptSetup and deduplicates', () => {
      // Provide an SFC whose <script> and <script setup> contain export-from statements
      const sfcContent = `
      <script>
        export * from 'a';
        export { x } from 'b';
      </script>
      <script setup>
        export * from 'b';
        export { default as Y } from 'c';
      </script>
    `
      mockFile(filename, sfcContent)
      // If you want deterministic AST extraction you can spy on bp.parse to return expected AST
      const result = getExports(filename)
      expect(result).toEqual(['a', 'b', 'c'])
    })

    it('handles `export default from` syntax in script blocks', () => {
      const sfcContent = `
      <script>
        export default from 'x';
      </script>
    `
      mockFile(filename, sfcContent)
      const result = getExports(filename)
      expect(result).toEqual(['x'])
    })

    it('handles AST shape for export default declaration with identifier and source', () => {
      // Stub bp.parse to return a crafted AST node that matches the branch in collectFromCode
      const sfcContent = `
      <script>
        // content will be ignored because we stub parse
      </script>
    `
      mockFile(filename, sfcContent)

      const fakeAst = {
        type: 'Program',
        body: [
          {
            type: 'ExportDefaultDeclaration',
            declaration: { type: 'Identifier', name: 'X' },
            source: { value: 'z' },
          },
        ],
      }

      const spy = vi.spyOn(bp, 'parse').mockImplementation(() => fakeAst)
      const result = getExports(filename)
      spy.mockRestore()
      expect(result).toEqual(['z'])
    })

    it('returns null when compiler-sfc parse returns no descriptor', () => {
      mockFile(filename, '<template><div/></template>')
      const spy = vi.spyOn(sfc, 'parse').mockImplementation(() => ({ descriptor: null }))
      const res = getExports(filename)
      spy.mockRestore()
      expect(res).toBeNull()
    })

    it('works when component only has <script setup> (no <script>)', () => {
      const sfcOnlySetup = `
      <script setup>
        export * from 'b';
        export { default as Y } from 'c';
      </script>
    `
      mockFile(filename, sfcOnlySetup)
      const res = getExports(filename)
      expect(res).toEqual(['b', 'c'])
    })

    it('ignores parse errors in one block and still collects from the other', () => {
      const badScriptSfc = `
      <script>
        // intentionally malformed JS to trigger parse error
        this is not valid javascript %%
      </script>
      <script setup>
        export * from 'b';
        export { default as Y } from 'c';
      </script>
    `
      mockFile(filename, badScriptSfc)
      const res = getExports(filename)
      expect(res).toEqual(['b', 'c'])
    })
  })
})
