import { useMemo } from 'react'

// Componente que muestra recomendaciones generadas por IA (simulación)
export default function AIRecommendations({ note }: { note?: string }) {
  // Simular análisis de texto: extraer "temas" y sugerencias
  const analysis = useMemo(() => {
    const text = (note || '').toLowerCase()
    const themes: string[] = []
    if (text.includes('sangrado') || text.includes('hemorrag')) themes.push('Riesgo de sangrado')
    if (text.includes('alerg')) themes.push('Posible alergia / reacción')
    if (text.includes('anticoag')) themes.push('Revisión de anticoagulación')
    if (themes.length === 0) themes.push('Sin hallazgos inmediatos')

    const recs = themes.map((t) => {
      if (t === 'Riesgo de sangrado') return 'Considerar pruebas de coagulación y comunicar al equipo quirúrgico.'
      if (t === 'Posible alergia / reacción') return 'Confirmar alergias y utilizar alternativas no alergénicas.'
      if (t === 'Revisión de anticoagulación') return 'Consultar con Hematología o ajustar plan de anticoagulación.'
      return 'No se requieren acciones inmediatas.'
    })

    return { themes, recs }
  }, [note])

  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-2">Asistente IA — recomendaciones</h3>
      <div className="text-sm small-muted mb-2">Resumen automatizado de la nota clínica (simulado).</div>

      <div>
        <div className="text-sm font-semibold">Temas detectados</div>
        <ul className="text-sm small-muted mb-3">
          {analysis.themes.map((t, i) => (
            <li key={i}>• {t}</li>
          ))}
        </ul>
      </div>

      <div>
        <div className="text-sm font-semibold">Acciones sugeridas</div>
        <ul className="text-sm">
          {analysis.recs.map((r, i) => (
            <li key={i} className="py-1">{r}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
