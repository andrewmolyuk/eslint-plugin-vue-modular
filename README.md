# eslint-plugin-vue-modular

A custom ESLint plugin for enforcing modular patterns in Vue 3 projects.

## Features

- Custom linting rules for Vue 3 modular architecture
- Supports single-file components (SFC)
- Easily extendable for your team's needs

## Installation

This package is published on npm and should be installed as a devDependency in your project.

```bash
npm install eslint-plugin-vue-modular --save-dev
```

> [!NOTE]  
> Please note: ESLint is not bundled with eslint-plugin-vue-modular. You need to install ESLint separately in your project.

To enable the plugin and use one of the provided configurations, add the following to your eslint.config.js file:

```js
import modular from "eslint-plugin-vue-modular";
export default [
  {
    plugins: {
      modular,
    },
    rules: {
      ...modular.configs.recommended.rules,
    }
  }
];
```

## Recommended VS Code Extensions

See `.vscode/extensions.json` for a list of recommended extensions to
improve your development experience.

## Contributing

Pull requests and issues are welcome! Please follow the code style and add
tests for new rules.

## License

MIT, see [LICENSE](./LICENSE) for details.
