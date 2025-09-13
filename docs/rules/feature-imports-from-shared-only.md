# vue-modular/feature-imports-from-shared-only

Require that feature code imports only from the `shared/` layer (features must not import from other features).

## Rule Details

This rule flags imports originating from files under the configured features root (default: `src/features`) that resolve into a different feature. Keeping cross-feature dependencies routed through the `shared/` layer reduces coupling and prevents consumers from depending on implementation details inside other features.

How it works

- The rule first resolves the current filename to a project-relative path using the plugin project options (for example `src/features/auth/components/Login.vue`). If the file is not inside the configured `features` path the rule does nothing.

- For each import it calls the project's import resolver and then normalizes the resolved path back to a project-relative string. If the resolved path cannot be normalized the rule skips that import (this avoids false positives for unresolved or external packages).

- An import is allowed when the resolved, normalized path is inside the configured `shared` path (default: `src/shared`) or inside the same feature folder (same segment directly under the features root). Any other resolved path that points into another feature is reported.

## Options

The rule accepts an options object with the following properties:

- `ignores` (string[], default: `[]`) — array of glob patterns (minimatch) that are tested against the resolved project-relative filename. If any pattern matches the filename the rule is skipped for that file. Use this to temporarily exempt legacy features or generated files.

Note: project-level settings control `rootPath`, `rootAlias`, `featuresPath`, and `sharedPath` used by the rule; those defaults are provided by the plugin and can be overridden via rule settings if needed.

### Example configuration

```js
{
  "vue-modular/feature-imports-from-shared-only": ["error"]
}

// ignore legacy features while migrating
{
  "vue-modular/feature-imports-from-shared-only": ["error", { "ignores": ["src/features/legacy-*/**"] }]
}
```

## Examples

Incorrect (feature imports another feature):

```text
// File: src/features/auth/components/LoginForm.vue
import { charge } from '../../payments/utils/api.js'
```

Correct (use shared layer or feature's own public API only):

```ts
// File: src/features/auth/components/LoginForm.vue
import { paymentClient } from 'src/shared/services/paymentClient'
```

## When Not To Use

- Disable this rule during large migrations or if your architecture permits direct cross-feature imports.
