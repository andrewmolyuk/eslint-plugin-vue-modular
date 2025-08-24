# no-cross-feature-imports

Prevents direct imports from deep inside feature folders, enforcing that features should only be imported through their entry points.

## Rule Details

This rule prevents importing files from deep inside feature directories. Instead, features should expose their public API through entry points (like `index.js`) and only those entry points should be imported from outside the feature.

**Why this rule exists:**

- Enforces encapsulation of feature internals
- Prevents tight coupling between features
- Makes refactoring easier by limiting external dependencies
- Encourages well-defined feature APIs

## Examples

### ❌ Incorrect

```javascript
// Importing directly from inside a feature
import UserList from '@/features/user/components/UserList.vue'
import userService from '@/features/user/services/userService.js'
import { validateUser } from '@/features/user/utils/validation.js'

// Cross-feature imports (when allowCrossFeatureImports is false)
import AuthForm from '@/features/auth/components/AuthForm.vue'
```

### ✅ Correct

```javascript
// Importing from feature entry points
import userApi from '@/features/user'
import { UserService } from '@/features/auth'

// Importing within the same feature
import UserProfile from './components/UserProfile.vue'
import userService from './services/userService.js'

// Importing from allowed patterns
import { UserTypes } from '@/features/user/types.ts'
```

## Options

```json
{
  "vue-modular/no-cross-feature-imports": [
    "error",
    {
      "featurePattern": "src/features/*",
      "allowedPatterns": ["src/features/*/index.js", "src/features/*/index.ts"],
      "modulePattern": "src/modules/*",
      "allowCrossFeatureImports": false
    }
  ]
}
```

### Option Details

- **`featurePattern`** (string): Pattern to identify feature directories. Default: `"src/features/*"`
- **`allowedPatterns`** (array): File patterns that are allowed to be imported from outside the feature. Default: `["src/features/*/index.js", "src/features/*/index.ts"]`
- **`modulePattern`** (string): Pattern to identify module directories. Default: `"src/modules/*"`
- **`allowCrossFeatureImports`** (boolean): Whether to allow imports between different features. Default: `false`

## Project Structure

```
src/
├── features/
│   ├── user/
│   │   ├── index.js              ✅ Entry point - can be imported
│   │   ├── types.ts              ✅ If in allowedPatterns
│   │   ├── components/
│   │   │   ├── UserList.vue      ❌ Internal - cannot be imported directly
│   │   │   └── UserProfile.vue   ❌ Internal - cannot be imported directly
│   │   ├── services/
│   │   │   └── userApi.js        ❌ Internal - cannot be imported directly
│   │   └── utils/
│   │       └── validation.js     ❌ Internal - cannot be imported directly
│   ├── auth/
│   │   ├── index.js              ✅ Entry point - can be imported
│   │   ├── components/
│   │   │   └── LoginForm.vue     ❌ Internal - cannot be imported directly
│   │   └── services/
│   │       └── authApi.js        ❌ Internal - cannot be imported directly
│   └── product/
│       ├── index.js              ✅ Entry point - can be imported
│       └── components/
│           └── ProductCard.vue   ❌ Internal - cannot be imported directly
├── components/                   ✅ Shared components - can be imported
│   └── AppHeader.vue
├── utils/                        ✅ Shared utilities - can be imported
│   └── formatters.js
└── store/                        ✅ Shared store - can be imported
    └── index.js
```

## Feature Entry Point Example

```javascript
// src/features/user/index.js
export { default as UserService } from './services/userApi.js'
export { default as UserList } from './components/UserList.vue'
export { default as UserProfile } from './components/UserProfile.vue'
export * from './types.js'
export { validateUser } from './utils/validation.js'
```

## Configuration Examples

### Default Configuration

```json
{
  "rules": {
    "vue-modular/no-cross-feature-imports": "error"
  }
}
```

### Custom Feature Pattern

```json
{
  "rules": {
    "vue-modular/no-cross-feature-imports": [
      "error",
      {
        "featurePattern": "src/modules/*",
        "allowedPatterns": ["src/modules/*/index.js", "src/modules/*/api.js", "src/modules/*/types.ts"]
      }
    ]
  }
}
```

### Allow Cross-Feature Imports

```json
{
  "rules": {
    "vue-modular/no-cross-feature-imports": [
      "error",
      {
        "allowCrossFeatureImports": true
      }
    ]
  }
}
```

## When Not To Use

- If your project doesn't follow a feature-based architecture
- If you prefer a different modular architecture pattern
- If your features are designed to have tight coupling
- In small projects where architectural boundaries are not necessary
