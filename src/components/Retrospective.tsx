import { useState, useMemo } from 'react'
import useDashboardData from '../hooks/useDashboardData'

export default function Retrospective() {
  const { monthly, alerts, computeKPIs } = useDashboardData()
  const [expandedPhase, setExpandedPhase] = useState<string | null>('fase1')

  // Datos clínicos mejorados de errores de medicación anestésica
  const clinicalErrorData = useMemo(() => {
    return {
      medicationErrors: [
        { id: 1, drug: 'Propofol', dose: '2.5 mg/kg', error: 'Dosis subóptima', severity: 'medium', count: 34, trend: 'down' },
        { id: 2, drug: 'Rocuronio', dose: '1.2 mg/kg', error: 'Administración rápida', severity: 'high', count: 28, trend: 'stable' },
        { id: 3, drug: 'Remifentanilo', dose: '1-2 mcg/kg/min', error: 'Infusión no calibrada', severity: 'high', count: 22, trend: 'up' },
        { id: 4, drug: 'Mivacurio', dose: '0.15 mg/kg', error: 'Contraindicación no detectada', severity: 'critical', count: 8, trend: 'up' },
        { id: 5, drug: 'Succinilcolina', dose: '1.5 mg/kg', error: 'Malignant hyperthermia risk', severity: 'critical', count: 4, trend: 'stable' }
      ],
      commonMistakes: [
        { label: 'Omisión de dosis', pct: 28, color: 'rose' },
        { label: 'Dosis inadecuada', pct: 22, color: 'orange' },
        { label: 'Vía de administración incorrecta', pct: 18, color: 'amber' },
        { label: 'Falta de verificación farmacogenética', pct: 16, color: 'yellow' },
        { label: 'Incompatibilidad de fármacos', pct: 10, color: 'lime' },
        { label: 'Alergia no detectada', pct: 6, color: 'green' }
      ],
      riskFactors: [
        { factor: 'Paciente > 70 años', incidents: 156, potentialEvents: 42 },
        { factor: 'ASA ≥ III', incidents: 134, potentialEvents: 38 },
        { factor: 'Polifarmacia (> 5 fármacos)', incidents: 112, potentialEvents: 31 },
        { factor: 'IMC > 30', incidents: 98, potentialEvents: 25 },
        { factor: 'Enfermedad renal crónica', incidents: 64, potentialEvents: 18 }
      ],
      outcomes: {
        prevented: 187,
        minorHarm: 23,
        seriousHarm: 6,
        deaths: 1
      }
    }
  }, [])

  const kpis = useMemo(() => computeKPIs({ period: 12, area: 'Todas' }), [computeKPIs])

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
    <div className="space-y-4">
      {/* RESUMEN EJECUTIVO */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="card bg-gradient-to-br from-green-900/30 to-green-900/10 border-green-700/30">
          <div className="text-2xl font-bold text-green-400">{clinicalErrorData.outcomes.prevented}</div>
          <div className="text-xs text-green-300">Eventos prevenidos</div>
        </div>
        <div className="card bg-gradient-to-br from-yellow-900/30 to-yellow-900/10 border-yellow-700/30">
          <div className="text-2xl font-bold text-yellow-400">{clinicalErrorData.outcomes.minorHarm}</div>
          <div className="text-xs text-yellow-300">Daño menor</div>
        </div>
        <div className="card bg-gradient-to-br from-orange-900/30 to-orange-900/10 border-orange-700/30">
          <div className="text-2xl font-bold text-orange-400">{clinicalErrorData.outcomes.seriousHarm}</div>
          <div className="text-xs text-orange-300">Daño grave</div>
        </div>
        <div className="card bg-gradient-to-br from-red-900/30 to-red-900/10 border-red-700/30">
          <div className="text-2xl font-bold text-red-400">{clinicalErrorData.outcomes.deaths}</div>
          <div className="text-xs text-red-300">Mortalidad evitable</div>
        </div>
      </div>

      {/* FASE 1: AUDITORÍA Y DIAGNÓSTICO */}
      <div className="card glow-border">
        <button
          onClick={() => setExpandedPhase(expandedPhase === 'fase1' ? null : 'fase1')}
          className="w-full flex items-center justify-between"
        >
          <h3 className="text-lg font-semibold text-white">📋 Fase 1: Auditoría y Diagnóstico</h3>
          <span className="text-xl">{expandedPhase === 'fase1' ? '−' : '+'}</span>
        </button>
        
        {expandedPhase === 'fase1' && (
          <div className="mt-4 space-y-4">
            {/* Errores de medicación */}
            <div className="space-y-2">
              <h4 className="font-semibold text-cyan-400">Errores de Medicación por Fármaco</h4>
              <div className="space-y-2">
                {clinicalErrorData.medicationErrors.map((err) => (
                  <div key={err.id} className="bg-white/4 rounded p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-semibold">{err.drug} ({err.dose})</div>
                        <div className="text-xs text-slate-400">{err.error}</div>
                      </div>
                      <div className="flex gap-2 items-center">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          err.severity === 'critical' ? 'bg-red-900 text-red-300' :
                          err.severity === 'high' ? 'bg-orange-900 text-orange-300' :
                          'bg-yellow-900 text-yellow-300'
                        }`}>
                          {err.severity.toUpperCase()}
                        </span>
                        <span className="text-sm font-mono">{err.count}</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded overflow-hidden">
                      <div 
                        style={{ width: `${Math.min((err.count / 40) * 100, 100)}%` }}
                        className={`h-1.5 rounded ${
                          err.severity === 'critical' ? 'bg-red-500' :
                          err.severity === 'high' ? 'bg-orange-500' :
                          'bg-yellow-500'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tipos de errores */}
            <div className="space-y-2">
              <h4 className="font-semibold text-cyan-400">Clasificación de Errores</h4>
              <div className="space-y-1.5">
                {clinicalErrorData.commonMistakes.map((mistake, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">{mistake.label}</span>
                        <span className="font-mono text-xs">{mistake.pct}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded overflow-hidden">
                        <div 
                          style={{ width: `${mistake.pct}%` }}
                          className={`h-2 bg-${mistake.color}-500 rounded`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Factores de riesgo */}
            <div className="space-y-2">
              <h4 className="font-semibold text-cyan-400">Factores de Riesgo Identificados</h4>
              <div className="space-y-2">
                {clinicalErrorData.riskFactors.map((risk, idx) => (
                  <div key={idx} className="bg-white/4 rounded p-2">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-sm">{risk.factor}</span>
                      <span className="text-xs text-slate-400">{risk.potentialEvents} eventos potenciales</span>
                    </div>
                    <div className="flex gap-2 text-xs">
                      <span className="px-2 py-1 bg-blue-900/30 text-blue-300 rounded">{risk.incidents} incidentes</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FASE 2: ANÁLISIS COMPARATIVO */}
      <div className="card glow-border">
        <button
          onClick={() => setExpandedPhase(expandedPhase === 'fase2' ? null : 'fase2')}
          className="w-full flex items-center justify-between"
        >
          <h3 className="text-lg font-semibold text-white">📊 Fase 2: Análisis Comparativo y Benchmarking</h3>
          <span className="text-xl">{expandedPhase === 'fase2' ? '−' : '+'}</span>
        </button>

        {expandedPhase === 'fase2' && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/4 rounded p-3">
                <div className="text-xs text-slate-400 mb-2">Tasa de Errores (por 1000 administraciones)</div>
                <div className="text-2xl font-bold text-cyan-400">{Math.round(kpis.erroresPor1000 * 100) / 100}</div>
                <div className="text-xs text-slate-400 mt-1">Benchmark nacional: 2.5-3.2</div>
              </div>
              <div className="bg-white/4 rounded p-3">
                <div className="text-xs text-slate-400 mb-2">Tasa de Eventos Severos (por 1000)</div>
                <div className="text-2xl font-bold text-orange-400">{Math.round(kpis.severosPor1000 * 100) / 100}</div>
                <div className="text-xs text-slate-400 mt-1">Objetivo: &lt; 0.5</div>
              </div>
              <div className="bg-white/4 rounded p-3">
                <div className="text-xs text-slate-400 mb-2">Near-Miss Rate (por 1000)</div>
                <div className="text-2xl font-bold text-yellow-400">{Math.round(kpis.nearMissPor1000 * 100) / 100}</div>
                <div className="text-xs text-slate-400 mt-1">Indicador de cultura de seguridad</div>
              </div>
              <div className="bg-white/4 rounded p-3">
                <div className="text-xs text-slate-400 mb-2">% Alertas Aceptadas</div>
                <div className="text-2xl font-bold text-green-400">{Math.round((kpis.pctAlertasAceptadas || 0) * 100) / 100}%</div>
                <div className="text-xs text-slate-400 mt-1">Eficacia de CDSS</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FASE 3: IMPLEMENTACIÓN DE MEJORAS */}
      <div className="card glow-border">
        <button
          onClick={() => setExpandedPhase(expandedPhase === 'fase3' ? null : 'fase3')}
          className="w-full flex items-center justify-between"
        >
          <h3 className="text-lg font-semibold text-white">🎯 Fase 3: Implementación de Mejoras</h3>
          <span className="text-xl">{expandedPhase === 'fase3' ? '−' : '+'}</span>
        </button>

        {expandedPhase === 'fase3' && (
          <div className="mt-4 space-y-3">
            <div className="bg-gradient-to-r from-blue-900/30 to-blue-900/10 p-3 rounded border border-blue-700/30">
              <div className="font-semibold text-blue-300 mb-2">✓ Verificación de doble check en dosis críticas</div>
              <div className="text-xs text-slate-400">Implementación de protocolo de doble verificación farmacéutica antes de administración</div>
            </div>
            <div className="bg-gradient-to-r from-purple-900/30 to-purple-900/10 p-3 rounded border border-purple-700/30">
              <div className="font-semibold text-purple-300 mb-2">✓ Integración de farmacogenética en CDSS</div>
              <div className="text-xs text-slate-400">Alertas automáticas basadas en perfil PGx del paciente</div>
            </div>
            <div className="bg-gradient-to-r from-green-900/30 to-green-900/10 p-3 rounded border border-green-700/30">
              <div className="font-semibold text-green-300 mb-2">✓ Protocolos LASA en quirófano</div>
              <div className="text-xs text-slate-400">Identificación visual de fármacos de apariencia similar</div>
            </div>
            <div className="bg-gradient-to-r from-amber-900/30 to-amber-900/10 p-3 rounded border border-amber-700/30">
              <div className="font-semibold text-amber-300 mb-2">⏳ Capacitación del equipo (Q1 2026)</div>
              <div className="text-xs text-slate-400">Talleres de seguridad y protocolos de medicación</div>
            </div>
          </div>
        )}
      </div>
}
