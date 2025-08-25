# enforce-src-structure

Enforce allowed top-level folders and files in the `src` directory.

This rule ensures that the top-level entries inside your configured source directory (default: `src`) are limited to a known set of allowed folders and files. Useful for enforcing a consistent project scaffold.

## Default options

- `allowed` (string[]) - list of allowed entries (default: `['app','components','views','composables','entities','stores','features','modules','shared','main.ts','main.js']`)
- `src` (string) - source directory name (default: `src`)

## Configuration examples

```js
{
  rules: {
    'vue-modular/enforce-src-structure': 'error',
  }
}
```

```js
{
  rules: {
    'vue-modular/enforce-src-structure': ['error', { allowed: ['app','components','main.ts'] }],
  }
}
```
