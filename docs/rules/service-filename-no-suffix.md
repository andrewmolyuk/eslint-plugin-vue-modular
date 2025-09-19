# vue-modular/service-filename-no-suffix

Disallow the `Service` suffix in service filenames (for example `auth.ts`, not `authService.ts`).

Included in recommended config.

## Rule Details

This rule enforces concise service filenames for files placed under the configured service locations:

- `src/shared/services/` (cross-cutting services)
- `src/features/{feature}/services/` (feature-specific services)

The rule only runs for TypeScript files (the plugin uses the same `isTs` check as other filename rules). It reports when a file's basename ends with the `Service` suffix (case-insensitive) and suggests using a shorter name (for example `auth.ts`).

Why this rule

- Shorter filenames are easier to scan and keep naming consistent with other resource types (stores, composables, types).
- The suffix is redundant because the file location already implies the file is a service.

## Examples

### ✅ Valid

```text
src/shared/services/auth.ts
src/features/auth/services/token.ts
```

### ❌ Invalid

```text
src/shared/services/authService.ts
src/features/user/services/userService.ts
```

## Options

This rule accepts a single options object with the following properties:

- `suffix` (string, default: `'Service'`) — the suffix to forbid on filenames. The rule constructs a case-insensitive regular expression from this value and tests file basenames. Use this to forbid a different suffix (for example `'ServiceImpl'`).
- `ignores` (string[], default: `['**/*.d.ts', '**/*.spec.*', '**/*.test.*', '**/*.stories.*']`) — an array of glob patterns (minimatch) matched against the filename supplied by ESLint. Matching files are skipped.

Example configuration:

```js
// Use defaults (forbid 'Service' suffix)
{
 "vue-modular/service-filename-no-suffix": ["error"]
}

// Change suffix to 'ServiceModule' and ignore legacy files
{
 "vue-modular/service-filename-no-suffix": [
  "error",
  { "suffix": "ServiceModule", "ignores": ["**/legacy/**"] }
 ]
}
```

## Usage Notes

- The rule uses project settings for `rootPath`, `rootAlias`, `sharedPath`, and `featuresPath` to determine the file's normalized path. These settings are merged with plugin defaults and can be configured via `settings['vue-modular']` in your ESLint configuration.
- Ignore globs use `minimatch` semantics and should be written relative to the filename ESLint receives (which may be absolute or repo-relative depending on your lint invocation).

## When not to use

- If your project intentionally includes the `Service` suffix in filenames, do not enable this rule.
- During migrations where many legacy files retain the suffix, prefer adding ignore globs or disabling the rule temporarily.

## Further reading

- See the plugin's architecture guide for service location conventions: `docs/vue-modular-architecture.md`.
