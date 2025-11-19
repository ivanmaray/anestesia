import { useEffect, useState } from 'react'

type ChecklistItem = { id: string; text: string; done: boolean }

export default function Checklist({
  interventionId,
  items,
}: {
  interventionId: string
  items?: string[]
}) {
  const storageKey = `checklist:${interventionId}`
  const initial: ChecklistItem[] = (items || [
    'Verificar concentraciones estándar',
    'Confirmar etiquetado inequívoco',
    'Doble chequeo por 2 profesionales',
    'Revisión de interacciones medicamentosas',
  ]).map((t, i) => ({ id: `${i}`, text: t, done: false }))

  const [list, setList] = useState<ChecklistItem[]>(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) return JSON.parse(raw) as ChecklistItem[]
    } catch (e) {
      // ignore parse
    }
    return initial
  })

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(list))
  }, [list])

  function toggle(id: string) {
    setList((l) => l.map((it) => (it.id === id ? { ...it, done: !it.done } : it)))
  }

  function reset() {
    setList(initial)
  }

  function exportCSV() {
    const rows = [['item', 'done'], ...list.map((r) => [r.text, r.done ? 'yes' : 'no'])]
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `checklist-${interventionId}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <h3>Checklist</h3>
      <ul>
        {list.map((item) => (
          <li key={item.id}>
            <label>
              <input
                type="checkbox"
                checked={item.done}
                onChange={() => toggle(item.id)}
              />
              {item.text}
            </label>
          </li>
        ))}
      </ul>
      <div className="actions">
        <button onClick={reset}>Resetear</button>
        <button onClick={exportCSV}>Exportar a CSV</button>
      </div>
    </div>
  )
}
