# eslint-plugin-vue-modular

[![Build Status](https://github.com/andrewmolyuk/eslint-plugin-vue-modular/actions/workflows/test.yml/badge.svg)](https://github.com/andrewmolyuk/eslint-plugin-vue-modular/actions/workflows/test.yml)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/819ccf509a694fcc8204bca4a78c634d)](https://app.codacy.com/gh/andrewmolyuk/eslint-plugin-vue-modular/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![Codacy Badge](https://app.codacy.com/project/badge/Coverage/819ccf509a694fcc8204bca4a78c634d)](https://app.codacy.com/gh/andrewmolyuk/eslint-plugin-vue-modular/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_coverage)
[![Issues](https://img.shields.io/github/issues/andrewmolyuk/eslint-plugin-vue-modular)](https://github.com/andrewmolyuk/eslint-plugin-vue-modular/issues)
[![NPM downloads](https://img.shields.io/npm/dw/eslint-plugin-vue-modular.svg?style=flat)](https://www.npmjs.com/package/eslint-plugin-vue-modular)
[![semantic-release: conventional](https://img.shields.io/badge/semantic--release-conventional-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)

A custom ESLint plugin for enforcing modular patterns in Vue projects.

> The project is in active development and may have breaking changes in minor versions, but we will strive to keep changes minimal and well-documented.

## Modular Architecture in Vue

In Vue applications, modular architecture means organizing your codebase into self-contained feature modules. Each module typically contains its own components, composables, stores, and styles, grouped by feature rather than by file type. This approach improves maintainability, scalability, and testability by reducing coupling and clarifying dependencies.

With modular architecture, you can:

- Keep related logic together, making features easier to develop and refactor.
- Prevent accidental imports between unrelated features, enforcing clear boundaries.
- Enable teams to work independently on different modules.
- Simplify onboarding by making the project structure more intuitive.

See the [Vue Modular Architecture](./docs/vue-modular-architecture.md) for more details and rationale behind modular structure.

The `eslint-plugin-vue-modular` plugin helps enforce these boundaries, ensuring that your Vue project remains modular as it grows.

## Features

- Custom linting rules for Vue modular architecture
- Supports single-file components (SFC)
- Enforces architectural boundaries between features
- Supports flat config only (ESLint v9+)
- Easily extendable for your team's needs

## Installation

This package is published on npm and should be installed as a devDependency in your project.

```bash
npm install eslint-plugin-vue-modular --save-dev
```

> ESLint is not bundled with eslint-plugin-vue-modular. You need to install ESLint separately in your project.

## Usage

We provide two predefined configurations to help enforce modular architecture principles in your Vue.js projects:

- **recommended** - enables the rules that follow best practices for modular architecture and Vue.js development.
- **all** - enables all of the rules shipped with eslint-plugin-vue-modular.

### ESLint v9+ Configuration

```javascript
import vueModular from 'eslint-plugin-vue-modular'

export default [...vueModular.configs.recommended]
```

### Project options / settings (flat-config)

When using ESLint v9+ flat config or any setup that supports `settings`, plugin-wide project options should be placed under `settings['vue-modular']`.

Example (flat config):

```js
export default [
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.vue'],
    plugins: { 'vue-modular': vueModular },
    settings: {
      'vue-modular': {
        // optional overrides; omitted keys fall back to sensible defaults
        rootPath: 'src',
        rootAlias: '@',
        appPath: 'src/app',
        layoutsPath: 'src/app/layouts',
        featuresPath: 'src/features',
        sharedPath: 'src/shared',
        componentsFolderName: 'components',
        viewsFolderName: 'views',
        uiFolderName: 'ui',
      },
    },
  },
]
```

Notes:

- The plugin merges any provided settings with built-in defaults, so you only need to set the keys you want to override.
- Rule-level options (for example the `file-ts-naming` rule) remain available per-rule; `file-ts-naming` accepts an `ignores` array. The default ignore globs are `['**/*.d.ts', '**/*.spec.*', '**/*.test.*', '**/*.stories.*']`.

### Quick Start

1. Install the plugin: `npm install eslint-plugin-vue-modular --save-dev`
2. Add the recommended configuration to your ESLint config
3. Run: `npx eslint src/`

The plugin will now enforce modular architecture patterns in your Vue.js project!

## Rules

This plugin provides rules to enforce modular architecture boundaries in Vue.js applications.

> The list shows the most important rules for establishing modular architecture, ordered by priority.
>
> ![Progress](https://progress-bar.xyz/50/?scale=100&width=500&title=14%20of%2028%20core%20rules%20completed)

| Rule                                                                     | Description                                                                   |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| [feature-imports](./docs/rules/feature-imports.md)                       | Features should only import from the shared layer or their own internal files |
| [shared-imports](./docs/rules/shared-imports.md)                         | Shared folder cannot import from features or views                            |
| [app-imports](./docs/rules/app-imports.md)                               | App folder can import from shared and features with specific exceptions       |
| [feature-index-required](./docs/rules/feature-index-required.md)         | Each feature folder must contain an index.ts file as its public API           |
| [components-index-required](./docs/rules/components-index-required.md)   | All components folders must contain an index.ts file for component exports    |
| [shared-ui-index-required](./docs/rules/shared-ui-index-required.md)     | The shared/ui folder must contain an index.ts file for UI component exports   |
| [file-component-naming](./docs/rules/file-component-naming.md)           | All Vue components must use PascalCase naming                                 |
| [file-ts-naming](./docs/rules/file-ts-naming.md)                         | All TypeScript files must use camelCase naming                                |
| [sfc-required](./docs/rules/sfc-required.md)                             | All Vue components should be written as Single File Components                |
| [folder-kebab-case](./docs/rules/folder-kebab-case.md)                   | All folders must use kebab-case naming                                        |
| [service-filename-no-suffix](./docs/rules/service-filename-no-suffix.md) | Service files must not have Service suffix                                    |
| [store-filename-no-suffix](./docs/rules/store-filename-no-suffix.md)     | Store files must not have Store suffix                                        |
| stores-shared-location                                                   | Global state must be in shared/stores                                         |
| [sfc-order](./docs/rules/sfc-order.md)                                   | Enforce SFC block order: script, template, style                              |
| [views-suffix](./docs/rules/views-suffix.md)                             | View files must end with View.vue suffix                                      |
| services-shared-location                                                 | Cross-cutting services must be in shared/services                             |
| services-feature-location                                                | Feature-specific services must be in features/{feature}/services              |
| store-pinia-composition                                                  | Store files must use Pinia composition API syntax                             |
| stores-feature-location                                                  | Feature-specific state must be in features/{feature}/stores                   |
| feature-stores-no-imports                                                | Feature stores cannot import other feature stores directly                    |
| routes-global-location                                                   | Global routes must be in app/router.ts                                        |
| routes-feature-location                                                  | Feature routes must be in features/{feature}/routes.ts                        |
| feature-components-location                                              | Feature-specific components must be in features/{feature}/components          |
| ui-components-location                                                   | Reusable UI components must be in shared/ui                                   |
| business-components-location                                             | Business components used across features must be in shared/components         |
| views-feature-location                                                   | Feature views must be in features/{feature}/views                             |
| composables-shared-location                                              | Global composables must be in shared/composables                              |
| composables-feature-location                                             | Feature composables must be in features/{feature}/composables                 |

## Contributing

Pull requests and issues are welcome! Please follow the code style and add tests for new rules.

## License

MIT, see [LICENSE](./LICENSE.md) for details.
