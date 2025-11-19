// brand: neutral Farmacia-Anestesia mark (FA)

type Props = {
  section: string
  setSection: (s: string) => void
  // period, area, setPeriod, setArea removed as selects are no longer in header
}

export default function Header({ section, setSection }: Props) {
  return (
    <header className="site-header px-6 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">FA</div>
          <div>
            <h1 className="text-lg font-semibold">Farmacia–Anestesia — Seguridad clínica</h1>
            <div className="text-sm small-muted">Panel de control</div>
          </div>
        </div>

        <nav className="flex items-center gap-4">
          <button onClick={() => setSection('dashboard')} className={`px-3 py-1 rounded text-sm ${section === 'dashboard' ? 'bg-white/6' : 'hover:bg-white/2'}`}>Panel de control</button>
          <button onClick={() => setSection('retrospective')} className={`px-3 py-1 rounded text-sm ${section === 'retrospective' ? 'bg-white/6' : 'hover:bg-white/2'}`}>Evaluación retrospectiva</button>
          <button onClick={() => setSection('integracion')} className={`px-3 py-1 rounded text-sm ${section === 'integracion' ? 'bg-white/6' : 'hover:bg-white/2'}`}>Construcción IA</button>
          <button onClick={() => setSection('usecase')} className={`px-3 py-1 rounded text-sm ${section === 'usecase' ? 'bg-white/6' : 'hover:bg-white/2'}`}>Demo clínico</button>
          <button onClick={() => setSection('virtual-twin')} className={`px-3 py-1 rounded text-sm ${section === 'virtual-twin' ? 'bg-white/6' : 'hover:bg-white/2'}`}>Gemelo Virtual</button>
        </nav>

      </div>
    </header>
  )
}
