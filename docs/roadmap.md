# ESLint Plugin Vue Modular - Roadmap

This document outlines the current status and planned development of rules for enforcing Vue.js modular architecture patterns.

## Current Status

### Implemented Rules

| Rule                                    | Status       | Description                                                                          |
| --------------------------------------- | ------------ | ------------------------------------------------------------------------------------ |
| `vue-modular/no-cross-feature-imports`  | **Released** | Prevents direct imports from deep inside feature folders                             |
| `vue-modular/no-cross-module-imports`   | **Released** | Prevents deep imports between modules; prefer module public API                      |
| `vue-modular/enforce-import-boundaries` | **Released** | Enforces proper import paths and module/feature boundaries across the project        |
| `vue-modular/enforce-src-structure`     | **Released** | Enforces allowed top-level folders/files in the `src/` folder                        |
| `vue-modular/enforce-app-structure`     | **Released** | Validates `src/app` contains the expected entries (router, stores, layouts, App.vue) |
| `vue-modular/enforce-module-exports`    | **Released** | Ensures each `src/modules/*` exposes a public API index file                         |
| `vue-modular/enforce-feature-exports`   | **Released** | Ensures each `src/features/*` exposes a public API index file                        |
| `vue-modular/enforce-naming-convention` | **Released** | Enforce consistent naming patterns for Vue components                                |

---

## Planned Rules

### Component Organization

| Rule                                      | Priority   | Description                                           | Status      |
| ----------------------------------------- | ---------- | ----------------------------------------------------- | ----------- |
| `vue-modular/no-business-logic-in-ui-kit` | **Medium** | Prevent business logic in shared/ui components        | **Planned** |
| `vue-modular/prefer-composition-api`      | **Low**    | Encourage Composition API usage in modular components | **Planned** |

### Import Path Enforcement

| Rule                                             | Priority   | Description                                           | Status      |
| ------------------------------------------------ | ---------- | ----------------------------------------------------- | ----------- |
| `vue-modular/no-relative-imports-across-modules` | **High**   | Prevent relative imports that cross module boundaries | **Planned** |
| `vue-modular/prefer-absolute-imports`            | **Medium** | Encourage absolute imports for better maintainability | **Planned** |

### Store and State Management

| Rule                               | Priority   | Description                                 | Status      |
| ---------------------------------- | ---------- | ------------------------------------------- | ----------- |
| `vue-modular/enforce-store-naming` | **Medium** | Enforce consistent store naming conventions | **Planned** |

### Route and Navigation

| Rule                              | Priority | Description                     | Status      |
| --------------------------------- | -------- | ------------------------------- | ----------- |
| `vue-modular/no-hardcoded-routes` | **Low**  | Prevent hardcoded route strings | **Planned** |

### API and Services

| Rule                                        | Priority   | Description                                    | Status      |
| ------------------------------------------- | ---------- | ---------------------------------------------- | ----------- |
| `vue-modular/enforce-api-service-structure` | **Medium** | Ensure API services follow consistent patterns | **Planned** |
| `vue-modular/no-direct-api-imports`         | **Low**    | Encourage API access through service layer     | **Planned** |

### Testing and Quality

| Rule                                 | Priority | Description                              | Status      |
| ------------------------------------ | -------- | ---------------------------------------- | ----------- |
| `vue-modular/enforce-test-structure` | **Low**  | Ensure tests follow modular organization | **Planned** |

### File and Folder Organization

| Rule                            | Priority   | Description                                        | Status      |
| ------------------------------- | ---------- | -------------------------------------------------- | ----------- |
| `vue-modular/no-deep-nesting`   | **Medium** | Prevent excessive folder nesting in modules        | **Planned** |
| `vue-modular/no-orphaned-files` | **Medium** | Flag files that don't belong to any clear category | **Planned** |

### Vue.js Specific Rules

| Rule                                            | Priority   | Description                                      | Status      |
| ----------------------------------------------- | ---------- | ------------------------------------------------ | ----------- |
| `vue-modular/component-composition`             | **Medium** | Enforce composition API patterns in modules      | **Planned** |
| `vue-modular/no-global-components`              | **Medium** | Prevent global component registration in modules | **Planned** |
| `vue-modular/enforce-vue-naming`                | **Low**    | Ensure Vue component naming follows conventions  | **Planned** |
| `vue-modular/no-template-literals-in-templates` | **Low**    | Prevent complex logic in Vue templates           | **Planned** |

## Rule Configurations

### Recommended Configuration Sets

| Configuration              | Description                                      | Status        |
| -------------------------- | ------------------------------------------------ | ------------- |
| `@vue-modular/recommended` | Essential rules for modular architecture         | **Available** |
| `@vue-modular/strict`      | Strict enforcement of all architectural patterns | **Planned**   |
| `@vue-modular/legacy`      | Rules for migrating existing projects            | **Planned**   |
| `@vue-modular/enterprise`  | Additional rules for large-scale applications    | **Planned**   |

## Resources

### Architecture References

- [Vue 3 Project Modules Blueprint](./vue3-project-modules-blueprint.md)
- [Feature-Driven Development](https://en.wikipedia.org/wiki/Feature-driven_development)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

### ESLint Development

- [ESLint Rule Development Guide](https://eslint.org/docs/developer-guide/working-with-rules)
- [AST Explorer](https://astexplorer.net/) - For rule development
- [ESLint Plugin Template](https://github.com/eslint/generator-eslint)
