import * as fs from 'fs'
import * as path from 'path'
import type { ESLint } from 'eslint'

type PkgJson = { name: string; version: string }

const pkgPath = path.resolve(__dirname, '../package.json')
const pkgContent = fs.readFileSync(pkgPath, 'utf8')
const pkg = JSON.parse(pkgContent) as PkgJson

export const meta: ESLint.ObjectMetaProperties = {
  name: pkg.name,
  version: pkg.version,
}
