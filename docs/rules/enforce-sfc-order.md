# enforce-sfc-order

Enforces the order of blocks in Vue Single File Components (SFC) according to the Vue.js style guide.

## Rule Details

This rule enforces a specific order for Vue SFC blocks to ensure consistency across your codebase. Following the [Vue.js style guide](https://vuejs.org/style-guide/rules-recommended.html#single-file-component-top-level-element-order), this rule requires:

1. At least one of `<script>` or `<template>` block must be present
2. `<style>` blocks (optional) must come last
3. The order between `<script>` and `<template>` is configurable (both orders are acceptable)

By default, the rule enforces `<script>` → `<template>` → `<style>` order, but can be configured to use `<template>` → `<script>` → `<style>` order.## Examples

### ✅ Valid

**Script-first order (default):**

```vue
<script>
export default {
  name: 'MyComponent',
}
</script>

<template>
  <div>Hello World</div>
</template>

<style>
.hello {
  color: red;
}
</style>
```

**Template-first order (with configuration):**

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

**Script setup:**

```vue
<script setup>
const message = 'Hello World'
</script>

<template>
  <div>{{ message }}</div>
</template>
```

**Only script:**

```vue
<script>
export default {
  name: 'MyComponent',
}
</script>
```

**Only template:**

```vue
<template>
  <div>Hello World</div>
</template>
```

### ❌ Invalid

````vue
### ❌ Invalid **Missing required blocks:** ```vue
<!-- Neither script nor template -->
<style>
.hello {
  color: red;
}
</style>
````

**Wrong order (template before script with script-first config):**

```vue
<template>
  <div>Hello World</div>
</template>

<script>
export default {
  name: 'MyComponent',
}
</script>
```

**Style not last:**

```vue
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

<template>
  <div>Hello World</div>
</template>
```

**Style not last:**

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

- `order` (array): Defines the expected order of SFC blocks. Default: `['script', 'template', 'style']`

**Note:** `style` must always be last when present, regardless of configuration.

### Example Configuration

**Script-first order (default):**

```js
{
  "vue-modular/enforce-sfc-order": ["error", {
    "order": ["script", "template", "style"]
  }]
}
```

**Template-first order:**

```js
{
  "vue-modular/enforce-sfc-order": ["error", {
    "order": ["template", "script", "style"]
  }]
}
```

## Why This Rule Exists

Consistent SFC block ordering improves:

1. **Vue.js Style Guide Compliance**: Follows the official Vue.js recommended practices
2. **Code Readability**: Developers always know where to find specific content
3. **Team Consistency**: Establishes a standard structure across all Vue components
4. **Flexibility**: Supports both acceptable orders from the Vue.js style guide
5. **Tooling Support**: Many Vue development tools expect conventional SFC structure

## When Not To Use

This rule should not be used if:

- Your team has already established a different SFC block order convention that conflicts with the Vue.js style guide
- You're working with legacy codebases where changing order would be disruptive
- Your project doesn't use Vue Single File Components

## Related Rules

- [vue/component-tags-order](https://eslint.vuejs.org/rules/component-tags-order.html) - Vue's official ESLint plugin rule for similar functionality
