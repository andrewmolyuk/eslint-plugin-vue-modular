import { getRuleTester } from '../test-utils'
import { storesLocation } from '../../src/rules/stores-location'
import { describe, it } from 'vitest'
import { runRule } from '../test-utils'
import { expect } from 'vitest'

const ruleTester = getRuleTester()

describe('stores-location', () => {
  it('valid when store file lives under shared stores', () => {
    ruleTester.run('stores-location', storesLocation, {
      valid: [
        {
          code: '<script setup>defineStore("useAuth", {})</script>',
          filename: 'src/shared/stores/auth.ts',
        },
        {
          code: '<script>export const a = 1</script>',
          filename: 'src/shared/stores/not-a-store.ts',
        },
      ],
      invalid: [],
    })
  })

  it('valid when store file lives under feature stores', () => {
    ruleTester.run('stores-location', storesLocation, {
      valid: [
        {
          code: '<script setup>defineStore("useAuth", {})</script>',
          filename: 'src/features/auth/stores/auth.ts',
        },
      ],
      invalid: [],
    })
  })

  it('reports when a SFC uses defineStore but is not in a stores folder', () => {
    ruleTester.run('stores-location', storesLocation, {
      valid: [],
      invalid: [
        {
          code: '<script setup>defineStore("useAuth", {})</script>',
          filename: 'src/features/auth/components/SomeComp.vue',
          errors: [
            {
              messageId: 'moveToStores',
              data: {
                filename: 'src/features/auth/components/SomeComp.vue',
                storesFolderName: 'stores',
              },
            },
          ],
        },
      ],
    })
  })

  it('reports when script block uses defineStore (non-setup)', () => {
    ruleTester.run('stores-location', storesLocation, {
      valid: [],
      invalid: [
        {
          code: '<script>export function useSomething(){ return defineStore("x", {}) }</script>',
          filename: 'src/components/BadStore.vue',
          errors: [{ messageId: 'moveToStores' }],
        },
      ],
    })
  })

  it('does not report when file is ignored via options', () => {
    const context = runRule(storesLocation, 'src/features/auth/components/SomeComp.vue', [{ ignores: ['src/features/auth/components/**'] }])
    expect(context.report).not.toHaveBeenCalled()
  })

  it('does not report when SFC has no defineStore and is outside stores', () => {
    ruleTester.run('stores-location', storesLocation, {
      valid: [
        {
          code: '<script>const x = 1</script><template><div/></template>',
          filename: 'src/features/auth/components/Other.vue',
        },
      ],
      invalid: [],
    })
  })
})
