import React from 'react'

interface DashboardProps { onNavigate?: (section: string) => void }

const Card: React.FC<{title: string; desc: string; action: string; onNavigate?: (s: string) => void}> = ({ title, desc, action, onNavigate }) => (
  <div className="bg-slate-700 p-4 rounded hover:shadow-lg transition-shadow">
    <h4 className="font-semibold text-white mb-2">{title}</h4>
    <p className="text-slate-300 text-sm mb-4">{desc}</p>
    <div className="flex justify-end">
      <button
        className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-sm"
        onClick={() => onNavigate?.(action)}
      >Abrir</button>
    </div>
  </div>
)

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card title="Evaluación Retrospectiva" desc="Revisión de casos y métricas para identificar patrones y mejoras" action="retrospective" onNavigate={onNavigate} />
        <Card title="Construcción IA" desc="Entorno para desarrollar y validar modelos predictivos y reglas clínicas" action="integracion" onNavigate={onNavigate} />
        <Card title="Demo Clínico" desc="Interfaz para simular un caso clínico interactivo con flujo de decisiones" action="usecase" onNavigate={onNavigate} />
        <Card title="Gemelo Virtual" desc="Simulación avanzada por paciente: PK/PD, ventilación y alertas farmacogenómicas" action="virtual-twin" onNavigate={onNavigate} />
      </div>
      <div className="mt-4 text-sm text-slate-400">Pulsa Abrir para ver cada funcionalidad en detalle.</div>
    </div>
  )
}

export default Dashboard