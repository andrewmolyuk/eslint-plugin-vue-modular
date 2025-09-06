# Utility Functions

// Files
isComponent(filename: string) => boolean
isStore(filename: string) => boolean
isService(filename: string) => boolean
isComposable(filename: string) => boolean
isView(filename: string, view: string) => boolean
isIndex(filename: string, index: string) => boolean
isLayout(filename: string, app: string, layout: string) => boolean
isSFC(filename: string) => boolean
isIgnored(filename: string, ignorePatterns: string[]) => boolean

// Location
isInApp(filename: string, app: string) => boolean
isInFeature(filename: string, feature: string) => boolean
isInShared(filename: string, shared: string) => boolean
isOutsideSrc(filename: string, src: string) => boolean

// Imports
getImports(filename: string) => string[]
isAliasImport(filename: string) => boolean
isRelativeImport(filename: string) => boolean
getImportDepth(from: string, to: string) => number
resolveImportPath(from: string, to: string) => string

// Exports
getExports(filename: string) => { named: string[], hasDefault: boolean }

// Filesystem and paths
listFilesRecursive(dir: string, exts: string[]) => string[]
listFiles(dir: string, ext: string[]) => string[]
listDirs(dir: string) => string[]
getFileContent(filename: string) => string
resolvePath(path: string) => string

// Rules
parseRuleOptions(context: Object, defaultOptions: Object) => Object
runOnce(ruleId: string) => boolean

// Strings
toCamelCase(name: string) => string
toKebabCase(name: string) => string
toPascalCase(name: string) => string

// SFC
parseSFC(content: string) => { script?: string, template?: string, styles?: string[] }
