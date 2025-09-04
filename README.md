# eslint-plugin-vue-modular

[![Build Status](https://img.shields.io/github/actions/workflow/status/andrewmolyuk/eslint-plugin-vue-modular/release.yml)](https://github.com/andrewmolyuk/eslint-plugin-vue-modular/actions/workflows/release.yml)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/819ccf509a694fcc8204bca4a78c634d)](https://app.codacy.com/gh/andrewmolyuk/eslint-plugin-vue-modular/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Issues](https://img.shields.io/github/issues/andrewmolyuk/eslint-plugin-vue-modular)](https://github.com/andrewmolyuk/eslint-plugin-vue-modular/issues)
[![NPM downloads](https://img.shields.io/npm/dw/eslint-plugin-vue-modular.svg?style=flat)](https://www.npmjs.com/package/eslint-plugin-vue-modular)
[![semantic-release: conventional](https://img.shields.io/badge/semantic--release-conventional-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)

A custom ESLint plugin for enforcing modular patterns in Vue projects.

> [!NOTE]
> The project is in active development and may have breaking changes in minor versions, but we will strive to keep changes minimal and well-documented.

## Modular Architecture in Vue

In Vue applications, modular architecture means organizing your codebase into self-contained feature modules. Each module typically contains its own components, composables, stores, and styles, grouped by feature rather than by file type. This approach improves maintainability, scalability, and testability by reducing coupling and clarifying dependencies.

With modular architecture, you can:

- Keep related logic together, making features easier to develop and refactor.
- Prevent accidental imports between unrelated features, enforcing clear boundaries.
- Enable teams to work independently on different modules.
- Simplify onboarding by making the project structure more intuitive.

See the [Vue Modular Architecture](./docs/vue-modular-architecture.md) for more details and rationale behind modular structure.

The `eslint-plugin-vue-modular` plugin helps enforce these boundaries, ensuring that your Vue project remains modular as it grows.

## Features

- Custom linting rules for Vue modular architecture
- Supports single-file components (SFC)
- Enforces architectural boundaries between features
- Automatic test file detection - test files can import from anywhere without restrictions
- Supports both flat config (ESLint v9+) and legacy config formats
- Easily extendable for your team's needs

## Installation

This package is published on npm and should be installed as a devDependency in your project.

```bash
npm install eslint-plugin-vue-modular --save-dev
```

> [!NOTE]  
> ESLint is not bundled with eslint-plugin-vue-modular. You need to install ESLint separately in your project.

## Usage

We provide two predefined configurations to help enforce modular architecture principles in your Vue.js projects:

- **recommended** - enables the rules that follow best practices for modular architecture and Vue.js development.
- **all** - enables all of the rules shipped with eslint-plugin-vue-modular.

### ESLint v9+ Configuration (Recommended)

```javascript
import vueModular from 'eslint-plugin-vue-modular'

export default [...vueModular.configs.recommended]
```

### Legacy ESLint v8 Configuration

```javascript
// .eslintrc.js
module.exports = {
  extends: ['plugin:vue-modular/legacy-all'],
}
```

### Quick Start

1. Install the plugin: `npm install eslint-plugin-vue-modular --save-dev`
2. Add the recommended configuration to your ESLint config
3. Run: `npx eslint src/`

The plugin will now enforce modular architecture patterns in your Vue.js project!

## Rules

This plugin provides rules to enforce modular architecture boundaries in Vue.js applications.

> [!IMPORTANT]  
> The list of rules is a work in progress. Rules with links are implemented and documented, and can be used in your project.

### File Organization Rules

| Rule                                                                       | Description                                                                              |
| -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| [vue-modular/file-component-naming](./docs/rules/file-component-naming.md) | All Vue components must use PascalCase naming (e.g., `UserForm.vue`, `ProductList.vue`). |
| [vue-modular/file-ts-naming](./docs/rules/file-ts-naming.md)               | All TypeScript files must use camelCase naming (e.g., `useAuth.ts`, `userApi.ts`).       |
| vue-modular/folder-kebab-case                                              | All folders must use kebab-case naming (e.g., `user-management/`, `auth/`).              |
| vue-modular/feature-index-required                                         | Each feature folder must contain an `index.ts` file as its public API.                   |
| vue-modular/components-index-required                                      | All `components/` folders must contain an `index.ts` file for component exports.         |
| vue-modular/shared-ui-index-required                                       | The `shared/ui/` folder must contain an `index.ts` file for UI component exports.        |

### Dependency Rules

| Rule                                         | Description                                                                                                                                       |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| vue-modular/no-direct-feature-imports        | Features cannot import from other features directly.                                                                                              |
| vue-modular/feature-imports-from-shared-only | Features can only import from `shared/` folder.                                                                                                   |
| vue-modular/no-shared-imports-from-features  | `shared/` folder cannot import from `features/` or `views/`.                                                                                      |
| vue-modular/app-imports                      | `app/` folder can import from `shared/` and `features/` (exception: `app/router.ts` may import feature route files to compose the global router). |
| vue-modular/cross-feature-via-shared         | All cross-feature communication must go through the `shared/` layer.                                                                              |

### Component Rules

| Rule                                     | Description                                                                                                      |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| vue-modular/sfc-required                 | All Vue components should be written as Single File Components (SFC) with `.vue` extension.                      |
| vue-modular/sfc-order                    | SFC blocks must be ordered: `<script>`, `<template>`, `<style>` (at least one of script or template must exist). |
| vue-modular/layout-components-location   | Layout-specific components must be in `app/components/`.                                                         |
| vue-modular/ui-components-location       | Reusable UI components (design system) must be in `shared/ui/`.                                                  |
| vue-modular/business-components-location | Business components used across features must be in `shared/components/`.                                        |
| vue-modular/feature-components-location  | Feature-specific components must be in `features/{feature}/components/`.                                         |
| vue-modular/component-props-typed        | Component props must be typed with TypeScript interfaces.                                                        |

### Service Rules

| Rule                                   | Description                                                                           |
| -------------------------------------- | ------------------------------------------------------------------------------------- |
| vue-modular/services-shared-location   | Cross-cutting services must be in `shared/services/`.                                 |
| vue-modular/services-feature-location  | Feature-specific services must be in `features/{feature}/services/`.                  |
| vue-modular/service-filename-no-suffix | Service files must not have "Service" suffix (e.g., `auth.ts`, not `authService.ts`). |
| vue-modular/service-named-exports      | Services must export named classes or named functions (avoid default exports).        |
| vue-modular/service-use-api-client     | API services must use the shared `apiClient.ts`.                                      |

### Store Rules

| Rule                                  | Description                                                                     |
| ------------------------------------- | ------------------------------------------------------------------------------- |
| vue-modular/stores-shared-location    | Global state must be in `shared/stores/`.                                       |
| vue-modular/stores-feature-location   | Feature-specific state must be in `features/{feature}/stores/`.                 |
| vue-modular/store-pinia-composition   | Store files must use Pinia composition API syntax.                              |
| vue-modular/store-filename-no-suffix  | Store files must not have "Store" suffix (e.g., `auth.ts`, not `authStore.ts`). |
| vue-modular/stores-cross-cutting      | Cross-cutting concerns (auth, notifications) must be in `shared/stores/`.       |
| vue-modular/feature-stores-no-imports | Feature stores cannot import other feature stores directly.                     |

### Type Rules

| Rule                                | Description                                                    |
| ----------------------------------- | -------------------------------------------------------------- |
| vue-modular/types-shared-location   | Global types must be in `shared/types/`.                       |
| vue-modular/types-feature-location  | Feature-specific types must be in `features/{feature}/types/`. |
| vue-modular/types-export-interfaces | Type files must export interfaces and types, not classes.      |
| vue-modular/types-common-location   | Common utility types must be in `shared/types/common.ts`.      |
| vue-modular/types-api-location      | API response types must be in `shared/types/api.ts`.           |

### Routing Rules

| Rule                                | Description                                                       |
| ----------------------------------- | ----------------------------------------------------------------- |
| vue-modular/routes-global-location  | Global routes must be in `app/router.ts`.                         |
| vue-modular/routes-feature-location | Feature routes must be in `features/{feature}/routes.ts`.         |
| vue-modular/routes-merge-in-app     | Feature routes must be imported and merged in `app/router.ts`.    |
| vue-modular/routes-lazy-load        | Route components must be lazy-loaded using dynamic imports.       |
| vue-modular/routes-layout-meta      | Layout selection must be defined in route `meta.layout` property. |

### View Rules

| Rule                                | Description                                                                         |
| ----------------------------------- | ----------------------------------------------------------------------------------- |
| vue-modular/views-feature-location  | Feature views must be in `features/{feature}/views/`.                               |
| vue-modular/views-global-location   | Global views (not feature-specific) must be in `views/` folder.                     |
| vue-modular/views-suffix            | View files must end with `View.vue` suffix.                                         |
| vue-modular/views-no-business-logic | Views cannot contain business logic (delegate to composables/services).             |
| vue-modular/views-layout-meta       | Layout selection must be defined in route metadata, not imported directly in views. |

### Composable Rules

| Rule                                     | Description                                                       |
| ---------------------------------------- | ----------------------------------------------------------------- |
| vue-modular/composables-shared-location  | Global composables must be in `shared/composables/`.              |
| vue-modular/composables-feature-location | Feature composables must be in `features/{feature}/composables/`. |
| vue-modular/composables-prefix-use       | Composable files must start with `use` prefix.                    |
| vue-modular/composables-return-reactive  | Composables must return reactive refs and computed properties.    |
| vue-modular/composables-no-dom           | Composables cannot directly manipulate DOM elements.              |

### Asset Rules

| Rule                               | Description                                                      |
| ---------------------------------- | ---------------------------------------------------------------- |
| vue-modular/assets-styles-location | Global styles must be in `assets/styles/`.                       |
| vue-modular/assets-images-location | Images must be in `assets/images/`.                              |
| vue-modular/assets-icons-location  | Icons must be in `assets/icons/`.                                |
| vue-modular/assets-fonts-location  | Fonts must be in `assets/fonts/`.                                |
| vue-modular/assets-scoped-styles   | Component-specific styles must be scoped within component files. |

### Utility Rules

| Rule                               | Description                                                        |
| ---------------------------------- | ------------------------------------------------------------------ |
| vue-modular/utils-shared-location  | Global utilities must be in `shared/utils/`.                       |
| vue-modular/utils-feature-location | Feature-specific utilities must be in `features/{feature}/utils/`. |
| vue-modular/utils-pure-functions   | Utility files must export pure functions without side effects.     |
| vue-modular/utils-stateless        | Utility functions must be stateless and deterministic.             |

### Middleware Rules

| Rule                                     | Description                                                                         |
| ---------------------------------------- | ----------------------------------------------------------------------------------- |
| vue-modular/middleware-global-location   | Global route middleware must be in `app/middleware/`.                               |
| vue-modular/middleware-feature-location  | Feature-specific middleware must be in `features/{feature}/middleware/`.            |
| vue-modular/middleware-descriptive-names | Middleware files must use descriptive names (e.g., `authGuard.ts`, not `guard.ts`). |
| vue-modular/middleware-registration      | Route guards must be registered in feature route configurations.                    |
| vue-modular/middleware-composable        | Middleware must be composable and chainable.                                        |

### Plugin Rules

| Rule                                  | Description                                                  |
| ------------------------------------- | ------------------------------------------------------------ |
| vue-modular/plugins-registration      | Global plugin registration must be in `app/plugins.ts`.      |
| vue-modular/plugins-env-aware         | Plugin configurations must be environment-aware.             |
| vue-modular/plugins-init-before-mount | Third-party plugins must be initialized before app mounting. |
| vue-modular/plugins-api-conformance   | Custom plugins must follow Vue.js plugin API conventions.    |
| vue-modular/plugins-document-deps     | Plugin dependencies must be clearly documented.              |

### Environment / Config Rules

| Rule                                | Description                                                                   |
| ----------------------------------- | ----------------------------------------------------------------------------- |
| vue-modular/config-type-safe        | Environment configurations must be type-safe.                                 |
| vue-modular/config-env-files        | Configuration files must use `.env` files for environment variables.          |
| vue-modular/config-no-secrets       | Sensitive data must not be committed to version control.                      |
| vue-modular/config-environments     | Different environments (dev/staging/prod) must have separate config handling. |
| vue-modular/config-validate-runtime | Runtime configuration must be validated at application startup.               |
| vue-modular/config-location         | App configurations must be in `app/config/` folder.                           |
| vue-modular/config-export-typed     | Config files must export typed configuration objects.                         |

### Import Rules

| Rule                                 | Description                                                                          |
| ------------------------------------ | ------------------------------------------------------------------------------------ |
| vue-modular/imports-absolute-alias   | Use absolute imports with `@/` alias for cross-layer imports and shared resources.   |
| vue-modular/imports-relative-local   | Use relative imports for same-feature or nearby file imports (within 2 levels).      |
| vue-modular/imports-no-deep-relative | Avoid relative imports with more than 2 levels (`../../../`) - use absolute instead. |
| vue-modular/imports-from-index       | Import from `index.ts` files when available.                                         |
| vue-modular/imports-grouping         | Group imports: Vue imports, third-party imports, internal imports.                   |
| vue-modular/imports-type-syntax      | Type imports must use `import type` syntax.                                          |
| vue-modular/imports-avoid-deep       | Avoid deep imports into feature internals.                                           |

### Export Rules

| Rule                                 | Description                                                                            |
| ------------------------------------ | -------------------------------------------------------------------------------------- |
| vue-modular/exports-named            | Use named exports instead of default exports for better tree-shaking.                  |
| vue-modular/exports-internal-hidden  | Internal feature helpers should not be exported from their modules.                    |
| vue-modular/exports-types            | Types must be exported with `export type` syntax.                                      |
| vue-modular/exports-components-index | Components must use default exports and be re-exported as named exports in `index.ts`. |

### Naming Conventions

| Rule                                  | Description                                                                                                                                                  |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| vue-modular/naming-camelcase-runtime  | Use camelCase for variables, function names, and named exports (e.g., `fetchUsers`, `getUserById`).                                                          |
| vue-modular/naming-pascalcase-exports | Use PascalCase for exported types, interfaces, classes, and component identifiers (e.g., `User`, `AuthState`, `UserCard`). Avoid `I` prefixes on interfaces. |
| vue-modular/naming-composables-prefix | Prefix composable functions with `use` and keep them camelCase (e.g., `useAuth`, `useProductForm`).                                                          |
| vue-modular/naming-pinia-stores       | Pinia store factory exports should follow Pinia's recommendation: start with `use` and include the `Store` suffix (e.g., `useAuthStore`).                    |
| vue-modular/naming-constants          | Use UPPER_SNAKE_CASE for compile-time constants and environment keys and camelCase for runtime constants.                                                    |
| vue-modular/naming-event-kebab        | Component-emitted custom event names should use kebab-case (e.g., `item-selected`, `save:success`).                                                          |

## Contributing

Pull requests and issues are welcome! Please follow the code style and add tests for new rules.

## License

MIT, see [LICENSE](./LICENSE) for details.
