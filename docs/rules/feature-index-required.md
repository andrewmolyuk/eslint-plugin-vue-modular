# vue-modular/feature-index-required

Require a public feature entry file (for example `src/features/<feature>/index.ts`) so consumers import from the feature root instead of deep-importing internal implementation files.

Included in recommended config.

## Rule Details

This rule verifies that each feature folder exposes a public API index file. Keeping a small, stable public surface at the feature root helps encapsulate implementation details and makes refactors safer.

The rule scans all directories in the configured features path (default: `src/features`) and reports any feature directory that is missing the required index file. The features path is configured via the project settings `featuresPath` option.

Default index filename: `index.ts`, but can be customized via the `index` option.

## Options

The rule accepts an options object with the following properties:

- `ignores` (string[], default: `[]`) — array of feature-name patterns to skip. Patterns are matched against the feature folder name using the plugin's ignore matching logic.
- `index` (string, default: `"index.ts"`) — filename to look for as the feature public API. Use this to change the expected index file name (for example `index.js` or `main.ts`). The rule checks for this exact filename at the feature root.

Note: The features path is configured via the project-wide `featuresPath` setting (default: `"src/features"`), not per-rule options.

### Example configuration

```js
// Use defaults (scan `src/features` for `index.ts` files)
{
  "vue-modular/feature-index-required": ["error"]
}

// Custom ignores and index filename
{
  "vue-modular/feature-index-required": [
    "error",
    { "ignores": ["shared-.*", "legacy"], "index": "main.ts" }
  ]
}

// Configure features path via project settings
{
  "settings": {
    "vue-modular": {
      "featuresPath": "app/features"
    }
  },
  "rules": {
    "vue-modular/feature-index-required": ["error"]
  }
}
```

## Examples

### Default index (index.ts)

Incorrect (feature has directory but no `index.ts`):

```text
src/features/auth/components/LoginForm.vue
src/features/auth/composables/useAuth.ts
// Missing: src/features/auth/index.ts
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
src/features/auth/components/LoginForm.vue
src/features/auth/composables/useAuth.ts
// Missing: src/features/auth/main.ts (rule expects 'main.ts')
```

Correct (provide `main.ts` at feature root):

```ts
// File: src/features/auth/main.ts
export * from './components'
export * from './composables'
```

### Using ignores

To skip certain feature directories from this rule:

```js
{
  "vue-modular/feature-index-required": [
    "error",
    { "ignores": ["shared", "legacy-*"] }
  ]
}
```

This would skip checking for index files in `src/features/shared/` and any feature starting with `legacy-`.

## Usage Notes

- The rule executes a single scan per ESLint process (the plugin `runOnce` pattern) to avoid duplicate reports when linting multiple files.
- The rule scans the filesystem directly and reports missing index files for all feature directories found in the features path.
- The `ignores` option is matched against the feature folder name only (not the whole path).
- The features path can be customized via the project-wide `featuresPath` setting in ESLint settings.
- The rule gracefully handles filesystem errors and will not crash if the features directory doesn't exist.

## When Not To Use

- Do not enable this rule if your project intentionally relies on deep imports or follows a different public API strategy for features.
- Skip this rule if you don't use a features-based architecture.

## Further Reading

- Modular design: prefer small public surfaces for modules/features to improve encapsulation and simplify refactors.
