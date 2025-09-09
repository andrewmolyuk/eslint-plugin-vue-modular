import { describe, it, expect, vi, beforeEach } from 'vitest'
import { isComponent, resolvePath } from '@/utils'

vi.mock('../../src/utils/resolvePath', () => ({
  resolvePath: vi.fn(),
}))

const mockResolvePath = resolvePath as unknown as ReturnType<typeof vi.fn>

beforeEach(() => {
  vi.resetAllMocks()
})

describe('isComponent', () => {
  it('returns false when resolvePath returns falsy', () => {
    mockResolvePath.mockReturnValue(null)
    expect(isComponent('any', '/root', '@', 'components')).toBe(false)
  })

  it('returns false for non-.vue extensions', () => {
    mockResolvePath.mockReturnValue('/project/src/components/Foo.js')
    expect(isComponent('Foo.js', '/project', '@', 'components')).toBe(false)
  })

  it('returns true for .vue files inside the components folder', () => {
    mockResolvePath.mockReturnValue('/project/src/components/Foo.vue')
    expect(isComponent('Foo.vue', '/project', '@', 'components')).toBe(true)
  })

  it('is case-insensitive on the .vue extension', () => {
    mockResolvePath.mockReturnValue('/project/src/components/Foo.VUE')
    expect(isComponent('Foo.VUE', '/project', '@', 'components')).toBe(true)
  })

  it('returns false when the parent folder name does not match componentsFolderName', () => {
    mockResolvePath.mockReturnValue('/project/src/components/other/Foo.vue')
    expect(isComponent('Foo.vue', '/project', '@', 'components')).toBe(false)
  })

  it('returns true when components folder is nested deeper in the path', () => {
    mockResolvePath.mockReturnValue('/project/src/app/foo/components/Bar.vue')
    expect(isComponent('Bar.vue', '/project', '@', 'components')).toBe(true)
  })

  it('returns true for Windows-style backslash paths', () => {
    mockResolvePath.mockReturnValue('C:\\project\\src\\components\\Foo.vue')
    expect(isComponent('Foo.vue', '/project', '@', 'components')).toBe(true)
  })
})
