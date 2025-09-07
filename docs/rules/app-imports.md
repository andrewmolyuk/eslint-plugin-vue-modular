# vue-modular/app-imports

Prevent `app/` code from depending on implementation details in other layers.

## Rule Details

Files under the configured `app` segment should only import from the
`shared/` layer and from a feature's public API (for example
`src/features/payments`). Deep imports into a feature (for example
`src/features/payments/components/button`) are flagged because application code
should depend on the feature's public surface rather than internal
implementation.

There is one explicit exception: `app/router.ts` (or `app/router.js`) may
import feature route files (paths that include a `routes` segment) so the
application router can compose feature routes.

Import specifiers are resolved against the linted file, so relative imports
like `../features/payments/...` are interpreted correctly. Virtual filenames are ignored to avoid false positives.

## Options

The rule accepts an options object with the following properties:

- `app` (string, default: `"src/app"`) — path segment used to detect the app
  root in file paths.
- `shared` (string, default: `"src/shared"`) — path segment used for shared
  code.
- `features` (string, default: `"src/features"`) — path segment used for
  features.
- `ignore` (string[], default: `[]`) — array of feature-name patterns to skip;
  patterns use `minimatch` semantics and are matched against the single path
  segment after the `features` segment.

### Example configuration

```js
{
  "vue-modular/app-imports": ["error"]
}

// Allow the payments feature to be ignored during a migration
{
  "vue-modular/app-imports": ["error", { "ignore": ["payments"] }]
}
```

## Examples

Incorrect (deep import from a feature):

```text
// File: src/app/main.js
import button from 'src/features/payments/components/button'
```

Incorrect (import from unrelated internal layer):

```text
// File: src/app/main.js
import helper from 'src/utils/helper'
```

Correct (import shared code or feature public API):

```js
// File: src/app/main.js
import sharedLib from 'src/shared/lib'
import payments from 'src/features/payments'
```

Correct (router exception):

```js
// File: src/app/router.ts
import paymentsRoutes from 'src/features/payments/routes'
```

## Notes

- Relative import specifiers are resolved against the linted file so `..`
  segments map to the filesystem path.
- Virtual filenames are ignored to reduce noise.
- Use the `ignore` option to whitelist specific feature names during
  migrations.

## When Not To Use

- Disable this rule if your application intentionally relies on deep feature
  imports or other cross-layer dependencies, or during large refactors where
  temporary exceptions are required.
