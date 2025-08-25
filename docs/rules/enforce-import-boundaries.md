# enforce-import-boundaries

Enforce proper import paths based on the project modules/features blueprint. By default this rule prevents deep imports into other modules or features — imports between modules/features should go through the respective public API index files.

Options

- `src` (string) - source root (default: `src`)
- `modulesDir` (string) - modules folder name under `src` (default: `modules`)
- `featuresDir` (string) - features folder name under `src` (default: `features`)
- `aliases` (object) - path aliases map
- `allow` (array) - allow-list of import patterns
- `ignoreTypeImports` (boolean) - ignore TS type-only imports (default: true)

Examples

Valid

```js
import FooApi from 'src/modules/foo'
import SharedUtil from 'src/shared/util'
```

Invalid

```js
// deep import into another module
import thing from 'src/modules/bar/internal/thing'
```
