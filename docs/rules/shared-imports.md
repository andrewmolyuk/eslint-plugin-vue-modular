# vue-modular/shared-imports

Prevent files inside the `shared/` layer from importing implementation from `features/` (or `views`) folders.

Included in recommended config.

## Rule Details

This rule flags imports and re-exports found in files under the configured shared path (default: `src/shared`) when the resolved import points into a feature implementation or a `views` folder. The goal is to keep `shared/` code layer-agnostic and avoid coupling shared utilities to feature internals.

How it works

- The rule resolves the current filename to a project-relative path using the plugin project options (for example `src/shared/lib/util.ts`). If the file is not inside the configured `shared` path the rule does nothing.
- For each import or `export * from '...'` it resolves the target import to a normalized project-relative path. If the resolved path cannot be normalized (external packages, unresolved paths) the import is ignored.
- If the resolved path is inside the configured `shared` path the import is allowed (this covers local relative imports inside shared).
- If the resolved path is inside the configured `features` path or appears to target a `views` folder (by matching the configured `viewsFolderName` segment), the import is reported.

## Options

The rule accepts an options object with the following properties:

- `ignores` (string[], default: `[]`) — array of glob patterns (minimatch) that are tested against the resolved project-relative filename. If any pattern matches the filename the rule is skipped for that file. Use this to exempt legacy shared code or generated artifacts.

Note: project-level settings control `rootPath`, `rootAlias`, `featuresPath`, `sharedPath`, and `viewsFolderName` used by the rule; those defaults are provided by the plugin and can be overridden via rule settings if needed.

### Example configuration

```js
{
  "vue-modular/shared-imports": ["error"]
}

// ignore special files inside shared
{
  "vue-modular/shared-imports": ["error", { "ignores": ["src/shared/legacy/**"] }]
}
```

## Examples

Incorrect (shared imports feature implementation):

```text
// File: src/shared/lib/util.ts
import { doSomething } from '@/features/payments/internal'
```

Correct (use shared public APIs only):

```ts
// File: src/shared/lib/util.ts
import { paymentClient } from 'src/shared/services/paymentClient'
```

Correct (local relative import inside shared is allowed):

```ts
// File: src/shared/lib/util.ts
import helper from './helper'
```

## When Not To Use

- If your architecture deliberately allows shared code to depend on specific feature internals, disable this rule.
- During large migrations or refactors where temporary exceptions are needed, consider disabling this rule until the work is complete.
