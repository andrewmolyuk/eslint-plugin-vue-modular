import { minimatch } from 'minimatch'

/**
 * Creates test cases for file patterns
 * @param {string|string[]} patterns - Glob patterns for filenames
 * @param {Object} testCase - Base test case template
 * @returns {Array} Generated test cases
 */
export const createPatternTestCases = (patterns, testCase) => {
  const patternArray = Array.isArray(patterns) ? patterns : [patterns]
  return patternArray.map((pattern) => ({
    ...testCase,
    filename: pattern,
  }))
}

/**
 * Validates filename against multiple patterns
 * @param {string} filename - File to check
 * @param {string[]} patterns - Patterns to match against
 * @returns {boolean} True if matches any pattern
 */
export const matchesAnyPattern = (filename, patterns) => {
  return patterns.some((pattern) => minimatch(filename, pattern))
}

/**
 * Creates a mock file system implementation using pattern matching
 * @param {Object} structure - Object mapping glob patterns to file arrays
 * @returns {Function} Mock implementation function
 */
export const createMockFileSystem = (structure) => {
  return (path) => {
    for (const [pattern, files] of Object.entries(structure)) {
      if (minimatch(path, pattern)) {
        return files
      }
    }
    return []
  }
}
