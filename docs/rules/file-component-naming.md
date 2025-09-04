# vue-modular/file-component-naming

Enforce PascalCase filenames for Vue Single File Components (.vue).

## Rule Details

This rule requires that component filenames use PascalCase (for example `MyButton.vue`) to make component names predictable and consistent across a project.

By default the rule only applies to files under the `src` directory. It supports an `ignore` option with glob patterns to skip files or folders.

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

This rule accepts an object with the following properties:

- `src` (string, default: `"src"`) - base source directory to scope the rule. When set, files outside this directory are ignored.
- `ignore` (string[], default: `[]`) - array of glob patterns (minimatch) to ignore. Patterns are matched against both the absolute file path and the project-relative path.

Examples:

```js
// Use defaults (apply inside `src` only)
{
  "vue-modular/file-component-naming": ["error"]
}

// Custom source directory and ignored patterns
{
  "vue-modular/file-component-naming": ["error", { "src": "app", "ignore": ["**/tests/**", "**/*.spec.vue"] }]
}
```

## Usage Notes

- The rule only lints `.vue` files.
- The `src` option is applied by checking whether the file path contains the configured segment (for example `src` or `app`). If the segment is not present the file is ignored.
- The `ignore` patterns use `minimatch` semantics and are matched against the absolute filename and the path relative to the repository root.

## When Not To Use

- If your project convention requires a different casing (for example `kebab-case` filenames) you should not enable this rule.
- If your build tooling rewrites or normalizes component filenames automatically, this rule may produce false positives.

## Further Reading

- Vue style guide: <https://vuejs.org/style-guide/>
