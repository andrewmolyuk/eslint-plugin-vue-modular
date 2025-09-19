# vue-modular/views-suffix

Require that view files end with `View.vue` suffix.

Included in recommended config.

## Rule Details

This rule checks files located inside a `views/` folder (the exact folder name is configurable via project settings). When a file in a views folder does not end with the configured suffix (default `View.vue`) the rule reports.

The rule resolves the current filename to a project-relative path and uses the configured `viewsFolderName` from project options to detect views files.

### Incorrect

```vue
<!-- File: src/features/auth/views/Login.vue -->
<script>
export default {}
</script>
```

### Correct

```vue
<!-- File: src/features/auth/views/LoginView.vue -->
<script>
export default {}
</script>
```

## Options

This rule accepts an optional object with the following properties:

- `suffix` (string, default: `View`) - the suffix portion to require (the rule checks for `suffix + '.vue'`).
- `ignores` (string[], default: `['**/*.spec.*', '**/*.test.*', '**/*.stories.*']`) - array of glob patterns (minimatch) to ignore. Patterns are matched against both the absolute file path and the project-relative path.

Notes about scope:

- The rule determines whether a file is a view by resolving the filename relative to project options and checking it contains `/<viewsFolderName>/` (for example `src/features/auth/views/Login.vue`). If the resolved filename cannot be mapped to the project root (for example `Login.vue`) the rule skips checks.

Examples:

```js
// Use defaults
{
  "vue-modular/views-suffix": ["error"]
}

// Custom suffix or ignores
{
  "vue-modular/views-suffix": ["error", { "suffix": "Page", "ignores": ["**/tests/**"] }]
}
```

## Usage Notes

- The `ignores` patterns use `minimatch` semantics and are matched against the filename that ESLint provides to the rule (absolute or repo-relative paths depending on your ESLint invocation).

## Implementation notes

- The rule reports with messageId `invalidSuffix`. The reported `filename` in the message is the base filename (for example `Login.vue`).

## When Not To Use

- If your project requires a different filename convention for view files, do not enable this rule.
