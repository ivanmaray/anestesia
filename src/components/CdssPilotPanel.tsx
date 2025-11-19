import { useEffect, useState } from 'react'
import { rules } from '../lib/cdss'
import { getConfig, enableRule, disableRule, getLogs, clearLogs, exportLogsCSV, appendValidation, getValidationMetrics } from '../lib/cdssConfig'

export default function CdssPilotPanel() {
  const [cfg, setCfg] = useState(() => getConfig())
  const [logs, setLogs] = useState(() => getLogs())

  useEffect(() => {
    setLogs(getLogs())
  }, [])

  const metrics = getValidationMetrics()

  function toggleRule(ruleId: string) {
    const enabled = cfg.enabledRuleIds.includes(ruleId)
    if (enabled) disableRule(ruleId)
    else enableRule(ruleId)
    setCfg(getConfig())
  }

  function enableAll() {
    for (const r of rules) enableRule(r.id)
    setCfg(getConfig())
  }

  function disableAll() {
    for (const r of rules) disableRule(r.id)
    setCfg(getConfig())
  }

  function doExportLogs() {
    const csv = exportLogsCSV()
    if (!csv) return alert('No hay registros para exportar')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cdss_logs_${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  function doClearLogs() {
    if (!confirm('¿Borrar todos los registros del piloto? Esta acción no es reversible.')) return
    clearLogs()
    setLogs(getLogs())
  }

  return (
    <div className="p-4 bg-zinc-900/60 rounded-md border border-zinc-700">
      <h3 className="text-lg font-semibold mb-3">Piloto CDSS — Configuración</h3>

      <div className="mb-4">
        {rules.map((r) => {
          const enabled = cfg.enabledRuleIds.includes(r.id)
          return (
            <div key={r.id} className="flex items-center justify-between py-2 border-b border-zinc-800">
              <div>
                <div className="font-medium">{r.title}</div>
                <div className="text-sm small-muted">{r.description}</div>
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={enabled} onChange={() => toggleRule(r.id)} />
                  <span className="text-sm">{enabled ? 'Activada' : 'Desactivada'}</span>
                </label>
              </div>
            </div>
          )
        })}
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h4 className="font-semibold mb-2">Registros recientes (modo silencioso / evaluaciones)</h4>
          <div className="flex gap-2 items-center">
            <div className="text-sm small-muted">Validación: <span className="font-semibold">TP {metrics.tp}</span> / <span className="font-semibold">FP {metrics.fp}</span> {metrics.precision !== null && <span className="ml-2">Precisión {(metrics.precision * 100).toFixed(1)}%</span>}</div>
            <button onClick={enableAll} className="px-2 py-1 bg-green-600/30 rounded text-sm">Activar todas</button>
            <button onClick={disableAll} className="px-2 py-1 bg-red-600/30 rounded text-sm">Desactivar todas</button>
            <button onClick={doExportLogs} className="px-2 py-1 bg-white/6 rounded text-sm">Exportar</button>
            <button onClick={doClearLogs} className="px-2 py-1 bg-rose-700/20 rounded text-sm">Borrar</button>
          </div>
        </div>
        {logs.length === 0 ? (
          <div className="text-sm small-muted">Sin registros.</div>
        ) : (
          <ul className="space-y-2 max-h-48 overflow-auto">
            {logs.map((l) => (
              <li key={l.id} className="p-2 rounded border border-zinc-700 text-sm">
                <div className="text-xs small-muted">{new Date(l.timestamp).toLocaleString()} • {l.silent ? 'silencioso' : 'activo'}</div>
                <div className="mt-1">{l.alerts.length} alertas — {l.alerts.map((a) => `${a.ruleId}(${a.severity})`).join(', ')}</div>
                <div className="mt-2 flex gap-2">
                  <button onClick={() => { appendValidation({ id: `v-${Date.now()}`, logId: l.id, recordId: l.recordId, timestamp: new Date().toISOString(), isTP: true }); setLogs(getLogs()) }} className="px-2 py-1 bg-emerald-600/30 rounded text-sm">Marcar TP</button>
                  <button onClick={() => { appendValidation({ id: `v-${Date.now()}`, logId: l.id, recordId: l.recordId, timestamp: new Date().toISOString(), isTP: false }); setLogs(getLogs()) }} className="px-2 py-1 bg-rose-600/20 rounded text-sm">Marcar FP</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
