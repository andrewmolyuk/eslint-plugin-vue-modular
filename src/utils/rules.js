// Utility to parse rule options with defaults and normalization
export const parseRuleOptions = (context, defaultOptions) => {
  const options = context.options && context.options[0] ? context.options[0] : {}
  const parsed = {}

  for (const [key, value] of Object.entries(defaultOptions)) {
    parsed[key] = options[key] !== undefined ? options[key] : value

    if (Array.isArray(parsed[key])) {
      parsed[key] = parsed[key].map((item) => String(item).trim())
    } else if (typeof parsed[key] === 'string') {
      parsed[key] = String(parsed[key]).trim()
    }
  }

  return parsed
}

// Utility to run a rule only once per ESLint run
export const runOnce = (ruleId) => {
  if (!global.__eslintVueModularRunId) {
    global.__eslintVueModularRunId = `${process.pid}_${process.cwd()}`
  }

  if (!global.__eslintVueModularState) {
    global.__eslintVueModularState = new Map()
  }

  const eslintRunId = global.__eslintVueModularRunId
  if (!global.__eslintVueModularState.has(eslintRunId)) {
    global.__eslintVueModularState.set(eslintRunId, new Set())
  }

  const seen = global.__eslintVueModularState.get(eslintRunId)
  if (seen.has(ruleId)) return false

  seen.add(ruleId)
  return true
}
