const CONFIG_KEY = 'cdss:config'
const LOGS_KEY = 'cdss:logs'

export type CdssConfig = {
  enabledRuleIds: string[]
}

export type CdssLogEntry = {
  id: string
  recordId?: string
  timestamp: string
  silent?: boolean
  alerts: Array<{ ruleId: string; severity: string; message: string }>
}

export function getConfig(): CdssConfig {
  try {
    const raw = localStorage.getItem(CONFIG_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    // ignore
  }
  return { enabledRuleIds: [] }
}

export function setConfig(cfg: CdssConfig) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg))
}

export function enableRule(ruleId: string) {
  const cfg = getConfig()
  if (!cfg.enabledRuleIds.includes(ruleId)) {
    cfg.enabledRuleIds.push(ruleId)
    setConfig(cfg)
  }
}

export function disableRule(ruleId: string) {
  const cfg = getConfig()
  cfg.enabledRuleIds = cfg.enabledRuleIds.filter((r) => r !== ruleId)
  setConfig(cfg)
}

export function toggleRule(ruleId: string) {
  const cfg = getConfig()
  if (cfg.enabledRuleIds.includes(ruleId)) disableRule(ruleId)
  else enableRule(ruleId)
}

export function appendLog(entry: CdssLogEntry) {
  try {
    const raw = localStorage.getItem(LOGS_KEY) || '[]'
    const arr = JSON.parse(raw)
    arr.unshift(entry)
    // keep recent 200
    localStorage.setItem(LOGS_KEY, JSON.stringify(arr.slice(0, 200)))
  } catch (e) {
    // ignore
  }
}

export function clearLogs() {
  try {
    localStorage.setItem(LOGS_KEY, '[]')
  } catch (e) {
    // ignore
  }
}

export function exportLogsCSV(): string {
  const logs = getLogs()
  if (!logs.length) return ''
  const rows = [['id', 'recordId', 'timestamp', 'silent', 'alerts_count', 'alerts']]
  for (const l of logs) {
    const alertsText = l.alerts.map((a) => `${a.ruleId}|${a.severity}|${a.message.replace(/\n/g, ' ')}`).join(' ;; ')
    rows.push([l.id, l.recordId || '', l.timestamp, String(!!l.silent), String(l.alerts.length), alertsText])
  }
  return rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
}

export function getLogs(): CdssLogEntry[] {
  try {
    const raw = localStorage.getItem(LOGS_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    // ignore
  }
  return []
}

// Validations storage (TP/FP marking)
const VALID_KEY = 'cdss:validations'

export type ValidationRecord = {
  id: string
  logId?: string
  recordId?: string
  timestamp: string
  isTP: boolean
}

export function appendValidation(v: ValidationRecord) {
  try {
    const raw = localStorage.getItem(VALID_KEY) || '[]'
    const arr = JSON.parse(raw)
    arr.unshift(v)
    localStorage.setItem(VALID_KEY, JSON.stringify(arr.slice(0, 200)))
  } catch (e) {
    // ignore
  }
}

export function getValidations(): ValidationRecord[] {
  try {
    const raw = localStorage.getItem(VALID_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    // ignore
  }
  return []
}

export function getValidationMetrics() {
  const vals = getValidations()
  const tp = vals.filter((v) => v.isTP).length
  const fp = vals.filter((v) => !v.isTP).length
  const total = tp + fp
  const precision = total === 0 ? null : tp / total
  return { tp, fp, total, precision }
}
