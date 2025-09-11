import path from 'path'

// Utility to check if a file is a TypeScript file
export const isTs = (filename: string): boolean => {
  const ext = path.extname(filename)
  return ext === '.ts' || ext === '.tsx'
}
