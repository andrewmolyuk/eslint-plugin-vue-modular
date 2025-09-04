# vue-modular/folder-kebab-case

Enforce kebab-case folder names under the project's source directory.

## Rule Details

This rule requires that folder (directory) names inside the configured `src` directory use kebab-case: lowercase letters, numbers, and single hyphens between segments (for example `my-feature` or `api-v1`). The rule helps keep filesystem structure predictable and consistent across a project.

By default the rule only applies to folders under the `src` directory. It supports an `ignore` option with minimatch-style glob patterns to skip specific folders from validation.

### Incorrect

```text
// Folder: src/MyFolder
```

```text
// Folder: src/api_v1
```

### Correct

```text
// Folder: src/my-folder
```

```text
// Folder: src/api-v1
```

## Options

This rule accepts an object with the following properties:

- `src` (string, default: `"src"`) - base source directory to scan. Only folders under this path will be checked.
- `ignore` (string[], default: `[]`) - array of glob patterns (minimatch) to ignore. Patterns are matched against both the absolute folder path and the repository-relative path.

Examples:

```js
// Use defaults (scan `src` only)
{
  "vue-modular/folder-kebab-case": ["error"]
}

// Custom source directory and ignored patterns
{
  "vue-modular/folder-kebab-case": [
    "error",
    { "src": "app", "ignore": ["**/tests/**", "**/vendor/**"] }
  ]
}
```

## Usage Notes

- The rule scans directories on disk starting at the configured `src` root and reports folders whose base name does not match kebab-case.
- To avoid duplicate reports during multi-file ESLint runs, the implementation executes the scan once per ESLint process using the plugin's `runOnce` utility.
- The `ignore` patterns use `minimatch` semantics and are tested against both the absolute path and the path relative to the repository root.

## When Not To Use

- If your project convention uses a different folder naming style (for example `PascalCase` or `snake_case`), do not enable this rule.
- If your build tooling automatically renames or maps folders in a way that makes on-disk names unreliable, this rule may produce false positives.

## Further Reading

- File and directory naming conventions in large repositories.
