import fs from 'fs'
import path from 'path'
import type { ESLint } from 'eslint'
interface PkgJson {
  name: string
  version: string
}

export function getMeta(): ESLint.ObjectMetaProperties {
  const pkgPath = path.resolve(__dirname, '../package.json')
  const pkgContent = fs.readFileSync(pkgPath, 'utf8')
  const pkg = JSON.parse(pkgContent) as PkgJson

  return {
    name: pkg.name,
    version: pkg.version,
  }
}
