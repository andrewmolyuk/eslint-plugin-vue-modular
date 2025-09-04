# vue-modular/components-index-required

Enforce a components folder index file (for example `features/<feature>/components/index.ts`) so component consumers import from the components root instead of deep-importing implementation files.

## Rule Details

This rule verifies that a `components` directory inside a feature (or any configured segment) exposes a public API file. A stable components index makes imports shorter, centralizes re-exports, and reduces accidental deep imports.

Default index filename: `index.ts`.

## Options

The rule accepts an options object with the following properties:

- `components` (string, default: `"components"`) — the path segment used to locate component directories under a feature.
- `ignore` (string[], default: `[]`) — minimatch-style patterns matched against the parent folder name to skip certain features.
- `index` (string, default: `"index.ts"`) — filename to look for as the components public API (for example `index.js` or `main.ts`).

### Example configuration

```js
// Use defaults (scan `components`, expect `index.ts`)
{
  "vue-modular/components-index-required": ["error"]
}

// Custom configuration
{
  "vue-modular/components-index-required": [
    "error",
    { "components": "components", "ignore": ["shared"], "index": "main.ts" }
  ]
}
```

## Incorrect

```text
// File: src/features/auth/components/Button.vue
// There is no src/features/auth/components/index.ts
```

## Correct

```ts
// File: src/features/auth/components/index.ts
export { default as Button } from './Button.vue'
export { default as Icon } from './Icon.vue'
```

## Usage Notes

- The rule executes a single scan per ESLint process using the plugin's `runOnce` utility — this avoids duplicate reports when linting many files.
- The `ignore` option matches against the feature (parent) folder name and uses `minimatch` semantics.
- If your repository places component folders at non-standard locations, change the `components` option (for example `shared/components` or `app/components`).

## When Not To Use

- Do not enable this rule if your project intentionally relies on deep imports or uses a different component export strategy.

## Further Reading

- Centralized re-exports and module boundaries help reduce coupling and improve refactorability.
