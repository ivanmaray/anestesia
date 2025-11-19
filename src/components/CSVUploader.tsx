// CSV Uploader: no requiere import React explícito
import { useRef, useState } from 'react'
import Papa from 'papaparse'
import useDashboardData from '../hooks/useDashboardData'

const REQUIRED_MONTHLY = [
  'mes','area','administraciones','errores_totales','errores_severos_GI','near_miss','alertas_totales','alertas_criticas','alertas_aceptadas','dosis','farmaco','via','velocidad','lasa'
]

const REQUIRED_ALERTS = ['fecha','area','paciente_id','alerta','motivo','critica','aceptada']

export default function CSVUploader() {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { replaceData, monthly } = useDashboardData()
  const [error, setError] = useState<string | null>(null)

  function onFile(f: File) {
    setError(null)
    Papa.parse(f, {
      header: true,
      skipEmptyLines: true,
      complete: (results: Papa.ParseResult<any>) => {
        const keys = results.meta.fields || []
        // detect if monthly or alerts
        const hasMonthly = REQUIRED_MONTHLY.every((h) => keys.includes(h))
        const hasAlerts = REQUIRED_ALERTS.every((h) => keys.includes(h))
        if (!hasMonthly && !hasAlerts) {
          setError('CSV inválido. Faltan cabeceras requeridas. Cabeceras mínimas mensuales: ' + REQUIRED_MONTHLY.join(','))
          return
        }

        if (hasMonthly) {
          // map rows to monthly records
          const monthly = results.data.map((r: any) => ({
            mes: r.mes,
            area: r.area,
            administraciones: Number(r.administraciones) || 0,
            errores_totales: Number(r.errores_totales) || 0,
            errores_severos_GI: Number(r.errores_severos_GI) || 0,
            near_miss: Number(r.near_miss) || 0,
            dosis: Number(r.dosis) || 0,
            farmaco: Number(r.farmaco) || 0,
            via: Number(r.via) || 0,
            velocidad: Number(r.velocidad) || 0,
            lasa: Number(r.lasa) || 0,
            alertas_totales: Number(r.alertas_totales) || 0,
            alertas_criticas: Number(r.alertas_criticas) || 0,
            alertas_aceptadas: Number(r.alertas_aceptadas) || 0
          }))
          replaceData(monthly, null)
        }

        if (hasAlerts) {
          const alerts = results.data.map((r: any) => ({
            fecha: r.fecha,
            area: r.area,
            paciente_id: r.paciente_id,
            alerta: r.alerta,
            motivo: r.motivo,
            critica: r.critica === 'true' || r.critica === '1' || r.critica === true,
            aceptada: r.aceptada === 'true' || r.aceptada === '1' || r.aceptada === true
          }))
          replaceData(null, alerts)
        }

      },
  error: (err: any) => setError(String(err))
    })
  }

  return (
    <div className="flex items-center gap-2">
      <input ref={inputRef} type="file" accept="text/csv" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f) }} />
      <button onClick={() => inputRef.current?.click()} className="px-3 py-1 border rounded text-sm">Subir CSV</button>
      <button
        onClick={() => {
          try {
            const mCsv = Papa.unparse(monthly)
            const blob = new Blob([mCsv], { type: 'text/csv;charset=utf-8;' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'datos_mensuales.csv'
            a.click()
            URL.revokeObjectURL(url)
          } catch (err) {
            setError('Error generando CSV: ' + String(err))
          }
        }}
        className="px-3 py-1 border rounded text-sm"
      >
        Descargar datos simulados
      </button>
      {error && <div className="text-sm text-red-600 ml-2">{error}</div>}
    </div>
  )
}
