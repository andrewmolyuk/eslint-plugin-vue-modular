# vue-modular/src-structure

**Enforce allowed top-level folders and files in the `src` directory.**

## Rule Details

This rule ensures that only a specific set of folders and files are present at the top level of your project's `src` directory. This helps maintain a consistent and modular project structure.

**Allowed top-level folders/files:**
- app
- components
- composables
- entities
- features
- modules
- shared
- App.vue
- main.ts

Any other folder or file at the top level of `src` will trigger a lint error.

### Example of correct structure

```
src/
  app/
  components/
  composables/
  entities/
  features/
  modules/
  shared/
  App.vue
  main.ts
```

### Example of incorrect structure

```
src/
  app/
  components/
  utils/         # ❌ Not allowed
  App.vue
  main.ts
```

## When Not To Use It

If you want to allow arbitrary folders/files in your `src` directory, you can disable this rule.

## Further Reading
- [Vue 3 Project Modules Blueprint](../vue3-project-modules-blueprint.md)
