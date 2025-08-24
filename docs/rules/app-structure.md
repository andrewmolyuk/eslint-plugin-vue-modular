````markdown
# vue-modular/app-structure

**Ensure the `src/app` folder contains the required application infrastructure.**

This rule checks that your application's `app/` directory (inside the configured source folder) exists and contains a set of required entries. By default the rule expects:

# vue-modular/app-structure

**Ensure the `src/app` folder contains the required application infrastructure.**

This rule checks that your project's `app/` directory (inside the configured source folder) exists and contains a set of required entries. By default the rule expects:

- `router`
- `stores`
- `layouts`
- `App.vue`

The rule runs once per lint session for the configured source directory and reports any missing required entries.

## Rule Details

The `app/` folder is the application infrastructure layer. It typically contains router registration, app-level stores, global layouts and the root component (`App.vue`). This rule enforces presence of those entries to keep the app scaffold consistent across projects.

### Examples

Correct structure (default required entries present):

```text
src/
	app/
		router/
			index.ts
		stores/
		layouts/
		App.vue
	components/
	modules/
	main.ts
```

Missing `App.vue` or `stores` will trigger a report:

```text
src/
	app/
		router/
		layouts/
	main.ts

# ❌ 'stores' and 'App.vue' are missing
```

> Note: `app/router` does not have to export an `index` file — an index export is optional. The rule only ensures the existence of configured required entries. If your project uses an index export in `app/router` for automatic module discovery, keep it in your codebase, but the rule will not enforce it.

## Options

This rule supports a single options object.

### `src`

Type: `string`  
Default: `'src'`

Path to the source directory to check.

### `required`

Type: `string[]`  
Default: `['router','stores','layouts','App.vue']`

Array of required entries that must exist inside the `app/` directory. Each item is matched by name against the `fs.readdirSync` contents of `src/app`.

## Configuration Examples

### Default configuration

```js
// eslint.config.js
export default [
  {
    rules: {
      'vue-modular/app-structure': 'error',
    },
  },
]
```

### Custom required entries

```js
export default [
  {
    rules: {
      'vue-modular/app-structure': ['error', { required: ['router', 'stores', 'layouts', 'App.vue', 'plugins'] }],
    },
  },
]
```

### Custom source directory

```js
export default [
  {
    rules: {
      'vue-modular/app-structure': ['error', { src: 'source' }],
    },
  },
]
```

## How It Works

- The rule runs only when linting files inside the configured source directory (default: `src`).
- It reads the `src` directory once per lint run and checks for an `app` folder.
- If `app` exists, it reads `src/app` and reports any missing required entries.
- The rule uses a per-run cache to avoid duplicate reports during a lint session.

## When Not To Use It

Disable this rule if you prefer no enforcement of app-level scaffolding or if your project uses a different convention for application infrastructure.

## Further Reading

- [Vue 3 Project Modules Blueprint](../vue3-project-modules-blueprint.md)
````
