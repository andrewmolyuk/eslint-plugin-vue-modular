# vue-modular/store-filename-no-suffix

Disallow the `Store` suffix in store filenames (for example `auth.ts`, not `authStore.ts`).

## Rule details

This rule enforces concise store filenames for files placed under the configured store locations:

- `src/shared/stores/` (cross-cutting stores)
- `src/features/{feature}/stores/` (feature-specific stores)

The rule only runs for TypeScript files. It reports when a file's basename ends with the `Store` suffix (case-insensitive) and suggests using a shorter name (for example `auth.ts`).

Why this rule

- Shorter filenames are easier to scan and keep naming consistent with other resource types (services, composables, types).
- The suffix is redundant because the file location already implies the file is a store.

## Examples

### ✅ Valid

```text
src/shared/stores/auth.ts
src/features/auth/stores/token.ts
```

### ❌ Invalid

```text
src/shared/stores/authStore.ts
src/features/user/stores/userStore.ts
```

## Options

This rule accepts a single options object with the following properties:

- `suffix` (string, default: `'Store'`) — the suffix to forbid on filenames. The rule constructs a case-insensitive regular expression from this value and tests file basenames. Use this to forbid a different suffix (for example `'StoreModule'`).
- `ignores` (string[], default: `['**/*.d.ts', '**/*.spec.*', '**/*.test.*', '**/*.stories.*']`) — an array of glob patterns (minimatch) matched against the filename supplied by ESLint. Matching files are skipped.

Example configuration:

```js
// Use defaults (forbid 'Store' suffix)
{
 "vue-modular/store-filename-no-suffix": ["error"]
}

// Change suffix to 'StoreModule' and ignore legacy files
{
 "vue-modular/store-filename-no-suffix": [
  "error",
  { "suffix": "StoreModule", "ignores": ["**/legacy/**"] }
 ]
}
```

## Usage notes

- The rule uses project settings for `rootPath`, `rootAlias`, `sharedPath`, and `featuresPath` to determine the file's normalized path. These settings are merged with plugin defaults and can be configured via `settings['vue-modular']` in your ESLint configuration.
- Ignore globs use `minimatch` semantics and should be written relative to the filename ESLint receives (which may be absolute or repo-relative depending on your lint invocation).

## When not to use

- If your project intentionally includes the `Store` suffix in filenames, do not enable this rule.
- During migrations where many legacy files retain the suffix, prefer adding ignore globs or disabling the rule temporarily.

## Further reading

- See the plugin's architecture guide for store location conventions: `docs/vue-modular-architecture.md`.
