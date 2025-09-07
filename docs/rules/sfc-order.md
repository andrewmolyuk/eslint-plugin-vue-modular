# vue-modular/sfc-order

Require a conventional order for Single File Component (SFC) blocks when those blocks exist.

This rule parses `.vue` files using `@vue/compiler-sfc` and validates the relative order of blocks that are present in the file. Missing blocks are allowed — only the relative order among present blocks is checked.

By default the recommended order is:

1. `<script>` / `<script setup>`
2. `<template>`
3. `<style>` (one or more)

## Rule Details

- The rule runs only for on-disk `.vue` files under the configured `src` segment (default: `src`).
- Virtual inputs (filenames starting with `<...>`) and files matched by the `ignore` option are skipped.
- The rule computes the actual block order from the SFC descriptor and validates that the sequence of present blocks respects the relative order defined by the `order` option (or the default order).
- This rule intentionally does not report missing blocks — use `vue-modular/sfc-required` to enforce presence of `<template>`/`<script>`.

## Options

The rule accepts a single options object:

- `src` (string, default: `"src"`) — path segment used to identify the repository source area where the rule should run.
- `ignore` (string[], default: `[]`) — minimatch-style patterns to ignore files or folders.
- `order` (string[], default: `['script','template','style']`) — the desired relative block ordering. Allowed values are `"script"`, `"template"`, and `"style"`. Missing blocks are permitted.

### Example configuration

```js
{
  "vue-modular/sfc-order": ["error", { "src": "src", "ignore": [], "order": ["script", "template", "style"] }]
}
```

## Incorrect

```vue
<template>
  <div />
</template>
<script>
export default {}
</script>
```

## Correct

```vue
<script setup>
const a = 1
</script>
<template>
  <div />
</template>
<style>
/* css */
</style>
```

## Usage Notes

- The rule uses `@vue/compiler-sfc` to parse SFCs, so `<script setup>` and other modern SFC syntax are handled correctly.
- The rule checks order only; it does not assert the presence of template/script blocks. Use `vue-modular/sfc-required` to require those blocks.
- The `ignore` option accepts minimatch patterns — match feature folder names (for example `"**/legacy/**"`) to skip legacy areas.
