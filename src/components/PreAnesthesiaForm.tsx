import { useState, useMemo, useEffect } from 'react'
import Papa from 'papaparse'
import useCdssAlerts from '../hooks/useCdssAlerts'
import Pharmacogenomics from './Pharmacogenomics'
import type { PatientRecord, Medication } from '../lib/cdss'
function SeverityBadge({ severity }: { severity: string }) {
  const map: { [k: string]: string } = {
    critical: 'bg-rose-600 text-white',
    warning: 'bg-amber-500 text-black',
    info: 'bg-sky-600 text-white'
  }
  const cls = map[severity] || 'bg-zinc-600 text-white'
  return <span className={`px-2 py-0.5 rounded text-xs font-semibold ${cls}`}>{severity}</span>
}

type Record = {
  paciente_id: string
  nombre?: string
  fecha_nacimiento?: string
  edad?: number
  sexo?: string
  peso_kg?: number
  altura_cm?: number
  alergias?: string
  ASA_status?: string
  procedimiento_planificado?: string
  urgencia?: string
  ayuno_horas?: number
  medicacion_actual?: string
  antecedentes_relevantes?: string
  TA_mmHg?: number
  FC_bpm?: number
  Sat_O2_pct?: number
  INR?: number
  creatinina_mg_dL?: number
  hemoglobina_g_dL?: number
  plaquetas?: number
  n_prev_procedures?: number
  multiresistente?: boolean
  identidad_confirmada?: boolean
  consentimiento_obtenido?: boolean
  alergias_verificadas?: boolean
  marcaje_sitio_quirurgico?: boolean
  riesgo_global?: string
  recomendaciones?: string
}

export default function PreAnesthesiaForm({ allowApplyPgx = true }: { allowApplyPgx?: boolean }) {
  const [form, setForm] = useState<Record>({ paciente_id: '' })
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [medsList, setMedsList] = useState<string[]>([])
  const [selectedComorbs, setSelectedComorbs] = useState<string[]>([])
  const [selectedMedsFromGroup, setSelectedMedsFromGroup] = useState<string[]>([])
  // opciones clínicas predefinidas
  const comorbidityOptions = [
    'Diabetes', 'HTA', 'IRC', 'Cardiopatía', 'EPOC', 'Obesidad', 'FA', 'Hepatopatía', 'Insuficiencia renal', 'Historia de TEP'
  ]
  const medGroups = [
    { label: 'Antibióticos', options: ['Vancomicina', 'Ceftriaxona', 'Gentamicina'] },
    { label: 'Antitrombóticos', options: ['Aspirina', 'Warfarina', 'Enoxaparina'] },
    { label: 'Analgésicos', options: ['Paracetamol', 'Morphina', 'Ketorolaco'] },
    { label: 'Cardiovasculares', options: ['Metoprolol', 'Atorvastatina'] },
    { label: 'Antidiabéticos', options: ['Metformina'] }
  ]
  const [showPgx, setShowPgx] = useState(false)

  function update<K extends keyof Record>(k: K, v: Record[K]) {
    setForm((s) => ({ ...s, [k]: v }))
  }

  function validate(): boolean {
    setError(null)
    if (!form.paciente_id) {
      setError('El campo paciente_id es obligatorio')
      return false
    }
    if (form.edad && (form.edad < 0 || form.edad > 120)) {
      setError('Edad fuera de rango')
      return false
    }
    return true
  }

  // Adding meds only via grouped selector or editing existing items

  function updateMed(idx: number, value: string) {
    setMedsList((s) => s.map((m, i) => (i === idx ? value : m)))
  }

  function removeMed(idx: number) {
    setMedsList((s) => s.filter((_, i) => i !== idx))
  }

  function onSave() {
    if (!validate()) return
    // Build the record to store using current selected arrays
    const recordToSave = {
      ...form,
      antecedentes_relevantes: selectedComorbs.join(', '),
      medicacion_actual: medsList.join(', ')
    }
    const stored = JSON.parse(localStorage.getItem('preanesthesia_records') || '[]')
    stored.push(recordToSave)
    localStorage.setItem('preanesthesia_records', JSON.stringify(stored))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    // Ejecutar evaluación CDSS al guardar
    run()
  }

  // inicializar selectedComorbs y medsList desde el form si hay valores anteriores
  useEffect(() => {
    if (form.antecedentes_relevantes) {
      const arr = form.antecedentes_relevantes.split(',').map((s) => s.trim()).filter(Boolean)
      setSelectedComorbs(arr)
    }
    if (form.medicacion_actual) {
      const arr = form.medicacion_actual.split(',').map((s) => s.trim()).filter(Boolean)
      setMedsList(arr)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function exportCSV() {
    const csv = Papa.unparse([form])
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `preanesthesia_${form.paciente_id || 'record'}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  function analyzeWithAI() {
    // Simulación: determinamos riesgo por longitud de texto y ASA
    let score = 0
    if (form.ASA_status) score += ['I','II','III','IV','V'].indexOf(form.ASA_status) / 5
    if (selectedComorbs && selectedComorbs.length) score += Math.min(0.5, (selectedComorbs.length * 0.1))
    const label = score > 0.6 ? 'Alto' : score > 0.3 ? 'Moderado' : 'Bajo'
    update('riesgo_global', label)
    update('recomendaciones', `Recomendación simulada: revisar ${label === 'Alto' ? 'intervenciones' : 'observación'}`)
  }

  function onApplyPgx(summary: string) {
    // Only apply recommendations if allowed in this context (e.g., not in Construcción IA)
    if (allowApplyPgx) {
      update('recomendaciones', (form.recomendaciones ? form.recomendaciones + '\n' : '') + `PGx: ${summary}`)
    }
    // close modal regardless
    setShowPgx(false)
  }

  // Construir PatientRecord simple para el CDSS a partir del formulario
  function parseMeds(text?: string): Medication[] {
    // nueva versión: usar medsList si existe
    const source = medsList && medsList.length ? medsList : (text ? text.split(',').map((s) => s.trim()).filter(Boolean) : [])
    if (!source || !source.length) return []
    const renalList = ['vancomycin', 'gentamicin', 'enoxaparin', 'gabapentin', 'metformin']
    return source.map((raw, i) => {
      const name = raw.trim()
      const lname = name.toLowerCase()
      const isLASA = /\b(morphine|morphina|meperidine|meperidina|clonazepam|clonazepan)\b/i.test(name)
      const med: Medication = {
        id: `m-${i}-${lname.replace(/\s+/g, '-')}`,
        name: name,
        renalCleared: renalList.some((r) => lname.includes(r)),
        hepaticCleared: lname.includes('atorvastatin') || lname.includes('amiodarone'),
        isLASA: isLASA
      }
      return med
    })
  }

  const patientRecord: PatientRecord = useMemo(() => {
    const meds = parseMeds(form.medicacion_actual)
    // heurística simple para eGFR basada en creatinina
    let eGFR: number | undefined = undefined
    if (form.creatinina_mg_dL !== undefined) {
      const c = Number(form.creatinina_mg_dL)
      if (!isNaN(c)) {
        if (c > 2) eGFR = 25
        else if (c > 1.5) eGFR = 40
        else eGFR = 80
      }
    }
    // Extraer variantes PGx aplicadas desde recomendaciones si existen (simple parsing)
    let pgxVariants: { gene: string; genotype: string; impact?: string }[] | undefined = undefined
    if (form.recomendaciones && /PGx:/i.test(form.recomendaciones)) {
      const lines = form.recomendaciones.split('\n').filter(l => /CYP|OPRM|SLCO/i.test(l))
      pgxVariants = lines.map(l => {
        const geneMatch = l.match(/(CYP2D6|CYP3A4|OPRM1|SLCO1B1)/i)
        const genotypeMatch = l.match(/\b(PM|IM|NM|UM|Variant|WT|\*5)\b/i)
        return { gene: geneMatch ? geneMatch[1].toUpperCase() : 'GEN', genotype: genotypeMatch ? genotypeMatch[1] : 'UNK', impact: 'Perfil PGx aplicado (derivado de recomendaciones)' }
      })
      if (!pgxVariants.length) pgxVariants = undefined
    }
    return {
      id: form.paciente_id,
      age: form.edad,
      weightKg: form.peso_kg,
      eGFR: eGFR,
      ast: undefined,
      alt: undefined,
      meds,
      pgxVariants
    }
  }, [form])

  const { alerts, run, silent, setSilent } = useCdssAlerts(patientRecord, { silent: false })

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-sm small-muted">ID paciente</label>
          <input aria-label="paciente_id" className="w-full rounded bg-transparent border p-2" value={form.paciente_id} onChange={(e) => update('paciente_id', e.target.value)} />
        </div>
        <div>
          <label className="text-sm small-muted">Edad</label>
          <input type="number" className="w-full rounded bg-transparent border p-2" value={form.edad ?? ''} onChange={(e) => update('edad', Number(e.target.value) || undefined)} />
        </div>
        <div>
          <label className="text-sm small-muted">Peso (kg)</label>
          <input type="number" className="w-full rounded bg-transparent border p-2" value={form.peso_kg ?? ''} onChange={(e) => update('peso_kg', Number(e.target.value) || undefined)} />
        </div>
        <div>
          <label className="text-sm small-muted">ASA</label>
          <select className="w-full rounded bg-transparent border p-2" value={form.ASA_status || ''} onChange={(e) => update('ASA_status', e.target.value)}>
            <option value="">Seleccionar</option>
            <option value="I">I</option>
            <option value="II">II</option>
            <option value="III">III</option>
            <option value="IV">IV</option>
            <option value="V">V</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="text-sm small-muted">Antecedentes relevantes (seleccione uno o más)</label>
          <select multiple value={selectedComorbs} onChange={(e) => {
            const options = Array.from(e.target.selectedOptions).map(o => o.value)
            setSelectedComorbs(options)
            update('antecedentes_relevantes', options.join(', '))
          }} className="w-full rounded bg-transparent border p-2 h-36">
            {comorbidityOptions.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="text-xs small-muted">Usá Cmd/Ctrl + click para seleccionar múltiples entradas.</div>
        </div>

        <div>
          <label className="text-sm small-muted">Hemoglobina (g/dL)</label>
          <input type="number" className="w-full rounded bg-transparent border p-2" value={form.hemoglobina_g_dL ?? ''} onChange={(e) => update('hemoglobina_g_dL', Number(e.target.value) || undefined)} />
        </div>
        <div>
          <label className="text-sm small-muted">Plaquetas (x10^3/uL)</label>
          <input type="number" className="w-full rounded bg-transparent border p-2" value={form.plaquetas ?? ''} onChange={(e) => update('plaquetas', Number(e.target.value) || undefined)} />
        </div>
        <div>
          <label className="text-sm small-muted">N° intervenciones previas</label>
          <input type="number" className="w-full rounded bg-transparent border p-2" value={form.n_prev_procedures ?? ''} onChange={(e) => update('n_prev_procedures', Number(e.target.value) || undefined)} />
        </div>
        <div>
          <label className="text-sm small-muted">Colonizado/a multiresistente</label>
          <input type="checkbox" checked={!!form.multiresistente} onChange={(e) => update('multiresistente', !!e.target.checked)} />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm small-muted">Medicacion actual (lista)</label>
          <div className="space-y-2">
            <div>
              <label className="text-sm small-muted">Seleccionar medicación por grupo</label>
              <select multiple value={selectedMedsFromGroup} onChange={(e) => {
                const opts = Array.from(e.target.selectedOptions).map(o => o.value)
                setSelectedMedsFromGroup(opts)
                // merge selection into medsList without duplicates
                setMedsList((prev) => Array.from(new Set([...prev, ...opts])))
              }} className="w-full rounded bg-transparent border p-2 h-32">
                {medGroups.map(g => (
                  <optgroup key={g.label} label={g.label}>
                    {g.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </optgroup>
                ))}
              </select>
              <div className="text-xs small-muted">Seleccioná medicamentos del grupo para agregarlos a la lista.</div>
            </div>
            {medsList.map((m, i) => (
              <div key={i} className="flex gap-2">
                <input value={m} onChange={(e) => updateMed(i, e.target.value)} className="flex-1 rounded bg-transparent border p-2" />
                <button onClick={() => removeMed(i)} className="px-2 py-1 bg-rose-700/20 rounded">Eliminar</button>
              </div>
            ))}

            {/* No free-text add: meds must be selected from groups or edited inline */}
            <div className="text-xs small-muted">Puedes pegar una lista separada por comas y luego editar individualmente.</div>
          </div>
        </div>
      </div>

        <div className="flex items-center gap-3 mt-3">
        <button onClick={onSave} className="px-3 py-1 bg-white/6 rounded">Guardar registro</button>
        <button onClick={exportCSV} className="px-3 py-1 border rounded">Exportar CSV</button>
        <button onClick={analyzeWithAI} className="px-3 py-1 bg-white/6 rounded">Analizar con IA</button>
        {allowApplyPgx && (
          <button onClick={() => setShowPgx(true)} className="px-3 py-1 border rounded">Evaluar para PGx</button>
        )}
        {saved && <span className="text-sm text-green-400">Guardado</span>}
        {error && <span className="text-sm text-red-400">{error}</span>}
      </div>

      <div className="mt-4 card">
        <h4 className="text-sm font-semibold">Resultado IA</h4>
        <div className="small-muted">Riesgo: <span className="font-semibold">{form.riesgo_global ?? '—'}</span></div>
        <div className="small-muted mt-2">Recomendaciones: {form.recomendaciones ?? '—'}</div>
      </div>

      {showPgx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-2xl bg-zinc-950 rounded shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Evaluación Farmacogenómica (PGx)</h3>
              <button onClick={() => setShowPgx(false)} className="px-2 py-1 btn-ghost">Cerrar</button>
            </div>
            <Pharmacogenomics pacienteId={form.paciente_id} meds={medsList} onApply={allowApplyPgx ? onApplyPgx : undefined} allowApply={allowApplyPgx} />
          </div>
        </div>
      )}

      <div className="mt-4 card">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold">Alertas CDSS</h4>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={silent} onChange={(e) => setSilent(!!e.target.checked)} /> Modo silencioso
            </label>
            <button onClick={() => run()} className="px-2 py-1 bg-white/6 rounded text-sm">Evaluar</button>
          </div>
        </div>

        <div className="mt-3">
          {alerts.length === 0 ? (
            <div className="text-sm small-muted">No se detectaron alertas para este registro.</div>
          ) : (
            <ul className="space-y-2">
              {alerts.map((a) => (
                <li key={a.id} className="p-2 rounded border border-zinc-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <SeverityBadge severity={a.severity} />
                        <div className="text-sm font-semibold">{a.message}</div>
                      </div>
                      <div className="text-xs small-muted">Regla: {a.ruleId}</div>
                    </div>
                    <div className="text-xs text-zinc-300">{a.medsAffected.join(', ')}</div>
                  </div>
                  {a.recommendation && <div className="mt-2 text-sm">Recomendación: <span className="font-medium">{a.recommendation}</span></div>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
