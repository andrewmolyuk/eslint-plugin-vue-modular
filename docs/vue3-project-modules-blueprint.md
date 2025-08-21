# Vue 3 Project Modules Blueprint

This document provides recommendations for structuring Vue 3 projects using **modules**.  
A module represents a domain (e.g., `auth`, `users`, `notifications`) and may contain **views, components, services, composables, and stores**.

**Key Concepts:**
- **Modules** = Domain-specific folders containing related functionality
- **Global assets** = Reusable code accessible by all modules (components/, composables/, entities/, features/)
- **App infrastructure** = Framework setup and configuration (app/ folder)
- **Shared utilities** = Basic UI kit and utility functions (shared/ folder)

---

## Example Project Structure

```plaintext
src/
├── app/                      # Infrastructure and global setup
│   ├── router/               # Route registration
│   │   └── index.ts
│   ├── stores/               # Pinia/Vuex root store setup
│   ├── plugins/              # Global plugins (axios, i18n, etc.)
│   └── layouts/              # App-level layouts (DefaultLayout.vue, AuthLayout.vue)
│
├── components/               # Global reusable components
│   ├── layout/               # Layout-related components
│   └── form/                 # Form-related components
│
├── composables/              # Global reusable composables
│   ├── useApi.ts
│   ├── useAuth.ts
│   └── useLocalStorage.ts
│
├── entities/                 # Global business entities
│   ├── base/
│   ├── User.ts
│   └── Permission.ts
│
├── features/                 # Global reusable features
│   ├── search/
│   ├── file-upload/
│   ├── data-table/
│   └── notifications/
│
├── modules/
│   ├── auth/                 # Route-based module
│   │   ├── views/
│   │   │   ├── LoginView.vue
│   │   │   ├── RegisterView.vue
│   │   │   └── ForgotPasswordView.vue
│   │   ├── components/
│   │   │   └── LoginForm.vue
│   │   ├── services/
│   │   │   └── auth.api.ts
│   │   ├── composables/
│   │   │   └── useLogin.ts
│   │   ├── store/
│   │   │   └── useAuthStore.ts
│   │   ├── entities/         # Business/domain entities for auth
│   │   └── routes.ts
│   │
│   ├── users/                # Another route-based module
│   │   ├── views/
│   │   │   ├── UserListView.vue
│   │   │   ├── UserDetailView.vue
│   │   │   └── UserEditView.vue
│   │   ├── components/
│   │   │   └── UserTable.vue
│   │   ├── services/
│   │   │   └── users.api.ts
│   │   ├── composables/
│   │   │   └── useUsers.ts
│   │   ├── entities/         # Business/domain entities for users
│   │   ├── routes.ts
│   │   ├── menu.ts
│   │   └── index.ts
│   │
│   ├── notifications/        # Logic-only module (no views)
│   │   ├── composables/
│   │   │   └── useNotifications.ts
│   │   ├── components/
│   │   │   └── Toast.vue
│   │   ├── entities/         # Business/domain entities for notifications
│   │   └── store/
│   │       └── useNotificationStore.ts
│   │
│   └── settings/             # Mixed module (routes + logic)
│       ├── views/
│       │   └── SettingsView.vue
│       ├── services/
│       │   └── settings.api.ts
│       ├── composables/
│       │   └── useSettings.ts
│       └── entities/         # Business/domain entities for settings
│
├── shared/                   # Cross-module utilities and UI kit
│   ├── ui/                   # Basic UI kit (buttons, inputs, forms, etc.)
│   └── utils/                # Formatters, validators, etc.
│
├── App.vue                   # Application root component
└── main.ts                   # Application entry point
```

---

## What belongs where?

**Within each module:**

- **views/** → Pages mapped to routes (e.g., `LoginView.vue`, `UserListView.vue`).  
- **components/** → UI parts specific to the module (not shared globally).  
- **services/** → API calls or domain logic (e.g., `auth.api.ts`).  
- **composables/** → Hooks with stateful or computed logic (e.g., `useUsers.ts`).  
- **store/** → Module-specific Pinia/Vuex stores (e.g., `useAuthStore.ts`).  
- **entities/** → Business/domain entities specific to this module.  
- **routes.ts** → Defines routes for this module.  
- **menu.ts** → Navigation items for this module (if applicable).

**Note:** Global stores (shared across modules) go in `app/stores/`, while module-specific stores go in `modules/<module-name>/store/`.

---

## Routing Registration

Each module exports its own routes, then `app/router/index.ts` registers them:

```ts
// app/router/index.ts
import { createRouter, createWebHistory } from "vue-router"
import authRoutes from "@/modules/auth/routes"
import userRoutes from "@/modules/users/routes"
import settingsRoutes from "@/modules/settings/routes"

const routes = [
  ...authRoutes,
  ...userRoutes,
  ...settingsRoutes
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
```

## Module Navigation

Each module defines its own `menu.ts` for menu items related to that module:

```ts
// modules/users/menu.ts
import type { MenuItem } from "@/app/types"

export const userNav: MenuItem[] = [
  {
    title: 'User List',
    description: 'Manage system users',
    icon: 'Users',
    route: ROUTES.USERS_LIST,
  },
  {
    title: 'User Roles',
    description: 'User roles and permissions',
    icon: 'Shield',
    route: ROUTES.USER_ROLES,
  },
]
```

The app menu aggregator imports all module-level navigation and merges them:

```ts
// app/menu/index.ts
import { authNav } from "@/modules/auth/menu"
import { userNav } from "@/modules/users/menu"
import { settingsNav } from "@/modules/settings/menu"

export const navigation = [
  {
    title: 'Authentication',
    icon: 'Key',
    groups: [
      {
        title: 'General',
        items: [
          ...authNav,
        ]
      }
    ]
  },
  {
    title: 'Users',
    icon: 'Users',
    groups: [
      {
        title: 'Management',
        items: [
          ...userNav,
        ]
      }
    ]
  }
]
```

The sidebar component (e.g., `AppSidebar.vue`) consumes the aggregated menu and renders groups/items.

## Navigation Organization Patterns

### Navigation Structure Types

**1. Simple Navigation (Small Apps)**
```ts
// app/navigation/index.ts
export const navigation = [
  { title: 'Dashboard', route: '/dashboard', icon: 'Home' },
  { title: 'Users', route: '/users', icon: 'Users' },
  { title: 'Settings', route: '/settings', icon: 'Settings' },
]
```

**2. Grouped Navigation (Medium Apps)**
```ts
// app/navigation/index.ts
export const navigation = [
  {
    title: 'Management',
    items: [
      { title: 'Dashboard', route: '/dashboard', icon: 'Home' },
      { title: 'Users', route: '/users', icon: 'Users' },
      { title: 'Organizations', route: '/organizations', icon: 'Building' },
    ]
  },
  {
    title: 'System',
    items: [
      { title: 'Settings', route: '/settings', icon: 'Settings' },
      { title: 'Audit Logs', route: '/audit', icon: 'FileText' },
    ]
  }
]
```

**3. Hierarchical Navigation (Large Apps)**
```ts
// app/navigation/index.ts
export const navigation = [
  {
    title: 'General',
    icon: 'Home',
    groups: [
      {
        title: 'Overview',
        items: [
          { title: 'Dashboard', route: '/dashboard', icon: 'BarChart' },
          { title: 'Analytics', route: '/analytics', icon: 'TrendingUp' },
        ]
      }
    ]
  },
  {
    title: 'User Management',
    icon: 'Users',
    groups: [
      {
        title: 'Administration',
        items: [
          { title: 'User List', route: '/users', icon: 'Users' },
          { title: 'User Roles', route: '/users/roles', icon: 'Shield' },
          { title: 'Permissions', route: '/users/permissions', icon: 'Key' },
        ]
      },
      {
        title: 'Organization',
        items: [
          { title: 'Companies', route: '/organizations', icon: 'Building' },
          { title: 'Departments', route: '/departments', icon: 'Layers' },
        ]
      }
    ]
  }
]
```

### Module-Based Navigation Assembly

**Module Navigation Exports**
```ts
// modules/users/navigation.ts
export const usersNavigation = {
  title: 'User Management',
  icon: 'Users',
  groups: [
    {
      title: 'Administration',
      items: [
        { title: 'User List', route: '/users', icon: 'Users', permission: 'users:read' },
        { title: 'User Roles', route: '/users/roles', icon: 'Shield', permission: 'roles:read' },
        { title: 'Invite Users', route: '/users/invite', icon: 'UserPlus', permission: 'users:create' },
      ]
    }
  ]
}

// modules/auth/navigation.ts
export const authNavigation = {
  title: 'Authentication',
  icon: 'Key',
  groups: [
    {
      title: 'Security',
      items: [
        { title: 'Login Sessions', route: '/auth/sessions', icon: 'Clock', permission: 'auth:read' },
        { title: 'Password Policy', route: '/auth/policy', icon: 'Lock', permission: 'auth:manage' },
      ]
    }
  ]
}
```

**Navigation Aggregator**
```ts
// app/navigation/index.ts
import { userNav } from '@/modules/users/menu'
import { authNav } from '@/modules/auth/menu'
import { usePermissions } from '@/composables/usePermissions'

export function useAppNavigation() {
  const { hasPermission } = usePermissions()
  
  const moduleNavigations = [
    userNav,
    authNav,
  ]
  
  // Filter navigation items based on permissions
  const filteredNavigation = moduleNavigations.map(section => ({
    ...section,
    groups: section.groups.map(group => ({
      ...group,
      items: group.items.filter(item => 
        !item.permission || hasPermission(item.permission)
      )
    })).filter(group => group.items.length > 0)
  })).filter(section => section.groups.length > 0)
  
  return { navigation: filteredNavigation }
}
```

### Permission-Based Navigation

**Navigation with Role-Based Access**
```ts
// types/navigation.ts
export interface NavigationItem {
  title: string
  route: string
  icon: string
  permission?: string
  roles?: string[]
  badge?: {
    text: string
    variant: 'info' | 'warning' | 'success' | 'error'
  }
}

// app/navigation/guards.ts
export function filterNavigationByPermissions(
  navigation: NavigationItem[],
  userPermissions: string[],
  userRoles: string[]
): NavigationItem[] {
  return navigation.filter(item => {
    // Check permission-based access
    if (item.permission && !userPermissions.includes(item.permission)) {
      return false
    }
    
    // Check role-based access
    if (item.roles && !item.roles.some(role => userRoles.includes(role))) {
      return false
    }
    
    return true
  })
}
```

### Navigation Component Integration

**Sidebar Navigation Component**
```vue
<!-- components/AppSidebar.vue -->
<template>
  <nav class="sidebar">
    <div v-for="section in navigation" :key="section.title" class="nav-section">
      <h3 class="section-title">
        <Icon :name="section.icon" />
        {{ section.title }}
      </h3>
      
      <div v-for="group in section.groups" :key="group.title" class="nav-group">
        <h4 class="group-title">{{ group.title }}</h4>
        
        <ul class="nav-items">
          <li v-for="item in group.items" :key="item.route">
            <router-link :to="item.route" class="nav-link">
              <Icon :name="item.icon" />
              <span>{{ item.title }}</span>
              <Badge v-if="item.badge" :variant="item.badge.variant">
                {{ item.badge.text }}
              </Badge>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAppNavigation } from '@/app/navigation'

const { navigation } = useAppNavigation()
</script>
```

### Responsive Navigation Patterns

**Breadcrumb Navigation**
```ts
// composables/useBreadcrumbs.ts
export function useBreadcrumbs() {
  const route = useRoute()
  
  const breadcrumbs = computed(() => {
    const segments = route.path.split('/').filter(Boolean)
    const crumbs = []
    
    segments.reduce((path, segment) => {
      path += `/${segment}`
      const routeRecord = router.resolve(path)
      
      crumbs.push({
        title: routeRecord.meta?.breadcrumb || segment,
        path: path,
        isActive: path === route.path
      })
      
      return path
    }, '')
    
    return crumbs
  })
  
  return { breadcrumbs }
}
```

This navigation organization system provides flexibility for apps of any size while maintaining module independence and supporting advanced features like permissions and responsive design.

---

## Naming Conventions

- **Views** → Always end with `View.vue` → `LoginView.vue`, `UserListView.vue`.  
- **Components** → PascalCase, descriptive → `UserTable.vue`, `LoginForm.vue`.  
- **Stores** → Use Pinia convention: `useXxxStore.ts`.  
- **Composables** → Always start with `useXxx.ts`.  
- **Services** → `<domain>.api.ts` for API clients (e.g., `auth.api.ts`).  
- **Entities** → `<domain>.ts` for business/domain entities (e.g., `User.ts`, `Settings.ts`).  
- **Routes** → `routes.ts` inside module.  

---

## Architectural Principles

1. **Module isolation:** Modules should not import from each other directly. Instead, shared functionality should be moved to global directories (`components/`, `composables/`, `entities/`, `features/`) or the `shared/` folder.
2. **Global accessibility:** Global assets (`components/`, `composables/`, `entities/`, `features/`) are accessible by all modules.
3. **UI kit separation:** Basic UI components (buttons, inputs, forms) belong in `shared/ui/`, while business components go in `components/`.
4. **Utilities only in shared:** The `shared/` directory is reserved for true utilities and the UI kit.
5. **Feature-based organization:** Group related functionality within modules.

## Where to put features?

**What is a feature?** A feature is a self-contained piece of functionality that typically includes multiple related files (components, composables, services, entities) working together to provide a specific capability.

- **Reusable features (used by multiple modules):**
  Place in `features/` (e.g., `features/search/`, `features/file-upload/`).
- **Domain-specific features (used by one module):**
  Place in `modules/<module-name>/features/` (e.g., `modules/users/features/user-invite/`).

Examples of features: search functionality, file upload system, data export, notification system, user invitation workflow.

## Where to put complex UI components?

- **Global complex components (used across modules):**
  Place in `components/` (e.g., `components/DataTable.vue`, `components/FileUploader.vue`).
- **Module-specific complex components:**
  Place in `modules/<module-name>/components/` (e.g., `modules/users/components/UserInviteForm.vue`).

Complex components are reusable UI blocks that contain business logic or advanced functionality, as opposed to basic UI kit elements.

## UI Kit vs Business Components

- **UI Kit components (`shared/ui/`):**
  Basic, generic UI elements like buttons, inputs, forms, modals, etc.
  ```js
  // Examples:
  import Button from '@/shared/ui/Button.vue'
  import Input from '@/shared/ui/Input.vue'
  import Modal from '@/shared/ui/Modal.vue'
  ```

- **Business components (`components/`):**
  Application-specific components that contain business logic or complex functionality.
  ```js
  // Examples:
  import UserCard from '@/components/UserCard.vue'
  import DataTable from '@/components/DataTable.vue'
  import SearchFilters from '@/components/SearchFilters.vue'
  ```

The UI kit provides the building blocks, while business components use these blocks to create meaningful application features.

## What remains in the shared folder?

The `shared/` directory now contains only two categories of truly shared code:

- **`shared/ui/`** - Basic UI kit components (buttons, inputs, forms, modals, etc.)
  - Generic, stateless components with no business logic
  - Design system building blocks used to construct complex components
  - Examples: `Button.vue`, `Input.vue`, `Modal.vue`, `Card.vue`

- **`shared/utils/`** - Pure utility functions and constants
  - Formatters, validators, helpers with no side effects
  - Application constants and common type definitions
  - Examples: `formatters.ts`, `validators.ts`, `constants.ts`

Everything else (business components, composables, entities, features) has been moved to root-level directories for better accessibility and cleaner import paths.

## Where to put business entities?

**What are entities?** Entities are TypeScript interfaces, types, or classes that represent business domain objects, data models, or API response structures.

- **Global entities (used across modules):**
  Place in `entities/` (e.g., `entities/User.ts`, `entities/ApiResponse.ts`).
  These are core business objects referenced by multiple modules.

- **Module-specific entities:**
  Place in `modules/<module-name>/entities/` (e.g., `modules/users/entities/UserPreferences.ts`).
  These are domain objects specific to one module's business logic.

**Examples:**
- Global: `User`, `Permission`, `ApiResponse`, `PaginationMeta`
- Module-specific: `UserInvitation` (users module), `LoginAttempt` (auth module)

## Global vs. Module-Specific Organization

### Global Components (`components/`)
Global components are reusable UI elements used across multiple modules. They should be:
- **Generic and reusable** (e.g., `Button.vue`, `Modal.vue`, `DataTable.vue`)
- **Not tied to specific business logic**
- **Stateless or use props/events for communication**

```plaintext
components/
├── layout/               # Layout-related components
│   ├── AppHeader.vue
│   ├── AppSidebar.vue
│   └── AppFooter.vue
└── form/                 # Form-related components
    ├── FormField.vue
    ├── FormSelect.vue
    └── FormDatePicker.vue
```

### Global Composables (`composables/`)
Global composables provide cross-cutting functionality used by multiple modules:
- **Utility functions** (e.g., `useLocalStorage.ts`, `useDebounce.ts`)
- **Common business logic** (e.g., `useApi.ts`, `useAuth.ts`)
- **Framework utilities** (e.g., `useRouter.ts`, `useI18n.ts`)

```plaintext
composables/
├── useApi.ts             # HTTP client wrapper
├── useAuth.ts            # Authentication state
├── useLocalStorage.ts    # Local storage utilities
├── useDebounce.ts        # Debouncing utility
├── usePermissions.ts     # Authorization logic
└── useValidation.ts      # Form validation helpers
```

### Global Entities (`entities/`)
Global entities represent core business objects used across the application:
- **Base models** (e.g., `BaseEntity.ts`, `ApiResponse.ts`)
- **Cross-module domain objects** (e.g., `User.ts`, `Permission.ts`)
- **Common types** (e.g., `ApiError.ts`, `PaginationMeta.ts`)

```plaintext
entities/
├── base/                 # Base entity types
│   ├── BaseEntity.ts
│   ├── ApiResponse.ts
│   └── PaginationMeta.ts
├── User.ts               # Global user entity
├── Permission.ts         # Permission model
├── ApiError.ts           # Error handling types
└── index.ts              # Export all entities
```

**Example: Global User Entity**
```ts
// entities/User.ts
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  permissions: Permission[]
  createdAt: Date
  updatedAt: Date
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator'
}
```

### Global Features (`features/`)
Global features are complex, reusable functionality used across multiple modules:
- **Cross-cutting features** (e.g., search, notifications, file upload)
- **Complex UI patterns** (e.g., data tables with filters, wizards)
- **Business workflows** used by multiple modules

```plaintext
features/
├── search/               # Global search functionality
│   ├── components/
│   │   ├── SearchInput.vue
│   │   ├── SearchResults.vue
│   │   └── SearchFilters.vue
│   ├── composables/
│   │   └── useSearch.ts
│   ├── services/
│   │   └── search.api.ts
│   ├── entities/
│   │   └── SearchResult.ts
│   └── index.ts
├── file-upload/          # File upload feature
│   ├── components/
│   │   ├── FileUploader.vue
│   │   ├── FileProgress.vue
│   │   └── FilePreview.vue
│   ├── composables/
│   │   └── useFileUpload.ts
│   ├── services/
│   │   └── upload.api.ts
│   └── index.ts
├── data-table/           # Reusable data table
│   ├── components/
│   │   ├── DataTable.vue
│   │   ├── TableHeader.vue
│   │   ├── TableFilters.vue
│   │   └── TablePagination.vue
│   ├── composables/
│   │   ├── useDataTable.ts
│   │   ├── useTableFilters.ts
│   │   └── useTablePagination.ts
│   ├── entities/
│   │   └── TableConfig.ts
│   └── index.ts
└── notifications/        # Global notification system
    ├── components/
    │   ├── NotificationToast.vue
    │   ├── NotificationCenter.vue
    │   └── NotificationBell.vue
    ├── composables/
    │   └── useNotifications.ts
    ├── store/
    │   └── useNotificationStore.ts
    ├── entities/
    │   └── Notification.ts
    └── index.ts
```

**Example: Global Search Feature**
```ts
// features/search/index.ts
export { default as SearchInput } from './components/SearchInput.vue'
export { default as SearchResults } from './components/SearchResults.vue'
export { default as SearchFilters } from './components/SearchFilters.vue'
export { useSearch } from './composables/useSearch'
export * from './entities/SearchResult'

// Usage in modules:
// import { SearchInput, useSearch } from '@/features/search'
```

### Module-Specific vs. Global Decision Matrix

| Item | Global (Root Level) | Module-Specific (`modules/`) |
|------|-------------------|------------------------------|
| **Components** | UI primitives, layout components | Business-specific components |
| **Composables** | Utility functions, framework wrappers | Domain-specific logic |
| **Entities** | Core domain models, base types | Module-specific variations |
| **Features** | Cross-cutting functionality, reusable workflows | Domain-specific features |

**Examples:**
- `Button.vue` → Global (UI primitive)
- `UserForm.vue` → Module-specific (business logic)
- `useApi.ts` → Global (utility)
- `useUserManagement.ts` → Module-specific (domain logic)
- `User.ts` → Global (core entity)
- `UserPreferences.ts` → Module-specific (specific to user module)
- `search/` feature → Global (used across modules)
- `user-invite/` feature → Module-specific (specific to users module)

### Feature Organization Guidelines

**When to create a Global Feature (`features/`):**
- Used by 2+ modules
- Provides cross-cutting functionality
- Contains complex business logic or UI patterns
- Could be extracted as a separate package

**When to create a Module-Specific Feature (`modules/<module>/features/`):**
- Specific to one domain/module
- Contains domain-specific business logic
- Unlikely to be reused elsewhere
- Tightly coupled to module entities/services

## Feature-Oriented Module Example

A feature-oriented module organizes files by feature, not by type. Each feature is self-contained and may include its own components, composables, services, and views.

**Example: UserInvite feature in the users module**

```
src/
└── modules/
    └── users/
        ├── features/
        │   └── user-invite/
        │       ├── entities/
        │       │   └── UserInvite.ts
        │       ├── UserInviteForm.vue
        │       ├── useUserInvite.ts
        │       ├── userInvite.api.ts
        │       ├── UserInviteView.vue
        │       └── index.ts
        ├── components/
        ├── views/
        └── ...
```

- `features/user-invite/UserInviteForm.vue`: UI for inviting a new user
- `features/user-invite/useUserInvite.ts`: Composable for invite logic
- `features/user-invite/userInvite.api.ts`: API client for invites
- `features/user-invite/UserInviteView.vue`: Feature-specific view
- `features/user-invite/index.ts`: Feature exports

This keeps features self-contained, modular, and easy to maintain.

### Organizing Feature Folders: Flat vs. Subfolders

For small features, a flat structure (all files in the feature root) is simple and easy to navigate:

```
features/user-invite/
  UserInviteForm.vue
  useUserInvite.ts
  userInvite.api.ts
  UserInviteView.vue
  index.ts
```

For larger or more complex features, use subfolders by type for better scalability and clarity:

```
features/user-invite/
  components/
    UserInviteForm.vue
  composables/
    useUserInvite.ts
  services/
    userInvite.api.ts
  entities/
    UserInvite.ts
  views/
    UserInviteView.vue
  index.ts
```

Choose the structure that best fits the feature's complexity. Subfolders by type are recommended for features with many files or expected growth.

## Module vs. Feature Organization

- **Modules** are always organized as folders by domain (e.g., `users`, `auth`, `settings`). Each domain gets its own directory under `modules/`.
- **Features** inside modules can be organized either flat (all files in one folder) or with subfolders by type (e.g., `components/`, `composables/`, `entities/`, `services/`, `views/`). Choose flat or subfolder structure based on the feature's size and complexity.

This approach keeps the overall project modular, while allowing flexibility for feature organization as your codebase grows.

---

## Quick Reference Guide

### **Directory Structure Summary**
```
src/
├── app/                  # Framework infrastructure (router, stores, plugins, layouts)
├── components/           # Global business components
├── composables/          # Global composables  
├── entities/             # Global business entities
├── features/             # Global cross-cutting features
├── modules/              # Domain-specific modules
├── shared/               # UI kit and utilities
├── App.vue               # Root component
└── main.ts               # Entry point
```

### **Decision Tree: Where to put code?**

**Is it a basic UI element (button, input, modal)?** → `shared/ui/`  
**Is it a utility function or constant?** → `shared/utils/`  
**Is it used by multiple modules?** → Global directory (`components/`, `composables/`, `entities/`, `features/`)  
**Is it specific to one domain?** → Module directory (`modules/<domain>/`)  
**Is it app infrastructure?** → `app/` directory

### **Import Path Examples**
```js
// UI Kit
import Button from '@/shared/ui/Button.vue'

// Global assets
import UserCard from '@/components/UserCard.vue'
import { useApi } from '@/composables/useApi'
import { User } from '@/entities/User'
import { SearchInput } from '@/features/search'

// Module-specific
import LoginForm from '@/modules/auth/components/LoginForm.vue'
import { useAuth } from '@/modules/auth/composables/useAuth'
// or via public module export path
import LoginForm from '@/modules/auth'
import { useAuth } from '@/modules/auth'

// App infrastructure
import { router } from '@/app/router'
```
