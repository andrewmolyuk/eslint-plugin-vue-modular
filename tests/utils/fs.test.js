import fs from 'fs'
import path from 'path'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { listFilesRecursive, listFiles, listDirs, getFileContent } from '../../src/utils/fs'

function norm(p) {
  return p.replace(/\\/g, '/')
}

describe('fs.js', () => {
  let virtualRoot

  beforeEach(() => {
    // Virtual filesystem rooted at virtualRoot
    virtualRoot = '/virtual-root'

    const rootNode = {
      type: 'dir',
      children: {
        'a.txt': { type: 'file', content: 'content-a' },
        'b.js': { type: 'file', content: 'content-b' },
        subdir: {
          type: 'dir',
          children: {
            'c.md': { type: 'file', content: 'content-c' },
            nested: {
              type: 'dir',
              children: { 'd.txt': { type: 'file', content: 'content-d' } },
            },
          },
        },
        node_modules: { type: 'dir', children: { 'ignored.js': { type: 'file', content: 'x' } } },
        '.git': { type: 'dir', children: { 'ignored2.js': { type: 'file', content: 'y' } } },
      },
    }

    function getNode(p) {
      const rel = path.relative(virtualRoot, p)
      if (rel === '' || rel === '.') return rootNode
      const parts = rel.split(path.sep).filter(Boolean)
      let node = rootNode
      for (const part of parts) {
        if (!node.children || !node.children[part]) return null
        node = node.children[part]
      }
      return node
    }

    // Mock fs methods used by src/utils/fs
    vi.spyOn(fs, 'existsSync').mockImplementation((p) => !!getNode(p))

    vi.spyOn(fs, 'lstatSync').mockImplementation((p) => {
      const node = getNode(p)
      if (!node) throw new Error('ENOENT')
      return {
        isDirectory: () => node.type === 'dir',
        isFile: () => node.type === 'file',
      }
    })

    vi.spyOn(fs, 'readdirSync').mockImplementation((p) => {
      const node = getNode(p)
      if (!node || node.type !== 'dir') throw new Error('ENOTDIR')
      return Object.keys(node.children)
    })

    vi.spyOn(fs, 'readFileSync').mockImplementation((p) => {
      const node = getNode(p)
      if (!node || node.type !== 'file') throw new Error('EISDIR')
      return node.content
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('listFilesRecursive returns all files except ignored directories', () => {
    const res = listFilesRecursive(virtualRoot)
    const normalized = res.map(norm)
    expect(normalized).toEqual(
      expect.arrayContaining([
        norm(path.join(virtualRoot, 'a.txt')),
        norm(path.join(virtualRoot, 'b.js')),
        norm(path.join(virtualRoot, 'subdir', 'c.md')),
        norm(path.join(virtualRoot, 'subdir', 'nested', 'd.txt')),
      ]),
    )
    // ensure ignored files are not present
    expect(normalized).not.toEqual(expect.arrayContaining([norm(path.join(virtualRoot, 'node_modules', 'ignored.js'))]))
    expect(normalized).not.toEqual(expect.arrayContaining([norm(path.join(virtualRoot, '.git', 'ignored2.js'))]))
  })

  it('listFilesRecursive filters by extensions (case-insensitive)', () => {
    const resTxt = listFilesRecursive(virtualRoot, ['txt'])
    const normalizedTxt = resTxt.map(norm)
    expect(normalizedTxt).toEqual(
      expect.arrayContaining([norm(path.join(virtualRoot, 'a.txt')), norm(path.join(virtualRoot, 'subdir', 'nested', 'd.txt'))]),
    )
    expect(normalizedTxt).not.toEqual(expect.arrayContaining([norm(path.join(virtualRoot, 'b.js'))]))
  })

  it('listFiles (non-recursive) returns only top-level files and respects ext filter', () => {
    const allTop = listFiles(virtualRoot)
    const normAllTop = allTop.map(norm)
    expect(normAllTop).toEqual(expect.arrayContaining([norm(path.join(virtualRoot, 'a.txt')), norm(path.join(virtualRoot, 'b.js'))]))
    // Should not include nested files
    expect(normAllTop).not.toEqual(expect.arrayContaining([norm(path.join(virtualRoot, 'subdir', 'c.md'))]))

    const onlyJs = listFiles(virtualRoot, ['js'])
    expect(onlyJs.map(norm)).toEqual([norm(path.join(virtualRoot, 'b.js'))])
  })

  it('listDirs returns immediate subdirectories excluding ignored ones', () => {
    const dirs = listDirs(virtualRoot)
    const normDirs = dirs.map(norm)
    expect(normDirs).toEqual(expect.arrayContaining([norm(path.join(virtualRoot, 'subdir'))]))
    expect(normDirs).not.toEqual(expect.arrayContaining([norm(path.join(virtualRoot, 'node_modules'))]))
    expect(normDirs).not.toEqual(expect.arrayContaining([norm(path.join(virtualRoot, '.git'))]))
  })

  it('getFileContent returns file content and null for non-files/non-existent', () => {
    const aPath = path.join(virtualRoot, 'a.txt')
    expect(getFileContent(aPath)).toBe('content-a')

    // directory: should return null
    expect(getFileContent(path.join(virtualRoot, 'subdir'))).toBeNull()

    // non-existent
    expect(getFileContent(path.join(virtualRoot, 'nope.txt'))).toBeNull()
  })

  it('listFilesRecursive respects custom ignore patterns', () => {
    // ignore 'subdir' specifically
    const res = listFilesRecursive(virtualRoot, [], ['subdir'])
    const normalized = res.map(norm)
    expect(normalized).toEqual(expect.arrayContaining([norm(path.join(virtualRoot, 'a.txt')), norm(path.join(virtualRoot, 'b.js'))]))
    expect(normalized).not.toEqual(expect.arrayContaining([norm(path.join(virtualRoot, 'subdir', 'c.md'))]))
  })

  it('listFilesRecursive skips files when ignore pattern matches file path', () => {
    // ignore the file name 'c.md' specifically
    const res = listFilesRecursive(virtualRoot, [], ['c.md'])
    const normalized = res.map(norm)
    expect(normalized).not.toEqual(expect.arrayContaining([norm(path.join(virtualRoot, 'subdir', 'c.md'))]))
    // other files should still be present
    expect(normalized).toEqual(expect.arrayContaining([norm(path.join(virtualRoot, 'a.txt'))]))
  })

  it('listFiles respects ignore patterns for top-level files', () => {
    // ignore top-level 'b.js'
    const res = listFiles(virtualRoot, [], ['b.js'])
    expect(res.map(norm)).not.toEqual(expect.arrayContaining([norm(path.join(virtualRoot, 'b.js'))]))
    // a.txt should still be present
    expect(res.map(norm)).toEqual(expect.arrayContaining([norm(path.join(virtualRoot, 'a.txt'))]))
  })

  it('directory-listing functions return [] when given a non-directory (file) path', () => {
    const filePath = path.join(virtualRoot, 'a.txt')
    expect(listFilesRecursive(filePath)).toEqual([])
    expect(listFiles(filePath)).toEqual([])
    expect(listDirs(filePath)).toEqual([])
  })

  it('listFilesRecursive returns [] for non-existent directories', () => {
    expect(listFilesRecursive(path.join(virtualRoot, 'nope'))).toEqual([])
  })
})
