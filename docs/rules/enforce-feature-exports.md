````markdown
# vue-modular/enforce-feature-exports

Ensure every global feature under `src/features` exposes a public API via an `index.ts` or `index.js` file. This enforces the blueprint requirement that global features export a stable public interface.

## Default behavior

- Looks for a `features` directory under your configured `src` directory.
- For each subfolder under `src/features`, ensures one of `index.ts` or `index.js` exists.

## Options

- `src` (string) - source directory (default: `src`)
- `featuresDir` (string) - features directory name (default: `features`)
- `indexFiles` (string[]) - allowed public API filenames (default: `['index.ts','index.js']`)

## Examples

Correct:

```text
src/features/search/index.ts
src/features/file-upload/index.js
```

Incorrect (missing index in feature):

```text
src/features/search/components/SearchInput.vue
```
````
