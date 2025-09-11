// Utility to run a rule only once per ESLint run
interface VueGlobal {
  __eslintVueModularRunId?: string
  __eslintVueModularState?: Map<string, Set<string>>
}

export const runOnce = (ruleId: string) => {
  const vueGlobal: VueGlobal = global as unknown as VueGlobal
  if (!vueGlobal.__eslintVueModularRunId) {
    vueGlobal.__eslintVueModularRunId = `${process.pid}_${process.cwd()}`
  }

  if (!vueGlobal.__eslintVueModularState) {
    vueGlobal.__eslintVueModularState = new Map()
  }

  const eslintRunId = vueGlobal.__eslintVueModularRunId
  if (!vueGlobal.__eslintVueModularState.has(eslintRunId)) {
    vueGlobal.__eslintVueModularState.set(eslintRunId, new Set())
  }

  const seen = vueGlobal.__eslintVueModularState.get(eslintRunId)
  if (!seen) {
    vueGlobal.__eslintVueModularState.set(eslintRunId, new Set())
    return false
  }
  if (seen.has(ruleId)) return false

  seen.add(ruleId)
  return true
}
