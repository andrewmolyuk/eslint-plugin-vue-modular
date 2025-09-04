# vue-modular/shared-ui-index-required

Require a `shared/ui` public API file (for example `shared/ui/index.ts`) so shared UI components are exported from a single, stable entry point.

## Rule Details

This rule verifies that a `shared/ui` directory contains a public API file. A central entry file shortens imports, centralizes re-exports, and prevents consumers from deep-importing component implementation files.

The rule only inspects files whose path contains the configured `shared` segment (default: `shared`). If a `shared/ui` folder contains implementation files but the configured index file is missing, the rule reports a problem.

Default index filename: `index.ts`.

## Options

The rule accepts an options object with the following properties:

- `shared` (string, default: `"shared"`) — path segment used to locate the shared folder in file paths.
- `index` (string, default: `"index.ts"`) — filename to look for as the shared UI public API. Change this if your project uses a different entry filename (for example `main.ts`).

### Example configuration

```js
{
  "vue-modular/shared-ui-index-required": [
    "error",
    { "shared": "shared", "index": "index.ts" }
  ]
}
```

## Examples

Incorrect

```text
// File: src/shared/ui/Button.vue
// There is no src/shared/ui/index.ts
```

Correct

```ts
// File: src/shared/ui/index.ts
export { default as Button } from './Button.vue'
```

## Usage Notes

- The rule uses the plugin `runOnce` pattern to emit a single report per ESLint process, avoiding duplicate reports when linting many files.
- In monorepos or non-standard layouts, set the `shared` option to the appropriate path segment (for example `packages/*/shared`) to avoid false positives.

## When Not To Use

- Do not enable this rule if your project intentionally relies on deep imports from `shared/ui` or uses a different export strategy.

## Further Reading

- Centralized re-exports and small public surfaces help reduce coupling and make refactors safer.
