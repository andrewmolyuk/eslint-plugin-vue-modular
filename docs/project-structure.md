# Project Structure

This document provides an overview of the structure of the `eslint-plugin-vue-modular` repository to help contributors navigate the codebase effectively.

Understanding the project structure is essential for contributing to the development of the plugin, whether you're adding new features, fixing bugs, or improving documentation.

The project is structured as follows:

```plaintext
eslint-plugin-vue-modular
├── src/
│   ├── rules/              # ESLint rule implementations
│   ├── utils/              # Utility functions
│   ├── configs.ts          # Shared ESLint configurations
│   ├── meta.ts             # Plugin metadata (name, version, etc.)
│   ├── projectOptions.ts   # Project-specific options and settings
│   ├── rules.ts            # Rule definitions and exports
│   ├── types.ts            # TypeScript types and interfaces
│   └── index.ts            # Plugin entry point
├── tests/
│   ├── rules/              # Tests for each rule
│   ├── utils/              # Tests for utility functions
│   └── test-utils/         # Shared test utilities
├── docs/
│   ├── assets/             # Images and other assets
│   └── rules/              # Documentation for each rule
├── eslint.config.mjs       # ESLint configuration for the project
├── Makefile                # Makefile with common tasks
├── package.json            # Project metadata and scripts
├── tsconfig.json           # TypeScript configuration
└── vitest.config.ts        # Vitest configuration
```

## Key Directories and Files

The main components of the project structure include:

- `src/`: Contains the source code for the ESLint plugin.
- `src/rules/`: Contains the implementations of the ESLint rules provided by the plugin.
- `tests/rules/`: Contains unit tests for each rule to ensure correctness.
- `docs/`: Contains markdown files documenting the rules and other relevant information.
  options.
- `Makefile`: Provides convenient commands for common tasks like installing dependencies, running tests, and building the project.
- `eslint.config.mjs`: ESLint configuration specific to the development of the plugin itself.
- `vitest.config.ts`: Configuration for Vitest, the testing framework used in this project.

It is recommended to familiarize yourself with this structure before making contributions to ensure a smooth development experience. If you have any questions about the structure or where to find specific functionality, please feel free to ask in the project's issue tracker or discussion forums.
