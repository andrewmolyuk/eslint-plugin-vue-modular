# vue-modular/src-structure

**Enforce allowed top-level folders and files in the `src` directory.**

## Rule Details

This rule ensures that only a specific set of folders and files are present at the top level of your project's source directory. This helps maintain a consistent and modular project structure.

**Default allowed top-level folders/files:**

- app
- components
- composables
- entities
- features
- modules
- shared
- main.ts
- main.js

**Updated default allowed top-level folders/files:**

- app
- components
- composables
- entities
- features
- modules
- shared
- views
- stores
- main.ts
- main.js

Any other folder or file at the top level of the source directory will trigger a lint error.

### Example of correct structure

```text
src/
  app/
  components/
  composables/
  entities/
  features/
  modules/
  shared/
  main.ts
```

### Example of incorrect structure

```text
src/
  app/
  components/
  utils/         # ❌ Not allowed
  main.ts
```

## Options

This rule accepts an options object with the following properties:

### `allowed`

**Type:** `array`  
**Default:** `['app', 'components', 'composables', 'entities', 'features', 'modules', 'shared', 'views', 'stores', 'main.ts', 'main.js']`

An array of strings specifying the allowed top-level folders and files.

### `src`

**Type:** `string`  
**Default:** `'src'`

The name of the source directory to check.

## Configuration Examples

### Default Configuration

```js
// eslint.config.js
export default [
  {
    rules: {
      'vue-modular/src-structure': 'error',
    },
  },
]
```

### Custom allowed folders/files

```js
// eslint.config.js
export default [
  {
    rules: {
      'vue-modular/src-structure': [
        'error',
        {
          allowed: ['components', 'pages', 'utils', 'views', 'stores', 'main.ts'],
        },
      ],
    },
  },
]
```

### Custom source directory

```js
// eslint.config.js
export default [
  {
    rules: {
      'vue-modular/src-structure': [
        'error',
        {
          src: 'source',
        },
      ],
    },
  },
]
```

### Full custom configuration

```js
// eslint.config.js
export default [
  {
    rules: {
      'vue-modular/src-structure': [
        'error',
        {
          allowed: ['app', 'lib', 'pages', 'views', 'stores', 'index.ts'],
          src: 'lib',
        },
      ],
    },
  },
]
```

## How It Works

- The rule only runs when linting files inside the specified source directory (default: `src`)
- It checks the contents of the source directory once per lint run
- It reports any top-level entries (files or folders) that are not in the allowed list
- The rule runs only once per lint session to avoid duplicate reports

## When Not To Use It

If you want to allow arbitrary folders/files in your source directory, you can disable this rule or exclude it from your configuration.

## Further Reading

- [Vue 3 Project Modules Blueprint](../vue3-project-modules-blueprint.md)
