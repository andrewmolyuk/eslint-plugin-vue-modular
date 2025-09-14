# vue-modular/app-imports

Require that files under the configured application path (default: `src/app`) only
import from the `shared/` layer or from feature public APIs. This helps keep the
app shell focused on composition and prevents accidental dependencies on feature
internals.

## Rule Details

This rule flags import declarations that originate from files inside the
configured `appPath` and resolve into disallowed locations. The rule resolves
both the current filename and the import specifier to normalized project-
relative paths and reports when an import targets a non-shared, non-public
feature path.

The rule skips checks when the current filename cannot be resolved to a
project-relative path or when the filename matches an `ignores` pattern.
The router special-case is respected: `app/router.ts` may import feature route
files so the global router can be composed from feature routes.

How it works

- Resolve the current filename to a project-relative path. If the file is not
  inside `appPath` do nothing.
- For each import, resolve the import specifier to a normalized project-relative
  path. If resolution fails (external package, unresolved alias) skip the
  import.
- Allow imports that resolve inside `sharedPath`.
- Allow imports that resolve to a feature public API (feature root index file,
  e.g. `src/features/<feature>/index.ts`).
- Allow `app/router.ts` to import feature route files (for example
  `src/features/<feature>/routes.ts`).

## Options

The rule accepts an optional options object with the following properties:

- `ignores` (string[], default: `[]`) — minimatch patterns that skip files from
  rule checks when they match the resolved project-relative filename. Typical
  projects add patterns for test files, storybook files, or temporary folders
  (for example `['**/*.spec.*', '**/*.test.*', '**/*.stories.*']`).

Note: project-level settings control `rootPath`, `rootAlias`, `appPath`,
`sharedPath`, and `featuresPath`. Configure these via `settings['vue-modular']`.

### Example configuration

```js
{
  "vue-modular/app-imports": ["error"]
}

// skip app files in tests
{
  "vue-modular/app-imports": ["error", { "ignores": ["**/tests/**"] }]
}
```

## Examples

Incorrect (importing implementation from another layer):

```ts
// File: src/app/main.ts
import helper from '@/lib/some' // forbidden
```

Correct (import from shared or feature public API):

```ts
// File: src/app/main.ts
import helper from '@/shared/utils' // allowed
import routes from '@/features/auth/routes' // allowed (router exception)
```

## When Not To Use

- Disable this rule during large-scale refactors or when your architecture
  intentionally allows cross-layer imports.

## Implementation notes

- The rule reports with `messageId: 'forbiddenImport'` and includes `file`
  (project-relative filename) and `target` (import specifier) in the message
  data.
