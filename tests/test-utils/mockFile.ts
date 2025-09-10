import fs from 'fs'
import { vi } from 'vitest'

// Replace module mocks with spies. Use `mockFile` to stub fs reads.
export const mockFile = (filePath, content) => {
  vi.spyOn(fs, 'existsSync').mockImplementation((p) => String(p) === filePath)
  vi.spyOn(fs, 'readFileSync').mockImplementation(() => content)
}
