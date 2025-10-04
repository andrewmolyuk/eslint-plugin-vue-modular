import type { VueModularProjectOptions } from './types'

// Default project options
export const defaultProjectOptions: VueModularProjectOptions = {
  rootPath: 'src',
  rootAlias: '@',
  appPath: 'src/app',
  layoutsPath: 'src/app/layouts',
  featuresPath: 'src/features',
  sharedPath: 'src/shared',
  componentsFolderName: 'components',
  viewsFolderName: 'views',
  storesFolderName: 'stores',
  uiFolderName: 'ui',
}
