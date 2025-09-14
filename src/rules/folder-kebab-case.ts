import { createRule, parseRuleOptions, runOnce, toKebabCase, isIgnored, parseProjectOptions } from '../utils'
import type { VueModularRuleModule, VueModularRuleContext } from '../types'
import fs from 'fs'
import path from 'path'

const defaultOptions = {
  ignores: [],
}

// Rule to enforce kebab-case folder names under project src
export const folderKebabCase = createRule<VueModularRuleModule>({
  create(context: VueModularRuleContext) {
    if (!runOnce('folder-kebab-case')) return {}
    const options = parseRuleOptions(context, defaultOptions)

    return {
      Program(node) {
        const projectOptions = parseProjectOptions(context)
        const root = path.join(process.cwd(), projectOptions.rootPath)

        if (!fs.existsSync(root)) return
        try {
          const entries: fs.Dirent[] = fs.readdirSync(root, { recursive: true }) as unknown as fs.Dirent[]

          entries.forEach((dir) => {
            if (dir.isDirectory() === false) return
            const fullPath = path.join(root, String(dir))
            if (isIgnored(fullPath, options.ignores)) return
            const base = path.basename(fullPath)
            const kebab = toKebabCase(base)
            if (kebab !== base) {
              context.report({ node, messageId: 'folderNotKebab', data: { folder: String(dir), expected: kebab } })
              return
            }
          })
        } catch {
          // ignore fs errors
        }
      },
    }
  },
  name: 'folder-kebab-case',
  recommended: true,
  level: 'error',
  meta: {
    type: 'suggestion',
    docs: {
      category: 'File Organization',
      description: 'Require folder names under project src to be kebab-case',
    },
    schema: [
      {
        type: 'object',
        properties: {
          ignores: { type: 'array', items: { type: 'string' } },
        },
        additionalProperties: false,
      },
    ],
    defaultOptions: [defaultOptions],
    messages: {
      folderNotKebab: 'Folder name "{{folder}}" should be kebab-case (e.g., "{{expected}}").',
    },
  },
})
