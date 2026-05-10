# Getting Started

To set up a development environment for `eslint-plugin-vue-modular`, read the following instructions.

## Prerequisites

- Git (for version control, see <https://git-scm.com/>)
- Node.js (LTS version recommended, see <https://nodejs.org/>)
- Bun package manager (default for Makefile tasks, see <https://bun.sh/>)
- npm (optional alternative, bundled with Node.js)
- Make (for running tasks from the Makefile, see <https://www.gnu.org/software/make/>)
- GPG (for signing commits, see <https://gnupg.org/>)
- Basic knowledge of ESLint plugin development and Vue.js is helpful but not required.
- Familiarity with TypeScript is a plus, as the codebase is written in TypeScript.

### Development Setup

1. Fork the repository and clone your fork.
2. Install dependencies:

   ```sh
   make install
   ```

   The Makefile uses Bun by default through `PACKAGE_MANAGER ?= bun`. If you want to use npm instead, run `make PACKAGE_MANAGER=npm install`.

3. Run lint, tests and build to ensure everything is set up correctly:

   ```sh
    make lint
    make test
    make build
   ```

4. Start developing!

That's it! You should now have a working development environment for `eslint-plugin-vue-modular`. For more information on the project structure and development process, please refer to the [Project Structure](./project-structure.md) and [Development Process](./development.md) documents.
