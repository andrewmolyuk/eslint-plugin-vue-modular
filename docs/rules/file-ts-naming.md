# vue-modular/file-ts-naming

Enforce camelCase filenames for TypeScript files (.ts and .tsx).

## Rule Details

This rule requires that TypeScript filenames use camelCase (for example `useAuth.ts` or `userApi.ts`) to keep utility/composable and API filenames consistent across a project.

By default the rule only applies to files under the `src` directory. It supports an `ignore` option with glob patterns to skip files or folders.

### Incorrect

```ts
// File: src/utils/UseAuth.ts
// Filename should be camelCase
export function useAuth() {}
```

```ts
// File: src/api/user_api.ts
export const fetchUsers = () => {}
```

### Correct

```ts
// File: src/utils/useAuth.ts
export function useAuth() {}
```

```ts
// File: src/api/userApi.ts
export const fetchUsers = () => {}
```

## Options

This rule accepts an object with the following properties:

- `src` (string, default: `"src"`) - base source directory to scope the rule. When set, files outside this directory are ignored.
- `ignore` (string[], default: `[]`) - array of glob patterns (minimatch) to ignore. Patterns are matched against both the absolute file path and the project-relative path.

Examples:

```js
// Use defaults (apply inside `src` only)
{
  "vue-modular/file-ts-naming": ["error"]
}

// Custom source directory and ignored patterns
{
  "vue-modular/file-ts-naming": ["error", { "src": "app", "ignore": ["**/tests/**", "**/*.spec.ts"] }]
}
```

## Usage Notes

- The rule only lints `.ts` and `.tsx` files.
- The `src` option is applied by checking whether the file path contains the configured segment (for example `src` or `app`). If the segment is not present the file is ignored.
- The `ignore` patterns use `minimatch` semantics and are matched against the absolute filename and the path relative to the repository root.

## When Not To Use

- If your project convention requires a different casing (for example `kebab-case` filenames) you should not enable this rule.
- If your build tooling rewrites or normalizes TypeScript filenames automatically, this rule may produce false positives.

## Further Reading

- JavaScript/TypeScript naming conventions and style guides.
