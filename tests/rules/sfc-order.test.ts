import { getRuleTester } from '../test-utils'
import { sfcOrder } from '../../src/rules/sfc-order'
import { describe, it } from 'vitest'

const ruleTester = getRuleTester()

describe('sfc-order', () => {
  it('test cases for sfc-order rule', () => {
    ruleTester.run('sfc-order', sfcOrder, {
      valid: [
        { code: '<script>;</script><template><div/></template>', filename: 'app/components/MyComp.vue' },
        { code: '<script>;</script>', filename: 'app/components/MyComp.vue' },
        { code: '<template><div/></template>', filename: 'app/components/MyComp.vue' },
        { code: '<div></div>', filename: 'app/components/MyComp.vue' },
        { code: '<div></div>', filename: 'src/components/MyComp.vue' },
        // covers: ignores pattern matches filename (line 14)
        {
          code: '<script>;</script><template><div/></template>',
          filename: 'src/components/IgnoreMe.vue',
          options: [{ ignores: ['**/IgnoreMe.vue'] }],
        },
        // covers: file is not a component (line 33)
        { code: '<script>;</script><template><div/></template>', filename: 'src/views/NotAComponent.vue' },
        // covers: SFC with only style block (line 50)
        { code: '<style>body{}</style>', filename: 'src/components/StyleOnly.vue' },
        // custom order: style first, correct
        {
          code: '<style>body{}</style><script>;</script><template><div/></template>',
          filename: 'src/components/CustomOrder.vue',
          options: [{ order: ['style', 'script', 'template'] }],
        },
        // missing template block, only script and style, correct order
        { code: '<script>;</script><style>body{}</style>', filename: 'src/components/ScriptStyle.vue' },
        // multiple style blocks, correct order
        {
          code: '<script>;</script><template><div/></template><style>body{}</style><style>.a{}</style>',
          filename: 'src/components/MultiStyle.vue',
        },
        // script setup only, correct
        { code: '<script setup>const a = 1</script>', filename: 'src/components/ScriptSetup.vue' },
        // custom order: script setup, template, style, correct
        {
          code: '<script setup>const a = 1</script><template><div/></template><style>body{}</style>',
          filename: 'src/components/ScriptSetupOrder.vue',
          options: [{ order: ['script', 'template', 'style'] }],
        },
        { code: '<!-- comment --><style>body{}</style>', filename: 'src/components/OnlyStyle.vue' },
        { code: '<style>body{}</style><script></script>', filename: 'src/components/OnlyStyle.vue' },
        // covers: empty order option fallback to defaultOptions.order
        {
          code: '<script>;</script><template><div/></template>',
          filename: 'src/components/EmptyOrder.vue',
          options: [{ order: [] }],
        },
      ],
      invalid: [
        {
          code: '<template><div/></template><script>;</script><style>.style {}</style>',
          filename: 'src/components/MyComp.vue',
          errors: [{ messageId: 'wrongOrder' }],
        },
        // custom order: style first, but wrong order
        {
          code: '<script>;</script><style>body{}</style><template><div/></template>',
          filename: 'src/components/CustomOrderWrong.vue',
          options: [{ order: ['style', 'script', 'template'] }],
          errors: [{ messageId: 'wrongOrder' }],
        },
        // multiple style blocks, wrong order
        {
          code: '<style>body{}</style><script>;</script><style>.a{}</style><template><div/></template>',
          filename: 'src/components/MultiStyleWrong.vue',
          errors: [{ messageId: 'wrongOrder' }],
        },
        // script setup, template, style, wrong order
        {
          code: '<template><div/></template><script setup>const a = 1</script><style>body{}</style>',
          filename: 'src/components/ScriptSetupOrderWrong.vue',
          options: [{ order: ['script', 'template', 'style'] }],
          errors: [{ messageId: 'wrongOrder' }],
        },
        // style should be last
        {
          code: '<style>body{}</style><script setup>const a = 1</script><template><div/></template>',
          filename: 'src/components/ScriptSetupOrderWrong.vue',
          options: [{ order: ['script', 'template', 'style'] }],
          errors: [{ messageId: 'wrongOrder' }],
        },
      ],
    })
  })
})
