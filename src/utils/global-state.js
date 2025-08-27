/**
 * Shared utility for managing global ESLint run state across rules
 * This prevents duplicate directory checking within the same ESLint run
 */

import path from 'node:path'
import fs from 'node:fs'

/**
 * Creates a function to get checked directories for a specific rule
 * @param {string} ruleName - Unique identifier for the rule (e.g., 'appstructure', 'featurestructure')
 * @returns {Function} Function that returns the Set of checked directories for this rule
 */
export function createCheckedDirsGetter(ruleName) {
  const eslintRunId = `${process.pid}_${process.cwd()}_${ruleName}`

  // Initialize global state if needed
  if (!global.__eslintVueModularState) {
    global.__eslintVueModularState = new Map()
  }

  return function getCheckedDirs() {
    // Ensure the global map exists (tests may delete it between runs)
    if (!global.__eslintVueModularState) {
      global.__eslintVueModularState = new Map()
    }
    if (!global.__eslintVueModularState.has(eslintRunId)) {
      global.__eslintVueModularState.set(eslintRunId, new Set())
    }
    return global.__eslintVueModularState.get(eslintRunId)
  }
}

/**
 * Shared utility for parsing ESLint rule options with common validation patterns
 * @param {Object} context - ESLint rule context
 * @param {Object} defaultOptions - Default options for the rule
 * @returns {Object} Parsed and validated options
 */
export function parseRuleOptions(context, defaultOptions) {
  const options = context.options && context.options[0] ? context.options[0] : {}
  const parsed = {}

  // Parse src option with string validation
  if (defaultOptions.src !== undefined) {
    parsed.src = typeof options.src === 'string' && options.src.trim() ? options.src.trim() : defaultOptions.src
  }

  // Parse featuresDir option with string validation
  if (defaultOptions.featuresDir !== undefined) {
    parsed.featuresDir =
      typeof options.featuresDir === 'string' && options.featuresDir.trim() ? options.featuresDir.trim() : defaultOptions.featuresDir
  }

  // Parse modulesDir option with string validation
  if (defaultOptions.modulesDir !== undefined) {
    parsed.modulesDir =
      typeof options.modulesDir === 'string' && options.modulesDir.trim() ? options.modulesDir.trim() : defaultOptions.modulesDir
  }

  // Parse indexFiles option with array validation
  if (defaultOptions.indexFiles !== undefined) {
    parsed.indexFiles = Array.isArray(options.indexFiles) && options.indexFiles.length > 0 ? options.indexFiles : defaultOptions.indexFiles
  }

  // Parse required option with array validation
  if (defaultOptions.required !== undefined) {
    parsed.required = Array.isArray(options.required) && options.required.length > 0 ? options.required : defaultOptions.required
  }

  return parsed
}

/**
 * Shared utility for setting up source directory detection and duplicate checking
 * @param {Object} context - ESLint rule context
 * @param {string} src - Source directory name
 * @param {Set} checked - Set of already checked directories
 * @returns {Object|null} Object with srcDir if valid, null if should skip
 */
export function setupSrcDirectoryCheck(context, src, checked) {
  const filename = context.getFilename()
  if (!filename.includes(`${path.sep}${src}${path.sep}`)) {
    return null
  }

  const srcSegment = `${path.sep}${src}${path.sep}`
  const srcIndex = filename.indexOf(srcSegment)
  if (srcIndex === -1) return null
  const srcDir = filename.substring(0, srcIndex + srcSegment.length - 1)

  if (checked.has(srcDir)) return null
  checked.add(srcDir)

  return { srcDir }
}

/**
 * Creates a standardized ESLint rule Program handler for directory structure validation
 * @param {Object} context - ESLint rule context
 * @param {string} src - Source directory name
 * @param {Set} checked - Set of already checked directories for this rule
 * @param {Function} handler - Function that takes (srcDir, entries) and performs validation
 * @returns {Object} ESLint rule Program handler
 */
export function createDirectoryStructureRule(context, src, checked, handler) {
  const setup = setupSrcDirectoryCheck(context, src, checked)
  if (!setup) return {}
  const { srcDir } = setup

  return {
    Program() {
      try {
        const entries = fs.readdirSync(srcDir)
        handler(srcDir, entries, context)
      } catch {
        // Ignore read errors - directory might not exist or be accessible
      }
    },
  }
}
