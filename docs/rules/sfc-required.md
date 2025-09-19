# vue-modular/sfc-required

Require Vue Single File Component (SFC) files to contain at least a `<template>` or `<script>` block.

Included in recommended config.

This rule enforces that Vue component files contain meaningful content by requiring at least one of the core SFC blocks (`<template>` or `<script>` / `<script setup>`). It only runs on files that are identified as Vue components (`.vue` files in the configured components folder).

## Rule Details

The rule performs the following checks:

1. **Component detection**: Only runs on `.vue` files located in the configured components folder (default: `components`). Files outside component folders are ignored.
2. **SFC parsing**: Uses `@vue/compiler-sfc` to parse the Vue file and extract the SFC descriptor.
3. **Block validation**: Verifies that the SFC contains either a `<template>` block or a `<script>`/`<script setup>` block. If neither exists, reports an error.

This helps catch accidentally empty component files or files that only contain style blocks without meaningful component logic.

## Options

The rule accepts a single options object:

- `ignores` (string[], default: `[""]`) — minimatch-style patterns to exclude specific files from checking.

### Project Configuration

The rule uses project-wide settings from your ESLint configuration's `settings['vue-modular']`:

- `componentsFolderName` (string, default: `"components"`) — name of the folder that contains components
- `rootPath` (string, default: `"src"`) — root path of the project
- `rootAlias` (string, default: `"@"`) — alias for the root path

### Example configuration

```js
// ESLint config
{
  "settings": {
    "vue-modular": {
      "componentsFolderName": "components",
      "rootPath": "src",
      "rootAlias": "@"
    }
  },
  "rules": {
    "vue-modular/sfc-required": ["error", { "ignores": [] }]
  }
}
```

## Incorrect

```vue
<!-- File: src/components/EmptyComponent.vue -->
<!-- Only style block, no template or script -->
<style>
.card {
  padding: 1rem;
}
</style>
```

## Correct

```vue
<!-- File: src/components/Card.vue -->
<template>
  <div class="card">...</div>
</template>

<script setup>
const props = defineProps({})
</script>

<style>
.card {
  padding: 1rem;
}
</style>
```

```vue
<!-- File: src/components/Utility.vue -->
<!-- Script-only component is also valid -->
<script setup>
export function useCardUtils() {
  // utility logic
}
</script>
```

## Usage Notes

- The rule uses `@vue/compiler-sfc` to parse Vue files reliably, supporting `<script setup>` and other modern SFC syntax.
- Only files identified as components (`.vue` files in the components folder) are checked.
- Files can be excluded using the `ignores` option with minimatch patterns.
- The rule respects project-wide component folder configuration via ESLint settings.

## When Not To Use

- Disable this rule if you intentionally create Vue files with only style blocks (e.g., style-only component libraries).
- Use the `ignores` option to exclude specific files or patterns rather than disabling the rule entirely.
