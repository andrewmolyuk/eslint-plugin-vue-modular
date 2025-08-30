/**
 * @fileoverview Enforce correct order of SFC blocks in Vue.js files
 * At least one of script or template is required, style is optional and must be last
 */

const defaultOptions = {
  order: ['script', 'template', 'style'], // script-first order as per Vue style guide
}

export default {
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce correct order of SFC blocks according to Vue.js style guide',
      category: 'Stylistic Issues',
      recommended: true,
    },
    fixable: null,
    defaultOptions: [defaultOptions],
    schema: [
      {
        type: 'object',
        properties: {
          order: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['template', 'script', 'style'],
            },
            description: 'Expected order of SFC blocks (style must be last)',
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      missingRequiredBlock: 'Vue SFC must have at least one <script> or <template> block',
      wrongOrder: '{{currentBlock}} block should come {{expected}} {{otherBlock}} block',
      styleNotLast: '<style> block must be the last block in Vue SFC',
    },
  },

  create(context) {
    const options = { ...defaultOptions, ...(context.options[0] || {}) }
    const filename = context.getFilename()

    // Only apply to Vue files
    if (!filename.endsWith('.vue')) {
      return {}
    }

    return {
      Program() {
        const sourceCode = context.getSourceCode()
        const text = sourceCode.getText()

        // Parse SFC blocks using simple regex
        const blocks = []

        // Find template blocks
        const templateMatches = text.matchAll(/<template[^>]*>/g)
        for (const match of templateMatches) {
          blocks.push({
            type: 'template',
            start: match.index,
            startLine: sourceCode.getLocFromIndex(match.index).line,
          })
        }

        // Find script blocks (including <script setup>)
        const scriptMatches = text.matchAll(/<script[^>]*>/g)
        for (const match of scriptMatches) {
          blocks.push({
            type: 'script',
            start: match.index,
            startLine: sourceCode.getLocFromIndex(match.index).line,
          })
        }

        // Find style blocks
        const styleMatches = text.matchAll(/<style[^>]*>/g)
        for (const match of styleMatches) {
          blocks.push({
            type: 'style',
            start: match.index,
            startLine: sourceCode.getLocFromIndex(match.index).line,
          })
        }

        // Sort blocks by their position in the file
        blocks.sort((a, b) => a.start - b.start)

        // Check if at least one of script or template exists
        const hasScript = blocks.some((block) => block.type === 'script')
        const hasTemplate = blocks.some((block) => block.type === 'template')

        if (!hasScript && !hasTemplate) {
          context.report({
            loc: { line: 1, column: 0 },
            messageId: 'missingRequiredBlock',
          })
          return
        }

        // Check that style blocks are last (if any exist)
        const styleBlocks = blocks.filter((block) => block.type === 'style')
        const nonStyleBlocks = blocks.filter((block) => block.type !== 'style')

        if (styleBlocks.length > 0 && nonStyleBlocks.length > 0) {
          const lastNonStyleBlock = nonStyleBlocks[nonStyleBlocks.length - 1]
          const firstStyleBlock = styleBlocks[0]

          if (firstStyleBlock.start < lastNonStyleBlock.start) {
            context.report({
              loc: { line: firstStyleBlock.startLine, column: 0 },
              messageId: 'styleNotLast',
            })
          }
        }

        // Check order according to the expected sequence (excluding style which must be last)
        const expectedOrder = options.order.filter((type) => type !== 'style')
        const nonStyleBlocksSorted = nonStyleBlocks.slice()

        // Check if the blocks follow the expected order
        let previousExpectedIndex = -1
        for (const block of nonStyleBlocksSorted) {
          const currentExpectedIndex = expectedOrder.indexOf(block.type)

          if (currentExpectedIndex === -1) {
            continue // Skip unknown block types
          }

          if (currentExpectedIndex < previousExpectedIndex) {
            // This block appears before a block that should come later
            const expectedPreviousType = expectedOrder[previousExpectedIndex]
            context.report({
              loc: { line: block.startLine, column: 0 },
              messageId: 'wrongOrder',
              data: {
                currentBlock: block.type,
                expected: 'after',
                otherBlock: expectedPreviousType,
              },
            })
          }

          previousExpectedIndex = Math.max(previousExpectedIndex, currentExpectedIndex)
        }
      },
    }
  },
}
