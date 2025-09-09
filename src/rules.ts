import type { ESLint } from 'eslint'
import { fileTsNaming } from './rules/file-ts-naming'

export const rules: ESLint.Plugin['rules'] = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  'file-ts-naming': fileTsNaming as unknown as any,
}
