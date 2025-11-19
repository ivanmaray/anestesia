import { useState } from 'react'
import { sampleInterventions } from '../data/interventions'
import type { Intervention } from '../types/interventions'
import Checklist from './Checklist'
import CdssPilotPanel from './CdssPilotPanel'
import { getConfig } from '../lib/cdssConfig'

function truncate(text: string, n = 140) {
  if (text.length <= n) return text
  return text.slice(0, n) + '…'
}

export default function InterventionsPanel() {
  const [selected, setSelected] = useState<Intervention | null>(null)

  const groupedInterventions = sampleInterventions.reduce<Record<string, Intervention[]>>((acc, it) => {
    if (!acc[it.level]) {
      acc[it.level] = []
    }
    acc[it.level].push(it)
    return acc
  }, {})

  const InterventionCard: React.FC<{ intervention: Intervention }> = ({ intervention }) => {
    const [showChecklist, setShowChecklist] = useState(false)

    return (
      <div className="intervention-card p-3 bg-zinc-900/50 rounded border border-zinc-700">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-lg font-semibold">{intervention.title}</div>
            <div className="text-sm text-zinc-400">{intervention.component}</div>
          </div>
          <div className="text-sm text-zinc-300">
            {intervention.pilot || intervention.status}
            {intervention.id === 'int-2-cdss' && (
              <div className="text-xs mt-1">
                Estado piloto: {getConfig().enabledRuleIds.length ? <span className="text-emerald-400 font-semibold">Activado</span> : <span className="text-zinc-400">Desactivado</span>}
              </div>
            )}
          </div>
        </div>
        <p className="mt-2 text-sm text-zinc-300">{truncate(intervention.description, 180)}</p>
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => setSelected(intervention)}
            className="btn btn-sm btn-outline"
          >
            Ver ficha
          </button>
          <button
            onClick={() => {
              // open checklist modal via selected
              setSelected(intervention)
            }}
            className="btn btn-sm btn-primary"
          >
            Abrir checklist
          </button>
        </div>

        {/* Checklist integration for Nivel 1 interventions */}
        {intervention.level === '1' && (
          <div className="mt-4">
            <button
              onClick={() => setShowChecklist(!showChecklist)}
              className="btn btn-sm btn-secondary w-full"
            >
              {showChecklist ? 'Cerrar Checklist' : 'Ver Checklist'}
            </button>
            {showChecklist && (
              <Checklist
                interventionId={intervention.id}
                items={intervention.checklistItems}
              />
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="interventions-panel">
      <h2 className="text-2xl font-bold">Mapa de Intervenciones</h2>
      {Object.entries(groupedInterventions).map(([level, interventions]) => (
        <div key={level} className="intervention-group">
          <h3 className="mb-2 font-semibold">Nivel {level} — {level === '1' ? 'Prevención / Estandarización' : 'Pilotos / Innovación'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {interventions.map((it) => (
              <InterventionCard key={it.id} intervention={it} />
            ))}
          </div>
        </div>
      ))}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-2xl bg-zinc-950 rounded shadow-lg p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold">{selected.title}</h3>
                <div className="text-sm text-zinc-400">{selected.component} • {selected.status}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setSelected(null)} className="btn btn-sm btn-ghost">Cerrar</button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-zinc-300">{selected.description}</p>
                <div className="mt-3 text-sm">
                  <strong>Objetivo:</strong>
                  <div className="text-zinc-300">{selected.objective}</div>
                </div>
                {selected.tags && (
                  <div className="mt-3 text-xs text-zinc-400">Tags: {selected.tags.join(', ')}</div>
                )}
              </div>

              <div>
                <Checklist interventionId={selected.id} />
                {selected.id === 'int-2-cdss' && (
                  <div className="mt-4">
                    <CdssPilotPanel />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
