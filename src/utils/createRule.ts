import { ESLintUtils } from '@typescript-eslint/utils'

export interface VueModularRuleDocs {
  category: string
  description: string
  recommended: boolean
  url?: string
}

export const createRule = ESLintUtils.RuleCreator<VueModularRuleDocs>(
  (name) => `https://github.com/andrewmolyuk/eslint-plugin-vue-modular/blob/main/docs/rules/${name}.md`,
)
