# vue-modular/enforce-naming-convention

Enforce consistent naming patterns for different file types based on Vue modular architecture.

## Rule Details

This rule enforces consistent naming conventions for Vue component filenames and validates file naming patterns based on Vue modular architecture guidelines. It ensures that different file types follow proper naming conventions:

- **Views** → Always end with `View.vue` → `LoginView.vue`, `UserListView.vue`
- **Components** → PascalCase filenames → `UserTable.vue`, `LoginForm.vue`, `CgsIcon.vue`
- **Stores** → Free naming (any filename allowed)
- **Composables** → Free naming (any filename allowed)
- **Services** → Start with lowercase letter → `index.ts`, `auth.ts`, `frameMessages.ts`
- **Entities** → Start with lowercase letter → `user.ts`, `settings.ts`, `apiResponse.ts`
- **Routes** → Must be exactly `routes.ts` in modules
- **Menu** → Must be exactly `menu.ts` in modules

**Note**: This rule is designed for modern Vue applications where components typically don't have explicit `name` properties (especially with `<script setup>`). The rule primarily validates **filenames** rather than component names.

### Examples

#### ❌ Incorrect

```vue
<!-- File: src/components/user-card.vue -->
<!-- Component filename should be PascalCase -->
<script setup>
// Modern Vue component
</script>
```

```vue
<!-- File: src/shared/ui/cgs-icon.vue -->
<!-- UI component filename should be PascalCase -->
<script>
export default {
  // Anonymous component
}
</script>
```

```vue
<!-- File: src/views/Login.vue -->
<!-- View files must end with 'View.vue' -->
<script>
export default {
  name: 'Login',
}
</script>
```

```js
// File: src/stores/authStore.ts
// Any store filename is now allowed
export const authStore = defineStore('auth', {
  // store implementation
})
```

```js
// File: src/composables/api.ts
// Any composable filename is now allowed
export function fetchData() {
  // composable implementation
}
```

```js
// File: src/services/AuthService.ts
// Service files should start with lowercase letter
export class AuthService {
  // service implementation
}
```

```js
// File: src/entities/user.ts
// Entity files should start with lowercase letter
export interface User {
  // entity definition
}
```

```js
// File: src/modules/auth/Routes.ts
// Module routes file must be exactly 'routes.ts'
export default [
  // route definitions
]
```

```js
// File: src/modules/users/navigation.ts
// Module menu file must be exactly 'menu.ts'
export const moduleNavigation = [
  // menu definitions
]
```

#### ✅ Correct

```vue
<!-- File: src/components/UserCard.vue -->
<!-- PascalCase component filename -->
<script setup>
// Modern Vue component
</script>
```

```vue
<!-- File: src/shared/ui/CgsIcon.vue -->
<!-- PascalCase UI component filename -->
<script>
export default {
  // Anonymous component with proper filename
}
</script>
```

```vue
<!-- File: src/views/LoginView.vue -->
<!-- View files ending with 'View.vue' -->
<script>
export default {
  name: 'LoginView',
}
</script>
```

```js
// File: src/stores/useAuthStore.ts
// Any store filename is allowed
export const useAuthStore = defineStore('auth', {
  // store implementation
})
```

```js
// File: src/stores/authStore.ts
// Any store filename is allowed
export const authStore = defineStore('auth', {
  // store implementation
})
```

```js
// File: src/composables/useApi.ts
// Any composable filename is allowed
export function useApi() {
  // composable implementation
}
```

```js
// File: src/composables/api.ts
// Any composable filename is allowed
export function fetchData() {
  // composable implementation
}
```

```js
// File: src/services/auth.ts
// Proper service naming (starts with lowercase)
export class AuthAPI {
  // service implementation
}
```

```js
// File: src/services/index.ts
// Proper service naming (starts with lowercase)
export * from './auth'
export * from './frameMessages'
```

```js
// File: src/services/frameMessages.ts
// Proper service naming (starts with lowercase)
export function sendMessage() {
  // service implementation
}
```

```js
// File: src/entities/user.ts
// Proper entity naming (lowercase start)
export interface User {
  id: string
  name: string
  email: string
}
```

```js
// File: src/entities/settings.ts
// Proper entity naming (lowercase start)
export interface Settings {
  theme: string
  language: string
}
```

```js
// File: src/modules/auth/routes.ts
// Correct module routes file name
export default [
  { path: '/login', component: () => import('./views/LoginView.vue') },
  { path: '/register', component: () => import('./views/RegisterView.vue') },
]
```

```js
// File: src/modules/users/menu.ts
// Correct module menu file name
export const moduleNavigation = [
  { title: 'User List', route: '/users' },
  { title: 'User Roles', route: '/users/roles' },
]
```

## Options

```js
{
  "vue-modular/enforce-naming-convention": ["error", {
    "style": "PascalCase",
    "requireFileNameMatches": true,
    "enforceFileTypeConventions": true
  }]
}
```

### `style` (default: `"PascalCase"`)

Defines the naming convention for component names (legacy mode only):

- `"PascalCase"` - Component names should use PascalCase (e.g., `UserCard`, `LoginForm`)
- `"kebab-case"` - Component names should use kebab-case (e.g., `user-card`, `login-form`)

### `requireFileNameMatches` (default: `true`)

When enabled in legacy mode, requires that the filename matches the component name exactly.

- `true` - Filename must match component name
- `false` - No filename validation

### `enforceFileTypeConventions` (default: `true`)

When enabled, enforces Vue modular architecture naming conventions based on file type and location.

- `true` - Enforce file type-specific naming conventions
- `false` - Use legacy component name validation only

## File Type Detection

The rule automatically detects file types based on directory structure and filename patterns:

### Views

- **Directory patterns**: `/views/`, `/view/`
- **File pattern**: `*.vue`
- **Convention**: Must end with `View.vue`
- **Examples**: `LoginView.vue`, `UserListView.vue`, `DashboardView.vue`

### Components

- **Directory patterns**: `/components/`, `/component/`, `/shared/ui/`
- **File pattern**: `*.vue`
- **Convention**: PascalCase filenames (always enforced regardless of explicit component names)
- **Examples**: `UserTable.vue`, `LoginForm.vue`, `SearchInput.vue`, `CgsIcon.vue`
- **Note**: Works with modern Vue patterns including `<script setup>` and anonymous components

### Stores

- **Directory patterns**: `/stores/`, `/store/` (files must be **directly** in the stores directory)
- **File pattern**: `*.ts`, `*.js`
- **Convention**: Free naming (any filename allowed)
- **Examples**:
  - ✅ `src/stores/useAuthStore.ts` (any filename allowed)
  - ✅ `src/stores/authStore.ts` (any filename allowed)
  - ✅ `src/stores/auth.ts` (any filename allowed)
  - ❌ `src/stores/types/config.ts` (subdirectory - **not** treated as store)
  - ❌ `src/stores/config/constants.ts` (subdirectory - **not** treated as store)

**Important**: Only files directly in the stores directory are treated as stores. Files in subdirectories like `stores/types/`, `stores/config/`, etc. are ignored by this rule, allowing for type definitions, configuration files, and other utilities without naming restrictions.

### Composables

- **Directory patterns**: `/composables/`, `/composable/`
- **File pattern**: `*.ts`, `*.js`
- **Convention**: Free naming (any filename allowed)
- **Examples**: `useApi.ts`, `api.ts`, `helpers.ts`, `validation.ts`

### Services

- **Directory patterns**: `/services/`, `/service/`
- **File pattern**: `*.ts`, `*.js`
- **Convention**: Must start with lowercase letter
- **Examples**: `auth.ts`, `index.ts`, `frameMessages.ts`, `notifications.ts`

### Entities

- **Directory patterns**: `/entities/`, `/entity/`
- **File pattern**: `*.ts`, `*.js`
- **Convention**: Start with lowercase letter (domain/business entities)
- **Examples**: `user.ts`, `settings.ts`, `apiResponse.ts`, `permission.ts`

### Routes

- **Directory patterns**: Module files only (`modules/*/routes.ts`)
- **File pattern**: Must be exactly `routes.ts`
- **Convention**: Fixed filename for module route definitions
- **Examples**: `modules/auth/routes.ts`, `modules/users/routes.ts`

### Menu

- **Directory patterns**: Module files only (`modules/*/menu.ts`)
- **File pattern**: Must be exactly `menu.ts`
- **Convention**: Fixed filename for module navigation definitions
- **Examples**: `modules/auth/menu.ts`, `modules/users/menu.ts`

## Configuration Examples

### Default Configuration (Recommended)

```js
{
  "vue-modular/enforce-naming-convention": "error"
}
```

This enforces:

- Vue modular architecture naming conventions
- File type-specific validation based on directory structure
- **PascalCase component filenames** for all Vue files (regardless of explicit component names)
- Proper filename patterns for services
- **Lowercase entity filenames** for business/domain objects
- **Exact naming for module routes and menu files**
- **Free naming for stores and composables** (no restrictions)

### Legacy Mode (Component Names Only)

```js
{
  "vue-modular/enforce-naming-convention": ["error", {
    "enforceFileTypeConventions": false,
    "style": "PascalCase",
    "requireFileNameMatches": true
  }]
}
```

This enforces:

- PascalCase component names only (when explicit `name` property exists)
- Filename must match component name
- No file type-specific validation
- **Note**: Less useful for modern Vue apps with `<script setup>`

### File Type Conventions Only

```js
{
  "vue-modular/enforce-naming-convention": ["error", {
    "enforceFileTypeConventions": true,
    "requireFileNameMatches": false
  }]
}
```

This enforces:

- File type-specific naming conventions
- Vue component filename validation
- No legacy component name matching

## Benefits

- **Consistent codebase**: Enforces uniform naming across the entire project
- **Clear file purpose**: File naming immediately indicates the file's role
- **Better organization**: Supports Vue modular architecture patterns
- **Team alignment**: Ensures all developers follow the same conventions
- **Easier navigation**: Predictable naming makes files easier to find
- **Modern Vue compatible**: Works seamlessly with `<script setup>` and anonymous components
- **Flexible store organization**: Allows type definitions and utilities in store subdirectories while enforcing naming only for actual store files
- **Production-ready**: Catches naming issues before they reach production

## Real-World Examples

### Typical Issues Caught

```bash
# Component filename issues
❌ src/shared/ui/cgs-icon.vue → Should be CgsIcon.vue
❌ src/components/user-card.vue → Should be UserCard.vue

# View naming issues
❌ src/views/Login.vue → Should be LoginView.vue

# Service naming issues
❌ src/services/AuthService.ts → Should be authService.ts
❌ src/services/FrameMessages.ts → Should be frameMessages.ts
✅ src/services/index.ts → OK (starts with lowercase)

# Entity naming issues
❌ src/entities/User.ts → Should be user.ts
❌ src/entities/Api-Response.ts → Should be apiResponse.ts
✅ src/entities/settings.ts → OK (lowercase start)

# Module file naming issues
❌ src/modules/auth/Routes.ts → Should be routes.ts
❌ src/modules/users/navigation.ts → Should be menu.ts
✅ src/modules/auth/routes.ts → OK (exact name)
✅ src/modules/users/menu.ts → OK (exact name)

# Store and composable naming
✅ src/stores/authStore.ts → OK (free naming)
✅ src/stores/useAuthStore.ts → OK (free naming)
✅ src/composables/api.ts → OK (free naming)
✅ src/composables/useApi.ts → OK (free naming)
```

## When Not To Use

- If your project uses a different architectural pattern
- If you have legacy files that can't be easily renamed
- If your build process handles name transformations automatically
- If your team prefers different naming conventions

## Related Rules

- [Vue.js Style Guide - Component Name Casing](https://vuejs.org/style-guide/rules-strongly-recommended.html#component-name-casing-in-templates)
- [Vue.js Style Guide - Component Names](https://vuejs.org/style-guide/rules-essential.html#use-multi-word-component-names)

## Further Reading

- [Vue.js Component Naming Best Practices](https://vuejs.org/style-guide/)
- [Vue Modular Architecture Blueprint](../vue-project-modules-blueprint.md)
- [Pinia Store Naming Conventions](https://pinia.vuejs.org/core-concepts/)
