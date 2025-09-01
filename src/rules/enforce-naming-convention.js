function toPascalCase(name) {
  return String(name)
    .replace(/(^|[-_/\s]+)([a-zA-Z0-9])/g, (_, __, ch) => ch.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, '')
}

function toKebabCase(name) {
  return String(name)
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .toLowerCase()
}

/**
 * Check if a declared name matches the expected style and report if not
 * @param {Object} context - ESLint context
 * @param {Object} node - The AST node to report on
 * @param {string} declared - The declared name
 * @param {string} style - The expected style ('kebab-case' or 'PascalCase')
 * @returns {boolean} - True if style check passed, false if reported
 */
function checkAndReportStyle(context, node, declared, style) {
  const expectedStyle = style === 'kebab-case' ? toKebabCase(declared) : toPascalCase(declared)

  if (declared !== expectedStyle) {
    context.report({
      node,
      messageId: 'badStyle',
      data: { name: declared, expected: expectedStyle, style },
    })
    return false
  }
  return true
}

function getFileType(filename) {
  const path = filename.toLowerCase()
  const basename = filename.split('/').pop()
  const pathParts = filename.split('/')

  // Check for specific patterns based on directory structure
  if (path.includes('/views/') && basename.endsWith('.vue')) {
    return 'view'
  }
  if ((path.includes('/components/') || path.includes('/component/')) && basename.endsWith('.vue')) {
    return 'component'
  }

  // Only files DIRECTLY in stores directory, not in subdirectories
  if (basename.endsWith('.ts') || basename.endsWith('.js')) {
    const storesDirIndex = pathParts.findIndex((part) => part === 'stores' || part === 'store')
    if (storesDirIndex !== -1 && storesDirIndex === pathParts.length - 2) {
      // File is directly in stores directory (stores/filename.ts)
      return 'store'
    }
  }

  if ((path.includes('/composables/') || path.includes('/composable/')) && (basename.endsWith('.ts') || basename.endsWith('.js'))) {
    return 'composable'
  }
  if ((path.includes('/services/') || path.includes('/service/')) && (basename.endsWith('.ts') || basename.endsWith('.js'))) {
    return 'service'
  }
  if ((path.includes('/entities/') || path.includes('/entity/')) && (basename.endsWith('.ts') || basename.endsWith('.js'))) {
    return 'entity'
  }

  // Check for specific module files (detect any .ts/.js file in modules directory that should be routes or menu)
  if (pathParts.includes('modules') && (basename.endsWith('.ts') || basename.endsWith('.js'))) {
    // Check if it's a routes file (basename starts with route-related names or is routes.ts)
    if (basename === 'routes.ts' || basename.startsWith('route') || basename.startsWith('Route') || basename.includes('routes')) {
      return 'routes'
    }
    // Check if it's a menu file (basename starts with menu/nav-related names or is menu.ts)
    if (
      basename === 'menu.ts' ||
      basename.startsWith('menu') ||
      basename.startsWith('Menu') ||
      basename.startsWith('nav') ||
      basename.startsWith('Nav') ||
      basename.includes('navigation')
    ) {
      return 'menu'
    }
  }

  // Fallback based on file extension and common patterns
  if (basename.endsWith('.vue')) {
    return 'component'
  }
  if (basename.endsWith('.ts') || basename.endsWith('.js')) {
    if (basename.startsWith('use') && basename.includes('Store')) {
      return 'store'
    }
    if (basename.startsWith('use')) {
      return 'composable'
    }
  }

  return 'unknown'
}

function validateNamingConvention(filename, componentName) {
  const fileType = getFileType(filename)
  const basename = filename.split('/').pop()
  const nameFromFile = basename.replace(/\.(js|ts|vue|jsx|tsx)$/, '')

  const violations = []

  switch (fileType) {
    case 'view': {
      // Views must end with 'View.vue'
      if (!basename.endsWith('View.vue')) {
        violations.push({
          type: 'filename',
          message: `View files must end with 'View.vue'. Expected: ${nameFromFile}View.vue`,
          expected: `${nameFromFile}View.vue`,
        })
      }
      // Component name should match filename (PascalCase)
      if (componentName && componentName !== nameFromFile) {
        violations.push({
          type: 'componentName',
          message: `Component name should match filename. Expected: ${nameFromFile}`,
          expected: nameFromFile,
        })
      }
      break
    }

    case 'component': {
      // Component filename should be PascalCase
      const expectedFilename = toPascalCase(nameFromFile)
      if (nameFromFile !== expectedFilename) {
        violations.push({
          type: 'filename',
          message: `Component filename should be PascalCase. Expected: ${expectedFilename}.vue`,
          expected: `${expectedFilename}.vue`,
        })
      }

      // Validate component name if provided
      if (componentName) {
        const expectedPascal = toPascalCase(componentName)
        if (componentName !== expectedPascal) {
          violations.push({
            type: 'componentName',
            message: `Component name should be PascalCase. Expected: ${expectedPascal}`,
            expected: expectedPascal,
          })
        }
        // Check filename matches component name only if both filename and component name are already PascalCase
        if (nameFromFile === expectedFilename && componentName === expectedPascal && nameFromFile !== componentName) {
          violations.push({
            type: 'filename',
            message: `Filename should match component name. Expected: ${componentName}.vue`,
            expected: `${componentName}.vue`,
          })
        }
      }
      break
    }

    case 'store': {
      // No naming requirement for stores
      break
    }

    case 'composable': {
      // No naming requirement for composables
      break
    }

    case 'service': {
      // Services should start with lowercase letter
      if (nameFromFile.charAt(0) !== nameFromFile.charAt(0).toLowerCase()) {
        const suggested = nameFromFile.charAt(0).toLowerCase() + nameFromFile.slice(1)
        violations.push({
          type: 'filename',
          message: `Service files should start with lowercase letter. Expected: ${suggested}.ts`,
          expected: `${suggested}.ts`,
        })
      }
      break
    }

    case 'entity': {
      // Entities should use PascalCase (e.g., User.ts, Settings.ts)
      const expectedFilename = toPascalCase(nameFromFile)
      if (nameFromFile !== expectedFilename) {
        violations.push({
          type: 'filename',
          message: `Entity files should use PascalCase. Expected: ${expectedFilename}.ts`,
          expected: `${expectedFilename}.ts`,
        })
      }
      break
    }

    case 'routes': {
      // Routes files should be exactly 'routes.ts'
      if (basename !== 'routes.ts') {
        violations.push({
          type: 'filename',
          message: `Module routes file must be named 'routes.ts'. Found: ${basename}`,
          expected: 'routes.ts',
        })
      }
      break
    }

    case 'menu': {
      // Menu files should be exactly 'menu.ts'
      if (basename !== 'menu.ts') {
        violations.push({
          type: 'filename',
          message: `Module menu file must be named 'menu.ts'. Found: ${basename}`,
          expected: 'menu.ts',
        })
      }
      break
    }
  }

  return violations
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce consistent naming patterns for different file types based on Vue modular architecture',
      category: 'Best Practices',
      recommended: false,
    },
    defaultOptions: [
      {
        style: 'PascalCase',
        requireFileNameMatches: true,
        enforceFileTypeConventions: true,
      },
    ],
    schema: [
      {
        type: 'object',
        properties: {
          style: { type: 'string', description: 'Naming style: PascalCase or kebab-case' },
          requireFileNameMatches: { type: 'boolean', description: 'Require file name to match component name' },
          enforceFileTypeConventions: { type: 'boolean', description: 'Enforce naming conventions based on file type' },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      badStyle: 'Component name "{{name}}" should be "{{expected}}" ({{style}}).',
      fileMismatch: 'Filename "{{filename}}" must correspond to component name "{{expected}}".',
      namingConvention: '{{message}}',
    },
  },

  create(context) {
    const options = context.options[0] || {}
    const style = options.style || 'PascalCase'
    const requireFileNameMatches = options.requireFileNameMatches !== false
    const enforceFileTypeConventions = options.enforceFileTypeConventions !== false

    return {
      ExportDefaultDeclaration(node) {
        if (!node || !node.declaration || node.declaration.type !== 'ObjectExpression') return

        const filename = context.getFilename()
        const fileType = getFileType(filename)

        // Find the 'name' property in the object
        const nameProp = node.declaration.properties.find(
          (prop) => prop.type === 'Property' && prop.key && prop.key.type === 'Identifier' && prop.key.name === 'name',
        )

        const declared = nameProp && nameProp.value && nameProp.value.type === 'Literal' ? String(nameProp.value.value) : null

        // If enforceFileTypeConventions is enabled, use the new validation logic for Vue files only
        if (enforceFileTypeConventions && (fileType === 'component' || fileType === 'view')) {
          // For Vue files, validate component name style if it exists
          if (declared) {
            const violations = validateNamingConvention(filename, declared)

            // Only report component name violations, not filename violations (handled in Program)
            violations.forEach((violation) => {
              if (violation.type === 'componentName') {
                context.report({
                  node: nameProp.value,
                  messageId: 'namingConvention',
                  data: { message: violation.message },
                })
              }
            })
          }
          return
        }

        // Legacy validation logic for backward compatibility or non-Vue files
        if (!nameProp || !nameProp.value || nameProp.value.type !== 'Literal') return

        // Check style
        if (!checkAndReportStyle(context, nameProp.value, declared, style)) {
          return
        }

        // Check filename matching
        if (requireFileNameMatches) {
          const base = filename.split('/').pop()
          const nameFromFile = base.replace(/\.(js|ts|vue|jsx|tsx)$/, '')

          // Convert component name to the expected filename format
          // For now, expect filename to match component name exactly
          if (nameFromFile !== declared) {
            context.report({
              node: nameProp.value,
              messageId: 'fileMismatch',
              data: { filename: nameFromFile, expected: declared },
            })
          }
        }
      },

      Program(node) {
        if (!enforceFileTypeConventions) return

        const filename = context.getFilename()
        const fileType = getFileType(filename)

        // Validate file naming for all supported file types
        if (
          fileType === 'service' ||
          fileType === 'component' ||
          fileType === 'view' ||
          fileType === 'entity' ||
          fileType === 'routes' ||
          fileType === 'menu'
        ) {
          const violations = validateNamingConvention(filename, null)

          violations.forEach((violation) => {
            if (violation.type === 'filename') {
              context.report({
                node,
                messageId: 'namingConvention',
                data: { message: violation.message },
              })
            }
          })
        }
      },
    }
  },
}
