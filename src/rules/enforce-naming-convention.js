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

function getFileType(filename) {
  const path = filename.toLowerCase()
  const basename = filename.split('/').pop()

  // Check for specific patterns based on directory structure
  if (path.includes('/views/') && basename.endsWith('.vue')) {
    return 'view'
  }
  if ((path.includes('/components/') || path.includes('/component/')) && basename.endsWith('.vue')) {
    return 'component'
  }
  if ((path.includes('/stores/') || path.includes('/store/')) && (basename.endsWith('.ts') || basename.endsWith('.js'))) {
    return 'store'
  }
  if ((path.includes('/composables/') || path.includes('/composable/')) && (basename.endsWith('.ts') || basename.endsWith('.js'))) {
    return 'composable'
  }
  if ((path.includes('/services/') || path.includes('/service/')) && (basename.endsWith('.ts') || basename.endsWith('.js'))) {
    return 'service'
  }

  // Fallback based on file extension and common patterns
  if (basename.endsWith('.vue')) {
    return 'component'
  }
  if (basename.endsWith('.ts') || basename.endsWith('.js')) {
    if (basename.includes('.api.')) {
      return 'service'
    }
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
      // Components should be PascalCase and descriptive
      if (componentName) {
        const expectedPascal = toPascalCase(componentName)
        if (componentName !== expectedPascal) {
          violations.push({
            type: 'componentName',
            message: `Component name should be PascalCase. Expected: ${expectedPascal}`,
            expected: expectedPascal,
          })
        }
        // Filename should match component name
        if (nameFromFile !== componentName) {
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
      // Stores must use 'useXxxStore.ts' pattern
      if (!basename.startsWith('use') || !basename.includes('Store.')) {
        const cleanName = nameFromFile.replace(/^use/, '').replace(/Store$/, '')
        const suggested = `use${toPascalCase(cleanName)}Store.ts`
        violations.push({
          type: 'filename',
          message: `Store files must follow 'useXxxStore.ts' pattern. Expected: ${suggested}`,
          expected: suggested,
        })
      }
      break
    }

    case 'composable': {
      // Composables must start with 'useXxx.ts'
      if (!basename.startsWith('use')) {
        const suggested = `use${toPascalCase(nameFromFile)}.ts`
        violations.push({
          type: 'filename',
          message: `Composable files must start with 'use'. Expected: ${suggested}`,
          expected: suggested,
        })
      }
      break
    }

    case 'service': {
      // Services should use '<domain>.api.ts' pattern
      if (!basename.includes('.api.')) {
        const domain = nameFromFile.replace(/Service$/, '').replace(/API$/, '')
        const suggested = `${toKebabCase(domain)}.api.ts`
        violations.push({
          type: 'filename',
          message: `Service files should follow '<domain>.api.ts' pattern. Expected: ${suggested}`,
          expected: suggested,
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
      description: 'Enforce consistent naming patterns for different file types based on Vue 3 modular architecture',
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
          const violations = validateNamingConvention(filename, declared)

          violations.forEach((violation) => {
            context.report({
              node: nameProp ? nameProp.value : node,
              messageId: 'namingConvention',
              data: { message: violation.message },
            })
          })

          return
        }

        // Legacy validation logic for backward compatibility or non-Vue files
        if (!nameProp || !nameProp.value || nameProp.value.type !== 'Literal') return

        // Check style
        if (style === 'kebab-case') {
          const expectedStyle = toKebabCase(declared)
          if (declared !== expectedStyle) {
            context.report({
              node: nameProp.value,
              messageId: 'badStyle',
              data: { name: declared, expected: expectedStyle, style },
            })
            return
          }
        } else {
          const expectedStyle = toPascalCase(declared)
          if (declared !== expectedStyle) {
            context.report({
              node: nameProp.value,
              messageId: 'badStyle',
              data: { name: declared, expected: expectedStyle, style },
            })
            return
          }
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

      // Check files without explicit component names (only for non-Vue files)
      Program(node) {
        if (!enforceFileTypeConventions) return

        const filename = context.getFilename()
        const fileType = getFileType(filename)

        // Only validate file naming for non-Vue files (stores, composables, services)
        if (fileType === 'store' || fileType === 'composable' || fileType === 'service') {
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
