# vue-modular/sfc-required

Require Single File Component (SFC) structure for Vue component files under a configured `src` segment.

This rule enforces that any Vue component file that lives under the configured `src` segment uses the `.vue` SFC format and, when the file is present on disk, contains at least one of the meaningful SFC blocks (`<template>` or `<script>` / `<script setup>`). Files that are virtual (like `"<input>"`) or explicitly ignored by the rule's `ignore` option are skipped.

## Rule Details

The rule performs two related checks:

1. It only runs for files inside the configured `src` segment (default: `src`). Files outside that segment are ignored.
2. For on-disk `.vue` files it parses the SFC using `@vue/compiler-sfc` and verifies the descriptor contains either a `<template>` block or a `<script>` / `<script setup>` block. If neither block exists the rule reports `missingSfcBlock` with the filename.

This behavior helps catch accidentally empty `.vue` files or files that only contain style blocks (for example UI kit style-only files that should not be placed inside feature code), while avoiding false positives for virtual or non-.vue files.

## Options

The rule accepts a single options object:

- `src` (string, default: `"src"`) — the path segment used to identify the codebase root under which the rule should run. The rule finds the configured segment in the linted file path and only enforces rules for files under that segment.
- `ignore` (string[], default: `[]`) — minimatch-style patterns matched against the relative path (or parent segment) to skip files or features. Use this to exclude legacy folders or third-party directories.

### Example configuration

```js
// Recommended defaults: scan files under `src` and do not ignore anything
{
  "vue-modular/sfc-required": ["error", { "src": "src", "ignore": [] }]
}
```

## Incorrect

```text
// File: src/features/payments/components/Orphan.vue
// File contents: only style and no template or script blocks
<style>
  /* only styles */
</style>
```

## Correct

```vue
<!-- File: src/features/payments/components/Card.vue -->
<template>
  <div class="card">...</div>
</template>

<script setup>
const props = defineProps({})
</script>

<style>
/* styles */
</style>
```

## Usage Notes

- The rule uses `@vue/compiler-sfc` to parse the `.vue` file reliably; this allows detection of `<script setup>` and other valid SFC syntax.
- The rule runs only once per ESLint process using the plugin's `runOnce` helper to avoid duplicate scans and noise when linting many files.
- If a `.vue` file is missing on disk (for example an IDE virtual document) the rule will skip the content check.
- The `ignore` option accepts minimatch patterns; match the feature folder name (for example `"**/legacy/**"`) to skip legacy areas.

## When Not To Use

- Do not enable this rule for folders that intentionally contain non-SFC Vue artifacts (for example a style-only UI-kit folder that you choose to keep outside of features). Instead, configure `ignore` to skip those paths.
