# vue-modular/enforce-naming-convention

Enforce consistent naming patterns for Vue components.

## Rule Details

This rule enforces consistent naming conventions for Vue component `name` properties. It ensures that component names follow proper case conventions (PascalCase by default) and optionally validates that filenames match component names.

### Examples

#### ❌ Incorrect

```js
// Component name should be PascalCase
export default {
  name: 'user-card',
}
```

```js
// Filename should match component name (if requireFileNameMatches: true)
// File: src/components/user-card.js
export default {
  name: 'UserCard',
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
// Matching filename and component name
// File: src/components/UserCard.js
export default {
  name: 'UserCard',
}
```

```js
// Component without explicit name (allowed by default)
export default {
  // Component logic without name property
}
```

## Options

```js
{
  "vue-modular/enforce-naming-convention": ["error", {
    "style": "PascalCase",
    "requireFileNameMatches": true
  }]
}
```

### `style` (default: `"PascalCase"`)

Defines the naming convention for component names:

- `"PascalCase"` - Component names should use PascalCase (e.g., `UserCard`, `LoginForm`)
- `"kebab-case"` - Component names should use kebab-case (e.g., `user-card`, `login-form`)

### `requireFileNameMatches` (default: `true`)

When enabled, requires that the filename matches the component name exactly.

- `true` - Filename must match component name
- `false` - No filename validation

## Configuration Examples

### Default Configuration

```js
{
  "vue-modular/enforce-naming-convention": "error"
}
```

This enforces:

- PascalCase component names
- Filename must match component name

### Custom Style

```js
{
  "vue-modular/enforce-naming-convention": ["error", {
    "style": "kebab-case"
  }]
}
```

### Disable Filename Matching

```js
{
  "vue-modular/enforce-naming-convention": ["error", {
    "requireFileNameMatches": false
  }]
}
```

## When Not To Use

- If your project uses a different naming convention that doesn't follow standard Vue.js practices
- If you have legacy components that can't be easily renamed
- If your build process handles component name transformations automatically

## Related Rules

- [Vue.js Style Guide - Component Name Casing](https://vuejs.org/style-guide/rules-strongly-recommended.html#component-name-casing-in-templates)
- [Vue.js Style Guide - Component Names](https://vuejs.org/style-guide/rules-essential.html#use-multi-word-component-names)

## Further Reading

- [Vue.js Component Naming Best Practices](https://vuejs.org/style-guide/)
- [JavaScript Naming Conventions](https://www.robinwieruch.de/javascript-naming-conventions)
