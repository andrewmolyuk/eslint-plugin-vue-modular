import { VueModularRuleModule } from 'src/types'

export function createRule<T extends VueModularRuleModule>(rule: T): T {
  return {
    ...rule,
    meta: {
      ...rule.meta,
      docs: {
        ...rule.meta?.docs,
        url: `https://github.com/andrewmolyuk/eslint-plugin-vue-modular/blob/main/docs/rules/${rule.name}.md`,
      },
    },
  }
}
