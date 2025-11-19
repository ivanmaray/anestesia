import { useEffect, useState } from 'react'
import useDashboardData from '../hooks/useDashboardData'

export default function AlertsTable({ filters }: { filters: { period: number; area: string } }) {
  const { getAlerts } = useDashboardData()
  const [search, setSearch] = useState('')
  const [onlyCritical, setOnlyCritical] = useState(false)
  const [page, setPage] = useState(1)

  const { total, data } = getAlerts(filters, { onlyCritical, search, page, perPage: 10 })

  useEffect(() => {
    setPage(1)
  }, [filters, onlyCritical, search])

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <input aria-label="Buscar alertas" placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} className="border rounded px-2 py-1 text-sm flex-1" />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={onlyCritical} onChange={(e) => setOnlyCritical(e.target.checked)} />
          Ver solo críticas
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-600">
            <tr>
              <th className="pb-2">Fecha</th>
              <th className="pb-2">Área</th>
              <th className="pb-2">Paciente (ID)</th>
              <th className="pb-2">Alerta</th>
              <th className="pb-2">Motivo</th>
              <th className="pb-2">Crítica</th>
              <th className="pb-2">Aceptada</th>
            </tr>
          </thead>
          <tbody>
            {data.map((r, idx) => (
              <tr key={idx} className={idx % 2 ? 'bg-slate-50' : ''}>
                <td className="py-2 pr-4">{r.fecha}</td>
                <td className="py-2 pr-4">{r.area}</td>
                <td className="py-2 pr-4">{r.paciente_id}</td>
                <td className="py-2 pr-4">{r.alerta}</td>
                <td className="py-2 pr-4">{r.motivo}</td>
                <td className="py-2 pr-4">{r.critica ? 'Sí' : 'No'}</td>
                <td className="py-2 pr-4">{r.aceptada ? 'Sí' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-slate-600">Mostrando {data.length} de {total} alertas</div>
        <div className="flex items-center gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1 border rounded">Anterior</button>
          <div className="text-sm">Página {page}</div>
          <button onClick={() => setPage((p) => p + 1)} className="px-3 py-1 border rounded">Siguiente</button>
        </div>
      </div>
    </div>
  )
}
