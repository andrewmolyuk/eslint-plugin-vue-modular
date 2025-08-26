# ESLint Plugin Vue Modular - Roadmap

This document outlines the current status and planned development of rules for enforcing Vue.js modular architecture patterns.

## Current Status

### Implemented Rules

| Rule                                      | Status       | Description                                                                          |
| ----------------------------------------- | ------------ | ------------------------------------------------------------------------------------ |
| `vue-modular/no-cross-feature-imports`    | **Released** | Prevents direct imports from deep inside feature folders                             |
| `vue-modular/no-cross-module-imports`     | **Released** | Prevents deep imports between modules; prefer module public API                      |
| `vue-modular/enforce-import-boundaries`   | **Released** | Enforces proper import paths and module/feature boundaries across the project        |
| `vue-modular/enforce-src-structure`       | **Released** | Enforces allowed top-level folders/files in the `src/` folder                        |
| `vue-modular/enforce-app-structure`       | **Released** | Validates `src/app` contains the expected entries (router, stores, layouts, App.vue) |
| `vue-modular/enforce-module-exports`      | **Released** | Ensures each `src/modules/*` exposes a public API index file                         |
| `vue-modular/enforce-feature-exports`     | **Released** | Ensures each `src/features/*` exposes a public API index file                        |
| `vue-modular/component-naming-convention` | **Released** | Enforce consistent naming patterns for Vue components                                |

---

## Planned Rules

### Component Organization

| Rule                                      | Priority   | Description                                           | Status      |
| ----------------------------------------- | ---------- | ----------------------------------------------------- | ----------- |
| `vue-modular/no-business-logic-in-ui-kit` | **Medium** | Prevent business logic in shared/ui components        | **Planned** |
| `vue-modular/prefer-composition-api`      | **Low**    | Encourage Composition API usage in modular components | **Planned** |

### Import Path Enforcement

| Rule                                             | Priority   | Description                                           | Status       |
| ------------------------------------------------ | ---------- | ----------------------------------------------------- | ------------ |
| `vue-modular/enforce-import-boundaries`          | **High**   | Enforce proper import paths based on module structure | **Released** |
| `vue-modular/no-relative-imports-across-modules` | **High**   | Prevent relative imports that cross module boundaries | **Planned**  |
| `vue-modular/prefer-absolute-imports`            | **Medium** | Encourage absolute imports for better maintainability | **Planned**  |

### Store and State Management

| Rule                                       | Priority   | Description                                    | Status      |
| ------------------------------------------ | ---------- | ---------------------------------------------- | ----------- |
| `vue-modular/no-cross-module-store-access` | **High**   | Prevent direct access to other modules' stores | **Planned** |
| `vue-modular/enforce-store-naming`         | **Medium** | Enforce consistent store naming conventions    | **Planned** |
| `vue-modular/no-global-state-in-modules`   | **Medium** | Discourage global state access in modules      | **Planned** |

### Route and Navigation

| Rule                                         | Priority   | Description                                         | Status      |
| -------------------------------------------- | ---------- | --------------------------------------------------- | ----------- |
| `vue-modular/enforce-route-module-structure` | **Medium** | Ensure routes are properly organized within modules | **Planned** |
| `vue-modular/no-hardcoded-routes`            | **Low**    | Prevent hardcoded route strings                     | **Planned** |

### API and Services

| Rule                                        | Priority   | Description                                    | Status      |
| ------------------------------------------- | ---------- | ---------------------------------------------- | ----------- |
| `vue-modular/enforce-api-service-structure` | **Medium** | Ensure API services follow consistent patterns | **Planned** |
| `vue-modular/no-direct-api-imports`         | **Low**    | Encourage API access through service layer     | **Planned** |

### Testing and Quality

| Rule                                 | Priority | Description                              | Status      |
| ------------------------------------ | -------- | ---------------------------------------- | ----------- |
| `vue-modular/enforce-test-structure` | **Low**  | Ensure tests follow modular organization | **Planned** |
| `vue-modular/no-untested-modules`    | **Low**  | Flag modules without corresponding tests | **Planned** |

### File and Folder Organization

| Rule                                   | Priority   | Description                                        | Status      |
| -------------------------------------- | ---------- | -------------------------------------------------- | ----------- |
| `vue-modular/enforce-folder-structure` | **High**   | Ensure consistent folder structure within modules  | **Planned** |
| `vue-modular/no-deep-nesting`          | **Medium** | Prevent excessive folder nesting in modules        | **Planned** |
| `vue-modular/no-orphaned-files`        | **Medium** | Flag files that don't belong to any clear category | **Planned** |

### TypeScript and Type Safety

| Rule                                  | Priority   | Description                                       | Status      |
| ------------------------------------- | ---------- | ------------------------------------------------- | ----------- |
| `vue-modular/enforce-entity-types`    | **Medium** | Ensure entities have proper TypeScript interfaces | **Planned** |
| `vue-modular/no-any-in-modules`       | **Medium** | Discourage 'any' type usage in module code        | **Planned** |
| `vue-modular/enforce-strict-imports`  | **High**   | Enforce type-only imports where appropriate       | **Planned** |
| `vue-modular/consistent-type-exports` | **Medium** | Ensure consistent type export patterns            | **Planned** |

### Dependency Management

| Rule                                        | Priority   | Description                                        | Status      |
| ------------------------------------------- | ---------- | -------------------------------------------------- | ----------- |
| `vue-modular/no-circular-dependencies`      | **High**   | Prevent circular dependencies between modules      | **Planned** |
| `vue-modular/limit-module-dependencies`     | **Medium** | Limit number of dependencies per module            | **Planned** |
| `vue-modular/no-external-deps-in-modules`   | **Medium** | Prevent direct external library imports in modules | **Planned** |
| `vue-modular/enforce-dependency-boundaries` | **High**   | Control which modules can depend on others         | **Planned** |

### Performance and Bundle Management

| Rule                                    | Priority   | Description                                    | Status      |
| --------------------------------------- | ---------- | ---------------------------------------------- | ----------- |
| `vue-modular/no-heavy-imports`          | **Medium** | Flag imports that might affect bundle size     | **Planned** |
| `vue-modular/enforce-lazy-loading`      | **Medium** | Encourage lazy loading for module routes       | **Planned** |
| `vue-modular/no-duplicate-dependencies` | **Low**    | Prevent duplicate functionality across modules | **Planned** |

### Security and Best Practices

| Rule                                       | Priority   | Description                                     | Status      |
| ------------------------------------------ | ---------- | ----------------------------------------------- | ----------- |
| `vue-modular/no-sensitive-data-in-modules` | **High**   | Prevent hardcoded sensitive data in modules     | **Planned** |
| `vue-modular/enforce-error-boundaries`     | **Medium** | Ensure proper error handling in modules         | **Planned** |
| `vue-modular/no-console-in-production`     | **Low**    | Remove console statements in production modules | **Planned** |

### Vue.js Specific Rules

| Rule                                            | Priority   | Description                                      | Status      |
| ----------------------------------------------- | ---------- | ------------------------------------------------ | ----------- |
| `vue-modular/component-composition`             | **Medium** | Enforce composition API patterns in modules      | **Planned** |
| `vue-modular/no-global-components`              | **Medium** | Prevent global component registration in modules | **Planned** |
| `vue-modular/enforce-vue-naming`                | **Low**    | Ensure Vue component naming follows conventions  | **Planned** |
| `vue-modular/no-template-literals-in-templates` | **Low**    | Prevent complex logic in Vue templates           | **Planned** |

### Documentation and Maintenance

| Rule                                 | Priority | Description                                   | Status      |
| ------------------------------------ | -------- | --------------------------------------------- | ----------- |
| `vue-modular/require-module-docs`    | **Low**  | Ensure modules have documentation             | **Planned** |
| `vue-modular/enforce-jsdoc-comments` | **Low**  | Require JSDoc comments for exported functions | **Planned** |
| `vue-modular/no-todo-comments`       | **Low**  | Flag TODO comments in production code         | **Planned** |

---

## Rule Configurations

### Recommended Configuration Sets

| Configuration              | Description                                      | Status        |
| -------------------------- | ------------------------------------------------ | ------------- |
| `@vue-modular/recommended` | Essential rules for modular architecture         | **Available** |
| `@vue-modular/strict`      | Strict enforcement of all architectural patterns | **Planned**   |
| `@vue-modular/legacy`      | Rules for migrating existing projects            | **Planned**   |
| `@vue-modular/enterprise`  | Additional rules for large-scale applications    | **Planned**   |

---

## Contributing

### How to Suggest New Rules

1. **Create an issue** with the "rule suggestion" label
2. **Describe the problem** the rule would solve
3. **Provide examples** of code that should pass/fail
4. **Explain the architectural benefit**

### Rule Development Guidelines

1. **Focus on architecture** - Rules should enforce modular patterns
2. **Provide clear error messages** - Help developers understand violations
3. **Include documentation** - Examples and configuration options
4. **Add tests** - Comprehensive test coverage for all scenarios

### Priority Criteria

Rules are prioritized based on:

- **Architectural impact** - Does it prevent major violations?
- **Common pain points** - Does it address frequent issues?
- **Developer experience** - Does it improve productivity?
- **Migration support** - Does it help adopt modular patterns?

---

## Resources

### Architecture References

- [Vue 3 Project Modules Blueprint](./vue3-project-modules-blueprint.md)
- [Feature-Driven Development](https://en.wikipedia.org/wiki/Feature-driven_development)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

### ESLint Development

- [ESLint Rule Development Guide](https://eslint.org/docs/developer-guide/working-with-rules)
- [AST Explorer](https://astexplorer.net/) - For rule development
- [ESLint Plugin Template](https://github.com/eslint/generator-eslint)

---

## Rule Count Summary

- **Released**: 8 rules (core structure & boundary enforcement + component naming)
- **Total Planned Rules**: 38 remaining across categories (projected total 46)
- **High Priority**: ~8 rules remaining
- **Medium Priority**: ~21 rules remaining
- **Low Priority**: ~10 rules remaining

### Categories Overview

1. **Module Boundary Enforcement** (3 rules)
2. **Component Organization** (3 rules)
3. **Import Path Enforcement** (3 rules)
4. **Store and State Management** (3 rules)
5. **Route and Navigation** (2 rules)
6. **API and Services** (2 rules)
7. **File and Folder Organization** (4 rules)
8. **TypeScript and Type Safety** (4 rules)
9. **Dependency Management** (4 rules)
10. **Performance and Bundle Management** (3 rules)
11. **Security and Best Practices** (3 rules)
12. **Vue.js Specific Rules** (4 rules)
13. **Documentation and Maintenance** (3 rules)
14. **Testing and Quality** (2 rules)

---

Last updated: August 26, 2025
