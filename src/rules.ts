import { appImports } from './rules/app-imports'
import { componentsIndexRequired } from './rules/components-index-required'
import { crossImportsAbsolute } from './rules/cross-imports-alias'
import { featureImports } from './rules/feature-imports'
import { featureIndexRequired } from './rules/feature-index-required'
import { fileComponentNaming } from './rules/file-component-naming'
import { fileTsNaming } from './rules/file-ts-naming'
import { folderKebabCase } from './rules/folder-kebab-case'
import { internalImportsRelative } from './rules/internal-imports-relative'
import { serviceFilenameNoSuffix } from './rules/service-filename-no-suffix'
import { sfcOrder } from './rules/sfc-order'
import { sfcRequired } from './rules/sfc-required'
import { sharedImports } from './rules/shared-imports'
import { sharedUiIndexRequired } from './rules/shared-ui-index-required'
import { storeFilenameNoSuffix } from './rules/store-filename-no-suffix'
import { storesLocation } from './rules/stores-location'
import { viewsSuffix } from './rules/views-suffix'
import { VueModularRuleModule } from './types'

export const rules: Record<string, VueModularRuleModule> = {
  'app-imports': appImports,
  'components-index-required': componentsIndexRequired,
  'cross-imports-alias': crossImportsAbsolute,
  'feature-imports': featureImports,
  'feature-index-required': featureIndexRequired,
  'file-component-naming': fileComponentNaming,
  'file-ts-naming': fileTsNaming,
  'folder-kebab-case': folderKebabCase,
  'internal-imports-relative': internalImportsRelative,
  'service-filename-no-suffix': serviceFilenameNoSuffix,
  'sfc-order': sfcOrder,
  'sfc-required': sfcRequired,
  'shared-imports': sharedImports,
  'shared-ui-index-required': sharedUiIndexRequired,
  'store-filename-no-suffix': storeFilenameNoSuffix,
  'stores-location': storesLocation,
  'views-suffix': viewsSuffix,
}
