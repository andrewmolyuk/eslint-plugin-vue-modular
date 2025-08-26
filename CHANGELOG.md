# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.



### Features

* add initial version configuration file with commit message formats ([a0f4e96](https://github.com/andrewmolyuk/eslint-plugin-vue-modular/commit/a0f4e969769e2b128b82539eb6da7fc74370125f))
* enhance enforce-naming-convention rule to support Vue 3 modular architecture with file type-specific naming conventions and comprehensive validation ([c27dac4](https://github.com/andrewmolyuk/eslint-plugin-vue-modular/commit/c27dac4601ba5cf9de426625d0ca37f8f21a17ee))
* rename component naming convention rule to enforce-naming-convention and update related documentation ([cacf020](https://github.com/andrewmolyuk/eslint-plugin-vue-modular/commit/cacf020b8ac6e9ee375869b8d944b3b2ca16caeb))


### Bug Fixes

* update types structure in version configuration for consistency ([8801736](https://github.com/andrewmolyuk/eslint-plugin-vue-modular/commit/88017364570ae388bcf3178a707c1c437ec791b3))



### Features

* add component naming convention rule with tests and documentation ([d4ab529](https://github.com/andrewmolyuk/eslint-plugin-vue-modular/commit/d4ab529e6600c8ddc0146b2df859c5ecef3b938b))



### Features

* add badges for build status, Codacy grade, issues, NPM version, downloads, and license to README ([5c5b388](https://github.com/andrewmolyuk/eslint-plugin-vue-modular/commit/5c5b38870d272b7d805ac2999befa89d346b4e41))
* enhance ESLint configuration and rules with improved error handling and global definitions ([48e504b](https://github.com/andrewmolyuk/eslint-plugin-vue-modular/commit/48e504b1d9fc28840cd6525bddbd14d1c43f29cd))
* expand tests for enforce-import-boundaries rule with additional valid and invalid import cases ([36afc3d](https://github.com/andrewmolyuk/eslint-plugin-vue-modular/commit/36afc3d67b6d179fab47b5a88f5259df8af16d66))
* update enforce-import-boundaries documentation and tests to allow global services and stores imports ([5050ab9](https://github.com/andrewmolyuk/eslint-plugin-vue-modular/commit/5050ab98c73bce6137c73fafdf54bc87c7136b8e))



### Features

* enhance enforce-import-boundaries rule with detailed layer access control and additional test cases ([2aa2f8d](https://github.com/andrewmolyuk/eslint-plugin-vue-modular/commit/2aa2f8d74ef7ba7f89b439a41b21cd122d50e31f))



### Features

* enhance linting and documentation for modular rules ([e942e29](https://github.com/andrewmolyuk/eslint-plugin-vue-modular/commit/e942e29156e5b3b0b784ad7df0a7349a7c6f82b4))
* update error messages for cross feature imports and clarify optional features directory in tests ([c87f757](https://github.com/andrewmolyuk/eslint-plugin-vue-modular/commit/c87f757e851c4a35b01d27d071c66b810a3daa8f))


### Bug Fixes

* correct code block formatting in no-cross-feature-imports documentation ([1093f0e](https://github.com/andrewmolyuk/eslint-plugin-vue-modular/commit/1093f0e199d157eb3729db2fb7995badee37eb33))



### Features

* rename app-structure rule to enforce-app-structure and update related documentation ([1b8436f](https://github.com/andrewmolyuk/eslint-plugin-vue-modular/commit/1b8436fe71aec2805911c15dcb7c2ec484e03add))
* rename feature-structure rule to enforce-feature-exports and update related documentation ([af2ec8c](https://github.com/andrewmolyuk/eslint-plugin-vue-modular/commit/af2ec8cba842adff22a3bd0d213dba557a81bed0))
* rename module-structure rule to enforce-module-exports and update related documentation ([3148940](https://github.com/andrewmolyuk/eslint-plugin-vue-modular/commit/31489401eac650d25ad2db8292ba4f5f537be870))
* rename src-structure rule to enforce-src-structure and update related documentation ([1ba646c](https://github.com/andrewmolyuk/eslint-plugin-vue-modular/commit/1ba646cf1c77d735b501e30c7bfee75e915b26ad))



### Features

* add app-structure rule to enforce required application infrastructure in src/app ([af8c6e7](https://github.com/andrewmolyuk/eslint-plugin-vue-modular/commit/af8c6e7cf543709de95ad4a6feaa1b84bf3848a1))
* add enforce-import-boundaries rule to enforce proper import paths between modules and features ([f03a868](https://github.com/andrewmolyuk/eslint-plugin-vue-modular/commit/f03a8687d5032188d9d4af00bd73c1c33df60466))
* add feature-structure rule to enforce public API exposure for global features ([75b381f](https://github.com/andrewmolyuk/eslint-plugin-vue-modular/commit/75b381f8cec628e2d2a01876ecd2f84a9cf508ad))
* add module-structure rule to enforce public API exposure in modules ([c5d3195](https://github.com/andrewmolyuk/eslint-plugin-vue-modular/commit/c5d3195eca5df025da5d657c1ff1ac7bae262ade))
* update documentation and rules for import boundary enforcement ([f08aaa2](https://github.com/andrewmolyuk/eslint-plugin-vue-modular/commit/f08aaa23f5a1dae5fc8d8c18e427cfa34ef2aa87))




### Features

* add no-cross-module-imports rule to enforce module boundaries ([fe9e060](https://github.com/andrewmolyuk/eslint-plugin-vue-modular/commit/fe9e06083d8b241b043fd91d0504cd92f2347500))


### Bug Fixes

* add 'stores' to allowed top-level folders in src structure ([076906a](https://github.com/andrewmolyuk/eslint-plugin-vue-modular/commit/076906ad0e032e779994cdf764fdfc0244634cf3))



### Bug Fixes

* update test descriptions for clarity and remove unused dependencies ([8cffac5](https://github.com/andrewmolyuk/eslint-plugin-vue-modular/commit/8cffac590d8e3f2e2472ba1d65372e1fa1805cf2))



### Bug Fixes

* improve src-structure rule to use process-based cache and remove session-based cache ([14442e9](https://github.com/andrewmolyuk/eslint-plugin-vue-modular/commit/14442e96f23f9152d082a0fe0107844d5ec6c546))
* remove unnecessary blank lines in src-structure tests ([4519f7d](https://github.com/andrewmolyuk/eslint-plugin-vue-modular/commit/4519f7d458854a1ffa0de87aaef301783dc1b823))



### Bug Fixes

* **src-structure:** fix rule running multiple times by using process-based cache ([TBD](https://github.com/andrewmolyuk/eslint-plugin-vue-modular/commit/TBD))

### [0.0.8](https://github.com/andrewmolyuk/eslint-plugin-vue-modular/compare/v0.0.7...v0.0.8) (2025-08-22)ngelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.



### Bug Fixes

* update changelog for version 0.0.9 and improve src-structure rule session handling ([e3e3f62](https://github.com/andrewmolyuk/eslint-plugin-vue-modular/commit/e3e3f6202a0e74c9faa957566bfaef847700814b))



### Features

* add roadmap and planned rules for eslint-plugin-vue-modular ([f37f4a8](https://github.com/andrewmolyuk/eslint-plugin-vue-modular/commit/f37f4a8924ed3c4ff7dbae1b6c626bb47cc312f8))
* add src-structure rule to enforce allowed top-level folders and files in src directory ([f90a1d9](https://github.com/andrewmolyuk/eslint-plugin-vue-modular/commit/f90a1d98fbfd11e16096399f51112039781a1045))
* enhance README and documentation for eslint-plugin-vue-modular ([066823c](https://github.com/andrewmolyuk/eslint-plugin-vue-modular/commit/066823cda292843324a9531ab3a418fff851fdcd))



### Bug Fixes

* **release:** update tag retrieval to use version from package.json ([7ad4cf1](https://github.com/andrewmolyuk/eslint-plugin-vue-modular/commit/7ad4cf191ddc5c88330f63ab3e6689f733a2a82a))

### Features

* enhance release process with GitHub CLI authentication check ([a9ebbfe](https://github.com/andrewmolyuk/eslint-plugin-vue-modular/commit/a9ebbfed2552683fb109d8113f0ef81b55a58850))
* implement no-cross-feature-imports rule and update related configurations ([96d5347](https://github.com/andrewmolyuk/eslint-plugin-vue-modular/commit/96d5347146e2f0bced223ea323a6164b27b09237))

### 0.0.2 (2025-08-20)


### Features

* add eslint-plugin-vue-modular with no-var rule and vitest tests ([9254685](https://github.com/andrewmolyuk/eslint-plugin-vue-modular/commit/925468588af4ec729976d92a3ce1b00fd5e889cf))
* add GitHub Actions workflows for build and publish processes ([17f23eb](https://github.com/andrewmolyuk/eslint-plugin-vue-modular/commit/17f23eb99988fde5aaa8137d0a5eabe34a45f96e))
