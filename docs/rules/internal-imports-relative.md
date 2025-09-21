# vue-modular/internal-imports-relative

Enforce that imports between nearby files inside the same feature (or within the shared/app folders) use relative paths instead of the project root alias (e.g. `@/`). This keeps internal feature wiring local and avoids coupling through the root alias for nearby imports.

Not included in recommended config.

## Rule Details

This rule flags import declarations that use the configured project root alias (default `@`) when the import target is within the same feature (same feature segment under `src/features`) or otherwise a nearby file inside the same architectural area (e.g. both files inside `src/shared` or `src/app`). In these cases prefer relative imports (like `./foo` or `../bar`) to make the dependency clearly local and easier to refactor.

How it works

- The rule resolves the current filename to a project-relative path using the plugin project options (for example `src/features/auth/components/Login.vue`). If the filename cannot be resolved (outside project root), the rule does nothing.
- For each import it resolves the import specifier to a normalized project-relative path. If the resolved path cannot be normalized (external packages, unresolved imports), the rule skips that import to avoid false positives.
- The rule determines the architectural areas of both the source file and the target (app, feature, shared). It allows:
  - Relative imports within the same feature (same segment under `src/features`).
  - Imports within shared or app when both sides are inside the same `shared` or `app` folders.
- If both source and target are within the project areas of interest but the import uses the project root alias (e.g. `@/features/...` or `@/shared/...`), the rule reports and recommends using a relative import instead.

Behavior details (new/important):

- depth control: the rule accepts a `depth` option (default: `2`) which defines how many `/` segments are allowed for relative imports before the rule suggests switching to the alias. In other words:
  - Short relative imports (up to the configured `depth`) are preferred for clearly-local dependencies.
  - Long/deep relative imports that exceed `depth` are considered "distant" and the rule will recommend using the project root alias (message id `useAliasImport`).

- Two message types are emitted by the rule:
  - `useRelativeImport` — the import uses the project root alias but the target is local (same feature/shared/app); recommend changing to a relative import.
  - `useAliasImport` — the import is a relative path that exceeds the configured `depth`; recommend changing to the project root alias for clarity.

- Alias exceptions: certain alias imports remain allowed (no report)
  - Alias imports between different features (for example `@/features/featureA/...` importing `@/features/featureB/...`) are permitted.
  - Alias imports from `app` files to targets outside `app` (and similarly from `shared` to outside `shared`) are permitted to avoid spurious reports when crossing architectural areas.

- Path normalization for monorepo / nested-app layouts: filenames like `apps/web/src/...` are normalized to the configured `rootPath` (for example `src/...`) before rule logic is applied. That means files under `apps/web/src` are treated the same as `src` files for the purposes of this rule.

## Options

The rule accepts an options object with the following properties:

- `ignores` (string[], default: `[]`) — array of minimatch glob patterns tested against the resolved project-relative filename. If any pattern matches, the rule will skip that file. Use this to permit exceptions during migration or for generated files.

- `depth` (number, default: `2`) — maximum number of `/` segments allowed for a relative import before the rule recommends switching to the project root alias. Increase this value if your feature layout commonly requires deeper relative traversals and you want to prefer relative imports more often.

Note: project-level settings control `rootPath`, `rootAlias`, `appPath`, `featuresPath`, and `sharedPath` used by the rule; those defaults are provided by the plugin and can be overridden via settings.

### Example configuration

```js
{
  "vue-modular/internal-imports-relative": ["error"]
}

// ignore legacy features while migrating
{
  "vue-modular/internal-imports-relative": ["error", { "ignores": ["src/features/legacy-*/**"] }]
}
```

## Examples

Incorrect (using alias inside same feature):

```ts
// File: src/features/auth/components/LoginForm.vue
import helper from '@/features/auth/utils/helper'
```

Correct (use a relative import for local feature files):

```ts
// File: src/features/auth/components/LoginForm.vue
import helper from '../utils/helper'
```

Incorrect (use alias inside shared when the target is nearby in shared):

```ts
// File: src/shared/components/Button.vue
import { theme } from '@/shared/utils/theme'
```

Correct:
Incorrect (relative import is too deep; prefer alias):

```ts
// File: src/features/auth/components/very/deep/path/File.vue
import helper from '../../../utils/helper' // many ../ segments
```

Correct (use alias when relative traversal is deep):

```ts
// File: src/features/auth/components/very/deep/path/File.vue
import helper from '@/features/auth/utils/helper'
```

Notes:

- The rule will still allow alias imports when crossing feature boundaries or when the import target is outside the same architectural area (see "Alias exceptions" above).
- Files that cannot be resolved to the project root (for example external scripts) are ignored; use the `ignores` option for explicit exceptions.

```ts
// File: src/shared/components/Button.vue
import { theme } from '../utils/theme'
```

## When Not To Use

- If your team prefers always using the root alias for consistency across the codebase, disable this rule.
- Consider disabling this rule during large refactors or migrations where import style consistency is secondary to completing the change.
