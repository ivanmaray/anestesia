import { useMemo, useState } from 'react'
import { medCatalog } from '../data/med_catalog'

export default function MedAutocomplete({ onSelect }: { onSelect: (name: string) => void }) {
  const [q, setQ] = useState('')
  const options = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return medCatalog
    return medCatalog.filter((m) => m.name.toLowerCase().includes(term))
  }, [q])

  return (
    <div className="flex gap-2 items-center">
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar medicamento..." className="rounded bg-transparent border px-2 py-1 flex-1" />
      <select aria-label="Seleccionar medicamento" className="rounded bg-transparent border px-2 py-1" onChange={(e) => { if (e.target.value) { onSelect(e.target.value); setQ('') } }}>
        <option value="">Seleccionar...</option>
        {options.map((m) => (
          <option key={m.id} value={m.name}>{m.name}</option>
        ))}
      </select>
    </div>
  )
}
