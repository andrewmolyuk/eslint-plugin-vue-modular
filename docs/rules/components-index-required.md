# vue-modular/components-index-required

Enforce a components folder index file (for example `features/<feature>/components/index.ts`) so component consumers import from the components root instead of deep-importing implementation files.

## Rule Details

This rule scans the project's source tree (starting at the configured project `rootPath`, default: `src`) for `components` directories and verifies they contain a public API file. A stable components index makes imports shorter, centralizes re-exports, and reduces accidental deep imports.

Default index filename: `index.ts`.

## Options

The rule accepts an options object with the following properties:

- `ignores` (string[], default: `[]`) — minimatch-style patterns matched against directory paths to skip certain folders from scanning.
- `index` (string, default: `"index.ts"`) — filename to look for as the components public API (for example `index.js` or `main.ts`).

Note: project-wide paths such as `rootPath` are read from plugin settings (`settings['vue-modular']`) and merged with defaults.

### Example configuration

```js
// Use defaults (scan project src tree, expect `index.ts` in each components folder)
{
  "vue-modular/components-index-required": ["error"]
}

// Custom configuration (override index filename or add ignores)
{
  "vue-modular/components-index-required": [
    "error",
    { "ignores": ["**/shared/**"], "index": "main.ts" }
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
- Use the `ignores` option or update project `rootPath` via `settings['vue-modular']` when your repository places component folders in non-standard locations (for example monorepos).

## When Not To Use

- Do not enable this rule if your project intentionally relies on deep imports or uses a different component export strategy.

## Further Reading

- Centralized re-exports and module boundaries help reduce coupling and improve refactorability.
