import React, { useState, useEffect } from 'react'
import { generateRiskScore } from '../lib/iaPredictive'
import { evaluateRecord } from '../lib/cdss'
import PharmacogenomicsPanel from './PharmacogenomicsPanel'
import type { PGXResult } from './PharmacogenomicsPanel'

interface Medication {
  id: string
  name: string
  dose?: string
  route?: string
  action: 'no_suspend' | 'suspend_reintroduce_days_before' | 'suspend_definitely' | 'reintroduce_days_after'
  suspendDays?: number
  reintroduceDays?: number
}

const defaultMedications: Medication[] = [
  { id: 'm1', name: 'Aspirina 100 mg', dose: '100 mg', route: 'oral', action: 'suspend_reintroduce_days_before', suspendDays: 7, reintroduceDays: 1 },
  { id: 'm2', name: 'Metformina 850 mg', dose: '850 mg', route: 'oral', action: 'no_suspend' },
  { id: 'm3', name: 'Clopidogrel 75 mg', dose: '75 mg', route: 'oral', action: 'suspend_reintroduce_days_before', suspendDays: 5, reintroduceDays: 1 },
  { id: 'm4', name: 'Warfarina 5 mg', dose: '5 mg', route: 'oral', action: 'suspend_definitely' },
  { id: 'm5', name: 'Insulina glargina 20 UI', dose: '20 UI', route: 'subcutánea', action: 'reintroduce_days_after', reintroduceDays: 1 },
  { id: 'm6', name: 'Enalapril 10 mg', dose: '10 mg', route: 'oral', action: 'no_suspend' },
  { id: 'm7', name: 'Atorvastatina 20 mg', dose: '20 mg', route: 'oral', action: 'suspend_reintroduce_days_before', suspendDays: 3, reintroduceDays: 1 },
]

interface Props {
  simulate?: boolean
  onSimulated?: () => void
}

const UseCaseFlow: React.FC<Props> = ({ simulate, onSimulated }) => {
  const [step, setStep] = useState(1)
  const [patientName, setPatientName] = useState('Sr. Fernández')
  const [age, setAge] = useState(64)
  const [asa, setAsa] = useState(2)
  const [comorbidities, setComorbidities] = useState<string[]>(['HTA', 'Diabetes'])
  const [meds, setMeds] = useState<Medication[]>(defaultMedications)
  const [pgx, setPgx] = useState<string | null>(null)
  const [pgxResults, setPgxResults] = useState<PGXResult[] | null>(null)
  const [pharmRecommendation, setPharmRecommendation] = useState<string>('')
  const [riskScore, setRiskScore] = useState<number | null>(null)
  const [alerts, setAlerts] = useState<string[]>([])
  const [cdssAlerts, setCdssAlerts] = useState<any[]>([])

  function updateMedicationAction(id: string, action: Medication['action'], suspendDays?: number, reintroduceDays?: number) {
    setMeds((prev) => prev.map((m) => (m.id === id ? { ...m, action, suspendDays, reintroduceDays } : m)))
  }

  function runPgxTest() {
    // For the demo, choose a sample genotype with effect
    // Present a combined sample result with CYP2D6 UM and RYR1 variant to show multiple recommendations
    const sample = 'CYP2D6: UM (ultrarapid)\nRYR1: Variant (possible MH susceptibility)'
    setPgx(sample)
    setPgxResults([{ gene: 'CYP2D6', genotype: 'UM (ultrarapid)' }, { gene: 'RYR1', genotype: 'Variant (possible MH susceptibility)' }])
    // create a sample interpretation and recommendation
    const rec = `Farmacéutico: PGx detecta CYP2D6 UM → evitar codeína/tramadol; usar alternativas como paracetamol o metamizol y monitorizar sedación.\nFarmacéutico: RYR1 variante detectada → posible susceptibilidad a hipertermia maligna; evitar succinilcolina y agentes halogenados, notificar a anestesia.`
    setPharmRecommendation(rec)
    setAlerts((prev) => [...prev, 'PGx: CYP2D6 UM -> Evitar codeína/tramadol', 'PGx: RYR1 -> Riesgo MH: evitar ciertos agentes'])
    evaluateAll()
  }

  function handlePgxChange(results: PGXResult[]) {
    setPgxResults(results)
    // produce a simple string summary for display and integration into the record
    const str = results.map((r) => `${r.gene}: ${r.genotype}`).join('\n')
    setPgx(str)
    // produce deduced alerts based on the genes
    const newAlerts: string[] = []
    results.forEach((r) => {
      if (r.gene === 'CYP2D6' && r.genotype.includes('UM')) newAlerts.push('PGx: CYP2D6 UM -> Evitar codeína/tramadol')
      if (r.gene === 'RYR1' && r.genotype.includes('Variant')) newAlerts.push('PGx: RYR1 -> Riesgo MH: evitar ciertos agentes')
      if (r.gene === 'CYP2C19' && r.genotype.includes('PM')) newAlerts.push('PGx: CYP2C19 PM -> Considere alternativa a clopidogrel')
    })
    setAlerts((prev) => [...prev, ...newAlerts])
    evaluateAll()
  }

  function handleApplyPgxRecommendation(text: string) {
    if (!text) return
    setPharmRecommendation((prev) => [prev, text].filter(Boolean).join('\n'))
    setAlerts((prev) => [...prev, `Recomendación PGx aplicada: ${text}`])
    evaluateAll()
  }

  function runIA() {
    // Use the utility from src/lib/iaPredictive to compute a risk value
    const record = { id: patientName.replace(/\s+/g, '-').toLowerCase(), age, meds, pgxVariants: pgx ? [{ gene: 'CYP2D6', genotype: pgx }] : undefined }
    const risk = generateRiskScore(record)
    const score = risk.risk
    setRiskScore(score)
    setAlerts((prev) => [...prev, `IA: Riesgo perioperatorio estimado ${Math.round(score * 100)}%`])
    evaluateAll()
  }

  function runReconciliation() {
    // Simple reconciliation rules for demo (hardcoded sample rules)
    const recommendations: string[] = []
    const newAlerts: string[] = []
    const updatedMeds = meds.map((m) => {
      const name = m.name.toLowerCase()
      if (name.includes('clopidogrel')) {
        recommendations.push(`${m.name}: Suspender 5 días antes por riesgo hemorrágico, reintroducir 1 día después`)
        newAlerts.push(`${m.name} -> Suspender 5 días antes, reintroducir 1 día después`)
        return { ...m, action: 'suspend_reintroduce_days_before' as const, suspendDays: 5, reintroduceDays: 1 }
      }
      if (name.includes('aspir')) {
        recommendations.push(`${m.name}: Evaluar riesgo sangrado; considerar suspender 7 días antes, reintroducir 1 día después`) 
        newAlerts.push(`${m.name} -> Evaluar suspender 7 días antes, reintroducir 1 día después`) 
        return { ...m, action: 'suspend_reintroduce_days_before' as const, suspendDays: 7, reintroduceDays: 1 }
      }
      if (name.includes('metformina')) {
        recommendations.push(`${m.name}: Mantener, suspender solo si se administra contraste o falla renal aguda`) 
        return { ...m, action: 'no_suspend' as const }
      }
      return m
    })
    setMeds(updatedMeds)
    setPharmRecommendation(recommendations.join('\n'))
    setAlerts((prev) => [...prev, ...newAlerts])
    evaluateAll()
  }

  function exportFHIR() {
    const obs = {
      resourceType: 'Bundle',
      type: 'collection',
      entry: [
        { resource: { resourceType: 'Patient', name: [{ text: patientName }], age } },
        { resource: { resourceType: 'MedicationStatement', medication: meds.map((m) => ({ name: m.name, action: m.action, suspendDays: m.suspendDays, reintroduceDays: m.reintroduceDays })) } },
        { resource: { resourceType: 'Observation', code: { text: 'Perioperative risk' }, value: riskScore } },
      ],
    }
    const data = JSON.stringify(obs, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `patient-${patientName.replace(/\s+/g, '-')}.json`
    a.click()
  }

  function simulateScenario() {
    setPatientName('Sra. Gómez')
    setAge(64)
    setAsa(3)
    setComorbidities(['HTA', 'Diabetes'])
    const demoMeds: Medication[] = [
      { id: 'm1', name: 'Aspirina 100 mg', dose: '100 mg', route: 'oral', action: 'suspend_reintroduce_days_before', suspendDays: 7, reintroduceDays: 1 },
      { id: 'm2', name: 'Metformina 850 mg', dose: '850 mg', route: 'oral', action: 'no_suspend' },
      { id: 'm3', name: 'Clopidogrel 75 mg', dose: '75 mg', route: 'oral', action: 'suspend_reintroduce_days_before', suspendDays: 5, reintroduceDays: 1 },
    ]
    setMeds(demoMeds)
    // execute reconciliation, PGx & IA
    runReconciliation()
    runPgxTest()
    // small delay for IA
    setTimeout(() => runIA(), 500)
    setStep(4)
  }

  useEffect(() => {
    if (simulate) {
      simulateScenario()
      onSimulated?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simulate])

  function evaluateAll() {
    const record = {
      id: patientName.replace(/\s+/g, '-').toLowerCase(),
      age,
      meds,
      pgxVariants: pgxResults ? pgxResults.map((r) => ({ gene: r.gene, genotype: r.genotype })) : undefined,
    }
    const newAlerts = evaluateRecord(record)
    if (!newAlerts.length) return
    setCdssAlerts((prev) => {
      const ids = new Set(prev.map((a:any) => a.id))
      const merged = [...prev]
      for (const a of newAlerts) {
        if (!ids.has(a.id)) { ids.add(a.id); merged.push(a) }
      }
      return merged
    })
    // cdssAlertIds was previously used to track existing alert IDs; we now deduplicate using cdssAlerts state alone.
    setAlerts((prev) => [...prev, ...newAlerts.map(a => `${a.severity.toUpperCase()}: ${a.message}`)])
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Demo Clínica: Consulta Preoperatoria</h2>
      <div className="mb-4 text-sm text-white flex items-center justify-between">
        <div>Paso {step} de 4</div>
        <div className="flex gap-2 items-center">
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 card">
          <div className="mb-4">
            <label className="block text-sm text-white">Paciente</label>
            <input className="border p-2 w-full rounded" value={patientName} onChange={(e) => setPatientName(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-sm text-white">Edad</label>
              <input type="number" className="border p-2 w-full rounded" value={age} onChange={(e) => setAge(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-sm text-white">ASA</label>
              <select className="border p-2 w-full rounded" value={asa} onChange={(e) => setAsa(Number(e.target.value))}>
                <option value={1}>ASA 1</option>
                <option value={2}>ASA 2</option>
                <option value={3}>ASA 3</option>
                <option value={4}>ASA 4</option>
              </select>
            </div>
          </div>

          <h3 className="text-lg font-semibold">Medicaciones - Conciliación</h3>
          <ul className="mb-4">
            {meds.map((m) => (
              <li key={m.id} className="flex items-center gap-4 py-2 border-b">
                <div className="flex-1">
                  <div className="font-medium">{m.name}</div>
                  <div className="text-xs text-white">{m.dose} • {m.route}</div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={m.action}
                    onChange={(e) => updateMedicationAction(m.id, e.target.value as Medication['action'])}
                    className="px-2 py-1 rounded bg-slate-700 text-white text-sm"
                  >
                    <option value="no_suspend">No suspender</option>
                    <option value="suspend_reintroduce_days_before">Suspender/Reintroducir días antes</option>
                    <option value="suspend_definitely">Suspender definitivamente</option>
                    <option value="reintroduce_days_after">Reintroducir días después</option>
                  </select>
                  {m.action === 'suspend_reintroduce_days_before' && (
                    <>
                      <input
                        type="number"
                        value={m.suspendDays || ''}
                        onChange={(e) => updateMedicationAction(m.id, m.action, Number(e.target.value), m.reintroduceDays)}
                        placeholder="Suspender días antes"
                        className="px-2 py-1 rounded bg-slate-700 text-white text-sm w-20"
                      />
                      <input
                        type="number"
                        value={m.reintroduceDays || ''}
                        onChange={(e) => updateMedicationAction(m.id, m.action, m.suspendDays, Number(e.target.value))}
                        placeholder="Reintroducir días después"
                        className="px-2 py-1 rounded bg-slate-700 text-white text-sm w-20"
                      />
                    </>
                  )}
                  {m.action === 'reintroduce_days_after' && (
                    <input
                      type="number"
                      value={m.reintroduceDays || ''}
                      onChange={(e) => updateMedicationAction(m.id, m.action, undefined, Number(e.target.value))}
                      placeholder="Días después"
                      className="px-2 py-1 rounded bg-slate-700 text-white text-sm w-20"
                    />
                  )}
                </div>
              </li>
            ))}
          </ul>

          <div className="mb-4 flex gap-2">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded" onClick={() => { runPgxTest(); setStep(2) }}>Solicitar PGx</button>
            <button className="px-4 py-2 bg-amber-500 text-white rounded" onClick={() => { runReconciliation(); setStep(2) }}>Conciliar Medicación</button>
            <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => { runIA(); setStep(3) }}>Correr algoritmo IA</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={() => { setStep(4) }}>Continuar</button>
            <button className="px-3 py-1 bg-white/6 hidden md:block rounded border text-white" onClick={() => simulateScenario()}>Simular caso</button>
          </div>

          {pgx && (
              <div className="card mb-4">
              <div className="font-semibold mb-1">Resultado PGx</div>
                <pre className="text-xs bg-white/6 p-2 rounded text-white">{pgx}</pre>
              <div className="mt-2 text-sm text-white">Interpretación: {pharmRecommendation}</div>
            </div>
          )}

          {riskScore !== null && (
            <div className="bg-yellow-50 p-4 border rounded shadow-sm mb-4 text-gray-900">
              <div className="font-semibold">Riesgo peroperatorio (IA)</div>
              <div className="text-3xl font-extrabold" aria-live="polite">{Math.round(riskScore * 100)}%</div>
            </div>
          )}

        </div>

            <div className="card">
          <div className="text-sm text-white mb-2">Resumen</div>
          <div className="mb-2">Paciente: <strong>{patientName}</strong></div>
          <div className="mb-2">Edad: <strong>{age}</strong> • ASA: <strong>{asa}</strong></div>
          <div className="mb-2">Comorbilidades: <strong>{comorbidities.join(', ')}</strong></div>

          <div className="mt-4">
            <div className="text-sm font-semibold mb-2 border-b pb-2">Alertas</div>
            {alerts.length === 0 && <div className="text-xs text-white">Sin alertas aún</div>}
            <ul className="text-xs text-white list-disc ml-4">
              {alerts.map((a, i) => (<li key={i}>{a}</li>))}
            </ul>
          </div>

          {/* PGx Panel */}
          <div className="mt-6">
            <PharmacogenomicsPanel
              values={pgxResults || undefined}
              onChange={(res) => handlePgxChange(res)}
              onApplyRecommendation={(text) => handleApplyPgxRecommendation(text)}
            />
          </div>

          <div className="mt-4">
            <div className="text-sm font-semibold mb-2 border-b pb-2">Flujo clínico</div>
            <ol className="text-xs text-white list-decimal ml-4">
              <li>Consulta preoperatoria (Anestesiólogo): {patientName ? 'Completada' : 'Pendiente'}</li>
              <li>Conciliación (Farmacia): {pharmRecommendation ? 'Completada' : 'Pendiente'}</li>
              <li>PGx: {pgx ? 'Resultado disponible' : 'Solicitar prueba'}</li>
              <li>Algoritmo IA: {riskScore !== null ? `${Math.round(riskScore * 100)}%` : 'No calculado'}</li>
            </ol>
          </div>

          {pharmRecommendation && (
            <div className="mt-4">
              <div className="text-sm font-semibold mb-2 border-b pb-2">Recomendaciones farmacéuticas</div>
              <div className="text-xs text-white whitespace-pre-wrap">{pharmRecommendation}</div>
            </div>
          )}

          {cdssAlerts.length > 0 && (
            <div className="mt-4">
              <div className="text-sm font-semibold mb-2 border-b pb-2">Alertas CDSS</div>
              <ul className="text-xs text-white list-disc ml-4">
                {cdssAlerts.map((a:any) => (
                  <li key={a.id} className="mb-2">
                    <div><strong>{a.severity.toUpperCase()}</strong>: {a.message}</div>
                    {a.medsAffected && a.medsAffected.length > 0 && (
                      <div className="text-xs text-white">Medicamentos afectados: {a.medsAffected.map((id:string) => meds.find(m => m.id === id)?.name).filter(Boolean).join(', ')}</div>
                    )}
                    {a.recommendation && (<div className="text-xs text-white">Recomendación: {a.recommendation}</div>)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6">
            <button className="px-4 py-2 bg-green-600 text-white rounded w-full" onClick={() => exportFHIR()}>Exportar FHIR (Mock)</button>
            <button className="px-4 py-2 mt-2 bg-rose-600 hover:bg-rose-700 text-white rounded w-full" onClick={() => {
              setStep(1); setPgx(null); setPharmRecommendation(''); setRiskScore(null); setAlerts([])
            }}>
              Reset demo
            </button>
          </div>
        </div>
      </div>
      

    </div>
  )
}

export default UseCaseFlow
