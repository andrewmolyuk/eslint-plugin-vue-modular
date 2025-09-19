# vue-modular/file-component-naming

Enforce PascalCase filenames for Vue Single File Components (.vue).

Included in recommended config.

## Rule Details

This rule requires that component filenames use PascalCase (for example `MyButton.vue`) to make component names predictable and consistent across a project.

By default the rule applies to all `.vue` files in components folders. It supports an `ignores` option with glob patterns to skip files or folders.

Components folder name can be configured via the plugin's project options (the plugin exposes a `componentsFolderName` — typically `components`).

Examples of incorrect and correct code for this rule are below.

### Incorrect

```vue
<!-- File: src/components/user-card.vue -->
<!-- Filename should be PascalCase -->
<script setup>
// component implementation
</script>
```

```vue
<!-- File: src/shared/ui/cgs-icon.vue -->
<script>
export default {}
</script>
```

### Correct

```vue
<!-- File: src/components/UserCard.vue -->
<script setup>
// component implementation
</script>
```

```vue
<!-- File: src/shared/ui/CgsIcon.vue -->
<script>
export default {}
</script>
```

## Options

This rule accepts an optional object with the following properties:

- `ignores` (string[], default: `['**/*.spec.*', '**/*.test.*', '**/*.stories.*']`) - array of glob patterns (minimatch) to ignore. Patterns are matched against both the absolute file path and the project-relative path.

Notes about scope:

- The rule determines whether a file is a Vue component by checking the filename extension (`.vue`). It also resolves the filename relative to project options when necessary. If you need to restrict checks to a different folder, configure the plugin's project options (see README) or use `ignores` to skip paths.

Examples:

```js
// Use defaults (validate all .vue files, ignore common test patterns)
{
  "vue-modular/file-component-naming": ["error"]
}

// Custom ignored patterns
{
  "vue-modular/file-component-naming": ["error", { "ignores": ["**/tests/**", "**/*.spec.vue"] }]
}
```

## Usage Notes

- The rule only lints `.vue` files.
- The `ignores` patterns use `minimatch` semantics and are matched against the filename that ESLint provides to the rule (absolute or repo-relative paths depending on your ESLint invocation).

Implementation notes:

- The rule reports with messageIds `filenameNotPascal`. The reported `expected` value shows the PascalCase suggestion (for example `MyFile.vue`).

## When Not To Use

- If your project convention requires a different casing (for example `kebab-case` filenames) you should not enable this rule.
- If your build tooling rewrites or normalizes component filenames automatically, this rule may produce false positives.

## Further Reading

- Vue style guide: <https://vuejs.org/style-guide/>
