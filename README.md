# eslint-plugin-vue-modular

A custom ESLint plugin for enforcing modular patterns in Vue 3 projects.

## Features

- Custom linting rules for Vue 3 modular architecture
- Supports single-file components (SFC)
- Enforces architectural boundaries between features
- Supports both flat config (ESLint v9+) and legacy config formats
- Easily extendable for your team's needs

## Installation

This package is published on npm and should be installed as a devDependency in your project.

```bash
npm install eslint-plugin-vue-modular --save-dev
```

> [!NOTE]  
> Please note: ESLint is not bundled with eslint-plugin-vue-modular. You need to install ESLint separately in your project.

## Configuration

### Flat Config (ESLint v9+ - Recommended)

```js
// eslint.config.js
import vueModular from 'eslint-plugin-vue-modular'

export default [
  {
    files: ['**/*.js', '**/*.vue', '**/*.ts'],
    plugins: {
      'vue-modular': vueModular,
    },
    rules: {
      'vue-modular/no-cross-feature-imports': 'error',
      'vue-modular/src-structure': 'error',
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
  },
]
```

### Legacy Config (ESLint v8 and below)

```js
// .eslintrc.js
module.exports = {
  plugins: ['vue-modular'],
  extends: ['plugin:vue-modular/recommended'],
  rules: {
    'vue-modular/no-cross-feature-imports': 'error',
    'vue-modular/src-structure': 'error',
  },
}
```

## Rules

This plugin provides rules to enforce modular architecture boundaries in Vue.js applications.

### Included Rules

- [`vue-modular/no-cross-feature-imports`](./docs/rules/no-cross-feature-imports.md): Prevents direct imports from deep inside feature folders
- [`vue-modular/src-structure`](./docs/rules/src-structure.md): Enforces allowed top-level folders/files in source directory

For detailed documentation about rules, see the [Rules Documentation](./docs/rules.md).

### Modular Architecture in Vue

In Vue applications, modular architecture means organizing your codebase into self-contained feature modules. Each module typically contains its own components, composables, stores, and styles, grouped by feature rather than by file type. This approach improves maintainability, scalability, and testability by reducing coupling and clarifying dependencies.

With modular architecture, you can:

- Keep related logic together, making features easier to develop and refactor.
- Prevent accidental imports between unrelated features, enforcing clear boundaries.
- Enable teams to work independently on different modules.
- Simplify onboarding by making the project structure more intuitive.

See the [Vue 3 Project Modules Blueprint](./docs/vue3-project-modules-blueprint.md) for more details and rationale behind modular structure.

The `eslint-plugin-vue-modular` plugin helps enforce these boundaries, ensuring that your Vue project remains modular as it grows.

## Recommended VS Code Extensions

See `.vscode/extensions.json` for a list of recommended extensions to
improve your development experience.

## Contributing

Pull requests and issues are welcome! Please follow the code style and add
tests for new rules.

## License

MIT, see [LICENSE](./LICENSE) for details.
