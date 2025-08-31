import { describe, it, beforeEach } from 'vitest'
import noOrphanedFilesRule from '../src/rules/no-orphaned-files.js'
import { setupRuleTester } from './test-utils.js'

describe('no-orphaned-files rule', () => {
  let ruleTester

  beforeEach(() => {
    ruleTester = setupRuleTester()
  })

  describe('valid cases', () => {
    it('should allow files in correct locations', () => {
      ruleTester.run('no-orphaned-files', noOrphanedFilesRule, {
        valid: [
          // Root files
          {
            code: 'export default {}',
            filename: '/project/src/main.ts',
          },
          {
            code: 'export default {}',
            filename: '/project/src/main.js',
          },
          {
            code: 'export default {}',
            filename: '/project/src/App.vue',
          },

          // Components
          {
            code: 'export default {}',
            filename: '/project/src/components/UserCard.vue',
          },
          {
            code: 'export default {}',
            filename: '/project/src/components/DataTable.vue',
          },
          {
            code: 'export default {}',
            filename: '/project/src/components/ui/Button.vue', // Components can have subdirectories
          },

          // Composables
          {
            code: 'export function useApi() {}',
            filename: '/project/src/composables/useApi.ts',
          },
          {
            code: 'export function useAuth() {}',
            filename: '/project/src/composables/useAuth.js',
          },

          // Services
          {
            code: 'export const api = {}',
            filename: '/project/src/services/auth.api.ts',
          },
          {
            code: 'export const service = {}',
            filename: '/project/src/services/users.service.js',
          },

          // Stores
          {
            code: 'export const store = {}',
            filename: '/project/src/stores/authStore.ts',
          },
          {
            code: 'export const store = {}',
            filename: '/project/src/stores/userStore.js',
          },
          {
            code: 'export const FrameMessage = {}',
            filename: '/project/src/stores/types/FrameMessage.ts', // TypeScript files allowed in subdirectories
          },

          // Entities
          {
            code: 'export const User = {}',
            filename: '/project/src/entities/User.ts',
          },
          {
            code: 'export const BaseEntity = {}',
            filename: '/project/src/entities/base/BaseEntity.ts',
          },
          {
            code: 'export const CustomEntity = {}',
            filename: '/project/src/entities/custom/CustomEntity.ts', // Entities can have any subdirectory
          },

          // Views
          {
            code: 'export default {}',
            filename: '/project/src/views/HomeView.vue',
          },
          {
            code: 'export default {}',
            filename: '/project/src/views/AboutView.vue',
          },

          // Shared utilities
          {
            code: 'export const constants = {}',
            filename: '/project/src/shared/constants.ts',
          },
          {
            code: 'export function format() {}',
            filename: '/project/src/shared/formatters.ts',
          },
          {
            code: 'export default {}',
            filename: '/project/src/shared/ui/Button.vue',
          },
          {
            code: 'export const helpers = {}',
            filename: '/project/src/shared/helpers/string.ts', // .ts files allowed in subdirectories
          },
          {
            code: 'export const uiHelpers = {}',
            filename: '/project/src/shared/ui/helpers.ts', // .ts files allowed in ui subdirectories
          },

          // App infrastructure
          {
            code: 'export const router = {}',
            filename: '/project/src/app/router/index.ts',
          },
          {
            code: 'export const config = {}',
            filename: '/project/src/app/config/database.ts',
          },
          {
            code: 'export default {}',
            filename: '/project/src/app/layouts/DefaultLayout.vue',
          },

          // Modules (any structure allowed)
          {
            code: 'export default {}',
            filename: '/project/src/modules/auth/views/LoginView.vue',
          },
          {
            code: 'export default {}',
            filename: '/project/src/modules/auth/components/LoginForm.vue',
          },
          {
            code: 'export function useAuth() {}',
            filename: '/project/src/modules/auth/composables/useAuth.ts',
          },
          {
            code: 'export const routes = []',
            filename: '/project/src/modules/auth/routes.ts',
          },
          {
            code: 'export default {}',
            filename: '/project/src/modules/auth/deep/nested/file.ts',
          },

          // Features (any structure allowed)
          {
            code: 'export default {}',
            filename: '/project/src/features/search/components/SearchInput.vue',
          },
          {
            code: 'export function useSearch() {}',
            filename: '/project/src/features/search/composables/useSearch.ts',
          },
          {
            code: 'export default {}',
            filename: '/project/src/features/search/deep/nested/file.ts',
          },

          // Index files should be ignored
          {
            code: 'export default {}',
            filename: '/project/src/components/index.ts',
          },
          {
            code: 'export default {}',
            filename: '/project/src/stores/index.js',
          },
        ],
        invalid: [],
      })
    })

    it('should ignore test files', () => {
      ruleTester.run('no-orphaned-files', noOrphanedFilesRule, {
        valid: [
          {
            code: 'describe("test", () => {})',
            filename: '/project/src/tests/unit/auth.test.js',
          },
          {
            code: 'describe("test", () => {})',
            filename: '/project/src/components/Button.spec.ts',
          },
          {
            code: 'describe("test", () => {})',
            filename: '/project/src/__tests__/setup.js',
          },
          {
            code: 'describe("test", () => {})',
            filename: '/project/tests/integration/api.test.js',
          },
        ],
        invalid: [],
      })
    })

    it('should ignore specified patterns', () => {
      ruleTester.run('no-orphaned-files', noOrphanedFilesRule, {
        valid: [
          {
            code: 'export default {}',
            filename: '/project/src/types.d.ts',
          },
          {
            code: 'export default {}',
            filename: '/project/src/utils/index.ts',
          },
          {
            code: '',
            filename: '/project/src/.DS_Store',
          },
        ],
        invalid: [],
      })
    })
  })

  describe('invalid cases', () => {
    it('should flag unexpected root files', () => {
      ruleTester.run('no-orphaned-files', noOrphanedFilesRule, {
        valid: [],
        invalid: [
          {
            code: 'export const utils = {}',
            filename: '/project/src/utils.ts',
            errors: [
              {
                messageId: 'orphanedFile',
                data: {
                  message: "File 'utils.ts' should not be in src root. Expected files: main.ts, main.js, App.vue",
                },
              },
              {
                messageId: 'suggestion',
                data: {
                  suggestion: "Move 'utils.ts' to shared/ - utility and helper files belong in shared directory",
                },
              },
            ],
          },
          {
            code: 'export default {}',
            filename: '/project/src/RandomComponent.vue',
            errors: [
              {
                messageId: 'orphanedFile',
                data: {
                  message: "File 'RandomComponent.vue' should not be in src root. Expected files: main.ts, main.js, App.vue",
                },
              },
              {
                messageId: 'suggestion',
                data: {
                  suggestion: 'Move to components/ for global business components',
                },
              },
            ],
          },
        ],
      })
    })

    it('should flag unknown categories', () => {
      ruleTester.run('no-orphaned-files', noOrphanedFilesRule, {
        valid: [],
        invalid: [
          {
            code: 'export const config = {}',
            filename: '/project/src/config/database.ts',
            errors: [
              {
                messageId: 'orphanedFile',
                data: {
                  message: "Directory 'config' is not a recognized category in the modular architecture",
                },
              },
              {
                messageId: 'suggestion',
                data: {
                  suggestion: 'Use one of: app, modules, features, components, composables, services, stores, entities, shared, views',
                },
              },
            ],
          },
          {
            code: 'export const helpers = {}',
            filename: '/project/src/helpers/string.ts',
            errors: [
              {
                messageId: 'orphanedFile',
                data: {
                  message: "Directory 'helpers' is not a recognized category in the modular architecture",
                },
              },
            ],
          },
        ],
      })
    })

    it('should flag unexpected subdirectories in flat categories (stores)', () => {
      ruleTester.run('no-orphaned-files', noOrphanedFilesRule, {
        valid: [],
        invalid: [
          {
            code: 'export const store = {}',
            filename: '/project/src/stores/auth/authStore.js',
            errors: [
              {
                messageId: 'orphanedFile',
                data: {
                  message: "Subdirectory 'auth' is not allowed in 'stores'. Allowed: *.ts",
                },
              },
            ],
          },
        ],
      })
    })
  })

  describe('custom configuration', () => {
    it('should respect custom allowed directories', () => {
      const customOptions = {
        allowedDirectories: {
          components: ['ui', 'forms'], // Allow subdirectories
          utils: [], // New category
        },
        allowedRootFiles: ['main.ts', 'bootstrap.ts'], // Custom root files
      }

      ruleTester.run('no-orphaned-files', noOrphanedFilesRule, {
        valid: [
          {
            code: 'export default {}',
            filename: '/project/src/components/ui/Button.vue',
            options: [customOptions],
          },
          {
            code: 'export default {}',
            filename: '/project/src/components/forms/LoginForm.vue',
            options: [customOptions],
          },
          {
            code: 'export const helpers = {}',
            filename: '/project/src/utils/string.ts',
            options: [customOptions],
          },
          {
            code: 'export default {}',
            filename: '/project/src/bootstrap.ts',
            options: [customOptions],
          },
        ],
        invalid: [
          {
            code: 'export default {}',
            filename: '/project/src/main.js', // Not in allowed root files
            options: [customOptions],
            errors: [{ messageId: 'orphanedFile' }],
          },
          {
            code: 'export default {}',
            filename: '/project/src/components/layouts/Header.vue', // Not in allowed subdirs
            options: [customOptions],
            errors: [{ messageId: 'orphanedFile' }],
          },
        ],
      })
    })

    it('should respect custom ignore patterns', () => {
      const customOptions = {
        ignorePatterns: ['**/*.config.js', '**/vendor/**'],
      }

      ruleTester.run('no-orphaned-files', noOrphanedFilesRule, {
        valid: [
          {
            code: 'exports.config = {}',
            filename: '/project/src/tailwind.config.js',
            options: [customOptions],
          },
          {
            code: 'export default {}',
            filename: '/project/src/vendor/library/index.js',
            options: [customOptions],
          },
        ],
        invalid: [],
      })
    })

    it('should respect custom src directory', () => {
      const customOptions = {
        src: 'source',
      }

      ruleTester.run('no-orphaned-files', noOrphanedFilesRule, {
        valid: [
          {
            code: 'export default {}',
            filename: '/project/source/main.ts',
            options: [customOptions],
          },
          {
            code: 'export default {}',
            filename: '/project/source/components/Button.vue',
            options: [customOptions],
          },
        ],
        invalid: [
          {
            code: 'export const utils = {}',
            filename: '/project/source/utils.ts',
            options: [customOptions],
            errors: [{ messageId: 'orphanedFile' }],
          },
        ],
      })
    })
  })

  describe('suggestions', () => {
    it('should provide Vue component suggestions', () => {
      ruleTester.run('no-orphaned-files', noOrphanedFilesRule, {
        valid: [],
        invalid: [
          {
            code: 'export default {}',
            filename: '/project/src/LoginView.vue',
            errors: [
              {
                messageId: 'orphanedFile',
                data: { message: "File 'LoginView.vue' should not be in src root. Expected files: main.ts, main.js, App.vue" },
              },
              {
                messageId: 'suggestion',
                data: { suggestion: 'Move to views/ directory for page components' },
              },
              {
                messageId: 'suggestion',
                data: { suggestion: 'Consider moving to modules/<module>/views/ if module-specific' },
              },
            ],
          },
          {
            code: 'export default {}',
            filename: '/project/src/Button.vue',
            errors: [
              {
                messageId: 'orphanedFile',
                data: { message: "File 'Button.vue' should not be in src root. Expected files: main.ts, main.js, App.vue" },
              },
              {
                messageId: 'suggestion',
                data: { suggestion: 'Move to components/ for global business components' },
              },
              {
                messageId: 'suggestion',
                data: { suggestion: 'Move to shared/ui/ for basic UI components' },
              },
            ],
          },
        ],
      })
    })

    it('should provide TypeScript/JavaScript file suggestions', () => {
      ruleTester.run('no-orphaned-files', noOrphanedFilesRule, {
        valid: [],
        invalid: [
          {
            code: 'export function useAuth() {}',
            filename: '/project/src/useAuth.ts',
            errors: [
              {
                messageId: 'orphanedFile',
                data: { message: "File 'useAuth.ts' should not be in src root. Expected files: main.ts, main.js, App.vue" },
              },
              {
                messageId: 'suggestion',
                data: { suggestion: 'Move to composables/ for global composables' },
              },
            ],
          },
          {
            code: 'export const authAPI = {}',
            filename: '/project/src/authService.ts',
            errors: [
              {
                messageId: 'orphanedFile',
                data: { message: "File 'authService.ts' should not be in src root. Expected files: main.ts, main.js, App.vue" },
              },
              {
                messageId: 'suggestion',
                data: { suggestion: 'Move to services/ for API clients' },
              },
            ],
          },
          {
            code: 'export const useAuthStore = {}',
            filename: '/project/src/authStore.ts',
            errors: [
              {
                messageId: 'orphanedFile',
                data: { message: "File 'authStore.ts' should not be in src root. Expected files: main.ts, main.js, App.vue" },
              },
              {
                messageId: 'suggestion',
                data: { suggestion: 'Move to stores/ for global state' },
              },
            ],
          },
        ],
      })
    })

    it('should provide style file suggestions', () => {
      ruleTester.run('no-orphaned-files', noOrphanedFilesRule, {
        valid: [],
        invalid: [
          {
            code: '/* styles */',
            filename: '/project/src/styles.css',
            errors: [
              {
                messageId: 'orphanedFile',
                data: { message: "File 'styles.css' should not be in src root. Expected files: main.ts, main.js, App.vue" },
              },
              {
                messageId: 'suggestion',
                data: { suggestion: 'Move to app/styles/ for global styles' },
              },
              {
                messageId: 'suggestion',
                data: { suggestion: 'Keep styles co-located with components using <style> blocks' },
              },
            ],
          },
        ],
      })
    })
  })

  describe('edge cases', () => {
    it('should handle files outside src directory', () => {
      ruleTester.run('no-orphaned-files', noOrphanedFilesRule, {
        valid: [
          {
            code: 'export default {}',
            filename: '/project/config/webpack.config.js',
          },
          {
            code: 'export default {}',
            filename: '/project/build/utils.js',
          },
        ],
        invalid: [],
      })
    })

    it('should handle files with no extension', () => {
      ruleTester.run('no-orphaned-files', noOrphanedFilesRule, {
        valid: [],
        invalid: [
          {
            code: '#!/usr/bin/env node',
            filename: '/project/src/script',
            errors: [{ messageId: 'orphanedFile' }],
          },
        ],
      })
    })

    it('should handle empty category names', () => {
      ruleTester.run('no-orphaned-files', noOrphanedFilesRule, {
        valid: [
          {
            code: 'export default {}',
            filename: '/project/src/main.ts', // No category, just root file
          },
        ],
        invalid: [],
      })
    })
  })
})
