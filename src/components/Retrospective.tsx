import { useMemo } from 'react'
import useDashboardData from '../hooks/useDashboardData'

export default function Retrospective() {
  const { monthly, alerts, computeKPIs, stackedByType } = useDashboardData()
  // removed groupBy selector: no longer used
  // preRecords removed from UI (stored elsewhere in app if needed)

  const phase1Checklist = [
    { id: 'r1', label: 'Revisión de errores de medicación registrados (últimos 3 años)', done: false },
    { id: 'r2', label: 'Entrevistas estructuradas con anestesiólogos y farmacéuticos', done: false },
    { id: 'r3', label: 'Diseño de indicadores iniciales de seguridad y eficiencia', done: false }
  ]

  // save/delete helpers removed with preRecords

  // Simplified: checklist is static for now (no persistence or editing)

  // exportAllPreRecords removed

  // Removed summary useMemo as 'Resumen agregado' card was removed to reduce noise

  const phase1Example = useMemo(() => {
    // compute totals per area last 36 months
    const sorted = [...monthly].sort((a, b) => (a.mes > b.mes ? 1 : -1))
    const last36 = sorted.slice(-36)
    const areaMap = new Map<string, number>()
    last36.forEach((m) => areaMap.set(m.area, (areaMap.get(m.area) || 0) + (m.errores_totales || 0)))
    const perArea = Array.from(areaMap.entries()).sort((a, b) => b[1] - a[1])

    // top issues from calculate stackedByType rates
    const types = stackedByType({ period: Math.min(36, sorted.length), area: 'Todas' })
    const typesList = Object.entries(types).sort((a: any, b: any) => b[1] - a[1])

    // interviews: derive top motives from alerts
    const recentAlerts = alerts.slice(-1000) // cap
    const motiveMap = new Map<string, number>()
    recentAlerts.forEach((a) => motiveMap.set(a.motivo, (motiveMap.get(a.motivo) || 0) + 1))
    const motivesArr = Array.from(motiveMap.entries()).sort((a, b) => b[1] - a[1])
    const topMotives = motivesArr.slice(0, 5).map(([label, count]) => ({ label, count }))

    // KPIs sample as computed by the hook
    const kpis = computeKPIs({ period: Math.min(36, sorted.length), area: 'Todas' })

    return {
      perArea,
      typesList,
      topMotives,
      kpis
    }
  }, [monthly, alerts, computeKPIs, stackedByType])

  function getMotiveDescription(label: string) {
    const map: { [k: string]: string } = {
      'Prescripción manual': 'Prescripciones sin doble verificación o transcripción manual que inducen errores.',
      'Confusión parecido nombre': 'Errores por similitud de nombre entre fármacos o pacientes (confusión de identidad).',
      'Error humano': 'Errores por fallos humanos: interrupciones, fatiga o procesos no estandarizados.',
      'Errores de etiquetado': 'Etiquetado incorrecto de medicamentos/pacientes que puede conducir a administración equivocada.'
    }
    // look for startsWith key
    const key = Object.keys(map).find((k) => label.startsWith(k))
    return key ? map[key] : 'Hallazgo identificado en entrevistas (resumen cualitativo)'
  }

  function getMotiveOpportunity(label: string) {
    const map: { [k: string]: string } = {
      'Prescripción manual': 'Oportunidad: implementar verificación electrónica y doble check en dosis críticas.',
      'Confusión parecido nombre': 'Oportunidad: revisar listas LASA, usar tallos de colores y estandarizar nombres de farmacos.',
      'Error humano': 'Oportunidad: mejorar controles de carga cognitiva y checklists en quirófano.',
      'Errores de etiquetado': 'Oportunidad: aplicar etiquetado estandarizado con códigos de barra y verificación cruzada.'
    }
    const key = Object.keys(map).find((k) => label.startsWith(k))
    return key ? map[key] : 'Oportunidad: Revisar proceso operativo y aplicar controles adicionales.'
  }


  // Simplified: interviews and indicators are presented as static examples (no edit/persist)

  // Default interview findings to present in structured interviews UI
  const interviewFindingsDefault = [
    {
      label: 'Error humano',
      description: 'Errores por fallos humanos: interrupciones, fatiga o procesos no estandarizados.',
      count: 48,
      opportunity: 'Oportunidad: mejorar controles de carga cognitiva y checklists en quirófano.'
    },
    {
      label: 'Prescripción manual',
      description: 'Prescripciones sin doble verificación o transcripción manual que inducen errores.',
      count: 43,
      opportunity: 'Oportunidad: implementar verificación electrónica y doble check en dosis críticas.'
    },
    {
      label: 'Confusión parecido nombre',
      description: 'Errores por similitud de nombre entre fármacos o pacientes (confusión de identidad).',
      count: 40,
      opportunity: 'Oportunidad: revisar listas LASA, usar tallos de colores y estandarizar nombres de farmacos.'
    }
  ]

  const maxInterviewCount = Math.max(...interviewFindingsDefault.map((m: any) => m.count), 1)

  return (
    <div>
      {/* Removed 'Agrupar por' selector and 'Resumen agregado' card per user request: it added little value */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card glow-border">
          <h3 className="text-lg font-semibold mb-2 text-white">Fase 1 (0–6 meses): Auditoría y diagnóstico inicial</h3>
          <div className="text-sm small-muted">
            <div className="mb-2">Objetivo: auditoría inicial y establecer indicadores prioritarios para seguridad y eficiencia.</div>
            <ul className="list-inside">
              {phase1Checklist.map((it) => (
                <li key={it.id} className="py-1 flex items-center gap-2">
                  <input type="checkbox" aria-label={`phase1-${it.id}`} defaultChecked={it.done} readOnly />
                  <span className={it.done ? 'line-through text-white/60' : ''}>{it.label}</span>
                </li>
              ))}
            </ul>
            <div className="text-xs small-muted mt-2">Marca cada elemento como completado a medida que se avance en la auditoría.</div>
          </div>
        </div>
        {/* Sub-sections for Phase 1 */}
        <div className="card glow-border">
          <h3 className="text-lg font-semibold mb-2 text-white">Revisión de errores (últimos 3 años)</h3>
          <div className="text-sm small-muted">
            <div className="text-xs small-muted">Errores por área (sumados):</div>
            <ul className="text-sm mt-1">
              {phase1Example.perArea.slice(0, 10).map(([area, v]: any) => (
                <li key={area} className="flex justify-between"><span>{area}</span><span className="font-mono">{v}</span></li>
              ))}
            </ul>
            <div className="text-sm font-semibold mt-2">Top problemas identificados</div>
            <ul className="text-sm small-muted">
              {phase1Example.topMotives.map((m: any, i: number) => (
                <li key={i} className="py-1">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-semibold">{m.label}</div>
                      <div className="text-xs small-muted">{m.description}</div>
                    </div>
                    <div className="ml-4 text-xs font-mono">{m.count}</div>
                  </div>
                    <div className="mt-2 h-2 bg-white/6 rounded overflow-hidden">
                    <div style={{ width: `${Math.round((m.count / maxInterviewCount) * 100)}%` }} className="h-2 bg-rose-500 rounded" aria-label={`motive-bar-${m.label}`}></div>
                  </div>
                  <div className="text-xs small-muted mt-1">{m.opportunity}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="card glow-border">
          <h3 className="text-lg font-semibold mb-2 text-white">Entrevistas estructuradas</h3>
          <div className="text-sm small-muted">
            <div className="mb-1">Resumen y hallazgos preliminares (resultados de entrevistas con profesionales)</div>
            <div className="text-xs small-muted">Los números indican cuántas veces se mencionó ese tema en las entrevistas; no representan el número absoluto de errores.</div>
            <ul className="text-sm small-muted mt-2 space-y-3">
              {interviewFindingsDefault.map((m: any, i: number) => (
                <li key={i} className="py-1">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="font-semibold">{m.label}</div>
                      <div className="text-xs small-muted mt-1">{m.description}</div>
                      <div className="text-xs mt-1"><strong>Oportunidad:</strong> {m.opportunity.replace(/^Oportunidad:\s*/i, '')}</div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-mono bg-white/6 px-2 py-1 rounded">{m.count}</div>
                    </div>
                  </div>
                  <div className="mt-2 h-2 bg-white/6 rounded overflow-hidden">
                    <div style={{ width: `${Math.round((m.count / maxInterviewCount) * 100)}%` }} className="h-2 bg-rose-500 rounded" aria-label={`motive-bar-${m.label}`}></div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="card glow-border">
          <h3 className="text-lg font-semibold mb-2 text-white">Diseño de indicadores iniciales</h3>
          <div className="text-sm small-muted">
            <div className="text-xs small-muted">Indicadores calculados (ejemplo)</div>
            <div className="text-sm mt-2 grid grid-cols-2 gap-2">
              <div>Errores / 1.000 administraciones</div><div className="font-mono">{Math.round(phase1Example.kpis.erroresPor1000 * 100) / 100}</div>
              <div>Errores severos / 1.000 adm.</div><div className="font-mono">{Math.round(phase1Example.kpis.severosPor1000 * 100) / 100}</div>
              <div>Near-miss / 1.000 adm.</div><div className="font-mono">{Math.round(phase1Example.kpis.nearMissPor1000 * 100) / 100}</div>
              <div>% alertas aceptadas</div><div className="font-mono">{Math.round((phase1Example.kpis.pctAlertasAceptadas || 0) * 100) / 100}%</div>
            </div>
            {/* Indicadores definidos: simplificado — mostrar ejemplo calculado arriba */}
          </div>
        </div>
        {/* 'Resumen agregado' card removed — minimal UI requested */}

        <div className="card glow-border">
          <h3 className="text-lg font-semibold mb-2 text-white">Lista de errores (muestra)</h3>
          <div className="text-sm small-muted max-h-64 overflow-auto">
            {alerts.slice(0, 50).map((a, i) => (
              <div key={i} className="py-2 border-b border-white/4">
                <div className="text-sm">{a.fecha} — <span className="font-semibold">{a.area}</span></div>
                <div className="text-xs">{a.alerta || 'Incidencia'} — {a.motivo}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 'Registros preanestesia guardados' panel removed per request */}
    </div>
  )
}
