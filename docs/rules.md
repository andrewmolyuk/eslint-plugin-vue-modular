# Rules

This plugin provides rules to enforce modular architecture boundaries in Vue.js applications.

## Available Rules

| Rule                                                                                | Description                                                                          | Type       | Recommended | Fixable |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ---------- | ----------- | ------- |
| [`vue-modular/no-cross-feature-imports`](./rules/no-cross-feature-imports.md)       | Prevents direct imports from deep inside feature folders                             | Problem    | ✅          | ❌      |
| [`vue-modular/no-cross-module-imports`](./rules/no-cross-module-imports.md)         | Prevents imports between different modules                                           | Problem    | ✅          | ❌      |
| [`vue-modular/no-business-logic-in-ui-kit`](./rules/no-business-logic-in-ui-kit.md) | Prevents business logic imports in UI kit components                                 | Problem    | ✅          | ❌      |
| [`vue-modular/enforce-import-boundaries`](./rules/enforce-import-boundaries.md)     | Consolidated import-boundary enforcement                                             | Problem    | ✅          | ❌      |
| [`vue-modular/enforce-src-structure`](./rules/enforce-src-structure.md)             | Enforces allowed top-level folders/files in source directory (including `services/`) | Problem    | ✅          | ❌      |
| [`vue-modular/enforce-app-structure`](./rules/enforce-app-structure.md)             | Enforces presence of application infrastructure under `src/app`                      | Problem    | ✅          | ❌      |
| [`vue-modular/enforce-module-exports`](./rules/enforce-module-exports.md)           | Ensures modules expose a public API via index.ts/index.js                            | Problem    | ✅          | ❌      |
| [`vue-modular/enforce-feature-exports`](./rules/enforce-feature-exports.md)         | Ensures global features expose a public API via index.ts/index.js                    | Problem    | ✅          | ❌      |
| [`vue-modular/enforce-naming-convention`](./rules/enforce-naming-convention.md)     | Enforce consistent naming patterns for Vue components                                | Suggestion | ❌          | ❌      |

## Rule Categories

### Architectural Boundaries

Rules that help maintain clean architectural boundaries in your Vue.js application:

- [`vue-modular/no-cross-feature-imports`](./rules/no-cross-feature-imports.md) - Enforces that features should only be imported through their entry points
- [`vue-modular/no-cross-module-imports`](./rules/no-cross-module-imports.md) - Prevents imports between different modules
- [`vue-modular/no-business-logic-in-ui-kit`](./rules/no-business-logic-in-ui-kit.md) - Prevents business logic imports in UI kit components
- [`vue-modular/enforce-import-boundaries`](./rules/enforce-import-boundaries.md) - Consolidated import-boundary enforcement (modules/features/app/shared)
- [`vue-modular/enforce-src-structure`](./rules/enforce-src-structure.md) - Enforces allowed top-level folders/files in source directory (including `services/`)
- [`vue-modular/enforce-app-structure`](./rules/enforce-app-structure.md) - Enforces presence of application infrastructure under `src/app`
- [`vue-modular/enforce-module-exports`](./rules/enforce-module-exports.md) - Ensures modules expose a public API via `index.ts`/`index.js`
- [`vue-modular/enforce-feature-exports`](./rules/enforce-feature-exports.md) - Ensures global features expose a public API via `index.ts`/`index.js`

### Component Organization

Rules that help maintain consistent component organization and naming:

- [`vue-modular/enforce-naming-convention`](./rules/enforce-naming-convention.md) - Enforce consistent naming patterns for Vue components

## Planned Rules

For a comprehensive list of planned rules and development timeline, see our [Roadmap](./roadmap.md).

## Configuration

For detailed configuration examples and usage instructions, see the [main README](../README.md).

## Further Reading

- [Feature-Driven Development](https://en.wikipedia.org/wiki/Feature-driven_development)
- [Modular Architecture in Frontend Applications](https://martinfowler.com/articles/micro-frontends.html)
- [Vue.js Large Scale Application Architecture](https://vuejs.org/guide/scaling-up/state-management.html)
