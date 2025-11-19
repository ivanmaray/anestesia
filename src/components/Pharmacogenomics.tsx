import { useMemo } from 'react'

// Panel simulado de farmacogenómica (FGG)
// Acepta lista de medicamentos y un callback onApply para aplicar recomendaciones al formulario.
export default function Pharmacogenomics({
  pacienteId,
  meds,
  onApply,
  allowApply = true,
}: {
  pacienteId?: string
  meds?: string[]
  onApply?: (summary: string) => void
  allowApply?: boolean
}) {
  // Generar variantes simuladas basadas en pacienteId o datos aleatorios
  const variants = useMemo(() => {
    const base = pacienteId ? pacienteId.length : 6
    const v = [
      { gene: 'CYP2D6', genotype: base % 3 === 0 ? 'PM' : base % 3 === 1 ? 'IM' : 'NM', impact: base % 3 === 0 ? 'Metabolizador pobre (PM) — metabolismo reducido' : 'Normal' },
      { gene: 'CYP3A4', genotype: base % 4 === 0 ? 'UM' : 'NM', impact: base % 4 === 0 ? 'Variación CYP3A4 — posible efecto en fármacos metabolizados por 3A4' : 'Normal' },
      { gene: 'OPRM1', genotype: base % 5 === 0 ? 'Variant' : 'WT', impact: base % 5 === 0 ? 'Alteración en respuesta analgésica' : 'Normal' }
    ]
    return v
  }, [pacienteId])

  // Sugerencias de fármacos basadas en variantes y medicamentos actuales (simuladas)
  const suggestions = useMemo(() => {
    const out: { drug: string; issue: string; recommendation: string }[] = []
    variants.forEach((vt) => {
      if (vt.gene === 'CYP2D6' && vt.genotype === 'PM') {
        out.push({ drug: 'Codeína', issue: 'Eficacia reducida', recommendation: 'Evitar; usar morfina u opioide no dependiente de CYP2D6' })
      }
      if (vt.gene === 'CYP3A4' && vt.genotype === 'UM') {
        out.push({ drug: 'Fármacos CYP3A4', issue: 'Alteración en metabolismo', recommendation: 'Revisar dosis de fármacos altamente metabolizados por CYP3A4' })
      }
      if (vt.gene === 'OPRM1' && vt.genotype === 'Variant') {
        out.push({ drug: 'Opioides', issue: 'Respuesta analgésica variable', recommendation: 'Monitorizar analgesia y considerar alternativas multimodales' })
      }
    })

    // También detectar si alguno de los medicamentos actuales está directamente afectado
    if (meds && meds.length) {
      meds.forEach((m) => {
        const name = m.toLowerCase()
        if (name.includes('codeine') || name.includes('codeína')) {
          if (!out.find((o) => o.drug.toLowerCase().includes('codeine'))) {
            out.push({ drug: 'Codeína', issue: 'Considerar PGx', recommendation: 'Evaluar metabolismo (CYP2D6) si hay pobre respuesta o efectos adversos' })
          }
        }
      })
    }

    return out
  }, [variants, meds])

  function applyAll() {
    if (!onApply) return
    if (suggestions.length === 0) {
      onApply('No se encontraron recomendaciones específicas para este perfil simulado.')
      return
    }
    const txt = suggestions.map((s) => `${s.drug}: ${s.recommendation} (${s.issue})`).join('\n')
    onApply(txt)
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-2">Farmacogenómica — Perfil rápido</h3>
      <div className="text-sm small-muted mb-3">Perfil genético simulado para apoyo a la decisión farmacológica.</div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
        {variants.map((v) => (
          <div key={v.gene} className="p-2 bg-white/3 rounded">
            <div className="text-sm text-white/80">{v.gene}</div>
            <div className="font-mono font-semibold text-white mt-1">{v.genotype}</div>
            <div className="text-xs small-muted mt-1">{v.impact}</div>
          </div>
        ))}
      </div>

      <h4 className="text-sm font-semibold mb-2">Sugerencias farmacológicas</h4>
      {suggestions.length === 0 ? (
        <div className="small-muted">No se identifican recomendaciones específicas en este perfil simulado.</div>
      ) : (
        <ul className="text-sm">
          {suggestions.map((s, i) => (
            <li key={i} className="py-2 border-b border-white/4">
              <div className="font-semibold">{s.drug} — <span className="text-sm small-muted">{s.issue}</span></div>
              <div className="text-sm">Recomendación: <span className="font-semibold">{s.recommendation}</span></div>
            </li>
          ))}
        </ul>
      )}

      {allowApply ? (
        <div className="mt-4 flex gap-2">
          <button onClick={applyAll} className="px-3 py-1 bg-white/6 rounded">Aplicar recomendaciones</button>
        </div>
      ) : (
        <div className="mt-4 text-xs small-muted">Aplicación de recomendaciones deshabilitada en este módulo (solo verconsulta).</div>
      )}
    </div>
  )
}

