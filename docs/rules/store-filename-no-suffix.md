# vue-modular/store-filename-no-suffix

Disallow a configurable suffix (for example `-store` or `Store`) on TypeScript filenames under `src`.

## Rule Details

This rule flags TypeScript filenames that include a configured suffix at the end of the basename. It's useful to keep filenames concise and consistent (for example prefer `user.ts` over `user-store.ts`). The rule only applies to `.ts` and `.tsx` files by default.

By default the rule applies to files under the `src` directory. It supports an `ignore` option with glob patterns to skip files or folders.

### Incorrect

```ts
// File: src/features/f/stores/user-store.ts
export const getUser = () => {}
```

```ts
// File: src/features/f/stores/authStore.ts
export const login = () => {}
```

### Correct

```ts
// File: src/features/f/stores/user.ts
export const getUser = () => {}
```

```ts
// File: src/features/f/stores/auth.ts
export const login = () => {}
```

## Options

This rule accepts an object with the following properties:

- `src` (string, default: `"src"`) - base source directory to scope the rule. Files outside this directory are ignored.
- `ignore` (string[], default: `[]`) - array of glob patterns (minimatch) to ignore. Patterns are matched against both the absolute file path and the project-relative path.
- `suffix` (string, default: `"Store"`) - the suffix to disallow. The check is a simple string-suffix match against the filename (not the extension).

Examples:

```js
// Use defaults (disallow trailing "Store" in src)
{
  "vue-modular/store-filename-no-suffix": ["error"]
}

// Custom suffix and ignored patterns
{
  "vue-modular/store-filename-no-suffix": ["error", { "src": "app", "ignore": ["**/tests/**", "**/*.spec.ts"], "suffix": "-store" }]
}
```

## Usage Notes

- The rule only lints `.ts` and `.tsx` files.
- The `suffix` option is matched against the filename (basename without extension). It is a plain string match (case-sensitive).
- The `src` option is applied by checking whether the file path contains the configured segment (for example `src` or `app`). If the segment is not present the file is ignored.
- The `ignore` patterns use `minimatch` semantics and are matched against the absolute filename and the path relative to the repository root.

## When Not To Use

- If your project naming convention intentionally uses descriptive suffixes on filenames (for example `user-store.ts`), do not enable this rule.
- If your build tooling enforces or rewrites filenames, the rule may produce false positives.

## Further Reading

- TypeScript and repository naming conventions.
