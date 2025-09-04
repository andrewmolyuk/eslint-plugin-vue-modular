# vue-modular/no-direct-feature-imports

Disallow direct imports between feature folders. Cross-feature communication should go through the feature public API or the `shared/` layer to preserve encapsulation.

## Rule Details

This rule detects imports that reference another feature's implementation files directly (for example `src/features/payments/utils/api.js`) from inside a different feature. Direct cross-feature imports increase coupling and make refactors harder because consumers can depend on internal implementation details.

By default the rule considers file paths that contain the configured `features` segment (default: `src/features`) as feature sources to inspect. Import specifiers are resolved and analyzed; relative imports are resolved against the current file so `../../payments/...` correctly identifies the `payments` feature.

The rule ignores virtual filenames (`<input>`, `<text>`) and test files (files matched by the project's test detection utility). It also accepts an `ignore` option to skip reporting for specific target feature names.

## Options

The rule accepts an options object with the following properties:

- `features` (string, default: `"src/features"`) — path segment used to detect the features root in file paths. If this segment is not present in the filename the rule ignores the file.
- `ignore` (string[], default: `[]`) — array of feature-name patterns to skip. Patterns use `minimatch` semantics and are matched against the feature folder name (the single path segment after the features segment).

### Example configuration

```js
// Use defaults (scan `src/features` and no ignores)
{
  "vue-modular/no-direct-feature-imports": ["error"]
}

// Ignore a legacy feature
{
  "vue-modular/no-direct-feature-imports": [
    "error",
    { "features": "app/features", "ignore": ["legacy", "payments-stub"] }
  ]
}
```

## Examples

Incorrect (direct import from another feature):

```text
// File: src/features/auth/components/LoginForm.vue
import { charge } from '../../payments/utils/api.js' // -> imports implementation from another feature
```

Correct (use feature public API or shared layer):

```ts
// File: src/features/auth/components/LoginForm.vue
import { charge } from 'features/payments' // public API at src/features/payments/index.ts
// or
import { charge } from 'shared/services/paymentClient' // shared layer
```

## Notes

- The rule resolves relative import paths against the linted file to correctly map `..` segments to absolute filesystem paths.
- Test files and virtual filenames are ignored to avoid false positives during tests and non-file sources.
- Use the `ignore` option to whitelist feature names that should not be reported.

## When Not To Use

- Disable this rule if your project intentionally allows deep cross-feature imports or during migration phases where you need temporary exceptions.
