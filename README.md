# eslint-plugin-vue-modular

[![Build Status](https://img.shields.io/github/actions/workflow/status/andrewmolyuk/eslint-plugin-vue-modular/build.yml)](https://github.com/andrewmolyuk/eslint-plugin-vue-modular/actions/workflows/build.yml)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/819ccf509a694fcc8204bca4a78c634d)](https://app.codacy.com/gh/andrewmolyuk/eslint-plugin-vue-modular/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Issues](https://img.shields.io/github/issues/andrewmolyuk/eslint-plugin-vue-modular)](https://github.com/andrewmolyuk/eslint-plugin-vue-modular/issues)
[![NPM](https://img.shields.io/npm/v/eslint-plugin-vue-modular.svg?style=flat)](https://www.npmjs.com/package/eslint-plugin-vue-modular)
[![NPM downloads](https://img.shields.io/npm/dw/eslint-plugin-vue-modular.svg?style=flat)](https://www.npmjs.com/package/eslint-plugin-vue-modular)
[![License](https://img.shields.io/npm/l/eslint-plugin-vue-modular.svg)](LICENSE)

A custom ESLint plugin for enforcing modular patterns in Vue 3 projects.

## Features

- Custom linting rules for Vue 3 modular architecture
- Supports single-file components (SFC)
- Enforces architectural boundaries between features
- **Automatic test file detection** - test files can import from anywhere without restrictions
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
      'vue-modular/no-cross-module-imports': 'error',
      'vue-modular/enforce-src-structure': 'error',
      'vue-modular/enforce-module-exports': 'error',
      // Optional: Enable component naming convention
      // 'vue-modular/enforce-naming-convention': 'error',
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
  },
]
```

You can also use the plugin's bundled configurations for convenience:

```js
// eslint.config.js
import pluginVueModular from 'eslint-plugin-vue-modular'

// Recommended config (core architectural rules)
export default [pluginVueModular.configs['flat/recommended']]

// OR strict config (includes all rules, including style-related)
export default [pluginVueModular.configs['flat/strict']]
```

- **Recommended config**: Includes core architectural rules that enforce modular boundaries
- **Strict config**: Includes all rules, including style-related rules like component naming conventions

### Legacy Config (ESLint v8 and below)

```js
// .eslintrc.js
module.exports = {
  plugins: ['vue-modular'],
  extends: [
    'plugin:vue-modular/recommended', // Core architectural rules
    // OR
    // 'plugin:vue-modular/strict', // All rules including style-related
  ],
  rules: {
    'vue-modular/no-cross-feature-imports': 'error',
    'vue-modular/no-cross-module-imports': 'error',
    'vue-modular/enforce-src-structure': 'error',
    // Optional: Enable component naming convention
    // 'vue-modular/enforce-naming-convention': 'error',
  },
}
```

- **Recommended preset**: Includes core architectural rules that enforce modular boundaries
- **Strict preset**: Includes all rules, including style-related rules like component naming conventions

## Rules

This plugin provides rules to enforce modular architecture boundaries in Vue.js applications.

### Included Rules

- [`vue-modular/no-cross-feature-imports`](./docs/rules/no-cross-feature-imports.md): Prevents direct imports from deep inside feature folders
- [`vue-modular/no-cross-module-imports`](./docs/rules/no-cross-module-imports.md): Prevents imports between different modules
- [`vue-modular/enforce-import-boundaries`](./docs/rules/enforce-import-boundaries.md): Consolidated import-boundary enforcement (modules/features/app/shared)
- [`vue-modular/enforce-src-structure`](./docs/rules/enforce-src-structure.md): Enforces allowed top-level folders/files in source directory
- [`vue-modular/enforce-app-structure`](./docs/rules/enforce-app-structure.md): Enforces presence of application infrastructure under `src/app`
- [`vue-modular/enforce-module-exports`](./docs/rules/enforce-module-exports.md): Ensures modules expose a public API via `index.ts`/`index.js`
- [`vue-modular/enforce-feature-exports`](./docs/rules/enforce-feature-exports.md): Ensures global features expose a public API via `index.ts`/`index.js`
- [`vue-modular/enforce-naming-convention`](./docs/rules/enforce-naming-convention.md): Enforce consistent naming patterns for Vue components

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
