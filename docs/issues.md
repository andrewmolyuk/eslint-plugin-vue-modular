# Issue Reporting Guide

This document explains how to create and manage issues for the `eslint-plugin-vue-modular` project. Following these guidelines helps maintainers and contributors resolve problems and implement features efficiently.

---

## Where to Report

All issues should be reported via the [GitHub Issues page](https://github.com/andrewmolyuk/eslint-plugin-vue-modular/issues).

---

## Types of Issues

- **Bug Report**: Unexpected behavior, errors, or broken functionality.
- **Feature Request**: Suggest new features, enhancements, or rule proposals.
- **Documentation**: Missing, unclear, or incorrect documentation.
- **Question**: Usage questions, architectural clarifications, or support requests.

---

## Best Practices for Creating Issues

1. **Search First**
   - Check existing issues and discussions to avoid duplicates.
   - Use relevant keywords.

2. **Use Templates**
   - Select the appropriate issue template (Bug, Feature, Rule Proposal, etc.) if available.

3. **Provide Clear Title**
   - Summarize the issue in a concise, descriptive title.

4. **Describe the Problem or Request**
   - For bugs: Explain what happened, what you expected, and why it’s a problem.
   - For features: Describe the motivation and expected outcome.

5. **Steps to Reproduce (for bugs)**
   - List clear, numbered steps to reproduce the issue.
   - Include code snippets, configuration, or test cases if possible.

6. **Environment Details**
   - Include relevant environment info:
   - OS, Node.js version, package manager and version (npm or Bun), ESLint version, plugin version
     - Project setup (e.g., flat config, TypeScript, Vue version)

7. **Screenshots or Logs**
   - Attach screenshots, error logs, or stack traces if helpful.

8. **Minimal Reproduction**
   - Provide a minimal repository or code sample that demonstrates the issue.
   - Use [GitHub Gist](https://gist.github.com/) or [StackBlitz](https://stackblitz.com/) for quick examples.

9. **Label Appropriately**
   - Use labels (bug, enhancement, documentation, question) if you have permission.

10. **Be Respectful and Constructive**
    - Follow the [Code of Conduct](../CODE_OF_CONDUCT.md).
    - Be clear, polite, and constructive.

---

## Example Bug Report

```
Title: Rule 'feature-imports' reports false positive for shared imports

**Describe the bug**
The 'feature-imports' rule reports an error when importing from the shared layer, even though this should be allowed.

**To Reproduce**
1. Create a file in `src/features/auth/components/LoginForm.vue`
2. Add: `import { util } from '@/shared/utils'`
3. Run ESLint

**Expected behavior**
No error should be reported for imports from the shared layer.

**Environment**
- OS: Ubuntu 22.04
- Node.js: 22.0.0
- Package manager: npm 10.0.0
- ESLint: 10.0.3
- Plugin: 0.0.0

**Additional context**
See attached screenshot.
```

---

## Example Feature Request

```
Title: Add rule to enforce PascalCase for store filenames

**Describe the feature**
I’d like a rule that enforces PascalCase for filenames in the `stores` folder.

**Motivation**
This would improve consistency and match our component naming convention.

**Describe alternatives**
Currently, there is no rule for this.

**Additional context**
N/A
```

---

## Issue Lifecycle

1. **Triage**: Maintainers review and label the issue.
2. **Clarification**: Maintainers may request more info or a reproduction.
3. **Assignment**: Issue is assigned or picked up by a contributor.
4. **Resolution**: Fix, enhancement, or answer is provided.
5. **Closure**: Issue is closed when resolved or if inactive.

---

## References

- [GitHub Issues](https://github.com/andrewmolyuk/eslint-plugin-vue-modular/issues)
- [Code of Conduct](../CODE_OF_CONDUCT.md)
- [CONTRIBUTING.md](../CONTRIBUTING.md)

---

For questions or clarifications, open an issue or start a discussion on GitHub.
