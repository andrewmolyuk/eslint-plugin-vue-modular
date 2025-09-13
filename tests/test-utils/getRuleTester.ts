import parser from 'vue-eslint-parser'
import { RuleTester } from 'eslint'

// Utility to create a RuleTester instance with Vue parser and default options
export const getRuleTester = () => {
  return new RuleTester({
    languageOptions: {
      parser,
    },
  })
}
