import { componentsIndexRequired } from './rules/components-index-required'
import { featureIndexRequired } from './rules/feature-index-required'
import { fileComponentNaming } from './rules/file-component-naming'
import { fileTsNaming } from './rules/file-ts-naming'
import { folderKebabCase } from './rules/folder-kebab-case'
import { sfcRequired } from './rules/sfc-required'
import { sharedIndexRequired } from './rules/shared-ui-index-required'
import { featureImportsFromSharedOnly } from './rules/feature-imports-from-shared-only'
import { VueModularRuleModule } from './types'

export const rules: Record<string, VueModularRuleModule> = {
  'components-index-required': componentsIndexRequired,
  'feature-index-required': featureIndexRequired,
  'file-component-naming': fileComponentNaming,
  'file-ts-naming': fileTsNaming,
  'folder-kebab-case': folderKebabCase,
  'shared-ui-index-required': sharedIndexRequired,
  'sfc-required': sfcRequired,
  'feature-imports-from-shared-only': featureImportsFromSharedOnly,
}
