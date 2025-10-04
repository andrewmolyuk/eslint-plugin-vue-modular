# vue-modular/stores-location

Enforce that store files live under `src/shared/stores` or `src/features/{feature}/stores`.

Included in recommended config.

## Rule Details

This rule detects Vue SFC files that call `defineStore` (Pinia stores) and ensures they are placed in one of the project's store folders:

- `src/shared/stores/` (cross-cutting shared stores)
- `src/features/{feature}/stores/` (feature-specific stores)

If a file contains a `defineStore` call but is not placed under one of the allowed store folders, the rule reports and suggests moving the file to `shared/stores` or the corresponding feature's `stores` folder.

The rule uses project settings (see `settings['vue-modular']`) for `sharedPath`, `featuresPath`, and `storesFolderName`.

## Examples

### ✅ Valid

```text
// File: src/shared/stores/auth.ts
<script setup>defineStore('useAuth', {})</script>
```

```text
// File: src/features/auth/stores/auth.ts
<script setup>defineStore('useAuth', {})</script>
```

### ❌ Invalid

```text
// File: src/features/auth/components/SomeComp.vue
<script setup>defineStore('useAuth', {})</script>
```

## Options

- `ignores` (string[]) — minimatch globs matched against the filename; matching files are skipped by the rule.

## Usage Notes

- Included in recommended config.
- The rule parses SFCs using `@vue/compiler-sfc` and detects `defineStore` in either `<script setup>` or regular `<script>` blocks.

## When Not To Use

- If your project uses a different pattern for store placement, disable this rule or add appropriate ignore globs.

## Further Reading

- Plugin architecture: `docs/vue-modular-architecture.md`
