# vue-modular/shared-ui-index-required

Require a `shared/ui` public API file (for example `src/shared/ui/index.ts`) so shared UI components are exported from a single, stable entry point.

## Rule Details

This rule verifies that the configured `shared` UI folder contains a public API file. A central entry file shortens imports, centralizes re-exports, and prevents consumers from deep-importing component implementation files.

By default the rule uses the project's `sharedPath` from plugin project options (default: `src/shared`) and looks for an index file inside the `ui` subfolder (for example `src/shared/ui/index.ts`). If the index file is missing while implementation files exist, the rule reports a problem.

Default index filename: `index.ts`.

## Options

The rule accepts an options object with the following properties:

- `ignores` (array of glob strings, default: `[]`) — paths to ignore when checking for the index file (supports minimatch patterns).
- `index` (string, default: `"index.ts"`) — filename to look for as the shared UI public API. Change this if your project uses a different entry filename (for example `main.ts`).

Note: project-level paths (for example `sharedPath`) are read from plugin settings (`settings['vue-modular']`) and merged with sensible defaults.

### Example configuration

```js
{
  "vue-modular/shared-ui-index-required": [
    "error",
  { "ignores": [], "index": "index.ts" }
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
- Use the `ignores` option or adjust project `sharedPath` when your repository layout differs (for example monorepos). The `ignores` option accepts minimatch globs.

## When Not To Use

- Do not enable this rule if your project intentionally relies on deep imports from `shared/ui` or uses a different export strategy.

## Further Reading

- Centralized re-exports and small public surfaces help reduce coupling and make refactors safer.
