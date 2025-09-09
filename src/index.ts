// import { RuleModule } from '@typescript-eslint/utils/ts-eslint'
import { ESLint } from 'eslint'
import * as fs from 'fs'
import * as path from 'path'
// import { rules } from './rules'

// type RuleKey = keyof typeof rules

// interface Plugin extends Omit<ESLint.Plugin, 'rules'> {
// rules: Record<RuleKey, RuleModule<any, any, any>>
// }

type PkgInfo = { name: string; version: string }
const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf8')) as PkgInfo

const { name, version } = pkg

const plugin: ESLint.Plugin = {
  meta: {
    name,
    version,
  },
  // rules,
}

export default plugin
