# vue-modular/feature-index-required

Require a public feature entry file (for example `src/features/<feature>/index.ts`) so consumers import from the feature root instead of deep-importing internal implementation files.

## Rule Details

This rule verifies that each feature folder exposes a public API index file. Keeping a small, stable public surface at the feature root helps encapsulate implementation details and makes refactors safer.

By default the rule applies when the linted file path contains the configured `features` segment (default: `src/features`). If a feature contains implementation files but no supported index file exists, the rule reports a problem.

Default index filename: `index.ts`, rule still accepts any filename via the `index` option.

## Options

The rule accepts an options object with the following properties:

- `features` (string, default: `"src/features"`) — path segment used to detect the features root in file paths. If this segment is not present in the filename the rule ignores the file.
- `ignore` (string[], default: `[]`) — array of feature-name patterns to skip. Patterns use `minimatch` semantics and are matched against the feature folder name (the single path segment after the features segment).
- `index` (string, default: `"index.ts"`) — filename to look for as the feature public API. Use this to change the expected index file name (for example `index.js` or `main.ts`). The rule checks for this exact filename at the feature root.

### Example configuration

```js
// Use defaults (scan `src/features` and no ignores)
{
  "vue-modular/feature-index-required": ["error"]
}

// Custom features folder and ignores
{
  "vue-modular/feature-index-required": [
    "error",
    { "features": "app/features", "ignore": ["shared-.*", "legacy"], "index": "main.ts" }
  ]
}
```

## Examples

### Default index (index.ts)

Incorrect (feature has files but no `index.ts`):

```text
// File: src/features/auth/components/LoginForm.vue
// There is no src/features/auth/index.ts
```

Correct (add `index.ts` at feature root):

```ts
// File: src/features/auth/index.ts
export * from './components'
export * from './composables'
```

### Custom index filename (main.ts)

If your project uses a different entry filename, configure `index` accordingly.

Incorrect (rule configured with `index: 'main.ts'` but `main.ts` is missing):

```text
// File: app/features/auth/components/LoginForm.vue
// There is no app/features/auth/main.ts (rule expects 'main.ts')
```

Correct (provide `main.ts` at feature root):

```ts
// File: app/features/auth/main.ts
export * from './components'
export * from './composables'
```

## Usage Notes

- The rule executes a single scan per ESLint process (the plugin `runOnce` pattern) to avoid duplicate reports when linting multiple files.
- The rule only reports when the inspected feature directory contains implementation files other than the configured index; empty folders or features fully covered by `ignore` are not reported.
- The `ignore` option is matched against the feature folder name only (not the whole path) and uses `minimatch` semantics.
- In monorepos or non-standard layouts, set the `features` option to an appropriate segment (for example `packages/*/src/features` or `app/features`) to avoid false positives.

## When Not To Use

- Do not enable this rule if your project intentionally relies on deep imports or follows a different public API strategy for features.

## Further Reading

- Modular design: prefer small public surfaces for modules/features to improve encapsulation and simplify refactors.
