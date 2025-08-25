# enforce-import-boundaries

Enforce import boundaries according to the project Layer Access Control Matrix (app, modules, features, composables, components, services, stores, entities, shared).

This rule prevents imports that break isolation between layers and enforces that cross-layer access uses public APIs (for modules/features that expose index files).

## Options

- `src` (string) - source root (default: `src`)
- `modulesDir` (string) - modules folder name under `src` (default: `modules`)
- `featuresDir` (string) - features folder name under `src` (default: `features`)
- `aliases` (object) - path aliases map (for example `{ "@": "src" }`)
- `allow` (array) - allow-list of import patterns (globs like `@/modules/allowed/*`)
- `ignoreTypeImports` (boolean) - ignore TypeScript type-only imports (default: true)

## Layer Access Control Matrix (summary)

Rules implemented by this lint rule (short):

- App (`src/app`): may import module/feature public APIs only (their `index.js`/`index.ts`). Direct imports into module/feature internals are forbidden.
- Modules (`src/modules/<name>`): isolated from other modules — importing other modules or their internals is forbidden.
- Features (`src/features/<name>`): isolated from other features — importing other features is forbidden. Features must not import modules directly.
- Composables / Components (`src/composables`, `src/components`): should not import app/modules/features internals — these are global-business layers and should stay framework-agnostic.
- Services (`src/services`): allowed to import other `services`, `stores`, `entities`, `shared`.
- Stores (`src/stores`): allowed to import other `stores`, `entities`, `shared`.
- Entities (`src/entities`): allowed to import `entities`, `shared` only.
- Shared (`src/shared`): must be self-contained; importing other layers is forbidden.

Detailed rules are enforced as follows (examples below):

## Message IDs

- `deepModuleImport` — importing a deep internal file from another module (forbid). Suggest importing the module public API instead.
- `deepFeatureImport` — importing a deep internal file from another feature (forbid).
- `appDeepImport` — app imported a module/feature internal file (app must import public API only).
- `moduleToModuleImport` — importing another module root/public API is forbidden (modules are isolated).
- `featureToFeatureImport` — importing another feature is forbidden (features are isolated).
- `featureToModuleImport` — feature code must not import modules directly.
- `layerImportAppForbidden` — importing into `app` from domain code is forbidden.
- `forbiddenLayerImport` — generic forbidden import between two layers, used for various matrix rules.

## Examples

Valid

```js
// importing module public API from app (allowed only via index)
import AuthModule from '@/modules/auth'

// shared utilities allowed anywhere
import format from '@/shared/formatters'
```

Invalid

```js
// deep import into another module internals → reports `deepModuleImport`
import thing from '@/modules/billing/internal/thing'

// app importing module internals → reports `appDeepImport`
import secret from '@/modules/billing/internal/secret'

// cross-feature import → reports `featureToFeatureImport`
import Toast from '@/features/notifications/components/Toast.vue'

// feature importing a module → reports `featureToModuleImport`
import ModuleApi from '@/modules/auth'
```

## Allow list and overrides

Use the `allow` option to whitelist specific import patterns when necessary. The rule respects path aliases configured via the `aliases` option (e.g., `{ "@": "src" }`).

## Notes and edge cases

- The rule ignores imports not starting with the configured `src` root, relative imports are resolved against the importer file.
- Type-only imports can be ignored by setting `ignoreTypeImports: true` (default).
- Test files may require special allowances. Use the `allow` option to whitelist `tests/**` or add ESLint override sections for test directories.
