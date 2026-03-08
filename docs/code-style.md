# Code Style Guide

This document describes the code style conventions used in the `eslint-plugin-vue-modular` project. All contributors are expected to follow these guidelines to ensure consistency, readability, and maintainability across the codebase.

---

## Formatting

- **Indentation**: 2 spaces, no tabs.
- **Line endings**: LF (Unix-style).
- **Trailing whitespace**: Trimmed automatically.
- **Final newline**: Required at end of every file.
- **Maximum line length**: 140 characters.
- **Quotes**: Single quotes (`'`) for strings.
- **Semicolons**: Not used (enforced by Prettier).

Formatting is enforced by [Prettier](https://prettier.io/) and [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier). See `.prettierrc` for details.

---

## TypeScript

- **Strict mode**: Enabled (`strict: true` in `tsconfig.json`).
- **Target**: ES2020, module: ESNext.
- **Type annotations**: Required for all exported functions, interfaces, and types.
- **Type imports**: Use `import type` for type-only imports.
- **Avoid any**: Use explicit types, avoid `any` unless necessary.
- **Consistent naming**: Types and interfaces use PascalCase.

---

## Naming Conventions

- **Files**:
  - Component files: PascalCase (e.g., `MyComponent.vue`)
  - TypeScript files: camelCase or kebab-case, depending on context
  - Folders: kebab-case (e.g., `feature-module`)
- **Variables**: camelCase
- **Constants**: UPPER_CASE or PascalCase
- **Functions**: camelCase
- **Classes/Types**: PascalCase

---

## Imports

- **Order**: Built-in modules, external packages, internal modules.
- **Grouping**: Group imports by type, separated by blank lines.
- **Path resolution**: Use project aliases (`@` for `src/`) where possible.
- **No unused imports**: Remove unused imports automatically.

---

## Rule Implementation

- All rules are defined using the `createRule` utility for consistency.
- Rule files are located in `src/rules/` and named after their purpose (e.g., `file-component-naming.ts`).
- Each rule exports a constant with the same name as the file.
- Rule options and messages are defined in the rule's `meta` property.
- Tests for each rule are located in `tests/rules/`.
- Rule documentation is in `docs/rules/`.

---

## Comments

- Use JSDoc-style comments for exported functions, types, and classes.
- Inline comments should be concise and only used when necessary.
- Prefer self-documenting code over excessive comments.

---

## Project Structure

- Source code: `src/`
- Utilities: `src/utils/`
- Rules: `src/rules/`
- Types: `src/types.ts`
- Tests: `tests/`
- Documentation: `docs/`

---

## Linting & Testing

- Linting is enforced via ESLint with Prettier integration.
- All code must pass lint and type checks before merging.
- Tests are written using [Vitest](https://vitest.dev/) and must cover all rules and utilities.
- Use `bunx eslint . --ext .js,.ts,.json,.md --fix` and `bunx tsc --noEmit` to check code quality.

---

## Example

```typescript
// src/rules/file-component-naming.ts
import { createRule, toPascalCase, parseRuleOptions, isIgnored, isComponent, parseProjectOptions } from '../utils'
import type { VueModularRuleModule, VueModularRuleContext } from '../types'

const defaultOptions = {
  ignores: ['**/*.spec.*', '**/*.test.*', '**/*.stories.*'],
}

export const fileComponentNaming = createRule<VueModularRuleModule>({
  create(context: VueModularRuleContext) {
    // ...rule logic...
  },
  name: 'file-component-naming',
  recommended: true,
  level: 'error',
  meta: {
    type: 'suggestion',
    docs: {
      category: 'File Organization',
      description: 'Require component filenames to be PascalCase',
    },
    // ...meta options...
  },
})
```

---

## References

- [Prettier configuration](../.prettierrc)
- [ESLint configuration](../eslint.config.mts)
- [TypeScript configuration](../tsconfig.json)
- [Vitest configuration](../vitest.config.ts)

---

For questions or clarifications, see [CONTRIBUTING.md](../CONTRIBUTING.md) or open an issue.
