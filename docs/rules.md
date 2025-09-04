# Rules

This document outlines the ESLint rules for enforcing the architectural guidelines of the Vue modular design system.

| Rule                                         | Short description                                                                       | Severity | Released |
| -------------------------------------------- | --------------------------------------------------------------------------------------- | :------: | :------: |
| vue-modular/dependency-no-cross-feature      | Features cannot import from other features directly                                     |  error   |    No    |
| vue-modular/dependency-only-shared           | Features may only import from the `shared/` folder                                      |  error   |    No    |
| vue-modular/shared-no-import-features        | `shared/` folder must not import from `features/` or `views/`                           |  error   |    No    |
| vue-modular/cross-feature-through-shared     | All cross-feature communication must go through the `shared/` layer                     |  error   |    No    |
| vue-modular/feature-index-required           | Each feature folder must contain an `index.ts` file as its public API                   |  error   |    No    |
| vue-modular/import-from-index                | Import from `index.ts` files when available                                             |  error   |    No    |
| vue-modular/no-deep-imports                  | Avoid deep imports into feature internals                                               |  error   |    No    |
| vue-modular/import-no-deep-relative          | Avoid relative imports with more than 2 levels (`../../../`) - use absolute instead     |   warn   |    No    |
| vue-modular/stores-global-location           | Global state must be in `shared/stores/`                                                |  error   |    No    |
| vue-modular/stores-cross-cutting             | Cross-cutting concerns (auth, notifications) must be in `shared/stores/`                |  error   |    No    |
| vue-modular/store-pinia-composition          | Store files must use Pinia composition API syntax                                       |  error   |    No    |
| vue-modular/store-filename-no-suffix         | Store files must not have `Store` suffix (e.g., `auth.ts`)                              |  error   |    No    |
| vue-modular/stores-feature-location          | Feature-specific state must be in `features/{feature}/stores/`                          |  error   |    No    |
| vue-modular/feature-stores-isolation         | Feature stores cannot import other feature stores directly                              |  error   |    No    |
| vue-modular/services-shared-location         | Cross-cutting services must be in `shared/services/`                                    |  error   |    No    |
| vue-modular/services-feature-location        | Feature-specific services must be in `features/{feature}/services/`                     |  error   |    No    |
| vue-modular/service-filename-no-suffix       | Service files must not have a `Service` suffix (e.g., `auth.ts` not `authService.ts`)   |  error   |    No    |
| vue-modular/services-named-exports           | Services must export named functions/classes (avoid default exports)                    |  error   |    No    |
| vue-modular/component-sfc-required           | All Vue components must be Single File Components (`.vue`)                              |  error   |    No    |
| vue-modular/component-props-typed            | Component props must be typed with TypeScript interfaces                                |  error   |    No    |
| vue-modular/sfc-block-order                  | SFC blocks must be ordered: `script`, `template`, `style` (script or template required) |  error   |    No    |
| vue-modular/types-global-location            | Global types must be in `shared/types/`                                                 |  error   |    No    |
| vue-modular/types-feature-location           | Feature-specific types must be in `features/{feature}/types/`                           |  error   |    No    |
| vue-modular/types-export-interfaces          | Type files must export interfaces and types, not classes                                |  error   |    No    |
| vue-modular/types-api-location               | API response types must be in `shared/types/api.ts`                                     |  error   |    No    |
| vue-modular/routes-global-location           | Global routes must be in `app/router.ts`                                                |  error   |    No    |
| vue-modular/routes-feature-location          | Feature routes must be in `features/{feature}/routes.ts`                                |  error   |    No    |
| vue-modular/routes-merged-in-app             | Feature routes must be imported and merged in `app/router.ts`                           |  error   |    No    |
| vue-modular/route-components-lazy            | Route components must be lazy-loaded using dynamic imports                              |  error   |    No    |
| vue-modular/export-named-preferred           | Use named exports instead of default exports for better tree-shaking                    |  error   |    No    |
| vue-modular/export-no-internal-helpers       | Internal feature helpers should not be exported from their modules                      |  error   |    No    |
| vue-modular/config-no-sensitive-committed    | Sensitive data must not be committed to version control                                 |  error   |    No    |
| vue-modular/config-export-typed              | Config files must export typed configuration objects                                    |  error   |    No    |
| vue-modular/config-env-type-safe             | Environment configurations must be type-safe                                            |  error   |    No    |
| vue-modular/components-index-required        | All `components/` folders must contain an `index.ts` file for component exports         |  error   |    No    |
| vue-modular/shared-ui-index-required         | The `shared/ui/` folder must contain an `index.ts` file for UI component exports        |  error   |    No    |
| vue-modular/component-export-pattern         | Components must use default exports and be re-exported as named exports in `index.ts`   |   warn   |    No    |
| vue-modular/shared-ui-location               | Reusable UI components (design system) must be in `shared/ui/`                          |   warn   |    No    |
| vue-modular/shared-components-location       | Business components used across features must be in `shared/components/`                |   warn   |    No    |
| vue-modular/feature-components-location      | Feature-specific components must be in `features/{feature}/components/`                 |   warn   |    No    |
| vue-modular/layout-components-location       | Layout-specific components must live in `app/components/`                               |   warn   |    No    |
| vue-modular/views-feature-location           | Feature views must be in `features/{feature}/views/`                                    |   warn   |    No    |
| vue-modular/views-global-location            | Global views must be in `views/`                                                        |   warn   |    No    |
| vue-modular/view-filenames-suffix            | View files must end with `View.vue` suffix                                              |   warn   |    No    |
| vue-modular/views-no-business-logic          | Views cannot contain business logic (delegate to composables/services)                  |   warn   |    No    |
| vue-modular/views-layout-metadata            | Layout selection must be defined in route metadata (not imported in views)              |   warn   |    No    |
| vue-modular/composables-shared-location      | Global composables must be in `shared/composables/`                                     |   warn   |    No    |
| vue-modular/composables-feature-location     | Feature composables must be in `features/{feature}/composables/`                        |   warn   |    No    |
| vue-modular/composable-filename-use-prefix   | Composable files must start with `use` prefix                                           |   warn   |    No    |
| vue-modular/composables-signature            | Composables must return reactive refs and computed properties                           |   warn   |    No    |
| vue-modular/composables-no-dom-manipulation  | Composables cannot directly manipulate DOM elements                                     |   warn   |    No    |
| vue-modular/middleware-global-location       | Global route middleware must be in `app/middleware/`                                    |   warn   |    No    |
| vue-modular/middleware-feature-location      | Feature-specific middleware must be in `features/{feature}/middleware/`                 |   warn   |    No    |
| vue-modular/middleware-descriptive-names     | Middleware files must use descriptive names (e.g., `authGuard.ts`)                      |   warn   |    No    |
| vue-modular/middleware-register-route-guards | Route guards must be registered in feature route configurations                         |   warn   |    No    |
| vue-modular/middleware-chainable             | Middleware must be composable and chainable                                             |   warn   |    No    |
| vue-modular/plugins-global-registration      | Global plugin registration must be in `app/plugins.ts`                                  |   warn   |    No    |
| vue-modular/plugins-initialize-before-mount  | Third-party plugins must be initialized before app mounting                             |   warn   |    No    |
| vue-modular/plugins-vue-api                  | Custom plugins must follow Vue.js plugin API conventions                                |   warn   |    No    |
| vue-modular/plugins-env-aware                | Plugin configurations must be environment-aware                                         |   warn   |    No    |
| vue-modular/plugins-dependencies-documented  | Plugin dependencies must be clearly documented                                          |   warn   |    No    |
| vue-modular/api-services-use-client          | API services must use the shared `apiClient.ts`                                         |   warn   |    No    |
| vue-modular/import-absolute-alias            | Use absolute imports with `@/` alias for cross-layer imports and shared resources       |   warn   |    No    |
| vue-modular/import-relative-same-feature     | Use relative imports for same-feature or nearby file imports (within 2 levels)          |   warn   |    No    |
| vue-modular/import-grouping                  | Group imports: Vue imports, third-party imports, internal imports                       |   warn   |    No    |
| vue-modular/import-type-syntax               | Type imports must use `import type` syntax                                              |   warn   |    No    |
| vue-modular/types-common-location            | Common utility types must be in `shared/types/common.ts`                                |   warn   |    No    |
| vue-modular/config-multi-env-handling        | Different environments (dev/staging/prod) must have separate config handling            |   warn   |    No    |
| vue-modular/runtime-config-validate          | Runtime configuration must be validated at application startup                          |   warn   |    No    |
| vue-modular/app-config-location              | App configurations must be in `app/config/` folder                                      |   warn   |    No    |
| vue-modular/naming-pinia-store-export        | Pinia store factory exports should follow `useXStore` naming                            |   warn   |    No    |
| vue-modular/naming-composables-prefix        | Prefix composable functions with `use` and keep them camelCase                          |   warn   |    No    |
| vue-modular/naming-camelcase-vars            | Use camelCase for variables, function names, and named exports                          |   warn   |    No    |
| vue-modular/naming-pascalcase-types          | Use PascalCase for exported types, interfaces, classes, and component identifiers       |   warn   |    No    |
| vue-modular/naming-constants                 | Use UPPER_SNAKE_CASE for compile-time constants and environment keys                    |   warn   |    No    |
| vue-modular/naming-events-kebab              | Component-emitted custom event names should use kebab-case                              |   warn   |    No    |
| vue-modular/file-components-pascalcase       | All Vue component filenames must use PascalCase (e.g., `UserForm.vue`)                  |   warn   |    No    |
| vue-modular/file-types-camelcase             | All TypeScript filenames must use camelCase (e.g., `useAuth.ts`)                        |   warn   |    No    |
| vue-modular/folder-kebabcase                 | All folder names must use kebab-case (e.g., `user-management/`)                         |   warn   |    No    |
| vue-modular/assets-styles-location           | Global styles must be in `assets/styles/`                                               |   warn   |    No    |
| vue-modular/assets-images-location           | Images must be in `assets/images/`                                                      |   warn   |    No    |
| vue-modular/assets-icons-location            | Icons must be in `assets/icons/`                                                        |   warn   |    No    |
| vue-modular/assets-fonts-location            | Fonts must be in `assets/fonts/`                                                        |   warn   |    No    |
| vue-modular/component-styles-scoped          | Component-specific styles must be scoped within component files                         |   warn   |    No    |
| vue-modular/utils-global-location            | Global utilities must be in `shared/utils/`                                             |   warn   |    No    |
| vue-modular/utils-feature-location           | Feature-specific utilities must be in `features/{feature}/utils/`                       |   warn   |    No    |
| vue-modular/utils-pure-functions             | Utility files must export pure functions without side effects                           |   warn   |    No    |
| vue-modular/utils-stateless                  | Utility functions must be stateless and deterministic                                   |   warn   |    No    |
| vue-modular/app-import-exceptions            | `app/` may import from `shared/` and `features/` (router exception allowed)             |   warn   |    No    |
| vue-modular/export-types-type-syntax         | Types must be exported with `export type` syntax                                        |   warn   |    No    |
