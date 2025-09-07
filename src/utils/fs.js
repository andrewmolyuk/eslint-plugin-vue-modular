import fs from 'fs'

// List all files recursively in the specified directory with optional extension filtering
export function listFilesRecursive(dir, exts = [], ignore = ['node_modules', '.git']) {
  if (!fs.existsSync(dir) || !fs.lstatSync(dir).isDirectory()) return []

  let results = []
  const list = fs.readdirSync(dir)
  list.forEach((file) => {
    const filePath = `${dir}/${file}`
    const stat = fs.lstatSync(filePath)
    if (stat && stat.isDirectory()) {
      // skip ignored directories
      if (ignore.some((pattern) => filePath.includes(pattern))) return
      results = results.concat(listFilesRecursive(filePath, exts, ignore))
    } else {
      if (ignore.some((pattern) => filePath.includes(pattern))) return
      if (exts.length === 0 || exts.includes(filePath.split('.').pop().toLowerCase())) {
        results.push(filePath)
      }
    }
  })
  return results
}

// List all files (non-recursive) in the specified directory with optional extension filtering
export function listFiles(dir, exts = [], ignore = ['node_modules', '.git']) {
  if (!fs.existsSync(dir) || !fs.lstatSync(dir).isDirectory()) return []

  let results = []
  const list = fs.readdirSync(dir)
  list.forEach((file) => {
    const filePath = `${dir}/${file}`
    const stat = fs.lstatSync(filePath)
    if (stat && stat.isFile()) {
      if (ignore.some((pattern) => filePath.includes(pattern))) return
      if (exts.length === 0 || exts.includes(filePath.split('.').pop().toLowerCase())) {
        results.push(filePath)
      }
    }
  })
  return results
}

// List all directories (non-recursive) in the specified directory
export function listDirs(dir, ignore = ['node_modules', '.git']) {
  if (!fs.existsSync(dir) || !fs.lstatSync(dir).isDirectory()) return []

  let results = []
  const list = fs.readdirSync(dir)
  list.forEach((file) => {
    const filePath = `${dir}/${file}`
    const stat = fs.lstatSync(filePath)
    if (stat && stat.isDirectory()) {
      if (ignore.some((pattern) => filePath.includes(pattern))) return
      results.push(filePath)
    }
  })
  return results
}

// Read and return the content of a file, or null if it doesn't exist or isn't a file
export function getFileContent(filename) {
  if (!fs.existsSync(filename) || !fs.lstatSync(filename).isFile()) return null
  return fs.readFileSync(filename, 'utf-8')
}
