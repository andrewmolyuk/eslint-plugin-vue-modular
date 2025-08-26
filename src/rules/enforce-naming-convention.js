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

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce consistent naming patterns for Vue components',
      category: 'Best Practices',
      recommended: false,
    },
    defaultOptions: [
      {
        style: 'PascalCase',
        requireFileNameMatches: true,
      },
    ],
    schema: [
      {
        type: 'object',
        properties: {
          style: { type: 'string', description: 'Naming style: PascalCase or kebab-case' },
          requireFileNameMatches: { type: 'boolean', description: 'Require file name to match component name' },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      badStyle: 'Component name "{{name}}" should be "{{expected}}" ({{style}}).',
      fileMismatch: 'Filename "{{filename}}" must correspond to component name "{{expected}}".',
    },
  },

  create(context) {
    const options = context.options[0] || {}
    const style = options.style || 'PascalCase'
    const requireFileNameMatches = options.requireFileNameMatches !== false

    return {
      ExportDefaultDeclaration(node) {
        if (!node || !node.declaration || node.declaration.type !== 'ObjectExpression') return

        // Find the 'name' property in the object
        const nameProp = node.declaration.properties.find(
          (prop) => prop.type === 'Property' && prop.key && prop.key.type === 'Identifier' && prop.key.name === 'name',
        )

        if (!nameProp || !nameProp.value || nameProp.value.type !== 'Literal') return

        const declared = String(nameProp.value.value)

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
          const filename = context.getFilename()
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
    }
  },
}
