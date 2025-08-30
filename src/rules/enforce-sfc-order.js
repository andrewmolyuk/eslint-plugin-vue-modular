/**
 * @fileoverview Enforce correct order of SFC blocks in Vue.js files
 * Template must be first, then script (if exists), then style (if exists)
 */

const defaultOptions = {
  order: ['template', 'script', 'style'],
}

export default {
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce correct order of SFC blocks (template, script, style)',
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
            description: 'Expected order of SFC blocks',
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      missingTemplate: 'Vue SFC must have a <template> block and it must be first',
      wrongOrder: '{{currentBlock}} block should come {{expected}} {{otherBlock}} block',
      templateNotFirst: '<template> block must be the first block in Vue SFC',
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

        // Check if template exists and is first
        if (blocks.length === 0 || blocks[0].type !== 'template') {
          context.report({
            loc: { line: 1, column: 0 },
            messageId: 'missingTemplate',
          })
          return
        }

        // Check order according to the expected sequence
        const expectedOrder = options.order
        let expectedIndex = 0

        for (const block of blocks) {
          // Find the position of current block type in expected order
          const currentExpectedIndex = expectedOrder.indexOf(block.type)

          if (currentExpectedIndex === -1) {
            continue // Skip unknown block types
          }

          // Check if this block type should come after the last valid block
          if (currentExpectedIndex < expectedIndex) {
            // Find what block should come before this one
            let expectedPreviousBlock = null
            for (let i = currentExpectedIndex - 1; i >= 0; i--) {
              if (blocks.some((b) => b.type === expectedOrder[i])) {
                expectedPreviousBlock = expectedOrder[i]
                break
              }
            }

            if (expectedPreviousBlock) {
              context.report({
                loc: { line: block.startLine, column: 0 },
                messageId: 'wrongOrder',
                data: {
                  currentBlock: block.type,
                  expected: 'after',
                  otherBlock: expectedPreviousBlock,
                },
              })
            } else if (block.type !== 'template') {
              context.report({
                loc: { line: block.startLine, column: 0 },
                messageId: 'templateNotFirst',
              })
            }
          }

          expectedIndex = Math.max(expectedIndex, currentExpectedIndex + 1)
        }
      },
    }
  },
}
