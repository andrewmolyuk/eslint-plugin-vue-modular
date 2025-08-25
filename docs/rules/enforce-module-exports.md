````markdown
# vue-modular/enforce-module-exports

Ensure every module under `src/modules` exposes a public API via an `index.ts` or `index.js` file. This helps the `app/` layer and other modules import modules through a stable public interface.

## Why

The blueprint requires modules to provide a mandatory public API (an `index.ts`/`index.js`) that other layers import. This enforces encapsulation and allows the app layer to import modules using `@/modules/<name>`.

## Default behavior

- Looks for a `modules` directory under your configured `src` directory.
- For each subdirectory under `src/modules`, ensures that at least one of `index.ts` or `index.js` exists.

## Options

- `src` (string) - source directory (default: `src`)
- `modulesDir` (string) - modules directory name (default: `modules`)
- `indexFiles` (string[]) - allowed public API filenames (default: `['index.ts','index.js']`)

## Examples

Correct:

```text
src/modules/auth/index.ts
src/modules/users/index.js
```

Incorrect (missing index in module):

```text
src/modules/auth/views/LoginView.vue
```
````
