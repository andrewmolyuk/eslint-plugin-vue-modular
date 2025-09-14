import { componentsIndexRequired } from './rules/components-index-required'
import { featureImports } from './rules/feature-imports'
import { featureIndexRequired } from './rules/feature-index-required'
import { fileComponentNaming } from './rules/file-component-naming'
import { fileTsNaming } from './rules/file-ts-naming'
import { folderKebabCase } from './rules/folder-kebab-case'
import { sfcRequired } from './rules/sfc-required'
import { sharedImports } from './rules/shared-imports'
import { serviceFilenameNoSuffix } from './rules/service-filename-no-suffix'
import { storeFilenameNoSuffix } from './rules/store-filename-no-suffix'
import { sharedUiIndexRequired } from './rules/shared-ui-index-required'
import { viewsSuffix } from './rules/views-suffix'
import { VueModularRuleModule } from './types'

export const rules: Record<string, VueModularRuleModule> = {
  'components-index-required': componentsIndexRequired,
  'feature-index-required': featureIndexRequired,
  'file-component-naming': fileComponentNaming,
  'file-ts-naming': fileTsNaming,
  'folder-kebab-case': folderKebabCase,
  'shared-ui-index-required': sharedUiIndexRequired,
  'sfc-required': sfcRequired,
  'shared-imports': sharedImports,
  'service-filename-no-suffix': serviceFilenameNoSuffix,
  'store-filename-no-suffix': storeFilenameNoSuffix,
  'feature-imports': featureImports,
  'views-suffix': viewsSuffix,
}
