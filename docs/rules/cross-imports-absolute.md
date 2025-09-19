````markdown
# vue-modular/cross-imports-absolute

Enforce that cross-layer imports (between features or from features to shared) must use the project root alias (e.g. `@/`) instead of non-aliased absolute paths or relative paths that cross architectural boundaries.

## Rule Details

This rule flags import declarations that reference other parts of the project using non-aliased absolute paths (like `src/features/...` or `/features/...`) or relative paths that traverse outside the current architectural layer. Cross-layer imports should use the configured root alias to maintain consistency and prevent coupling to internal directory structures.

The rule allows relative imports within the same architectural layer (same feature, within shared, or within app) but requires alias imports when crossing these boundaries.

How it works

- Resolve the current filename to a project-relative path using the plugin project options.
- For each import, resolve the import specifier to a normalized project-relative path. If resolution fails (external package, unresolved alias) skip the import.
- Determine the architectural layers of both the source file and target import (app, feature, shared).
- Allow imports within the same layer:
  - Same feature: files within the same feature subdirectory can use relative imports
  - Within shared: files in shared can import other shared files
  - Within app: files in app can import other app files
- For cross-layer imports, require that the import uses the configured root alias (e.g. `@/shared/utils` instead of `src/shared/utils` or `../../shared/utils`).

## Options

The rule accepts an optional options object with the following properties:

- `ignores` (string[], default: `[]`) — minimatch patterns that skip files from rule checks when they match the resolved project-relative filename. Use this to exempt specific files or directories from the alias requirement.

Note: project-level settings control `rootPath`, `rootAlias`, `appPath`, `featuresPath`, and `sharedPath` used by the rule. Configure these via `settings['vue-modular']`.

### Example configuration

```js
{
  "vue-modular/cross-imports-absolute": ["error"]
}

// ignore specific legacy files
{
  "vue-modular/cross-imports-absolute": ["error", { "ignores": ["src/legacy/**"] }]
}
```

## Examples

Incorrect (non-aliased cross-layer imports):

```ts
// File: src/features/auth/components/LoginForm.vue
import { util } from 'src/shared/utils' // should use alias
import { charge } from '/features/payments/utils/api' // should use alias
import svc from '../../../shared/services/api' // should use alias
```

```ts
// File: src/app/main.ts
import authRoutes from '../features/auth/routes' // should use alias
```

Correct (use alias for cross-layer, relative within same layer):

```ts
// File: src/features/auth/components/LoginForm.vue
import { util } from '@/shared/utils' // correct alias usage
import helper from '../utils/helper' // correct relative within same feature
import { config } from '@/features/auth/config' // correct alias for same feature
```

```ts
// File: src/app/main.ts
import authRoutes from '@/features/auth/routes' // correct alias usage
import layout from './layouts/MainLayout' // correct relative within app
```

```ts
// File: src/shared/components/Button.vue
import { theme } from '../utils/theme' // correct relative within shared
import { config } from '@/shared/config' // correct alias within shared
```

## When Not To Use

- Disable this rule if your project intentionally allows non-aliased absolute imports or doesn't enforce consistent import styles across architectural layers.
- Consider disabling during large refactoring efforts where maintaining import consistency is less important than completing the migration.

## Implementation notes

- The rule reports with `messageId: 'useAlias'` and includes `file` (project-relative filename), `target` (import specifier), and `alias` (configured root alias) in the message data.
- Empty import strings are handled gracefully as a defensive measure against malformed AST nodes.
````
