# vue-modular/feature-imports-from-shared-only

Require that feature code imports only from the `shared/` layer (features must not import from other features).

## Rule Details

This rule flags imports originating from feature code that reference other features (for example `src/features/payments/utils/api.js`). Keeping cross-feature dependencies routed through the `shared/` layer reduces coupling and prevents consumers from depending on implementation details inside other features.

The rule inspects file paths containing the configured `features` segment (default: `src/features`). Import specifiers are resolved and analyzed; relative imports are resolved against the current file so `../../payments/...` correctly identifies the `payments` feature. Virtual filenames are ignored.

## Options

The rule accepts an options object with the following properties:

- `features` (string, default: `"src/features"`) — path segment used to detect the features root in file paths. If this segment is not present in the filename the rule ignores the file.
- `ignore` (string[], default: `[]`) — array of feature-name patterns to skip; patterns use `minimatch` semantics and are matched against the feature folder name (the single path segment after the features segment).

### Example configuration

```js
{
  "vue-modular/feature-imports-from-shared-only": ["error"]
}

// ignore legacy features while migrating
{
  "vue-modular/feature-imports-from-shared-only": ["error", { "ignore": ["legacy-*"] }]
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
import { paymentClient } from 'shared/services/paymentClient'
```

## When Not To Use

- Disable this rule during large migrations or if your architecture permits direct cross-feature imports.
