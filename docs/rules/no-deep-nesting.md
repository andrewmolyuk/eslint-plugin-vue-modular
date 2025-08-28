# no-deep-nesting

Prevent excessive folder nesting in modules and features to maintain code organization and improve navigation.

## Rule Details

Deep nesting in modules and features can make code harder to navigate, understand, and maintain. This rule enforces a maximum nesting depth to encourage better organization and prevent overly complex directory structures.

❌ Examples of **incorrect** code for this rule:

```javascript
// Too many levels of nesting in modules (4 levels, default max is 3)
// File: /src/modules/auth/components/forms/fields/PasswordField.vue
export default {
  name: 'PasswordField'
}

// Too many levels of nesting in features (5 levels, default max is 3)  
// File: /src/features/search/filters/advanced/date/DateRangePicker.vue
export default {
  name: 'DateRangePicker'
}
```

✅ Examples of **correct** code for this rule:

```javascript
// Within nesting limits (3 levels)
// File: /src/modules/auth/components/LoginForm.vue
export default {
  name: 'LoginForm'
}

// Within nesting limits (2 levels)
// File: /src/features/search/components/SearchBar.vue  
export default {
  name: 'SearchBar'
}

// Files outside modules/features are not checked
// File: /src/components/ui/forms/inputs/TextInput.vue (ignored)
export default {
  name: 'TextInput'
}
```

## Options

This rule accepts an options object with the following properties:

### `maxDepth` (default: `3`)

The maximum allowed nesting depth within the specified paths.

```javascript
{
  "vue-modular/no-deep-nesting": ["error", {
    "maxDepth": 2
  }]
}
```

### `paths` (default: `["modules", "features"]`)

An array of base directory names to check for nesting violations.

```javascript
{
  "vue-modular/no-deep-nesting": ["error", {
    "paths": ["modules", "features", "components"]
  }]
}
```

## Examples with Custom Configuration

### Custom Maximum Depth

With `{ "maxDepth": 2 }`:

❌ **Incorrect:**

```javascript
// File: /src/modules/auth/components/forms/LoginForm.vue (3 levels > 2)
export default { name: 'LoginForm' }
```

✅ **Correct:**

```javascript  
// File: /src/modules/auth/components/LoginForm.vue (2 levels ≤ 2)
export default { name: 'LoginForm' }
```

### Custom Paths

With `{ "paths": ["services", "stores"] }`:

❌ **Incorrect:**

```javascript
// File: /src/services/api/endpoints/auth/login.ts (4 levels > 3)
export const loginService = {}
```

✅ **Correct:**

```javascript
// File: /src/modules/auth/components/deeply/nested/LoginForm.vue (ignored - not in services/stores)
export default { name: 'LoginForm' }
```

## How Nesting Depth is Calculated

The rule calculates nesting depth by counting directory levels after the base path, excluding the filename:

- `/src/modules/auth/index.ts` → **1 level** (`auth`)
- `/src/modules/auth/components/LoginForm.vue` → **2 levels** (`auth/components`)  
- `/src/modules/auth/components/forms/LoginForm.vue` → **3 levels** (`auth/components/forms`)
- `/src/modules/auth/components/forms/fields/PasswordField.vue` → **4 levels** (`auth/components/forms/fields`)

## Suggestions

The rule provides contextual suggestions based on the base path:

### For `modules`
>
> "Consider extracting nested functionality into separate services or components within the {module} module"

### For `features`  
>
> "Consider breaking down the {feature} feature into smaller, more focused features"

### For custom paths
>
> "Consider restructuring to stay within {maxDepth} levels of nesting"

## When Not to Use

This rule may not be suitable if:

- Your project requires deep nesting for specific organizational needs
- You're working with legacy code that cannot be easily restructured
- Your team prefers a different organizational approach

## Related Rules

- [`enforce-src-structure`](./enforce-src-structure.md) - Controls top-level directory structure
- [`enforce-module-exports`](./enforce-module-exports.md) - Ensures modules have proper public APIs
- [`enforce-feature-exports`](./enforce-feature-exports.md) - Ensures features have proper public APIs

## Implementation Details

- Only checks files within the `/src/` directory
- Ignores files outside the specified base paths
- Counts directory levels, not file nesting
- Provides specific suggestions based on the context (modules vs features)
- Configurable maximum depth and target paths
