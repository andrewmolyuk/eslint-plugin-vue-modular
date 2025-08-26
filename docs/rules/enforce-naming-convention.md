# vue-modular/enforce-naming-convention

Enforce consistent naming patterns for different file types based on Vue 3 modular architecture.

## Rule Details

This rule enforces consistent naming conventions for Vue component `name` properties and validates file naming patterns based on Vue 3 modular architecture guidelines. It ensures that different file types follow proper naming conventions:

- **Views** → Always end with `View.vue` → `LoginView.vue`, `UserListView.vue`
- **Components** → PascalCase, descriptive → `UserTable.vue`, `LoginForm.vue`
- **Stores** → Use Pinia convention: `useXxxStore.ts`
- **Composables** → Always start with `useXxx.ts`
- **Services** → `<domain>.api.ts` for API clients (e.g., `auth.api.ts`)

### Examples

#### ❌ Incorrect

```js
// Component name should be PascalCase
export default {
  name: 'user-card',
}
```

```js
// View files must end with 'View.vue'
// File: src/views/Login.vue
export default {
  name: 'Login',
}
```

```js
// Store files must follow 'useXxxStore.ts' pattern
// File: src/stores/authStore.ts
export default {
  // store implementation
}
```

```js
// Composable files must start with 'use'
// File: src/composables/api.ts
export default {
  // composable implementation
}
```

```js
// Service files should follow '<domain>.api.ts' pattern
// File: src/services/authService.ts
export default {
  // service implementation
}
```

#### ✅ Correct

```js
// PascalCase component name
export default {
  name: 'UserCard',
}
```

```js
// View files ending with 'View.vue'
// File: src/views/LoginView.vue
export default {
  name: 'LoginView',
}
```

```js
// Proper store naming
// File: src/stores/useAuthStore.ts
export default {
  // store implementation
}
```

```js
// Proper composable naming
// File: src/composables/useApi.ts
export default {
  // composable implementation
}
```

```js
// Proper service naming
// File: src/services/auth.api.ts
export default {
  // service implementation
}
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

When enabled, enforces Vue 3 modular architecture naming conventions based on file type and location.

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

- **Directory patterns**: `/components/`, `/component/`
- **File pattern**: `*.vue`
- **Convention**: PascalCase, descriptive names
- **Examples**: `UserTable.vue`, `LoginForm.vue`, `SearchInput.vue`

### Stores

- **Directory patterns**: `/stores/`, `/store/`
- **File pattern**: `*.ts`, `*.js`
- **Convention**: Must follow `useXxxStore.ts` pattern
- **Examples**: `useAuthStore.ts`, `useUserStore.ts`, `useSettingsStore.ts`

### Composables

- **Directory patterns**: `/composables/`, `/composable/`
- **File pattern**: `*.ts`, `*.js`
- **Convention**: Must start with `use`
- **Examples**: `useApi.ts`, `useAuth.ts`, `useLocalStorage.ts`

### Services

- **Directory patterns**: `/services/`, `/service/`
- **File pattern**: `*.ts`, `*.js`
- **Convention**: Must follow `<domain>.api.ts` pattern
- **Examples**: `auth.api.ts`, `users.api.ts`, `notifications.api.ts`

## Configuration Examples

### Default Configuration (Recommended)

```js
{
  "vue-modular/enforce-naming-convention": "error"
}
```

This enforces:

- Vue 3 modular architecture naming conventions
- File type-specific validation
- PascalCase component names for Vue files
- Proper filename patterns for all file types

### Legacy Mode

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

- PascalCase component names only
- Filename must match component name
- No file type-specific validation

### Custom Style (Legacy Mode)

```js
{
  "vue-modular/enforce-naming-convention": ["error", {
    "enforceFileTypeConventions": false,
    "style": "kebab-case"
  }]
}
```

### File Type Conventions Only

```js
{
  "vue-modular/enforce-naming-convention": ["error", {
    "enforceFileTypeConventions": true,
    "requireFileNameMatches": false
  }]
}
```

## Benefits

- **Consistent codebase**: Enforces uniform naming across the entire project
- **Clear file purpose**: File naming immediately indicates the file's role
- **Better organization**: Supports Vue 3 modular architecture patterns
- **Team alignment**: Ensures all developers follow the same conventions
- **Easier navigation**: Predictable naming makes files easier to find

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
- [Vue 3 Modular Architecture Blueprint](../vue3-project-modules-blueprint.md)
- [Pinia Store Naming Conventions](https://pinia.vuejs.org/core-concepts/)
