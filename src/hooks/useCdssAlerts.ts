import { useEffect, useState, useCallback } from 'react'
import type { PatientRecord, CdssAlert } from '../lib/cdss'
import { evaluateRecord } from '../lib/cdss'
import { getConfig, appendLog } from '../lib/cdssConfig'

type UseCdssOpts = {
  silent?: boolean // modo silencioso: evalúa pero no 'notifica' (aplicable a UI)
  enabledRuleIds?: string[]
}

export default function useCdssAlerts(record?: PatientRecord, opts?: UseCdssOpts) {
  const [alerts, setAlerts] = useState<CdssAlert[]>([])
  const [running, setRunning] = useState(false)
  const [silent, setSilent] = useState(!!opts?.silent)

  const run = useCallback((override?: { silent?: boolean; enabledRuleIds?: string[] }) => {
    if (!record) return
    setRunning(true)
    try {
      const cfg = getConfig()
      const enabled = override?.enabledRuleIds ?? opts?.enabledRuleIds ?? cfg.enabledRuleIds
      const a = evaluateRecord(record, { enabledRuleIds: enabled })
      setAlerts(a)
      // Append a log entry for auditing/validation (include simple alert snapshot)
      try {
        appendLog({
          id: `log-${Date.now()}`,
          recordId: record.id,
          timestamp: new Date().toISOString(),
          silent: !!(override?.silent ?? opts?.silent),
          alerts: a.map((x) => ({ ruleId: x.ruleId, severity: x.severity, message: x.message }))
        })
      } catch (e) {
        // ignore
      }
    } finally {
      setRunning(false)
    }
  }, [record, opts])

  useEffect(() => {
    if (!record) {
      setAlerts([])
      return
    }
    // Ejecutar al montar / cuando cambie el record
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record])

  return { alerts, running, run, silent, setSilent }
}
