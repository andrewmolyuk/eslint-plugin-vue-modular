import fs from 'fs'
import path from 'path'
import { parseRuleOptions, isFileIgnored, runOnce, toKebabCase } from '../utils.js'

const defaultOptions = {
  src: 'src',
  ignore: [],
}

function scanDirs(baseDir, cb) {
  const entries = fs.readdirSync(baseDir, { withFileTypes: true })
  for (const ent of entries) {
    const full = path.join(baseDir, ent.name)
    if (ent.isDirectory()) {
      cb(full)
      scanDirs(full, cb)
    }
  }
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require folder names to be kebab-case under project src',
      category: 'Stylistic Issues',
      recommended: false,
    },
    defaultOptions: [defaultOptions],
    schema: [
      {
        type: 'object',
        properties: {
          src: { type: 'string' },
          ignore: { type: 'array', items: { type: 'string' } },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      folderNotKebab: 'Folder "{{folder}}" should be kebab-case (e.g., "my-folder").',
    },
  },

  create(context) {
    const { src, ignore } = parseRuleOptions(context, defaultOptions)

    return {
      Program(node) {
        // run once per eslint execution
        if (!runOnce('vue-modular/folder-kebab-case')) return

        const srcPath = path.join(process.cwd(), src)
        if (!fs.existsSync(srcPath)) return

        try {
          scanDirs(srcPath, (dir) => {
            if (isFileIgnored(dir, ignore)) return
            const base = path.basename(dir)
            if (toKebabCase(base) !== base) {
              context.report({ node, messageId: 'folderNotKebab', data: { folder: path.relative(process.cwd(), dir) } })
            }
          })
        } catch {
          // ignore fs errors
        }
      },
    }
  },
}
