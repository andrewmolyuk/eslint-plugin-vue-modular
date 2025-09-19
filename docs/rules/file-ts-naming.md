# vue-modular/file-ts-naming

Enforce camelCase filenames for TypeScript files (.ts and .tsx).

Included in recommended config.

## Rule Details

This rule requires that TypeScript filenames use camelCase (for example `useAuth.ts` or `userApi.ts`) to keep filenames consistent across a project.

The rule runs on `.ts` and `.tsx` files. By default it ignores common generated/test file patterns (see defaults below).

### Incorrect

```ts
// File: src/utils/UseAuth.ts
// Filename should be camelCase
function useAuth() {}
```

```ts
// File: src/api/user_api.ts
const fetchUsers = () => {}
```

### Correct

```ts
// File: src/utils/useAuth.ts
function useAuth() {}
```

```ts
// File: src/api/userApi.ts
const fetchUsers = () => {}
```

## Options

This rule accepts a single object (optional) with the following properties:

- `ignores` (string[], default: `['**/*.d.ts', '**/*.spec.*', '**/*.test.*', '**/*.stories.*']`) - array of glob patterns (minimatch) to ignore. Patterns are matched against the filename provided by ESLint (typically an absolute path or a path relative to the project) and will prevent the rule from running for matching files.

Examples:

```js
// Use defaults
{
  "vue-modular/file-ts-naming": ["error"]
}

// Custom ignored patterns
{
  "vue-modular/file-ts-naming": ["error", { "ignores": ["**/tests/**", "**/*.spec.ts"] }]
}
```

## Usage Notes

- The rule only lints `.ts` and `.tsx` files.
- Ignore patterns use `minimatch` semantics and are matched against the filename that ESLint supplies to the rule (so they should work with absolute or repo-relative paths depending on how ESLint is invoked).

## When Not To Use

- If your project convention requires a different casing (for example `kebab-case` filenames) you should not enable this rule.
- If your build tooling rewrites or normalizes TypeScript filenames automatically, this rule may produce false positives.

## Further Reading

- JavaScript/TypeScript naming conventions and style guides.
