import { getRuleTester } from '../test-utils'
import { sfcRequired } from '../../src/rules/sfc-required'
import { describe, it } from 'vitest'

const ruleTester = getRuleTester()

describe('sfc-required', () => {
  it('test cases for sfc-required rule', () => {
    ruleTester.run('sfc-required', sfcRequired, {
      valid: [
        { code: '<div></div>', filename: 'app/components/MyComp.vue' },
        { code: '', filename: 'src/components/MyComp.vue', options: [{ ignores: ['**/MyComp.vue'] }] },
        { code: '<template><div/></template>', filename: 'src/components/MyComp.vue' },
        { code: '<script>export default {}</script>', filename: 'src/components/MyComp.vue' },
        { code: '<script setup>export default {}</script>', filename: 'src/components/MyComp.vue' },
        { code: '<template><div/></template><style></style><script></script>', filename: 'src/components/MyComp.vue' },
      ],
      invalid: [
        {
          code: '<div></div>',
          filename: 'src/components/MyComp.vue',
          errors: [{ messageId: 'missingSfcBlock', data: { name: 'src/components/MyComp.vue' } }],
        },
        {
          code: '<style></style>',
          filename: 'src/components/MyComp.vue',
          errors: [{ messageId: 'missingSfcBlock', data: { name: 'src/components/MyComp.vue' } }],
        },
      ],
    })
  })
})
