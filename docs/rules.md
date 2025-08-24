# Rules

This plugin provides rules to enforce modular architecture boundaries in Vue.js applications.

## Available Rules

| Rule                                                                          | Description                                                     | Type    | Recommended | Fixable |
| ----------------------------------------------------------------------------- | --------------------------------------------------------------- | ------- | ----------- | ------- |
| [`vue-modular/no-cross-feature-imports`](./rules/no-cross-feature-imports.md) | Prevents direct imports from deep inside feature folders        | Problem | ✅          | ❌      |
| [`vue-modular/no-cross-module-imports`](./rules/no-cross-module-imports.md)   | Prevents imports between different modules                      | Problem | ✅          | ❌      |
| [`vue-modular/src-structure`](./rules/src-structure.md)                       | Enforces allowed top-level folders/files in source directory    | Problem | ✅          | ❌      |
| [`vue-modular/app-structure`](./rules/app-structure.md)                       | Enforces presence of application infrastructure under `src/app` | Problem | ✅          | ❌      |

## Rule Categories

### Architectural Boundaries

Rules that help maintain clean architectural boundaries in your Vue.js application:

- [`vue-modular/no-cross-feature-imports`](./rules/no-cross-feature-imports.md) - Enforces that features should only be imported through their entry points
- [`vue-modular/no-cross-module-imports`](./rules/no-cross-module-imports.md) - Prevents imports between different modules
- [`vue-modular/src-structure`](./rules/src-structure.md) - Enforces allowed top-level folders/files in source directory
- [`vue-modular/src-structure`](./rules/src-structure.md) - Enforces allowed top-level folders/files in source directory
- [`vue-modular/app-structure`](./rules/app-structure.md) - Enforces presence of application infrastructure under `src/app`

## Planned Rules

For a comprehensive list of planned rules and development timeline, see our [Roadmap](./roadmap.md).

### Coming Soon

| Rule                                       | Priority | Description                                                |
| ------------------------------------------ | -------- | ---------------------------------------------------------- |
| `vue-modular/enforce-module-exports`       | High     | Ensure modules expose functionality through index.ts files |
| `vue-modular/enforce-import-boundaries`    | High     | Enforce proper import paths based on module structure      |
| `vue-modular/no-cross-module-store-access` | High     | Prevent direct access to other modules' stores             |

## Configuration

For detailed configuration examples and usage instructions, see the [main README](../README.md).

## Further Reading

- [Feature-Driven Development](https://en.wikipedia.org/wiki/Feature-driven_development)
- [Modular Architecture in Frontend Applications](https://martinfowler.com/articles/micro-frontends.html)
- [Vue.js Large Scale Application Architecture](https://vuejs.org/guide/scaling-up/state-management.html)
