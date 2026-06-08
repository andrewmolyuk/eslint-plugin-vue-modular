# composable-filename-prefix

Require composable filenames to start with a prefix (default: `use`).

## Rule details

Vue 3 composables by convention start with `use`. This rule enforces that
all `.ts` files inside any `composables/` folder follow this convention.

### ❌ Incorrect

```
src/composables/logger.ts
src/composables/Logger.ts
src/features/auth/composables/auth.ts
```

### ✅ Correct

```
src/composables/useLogger.ts
src/composables/index.ts
src/features/auth/composables/useAuth.ts
```

## Options

```js
'vue-modular/composable-filename-prefix': ['error', {
prefix: 'use', // default
ignores: ['**/*.spec.*', '**/*.test.*', '**/*.d.ts', '**/*.stories.*'],
}]
```

### `prefix`

Type: `string` · Default: `'use'`

The required filename prefix. Override if your team uses a different convention:

```js
// require 'create' prefix instead
'vue-modular/composable-filename-prefix': ['error', { prefix: 'create' }]
```

### `ignores`

Type: `string[]`

Glob patterns to exclude from the check. Test files and type declarations
are excluded by default.

## When to turn off

If your project does not use a `composables/` folder convention, disable
the rule:

```js
'vue-modular/composable-filename-prefix': 'off'
```
