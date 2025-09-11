# vue-modular/folder-kebab-case

Enforce kebab-case folder names under the project's source directory.

## Rule Details

This rule requires that folder (directory) names use kebab-case: lowercase letters, numbers, and single hyphens between segments (for example `my-feature` or `api-v1`). The rule helps keep filesystem structure predictable and consistent across a project.

By default the rule scans the project's source root as provided by the plugin's project options (the plugin exposes a `rootPath` — typically `src`). To skip specific folders from validation the rule supports an `ignores` option with minimatch-style glob patterns.

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

This rule accepts an optional object with the following properties:

- `ignores` (string[], default: `[]`) - array of glob patterns (minimatch) to ignore. Patterns are matched against both the absolute folder path and the repository-relative path.

Notes about source root discovery:

- The rule reads the project/source root from the plugin's project options (`projectOptions.rootPath`). In most setups this will be the repository `src` folder. If you need to scan a different root, configure the plugin/project options used by this ESLint plugin.

Examples:

```js
// Use defaults (scan project source root)
{
  "vue-modular/folder-kebab-case": ["error"]
}

// Custom ignored patterns
{
  "vue-modular/folder-kebab-case": [
    "error",
    { "ignores": ["**/tests/**", "**/vendor/**"] }
  ]
}
```

## Usage Notes

- The rule scans directories on disk starting at the plugin's configured project root and reports folders whose base name does not match kebab-case.
- To avoid duplicate reports during multi-file ESLint runs, the implementation executes the scan once per ESLint process using the plugin's `runOnce` utility.
- The `ignore` patterns use `minimatch` semantics and are tested against both the absolute path and the path relative to the repository root.

## When Not To Use

- If your project convention uses a different folder naming style (for example `PascalCase` or `snake_case`), do not enable this rule.
- If your build tooling automatically renames or maps folders in a way that makes on-disk names unreliable, this rule may produce false positives.

## Further Reading

- File and directory naming conventions in large repositories.
