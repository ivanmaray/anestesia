import { useEffect, useState } from 'react'
import type { PatientRecord } from '../types/patient'
import { runPredictiveModel, modelMetadata } from '../lib/iaPredictive'

interface PredictiveRiskPanelProps {
  records?: PatientRecord[]
}

export default function PredictiveRiskPanel({ records = [] }: PredictiveRiskPanelProps) {
  const [localRecords, setLocalRecords] = useState<PatientRecord[]>(records)
  const [results, setResults] = useState<any[]>([])

  function loadFromLocal() {
    if (records && records.length) { setLocalRecords(records); return }
    try {
      const s = JSON.parse(localStorage.getItem('preanesthesia_records') || '[]') || []
      const parsed = s.map((r: any, i: number) => {
        const meds = (r.medicacion_actual && typeof r.medicacion_actual === 'string') ? r.medicacion_actual.split(',').map((m: string, j: number) => ({ id: `m-${j}`, name: m.trim() })) : []
        let eGFR: number | undefined = undefined
        if (r.creatinina_mg_dL !== undefined) {
          const c = Number(r.creatinina_mg_dL)
          if (!isNaN(c)) {
            if (c > 2) eGFR = 25
            else if (c > 1.5) eGFR = 40
            else eGFR = 80
          }
        }
        return {
          id: r.paciente_id,
          age: r.edad,
          sex: r.sexo,
          weightKg: r.peso_kg,
          eGFR,
          ast: r.ast,
          alt: r.alt,
          hemoglobina_g_dL: r.hemoglobina_g_dL,
          plaquetas: r.plaquetas,
          n_prev_procedures: r.n_prev_procedures || 0,
          multiresistant: !!r.multiresistente,
          meds,
        } as PatientRecord
      })
      setLocalRecords(parsed)
      return parsed
    } catch (err) {
      setLocalRecords([])
      return []
    }
  }

  useEffect(() => {
    const p = loadFromLocal()
    // optionally run model if data exists
    if (p && p.length) setResults(runPredictiveModel(p, true))
  }, [records])

  useEffect(() => {
    // listen for demoDataLoaded custom event to reload records and run model
    function onDemo() {
      const p = loadFromLocal()
      if (p && p.length) setResults(runPredictiveModel(p, true))
    }
    window.addEventListener('demoDataLoaded', onDemo)
    window.addEventListener('storage', onDemo)
    return () => {
      window.removeEventListener('demoDataLoaded', onDemo)
      window.removeEventListener('storage', onDemo)
    }
  }, [])

  function runModel() {
    const r = runPredictiveModel(localRecords, false)
    setResults(r)
  }

  return (
    <div className="predictive-risk-panel bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-lg shadow-xl w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            🤖 IA: Resultados predictivos
          </h2>
          <div className="text-slate-300 text-sm mt-1">Tabla de predicciones basadas en registros preoperatorios</div>
          <div className="text-slate-400 text-xs mt-1">Evento: "Complicación perioperatoria" (QFX = quirófano, REA = Reanimación/UCI)</div>
          <div className="text-slate-400 text-xs mt-1">Modelo de IA actual: <strong className="text-indigo-300">{modelMetadata.name}</strong> — Precisión: <strong className="text-green-300">{Math.round(modelMetadata.metrics.precision * 100)}%</strong> para predecir complicación perioperatoria</div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={runModel} className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors">🚀 Correr modelo</button>
          <div className="text-slate-300 text-sm">📊 Registros: <strong className="text-indigo-300">{localRecords.length}</strong></div>
        </div>
      </div>

      <div className="mb-6 border border-slate-600 rounded-lg p-4 bg-slate-800/50 shadow-inner">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold text-white flex items-center gap-2">
              📈 Métricas del modelo (demo)
            </div>
            <div className="text-slate-400 text-xs mt-1">Versión: <strong className="text-indigo-300">{modelMetadata.version}</strong> — Dataset: <strong className="text-indigo-300">{modelMetadata.dataset}</strong> — Ejemplos: <strong className="text-indigo-300">{modelMetadata.trainedOn}</strong></div>
          </div>
          <div className="text-sm grid grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-xs text-slate-400">Accuracy</div>
              <div className="text-lg font-bold text-green-300">{Math.round(modelMetadata.metrics.accuracy * 100)}%</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-400">Precision</div>
              <div className="text-lg font-bold text-blue-300">{Math.round(modelMetadata.metrics.precision * 100)}%</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-400">Recall</div>
              <div className="text-lg font-bold text-yellow-300">{Math.round(modelMetadata.metrics.recall * 100)}%</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-400">F1</div>
              <div className="text-lg font-bold text-purple-300">{Math.round(modelMetadata.metrics.f1 * 100)}%</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-400">AUC</div>
              <div className="text-lg font-bold text-red-300">{Math.round(modelMetadata.metrics.auc * 100)}%</div>
            </div>
          </div>
        </div>
        <div className="mt-3 text-xs text-slate-500">{modelMetadata.note}</div>
      </div>

      <div className="overflow-x-auto bg-slate-800/30 rounded-lg p-4">
        <div className="mb-4 flex items-center gap-4">
          <input placeholder="🔍 Buscar paciente..." className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-400 w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500" onChange={() => {}} />
          <select className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white">
            <option value="all">Todos los riesgos</option>
            <option value="high">🔴 Alto</option>
            <option value="medium">🟡 Medio</option>
            <option value="low">🟢 Bajo</option>
          </select>
        </div>
        <table className="w-full text-sm text-white">
          <thead className="bg-slate-700">
            <tr>
              <th className="py-4 px-6 text-left">👤 Paciente</th>
              <th className="py-4 px-6 text-left">🎂 Edad</th>
              <th className="py-4 px-6 text-left">⚧ Sexo</th>
              <th className="py-4 px-6 text-left hidden md:table-cell">💊 Medicaciones</th>
              <th className="py-4 px-6 text-left">💧 eGFR</th>
              <th className="py-4 px-6 text-left hidden lg:table-cell">AST/ALT</th>
              <th className="py-4 px-6 text-left hidden lg:table-cell">🩸 Hgb</th>
              <th className="py-4 px-6 text-left hidden lg:table-cell">🩸 Plaquetas</th>
              <th className="py-4 px-6 text-left hidden md:table-cell">#Prev</th>
              <th className="py-4 px-6 text-left hidden md:table-cell">🦠 Multires.</th>
              <th className="py-4 px-6 text-left min-w-[120px]">⚠️ Riesgo</th>
              <th className="py-4 px-6 text-left">🔮 Predicción</th>
              <th className="py-4 px-6 text-left">🚨 Complicación</th>
              <th className="py-4 px-6 text-left">📋 Tipo evento</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result: any, idx: number) => {
              const rec = localRecords[idx]
              return (
                <tr key={result.patientId ?? idx} className={`${idx % 2 ? 'bg-slate-700/50' : 'bg-slate-800/30'} hover:bg-slate-700/70 transition-colors`}>
                  <td className="py-4 px-6">{result.patientId ?? rec?.id ?? '—'}</td>
                  <td className="py-4 px-6">{rec?.age ?? '—'}</td>
                  <td className="py-4 px-6">{rec?.sex ?? '—'}</td>
                  <td className="py-4 px-6 hidden md:table-cell">{(rec?.meds?.length || 0)}</td>
                  <td className="py-4 px-6">{rec?.eGFR ?? '—'}</td>
                  <td className="py-4 px-6 hidden lg:table-cell">{rec?.ast ?? '—'}/{rec?.alt ?? '—'}</td>
                  <td className="py-4 px-6 hidden lg:table-cell">{rec?.hemoglobina_g_dL ?? '—'}</td>
                  <td className="py-4 px-6 hidden lg:table-cell">{rec?.plaquetas ?? '—'}</td>
                  <td className="py-4 px-6 hidden md:table-cell">{rec?.n_prev_procedures ?? 0}</td>
                  <td className="py-4 px-6 hidden md:table-cell">{rec?.multiresistant ? 'Sí' : 'No'}</td>
                  <td className="py-4 px-6 min-w-[120px]">
                    {(() => {
                      const p = Math.round(result.risk * 100)
                      if (p >= 60) return <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">🔴 {p}%</span>
                      if (p >= 30) return <span className="bg-yellow-600 text-white px-2 py-1 rounded-full text-xs font-bold">🟡 {p}%</span>
                      return <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-bold">🟢 {p}%</span>
                    })()}
                  </td>
                  <td className="py-4 px-6">
                    {(() => {
                      const label = result.predictedLabel ?? (() => {
                        const p = Math.round(result.risk * 100)
                        return p >= 60 ? 'Alto' : (p >= 30 ? 'Medio' : 'Bajo')
                      })()
                      return <span className="text-sm font-semibold text-indigo-300">{label}</span>
                    })()}
                  </td>
                  <td className="py-4 px-6">{result.predicted ? '✅ Sí' : '❌ No'}</td>
                  <td className="py-4 px-6">{result.predictedEventType ?? '-'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
 