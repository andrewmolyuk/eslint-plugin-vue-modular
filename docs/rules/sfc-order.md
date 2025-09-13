# vue-modular/sfc-order

Enforce a conventional order for Single File Component (SFC) blocks.

This rule parses Vue component files using `@vue/compiler-sfc` and validates the relative order of SFC blocks (`<script>`, `<template>`, `<style>`). The rule only enforces order among blocks that are present — missing blocks are allowed.

Default order:

1. `<script>` / `<script setup>`
2. `<template>`
3. `<style>` (one or more)

## Rule Details

- **Component detection**: Only runs on `.vue` files located in the configured components folder. Files outside component folders are ignored.
- **SFC parsing**: Uses `@vue/compiler-sfc` to parse the Vue file and extract block positions.
- **Order validation**: Checks that present blocks follow the configured relative order. Missing blocks are allowed.
- **Early exit**: If a component has neither `<template>` nor `<script>` blocks, the rule skips validation (no meaningful content to order).

## Options

The rule accepts a single options object:

- `order` (string[], default: `["script", "template", "style"]`) — desired relative block ordering. Allowed values: `"script"`, `"template"`, `"style"`
- `ignores` (string[], default: `[""]`) — minimatch-style patterns to exclude specific files

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
    "vue-modular/sfc-order": ["error", {
      "order": ["script", "template", "style"],
      "ignores": []
    }]
  }
}
```

## Incorrect

```vue
<!-- Wrong order: template before script -->
<template>
  <div>Hello</div>
</template>
<script setup>
const message = 'Hello'
</script>
```

```vue
<!-- Wrong order: style before template -->
<script setup>
const message = 'Hello'
</script>
<style>
.hello {
  color: blue;
}
</style>
<template>
  <div>Hello</div>
</template>
```

## Correct

```vue
<!-- Correct order: script, template, style -->
<script setup>
const message = 'Hello'
</script>
<template>
  <div>{{ message }}</div>
</template>
<style>
.hello {
  color: blue;
}
</style>
```

```vue
<!-- Missing blocks are allowed -->
<script setup>
// Script-only component
export function useUtils() {}
</script>
```

```vue
<!-- Custom order example -->
<style>
/* Custom order: style first */
.component {
  display: block;
}
</style>
<script setup>
const props = defineProps({})
</script>
<template>
  <div class="component">Content</div>
</template>
```

## Usage Notes

- The rule uses `@vue/compiler-sfc` to parse Vue files reliably, supporting `<script setup>` and other modern SFC syntax.
- Only files identified as components (`.vue` files in the components folder) are checked.
- Both `<script>` and `<script setup>` blocks are treated as `"script"` type for ordering purposes.
- Multiple `<style>` blocks are allowed and treated as individual `"style"` blocks.
- Files with only style blocks (no template or script) are skipped entirely.
- Files can be excluded using the `ignores` option with minimatch patterns.

## When Not To Use

- Disable this rule if your project doesn't follow consistent SFC block ordering conventions.
- Use the `ignores` option to exclude specific files or patterns rather than disabling the rule entirely.
