# vue-modular/no-shared-imports-from-features

Prevent `shared/` code from importing implementation from `features/` or `views/`.

## Rule Details

Shared code should be infrastructure- or design-system-level code that does not depend on feature implementations or view-specific modules. This rule flags import statements in files under the configured `shared` segment that reference `features/` or `views/` paths (for example `src/features/payments/...` or `src/views/Home/...`).

By default the rule inspects filenames that include `src/shared`. Relative import specifiers are resolved against the current file so `../../features/payments/...` is correctly recognized. Virtual filenames are ignored by the rule.

## Options

The rule accepts an options object with the following properties:

- `shared` (string, default: `"src/shared"`) — path segment used to detect the shared root in file paths.
- `features` (string, default: `"src/features"`) — path segment for features to detect feature imports.
- `views` (string, default: `"src/views"`) — path segment for views to detect view imports.
- `ignore` (string[], default: `[]`) — array of feature/view-name patterns to skip; patterns use `minimatch` semantics and are matched against the single path segment after the `features` or `views` segment.

### Example configuration

```js
{
  "vue-modular/no-shared-imports-from-features": ["error"]
}

// Ignore payments feature while migrating
{
  "vue-modular/no-shared-imports-from-features": ["error", { "ignore": ["payments"] }]
}
```

## Examples

Incorrect (shared importing a feature implementation):

```text
// File: src/shared/utils/index.js
import { charge } from '../../features/payments/utils/api.js'
```

Correct (shared imports only from other shared modules):

```js
// File: src/shared/utils/index.js
import { apiClient } from '../services/apiClient'
```

## Usage Notes

- The rule resolves relative import paths against the linted file to correctly map `..` segments to absolute filesystem paths.
- Virtual filenames are ignored to avoid false positives.
- Use the `ignore` option to whitelist specific feature or view names during migrations.

## When Not To Use

- Disable this rule in projects where `shared/` intentionally depends on feature or view code (rare) or during large migrations where temporary exceptions are needed.
