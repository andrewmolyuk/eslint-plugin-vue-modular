# enforce-sfc-order

Enforces the order of blocks in Vue Single File Components (SFC).

## Rule Details

This rule enforces a specific order for Vue SFC blocks to ensure consistency across your codebase. By default, it requires:

1. `<template>` block must be present and come first
2. `<script>` or `<script setup>` blocks (optional) come second
3. `<style>` blocks (optional) come last

## Examples

### ✅ Valid

```vue
<template>
  <div>Hello World</div>
</template>

<script>
export default {
  name: 'MyComponent',
}
</script>

<style>
.hello {
  color: red;
}
</style>
```

```vue
<template>
  <div>{{ message }}</div>
</template>

<script setup>
const message = 'Hello World'
</script>
```

```vue
<template>
  <div>Hello World</div>
</template>
```

### ❌ Invalid

```vue
<!-- Script before template -->
<script>
export default {
  name: 'MyComponent',
}
</script>

<template>
  <div>Hello World</div>
</template>
```

```vue
<!-- Style before script -->
<template>
  <div>Hello World</div>
</template>

<style>
.hello {
  color: red;
}
</style>

<script>
export default {
  name: 'MyComponent',
}
</script>
```

```vue
<!-- Missing template block -->
<script>
export default {
  name: 'MyComponent',
}
</script>

<style>
.hello {
  color: red;
}
</style>
```

## Options

The rule accepts an options object with the following properties:

- `order` (array): Defines the expected order of SFC blocks. Default: `['template', 'script', 'style']`

### Example Configuration

```js
{
  "vue-modular/enforce-sfc-order": ["error", {
    "order": ["template", "script", "style"]
  }]
}
```

## Why This Rule Exists

Consistent SFC block ordering improves:

1. **Code Readability**: Developers always know where to find specific content
2. **Team Consistency**: Establishes a standard structure across all Vue components
3. **Mental Model**: Template-first approach aligns with Vue's template-driven philosophy
4. **Tooling Support**: Many Vue development tools expect this conventional order

## When Not To Use

This rule should not be used if:

- Your team has already established a different SFC block order convention
- You're working with legacy codebases where changing order would be disruptive
- Your project doesn't use Vue Single File Components

## Related Rules

- [vue/component-tags-order](https://eslint.vuejs.org/rules/component-tags-order.html) - Vue's official ESLint plugin rule for similar functionality
