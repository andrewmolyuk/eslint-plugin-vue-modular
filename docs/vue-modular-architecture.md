# Vue.js Modular Architecture

Based on industry best practices, established architectural patterns, and lessons learned from large-scale Vue.js applications, this document provides an independent assessment of optimal modular project structures for Vue.js applications.

## Core Architectural Principles

### 1. Domain-Driven Design (DDD)

Modern Vue.js applications should be organized around business domains rather than technical layers. This aligns with DDD principles and makes the codebase more intuitive for business stakeholders.

### 2. Feature-First Organization

Structure code by features/capabilities rather than file types. This improves discoverability and makes it easier for teams to work on complete features.

### 3. Dependency Inversion

Higher-level modules should not depend on lower-level modules. Both should depend on abstractions. This is crucial for maintainable, testable code.

### 4. Single Responsibility Principle

Each module, component, and service should have one reason to change. This reduces coupling and improves maintainability.

### 5. Interface Segregation

Modules should expose minimal, focused interfaces. Large monolithic APIs should be avoided in favor of smaller, purpose-specific interfaces.

## Project Structure

Based on industry standards and Vue ecosystem conventions:

```text
src/
├── app/                          # Application shell and configuration
│   ├── main.ts                   # Application entry point
│   ├── App.vue                   # Root component
│   ├── router.ts                 # Global routing configuration
│   ├── plugins.ts                # Global plugin registration
│   ├── config/                   # Application configuration
│   │   ├── env.ts                # Environment configuration
│   │   └── api.ts                # API configuration
│   ├── middleware/               # Global route middleware
│   │   ├── auth.ts               # Authentication middleware
│   │   └── permissions.ts        # Permission checks
│   ├── layouts/                  # Application layouts
│   │   ├── DefaultLayout.vue     # Main application layout
│   │   ├── AuthLayout.vue        # Authentication layout
│   │   ├── MinimalLayout.vue     # Minimal layout for simple pages
│   │   └── AdminLayout.vue       # Admin interface layout
│   └── components/               # Layout-specific components
│       ├── AppHeader.vue
│       ├── AppSidebar.vue
│       ├── AppFooter.vue
│       └── index.ts              # Component exports
│
├── shared/                       # Cross-cutting concerns
│   ├── ui/                       # UI Kit components (design system)
│   │   ├── VButton.vue
│   │   ├── VInput.vue
│   │   ├── VModal.vue
│   │   └── index.ts              # UI component exports
│   ├── components/               # Business components
│   │   ├── DataTable.vue
│   │   ├── SearchInput.vue
│   │   ├── FileUpload.vue
│   │   └── index.ts              # Component exports
│   ├── composables/              # Reusable composition functions
│   │   ├── useAuth.ts
│   │   ├── useApi.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useValidation.ts
│   │   └── usePermissions.ts
│   ├── services/                 # Cross-cutting services
│   │   ├── apiClient.ts          # HTTP client configuration & interceptors
│   │   ├── storage.ts            # Unified storage abstraction
│   │   ├── auth.ts               # Authentication utilities
│   │   └── notification.ts       # Global notifications
│   ├── stores/                   # Global state management
│   │   ├── auth.ts               # Authentication state
│   │   ├── app.ts                # Application state
│   │   └── notifications.ts      # Global notifications
│   ├── types/                    # Global type definitions
│   │   ├── api.ts                # API response types
│   │   ├── auth.ts               # Authentication types
│   │   └── common.ts             # Common utility types
│   └── utils/                    # Pure utility functions
│       ├── formatters.ts         # Data formatting utilities
│       ├── helpers.ts            # General helper functions
│       └── constants.ts          # Application constants
│
├── features/                     # Feature modules (business domains)
│   ├── auth/                     # Authentication feature
│   │   ├── components/           # Feature-specific components
│   │   │   ├── LoginForm.vue
│   │   │   ├── SignupForm.vue
│   │   │   ├── PasswordReset.vue
│   │   │   └── index.ts          # Component exports
│   │   ├── composables/          # Feature-specific composables
│   │   │   ├── useLogin.ts
│   │   │   ├── useSignup.ts
│   │   │   └── usePasswordReset.ts
│   │   ├── services/             # Feature services
│   │   │   ├── authApi.ts
│   │   │   └── token.ts              # Token utilities
│   │   ├── utils/               # Feature utilities
│   │   │   └── authHelpers.ts
│   │   ├── middleware/           # Feature route guards
│   │   │   └── authGuard.ts
│   │   ├── views/                # Feature pages
│   │   │   ├── LoginView.vue
│   │   │   ├── SignupView.vue
│   │   │   └── PasswordResetView.vue
│   │   ├── routes.ts             # Feature routing
│   │   └── index.ts              # Feature public API
│   │
│   ├── user-management/          # User management feature
│   │   ├── components/
│   │   │   ├── UserList.vue
│   │   │   ├── UserForm.vue
│   │   │   ├── UserCard.vue
│   │   │   ├── RoleSelector.vue
│   │   │   └── index.ts          # Component exports
│   │   ├── composables/
│   │   │   ├── useUsers.ts
│   │   │   ├── useUserForm.ts
│   │   │   └── useRoles.ts
│   │   ├── services/
│   │   │   ├── userApi.ts
│   │   │   └── roleApi.ts
│   │   ├── utils/               # Feature utilities
│   │   │   └── userHelpers.ts
│   │   ├── middleware/           # Feature route guards
│   │   │   └── adminGuard.ts
│   │   ├── stores/
│   │   │   ├── user.ts
│   │   │   └── role.ts
│   │   ├── types/
│   │   │   ├── user.ts
│   │   │   └── role.ts
│   │   ├── views/
│   │   │   ├── UserListView.vue
│   │   │   ├── UserDetailView.vue
│   │   │   └── UserEditView.vue
│   │   ├── routes.ts
│   │   └── index.ts
│   │
│   ├── dashboard/                # Dashboard feature
│   │   ├── components/
│   │   │   ├── StatsCard.vue
│   │   │   ├── ChartWidget.vue
│   │   │   ├── ActivityFeed.vue
│   │   │   └── index.ts          # Component exports
│   │   ├── composables/
│   │   │   ├── useAnalytics.ts
│   │   │   └── useDashboard.ts
│   │   ├── services/
│   │   │   └── analyticsApi.ts
│   │   ├── utils/               # Feature utilities
│   │   │   └── dashboardHelpers.ts
│   │   ├── stores/
│   │   │   └── dashboard.ts
│   │   ├── types/
│   │   │   └── analytics.ts
│   │   ├── views/
│   │   │   └── DashboardView.vue
│   │   ├── routes.ts
│   │   └── index.ts
│   │
│   └── products/                 # Product management feature
│       ├── components/
│       │   ├── ProductList.vue
│       │   ├── ProductCard.vue
│       │   ├── ProductForm.vue
│       │   ├── CategorySelector.vue
│       │   └── index.ts          # Component exports
│       ├── composables/
│       │   ├── useProducts.ts
│       │   ├── useCategories.ts
│       │   └── useProductForm.ts
│       ├── services/
│       │   ├── productApi.ts
│       │   └── categoryApi.ts
│       ├── utils/               # Feature utilities
│       │   └── productHelpers.ts
│       ├── stores/
│       │   ├── product.ts
│       │   └── category.ts
│       ├── types/
│       │   ├── product.ts
│       │   └── category.ts
│       ├── views/
│       │   ├── ProductListView.vue
│       │   ├── ProductDetailView.vue
│       │   └── ProductEditView.vue
│       ├── routes.ts
│       └── index.ts
│
├── views/                        # Global views (not feature-specific)
│   ├── HomeView.vue              # Landing page
│   ├── AboutView.vue             # About page
│   ├── NotFoundView.vue          # 404 page
│   └── ErrorView.vue             # Error page
│
└── assets/                       # Static assets
    ├── images/                   # Image files
    ├── icons/                    # Icon files
    ├── fonts/                    # Font files
    └── styles/                   # Global styles
        ├── main.css              # Main stylesheet
        ├── variables.css         # CSS variables
        ├── components.css        # Component styles
        └── utilities.css         # Utility classes
```

## Rules

### File Organization Rules

- All Vue components must use PascalCase naming (e.g., `UserForm.vue`, `ProductList.vue`)
- All TypeScript files must use camelCase naming (e.g., `useAuth.ts`, `userApi.ts`)
- All folders must use kebab-case naming (e.g., `user-management/`, `auth/`)
- Each feature folder must contain an `index.ts` file as its public API
- All `components/` folders must contain an `index.ts` file for component exports
- The `shared/ui/` folder must contain an `index.ts` file for UI component exports

### Dependency Rules

- Features cannot import from other features directly
- Features can only import from `shared/` folder
- `shared/` folder cannot import from `features/` or `views/`
- `app/` folder can import from `shared/` and `features/` (exception: `app/router.ts` may import feature route files to compose the global router)
- All cross-feature communication must go through the `shared/` layer

### Component Rules

- All Vue components should be written as Single File Components (SFC) with `.vue` extension
- SFC blocks must be ordered: `<script>`, `<template>`, `<style>` (at least one of script or template must exist)
- Layout-specific components must be in `app/components/`
- Reusable UI components (design system) must be in `shared/ui/`
- Business components used across features must be in `shared/components/`
- Feature-specific components must be in `features/{feature}/components/`
- Component props must be typed with TypeScript interfaces

### Service Rules

- Cross-cutting services must be in `shared/services/`
- Feature-specific services must be in `features/{feature}/services/`
- Service files must not have "Service" suffix (e.g., `auth.ts`, not `authService.ts`)
- Services must export named classes or named functions (avoid default exports)
- API services must use the shared `apiClient.ts`

### Store Rules

- Global state must be in `shared/stores/`
- Feature-specific state must be in `features/{feature}/stores/`
- Store files must use Pinia composition API syntax
- Store files must not have "Store" suffix (e.g., `auth.ts`, not `authStore.ts`)
- Cross-cutting concerns (auth, notifications) must be in `shared/stores/`
- Feature stores cannot import other feature stores directly

### Type Rules

- Global types must be in `shared/types/`
- Feature-specific types must be in `features/{feature}/types/`
- Type files must export interfaces and types, not classes
- Common utility types must be in `shared/types/common.ts`
- API response types must be in `shared/types/api.ts`

### Routing Rules

- Global routes must be in `app/router.ts`
- Feature routes must be in `features/{feature}/routes.ts`
- Feature routes must be imported and merged in `app/router.ts`
- Route components must be lazy-loaded using dynamic imports
- Layout selection must be defined in route `meta.layout` property

### View Rules

- Feature views must be in `features/{feature}/views/`
- Global views (not feature-specific) must be in `views/` folder
- View files must end with `View.vue` suffix
- Views cannot contain business logic (delegate to composables/services)
- Layout selection must be defined in route metadata, not imported directly in views

### Composable Rules

- Global composables must be in `shared/composables/`
- Feature composables must be in `features/{feature}/composables/`
- Composable files must start with `use` prefix
- Composables must return reactive refs and computed properties
- Composables cannot directly manipulate DOM elements

### Asset Rules

- Global styles must be in `assets/styles/`
- Images must be in `assets/images/`
- Icons must be in `assets/icons/`
- Fonts must be in `assets/fonts/`
- Component-specific styles must be scoped within component files

### Utility Rules

- Global utilities must be in `shared/utils/`
- Feature-specific utilities must be in `features/{feature}/utils/`
- Utility files must export pure functions without side effects
- Utility functions must be stateless and deterministic

### Middleware Rules

- Global route middleware must be in `app/middleware/`
- Feature-specific middleware must be in `features/{feature}/middleware/`
- Middleware files must use descriptive names (e.g., `authGuard.ts`, not `guard.ts`)
- Route guards must be registered in feature route configurations
- Middleware must be composable and chainable

### Plugin Rules

- Global plugin registration must be in `app/plugins.ts`
- Plugin configurations must be environment-aware
- Third-party plugins must be initialized before app mounting
- Custom plugins must follow Vue.js plugin API conventions
- Plugin dependencies must be clearly documented

### Environment/Config Rules

- Environment configurations must be type-safe
- Configuration files must use `.env` files for environment variables
- Sensitive data must not be committed to version control
- Different environments (dev/staging/prod) must have separate config handling
- Runtime configuration must be validated at application startup
- App configurations must be in `app/config/` folder
- Config files must export typed configuration objects

### Import Rules

- Use absolute imports with `@/` alias for cross-layer imports and shared resources
- Use relative imports for same-feature or nearby file imports (within 2 levels)
- Avoid relative imports with more than 2 levels (`../../../`) - use absolute instead
- Import from `index.ts` files when available
- Group imports: Vue imports, third-party imports, internal imports
- Type imports must use `import type` syntax
- Avoid deep imports into feature internals

### Export Rules

- Use named exports instead of default exports for better tree-shaking
- Internal feature helpers should not be exported from their modules
- Types must be exported with `export type` syntax
- Components must use default exports and be re-exported as named exports in `index.ts`

### Naming Conventions

- Use camelCase for variables, function names, and named exports (e.g., `fetchUsers`, `getUserById`).
- Use PascalCase for exported types, interfaces, classes, and component identifiers (e.g., `User`, `AuthState`, `UserCard`). Avoid `I` prefixes on interfaces
- Prefix composable functions with `use` and keep them camelCase (e.g., `useAuth`, `useProductForm`).
- Pinia store factory exports should follow Pinia's recommendation: start with `use` and include the `Store` suffix (e.g., `useAuthStore`, `useNotificationsStore`)
- Use UPPER_SNAKE_CASE for compile-time constants and environment keys (e.g., `API_TIMEOUT_MS`) and camelCase for runtime constants.
- Component-emitted custom event names should use kebab-case (e.g., `item-selected`, `save:success`).

## Conclusion

This architecture provides a solid foundation for Vue.js applications of any size. The key principles are:

1. **Feature-first organization** over technical layers
2. **Clear dependency boundaries** with the shared layer
3. **Public APIs** for feature integration
4. **Consistent patterns** across the application
5. **Progressive enhancement** - start simple, add complexity as needed

The structure is flexible enough to accommodate different project sizes while maintaining consistency and avoiding common pitfalls that lead to unmaintainable codebases.
