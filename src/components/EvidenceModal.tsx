import React from 'react'

interface Props {
  open: boolean
  title?: string
  evidence: string
  onClose: () => void
  links?: { label: string; url: string }[]
}

const EvidenceModal: React.FC<Props> = ({ open, title, evidence, onClose, links }) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-md shadow-lg max-w-2xl w-full p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{title || 'Evidencia clínica'}</h3>
            <div className="text-xs text-gray-700 mt-1">Fuentes: CPIC, PharmGKB, guías locales (demo)</div>
          </div>
          <button onClick={onClose} className="text-gray-700 hover:text-gray-900">Cerrar</button>
        </div>
        <div className="mt-4 text-sm text-gray-700 leading-6">
          {evidence}
        </div>
        <div className="mt-4 text-right">
          {links && links.length > 0 ? (
            links.map((l) => (
              <a key={l.url} className="text-xs text-indigo-600 hover:underline mr-4" href={l.url} target="_blank" rel="noreferrer">{l.label}</a>
            ))
          ) : (
            <>
              <a className="text-xs text-indigo-600 hover:underline mr-4" href="https://www.pharmgkb.org" target="_blank" rel="noreferrer">PharmGKB</a>
              <a className="text-xs text-indigo-600 hover:underline" href="https://cpicpgx.org" target="_blank" rel="noreferrer">CPIC</a>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default EvidenceModal
