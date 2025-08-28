# no-orphaned-files

Flag files that don't belong to any clear category in the modular architecture.

## Rule Details

This rule enforces that all files in your source directory belong to a recognized category according to the Vue modular architecture blueprint. Files that don't fit into the defined structure are flagged as "orphaned" with helpful suggestions for proper placement.

**Why this rule exists:**

- Enforces consistent file organization across the project
- Prevents files from being placed in arbitrary locations
- Guides developers to follow the modular architecture principles
- Makes the codebase more maintainable and discoverable
- Provides context-aware suggestions for proper file placement

## Examples

### ❌ Incorrect

```javascript
// Files in wrong locations
src / utils.ts // Should be in shared/
src / RandomComponent.vue // Should be in components/ or views/
src / styles.css // Should be in app/styles/
src / config / database.ts // 'config' is not a recognized category
src / composables / api / useAuth.ts // 'api' is not allowed in composables/ (flat structure)
```

### ✅ Correct

```javascript
// Proper file organization
src / main.ts // Allowed root file
src / App.vue // Allowed root file
src / shared / utils.ts // Utilities in shared/
src / components / RandomComponent.vue // Global components
src / views / HomeView.vue // Page components
src / app / styles / main.css // Global styles
src / app / config / database.ts // App configuration
src / entities / base / User.ts // Base entities
src / modules / auth / LoginForm.vue // Module-specific components
src / features / dashboard / Chart.vue // Feature-specific components
```

## Architecture Categories

The rule validates files against these predefined categories:

### App Layer

- **`app/`** - Application infrastructure
  - Allowed subdirectories: `router`, `stores`, `plugins`, `layouts`, `config`, `styles`

### Domain Layer

- **`modules/`** - Domain modules (wildcard structure allowed)
- **`features/`** - Feature modules (wildcard structure allowed)

### Business Layer

- **`components/`** - Global business components (can contain subdirectories for complex components)
- **`composables/`** - Reusable composition functions (flat structure)
- **`services/`** - Business services and API clients (flat structure)

### State Layer

- **`stores/`** - Global state management (flat structure)

### Data Layer

- **`entities/`** - Data models and entities
  - Allowed subdirectories: any (wildcard `*` support)

### Utility Layer

- **`shared/`** - Shared utilities and UI components
  - Allowed subdirectories: `ui`
  - Allowed file patterns: `*.ts` (any TypeScript file in any subdirectory)
  - Allowed root files: `constants.ts`, `formatters.ts`, `validators.ts`, `helpers.ts`, `types.ts`

### View Layer

- **`views/`** - Page components (flat structure)

### Root Files

- Allowed root files: `main.ts`, `main.js`, `App.vue`

## Options

```typescript
interface Options {
  // Source directory to analyze
  src?: string // default: 'src'

  // Override allowed directories and their subdirectories
  allowedDirectories?: {
    [category: string]: string[] | ['*'] // '*' allows any subdirectory
  }

  // Override allowed root files
  allowedRootFiles?: string[] // default: ['main.ts', 'main.js', 'App.vue']

  // Additional patterns to ignore
  ignorePatterns?: string[] // default: ['**/*.d.ts', '**/index.ts', '**/index.js', '**/.DS_Store', '**/Thumbs.db']
}
```

### Pattern Matching

The `allowedDirectories` configuration supports glob patterns for flexible file matching:

- **`'*'`** - Allows any subdirectory structure (e.g., `modules: ['*']`)
- **`'*.ts'`** - Allows any `.ts` file in subdirectories (e.g., `shared: ['ui', '*.ts']`)
- **`'*.js'`** - Allows any `.js` file in subdirectories
- **Explicit names** - Only allows specific subdirectory names (e.g., `app: ['router', 'stores']`)

Example: `shared: ['ui', '*.ts']` allows:

- `shared/ui/Button.vue` ✅ (explicit subdirectory)
- `shared/utils/helpers.ts` ✅ (matches `*.ts` pattern)
- `shared/config/settings.ts` ✅ (matches `*.ts` pattern)
- `shared/helpers/utils.js` ❌ (doesn't match any pattern)

## Configuration Examples

### Default Configuration

```json
{
  "rules": {
    "vue-modular/no-orphaned-files": "error"
  }
}
```

### Custom Allowed Directories

```json
{
  "rules": {
    "vue-modular/no-orphaned-files": [
      "error",
      {
        "allowedDirectories": {
          "components": ["ui", "forms"],
          "utils": [],
          "lib": ["external"]
        },
        "allowedRootFiles": ["main.ts", "bootstrap.ts"]
      }
    ]
  }
}
```

### Custom Source Directory

```json
{
  "rules": {
    "vue-modular/no-orphaned-files": [
      "error",
      {
        "src": "source",
        "ignorePatterns": ["**/*.config.js", "**/vendor/**"]
      }
    ]
  }
}
```

## Suggestions

The rule provides context-aware suggestions based on file type and naming patterns:

### Vue Components

- **Views**: Files ending with "View.vue" → suggest `views/` directory
- **Layouts**: Files ending with "Layout.vue" → suggest `app/layouts/`
- **UI Components**: → suggest `shared/ui/` for basic UI components
- **Business Components**: → suggest `components/` for global business logic

### TypeScript/JavaScript Files

- **Composables**: Files starting with "use" → suggest `composables/`
- **Services**: Files containing "Service", "API", "Client" → suggest `services/`
- **Stores**: Files containing "Store" → suggest `stores/`
- **Utilities**: Files containing "util", "helper" → suggest `shared/`

### Style Files

- **Global Styles**: → suggest `app/styles/`
- **Component Styles**: → suggest co-location with components

## Wildcard Support

Modules and features support wildcard subdirectory structures:

```javascript
// These are all valid with wildcard support
src / modules / auth / components / LoginForm.vue
src / modules / auth / services / authApi.ts
src / modules / auth / stores / authStore.ts
src / features / dashboard / views / DashboardView.vue
src / features / dashboard / utils / chartHelpers.ts
```

## Ignore Patterns

The rule automatically ignores:

- TypeScript declaration files (`**/*.d.ts`)
- Index files (`**/index.{ts,js}`)
- System files (`.DS_Store`, `Thumbs.db`)
- Test files (detected using existing test utilities)

## Project Structure Example

```text
src/
├── main.ts                     ✅ Allowed root file
├── App.vue                     ✅ Allowed root file
├── app/                        ✅ Application infrastructure
│   ├── router/
│   ├── stores/
│   ├── config/
│   └── styles/
├── modules/                    ✅ Domain modules (wildcard)
│   └── auth/
│       ├── components/
│       ├── services/
│       └── stores/
├── features/                   ✅ Feature modules (wildcard)
│   └── dashboard/
│       ├── views/
│       └── utils/
├── components/                 ✅ Global components (can have subdirectories)
│   ├── UserCard.vue
│   ├── DataTable.vue
│   └── ui/
│       └── Button.vue
├── composables/                ✅ Global composables (flat)
│   ├── useAuth.ts
│   └── useApi.ts
├── services/                   ✅ Global services (flat)
│   ├── apiClient.ts
│   └── authService.ts
├── stores/                     ✅ Global stores (flat)
│   └── userStore.ts
├── entities/                   ✅ Data models
│   ├── base/
│   │   └── BaseEntity.ts
│   └── custom/
│       └── User.ts             ✅ Any subdirectory allowed
├── shared/                     ✅ Shared utilities
│   ├── ui/
│   │   ├── Button.vue
│   │   └── helpers.ts          ✅ .ts files allowed in subdirectories
│   ├── utils/
│   │   └── string.ts           ✅ .ts files allowed in subdirectories
│   ├── constants.ts
│   └── formatters.ts
└── views/                      ✅ Page components (flat)
    ├── HomeView.vue
    └── AboutView.vue
```

## When Not To Use

- If your project doesn't follow the Vue modular architecture pattern
- If you have a custom file organization system that conflicts with the blueprint
- In small projects where strict file organization is not necessary
- During migration periods when gradual adoption is preferred

## Related Rules

- [`vue-modular/enforce-src-structure`](./enforce-src-structure.md) - Enforces top-level directory structure
- [`vue-modular/enforce-import-boundaries`](./enforce-import-boundaries.md) - Enforces import boundaries between layers
- [`vue-modular/no-cross-feature-imports`](./no-cross-feature-imports.md) - Prevents direct feature imports
