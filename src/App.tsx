import { useState } from 'react'
import './index.css'

import Header from './components/Header'
import Dashboard from './components/Dashboard'
import KPIs from './components/KPIs'
import Footer from './components/Footer'
import Retrospective from './components/Retrospective'
import ModernIntegration from './components/ModernIntegration'
import UseCaseFlow from './components/UseCaseFlow'
import VirtualTwin from './components/VirtualTwin'
import ProjectExplanation from './components/ProjectExplanation'
// import InterventionsPanel from './components/InterventionsPanel'
// import IncidentReportForm from './components/IncidentReportForm'

/**
 * App principal del Dashboard (español)
 * Contiene layout y estado global básico de filtros (periodo, área)
 */
function App() {
  const [period] = useState<number>(12)
  const [area] = useState<string>('Todas')
  const [section, setSection] = useState<string>('dashboard')
  const [view, setView] = useState<'proyecto' | 'prototipo' | null>(null)
  // Single view: no simplified toggle; default minimal prototype
  const [simulateDemo, setSimulateDemo] = useState<boolean>(false)
  

    // Initialize visibleSections; no simplified/full toggle — single view

  

  if (view === null) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-indigo-700 via-blue-600 to-teal-600 text-white flex items-center justify-center p-6">
        <div className="max-w-5xl w-full">
          <div className="bg-white/10 rounded-xl p-8 shadow-lg backdrop-blur-sm border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-3">Proyecto Farmacia–Anestesia</h1>
                <p className="text-sm md:text-base text-white/90 mb-4">Mejorar la seguridad en anestesia mediante colaboración Farmacia–Anestesia, soporte de decisiones clínicas, farmacogenómica y modelos predictivos con IA.</p>
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <button onClick={() => setView('proyecto')} className="px-5 py-2 rounded-md bg-white text-indigo-700 font-semibold shadow hover:translate-y-[-1px]">
                    Ver Proyecto
                  </button>
                  <button onClick={() => setView('prototipo')} className="px-5 py-2 rounded-md bg-white/20 border border-white/30 text-white hover:bg-white/30">
                    Ver Prototipo del Proyecto
                  </button>
                </div>
                <div className="mt-6 text-xs text-white/80">
                  <strong>Demo:</strong> Demo funcional y narrativa de proyecto separadas — el prototipo contiene un caso clínico interactivo, CDSS, panel PGx y exportación mock a FHIR.
                </div>
              </div>
              <div className="hidden md:block">
                <div className="rounded-lg border border-white/10 shadow-inner bg-white/5 p-4">
                  <div className="mb-3 text-xs text-white/80">Resumen rápido</div>
                  <div className="grid grid-cols-2 gap-3 text-white/90">
                    <div className="bg-white/5 p-3 rounded">
                      <div className="text-xs">Pacientes pilotos</div>
                      <div className="font-bold text-lg mt-1">42</div>
                    </div>
                    <div className="bg-white/5 p-3 rounded">
                      <div className="text-xs">Alertas activas</div>
                      <div className="font-bold text-lg mt-1">28</div>
                    </div>
                    <div className="bg-white/5 p-3 rounded col-span-2">
                      <div className="text-xs">Progreso Plan</div>
                      <div className="font-bold text-lg mt-1">Fase 1 → Fase 2</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 text-center text-sm text-white/80">
            <span>¿Quieres ver una demo rápida o revisar el proyecto de forma narrativa? Usa los botones de arriba.</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {view === 'proyecto' && <ProjectExplanation onBack={() => setView(null)} onOpenPrototype={(section?: string) => { setView('prototipo'); if (section) setSection(section) }} />}
      {view === 'prototipo' && (
        <>
            <Header section={section} setSection={setSection} />
          <main className="p-6 max-w-none w-full flex-1">
            <div className="flex items-center justify-between mb-4">
              <div />
              <div className="flex items-center gap-2">
                {section === 'usecase' && (
                  <button onClick={() => setSimulateDemo(true)} className="px-3 py-1 rounded border text-sm bg-white/80 hover:bg-white/90">Demo rápida</button>
                )}
                <div className="px-2" />
                {/* In the single-view prototype we don't show prototype toggles to keep UI simple */}
              </div>
            </div>
            {/* Show only the section selected in the header */}
            <div className="mb-6">
              {section === 'dashboard' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  <div className="lg:col-span-2">
                    <div className="card">
                      <h3 className="text-lg font-semibold mb-4">Panel de control</h3>
                      <Dashboard />
                    </div>
                  </div>
                  <div>
                    <div className="card">
                      <h3 className="text-lg font-semibold mb-4">KPIs y Resumen</h3>
                      <KPIs filters={{ period, area }} />
                    </div>
                  </div>
                </div>
              )}

              {section === 'retrospective' && (
                <div className="card mb-6">
                  <h3 className="text-lg font-semibold mb-4">Evaluación retrospectiva</h3>
                  <Retrospective />
                </div>
              )}

              {section === 'integracion' && (
                <div className="card mb-6">
                  <h3 className="text-lg font-semibold mb-4">Construcción de algoritmo IA</h3>
                  <ModernIntegration />
                </div>
              )}

              {section === 'usecase' && (
                <div className="card mb-6">
                  <h3 className="text-lg font-semibold mb-4">Demo clínico</h3>
                  <UseCaseFlow simulate={simulateDemo} onSimulated={() => setSimulateDemo(false)} />
                </div>
              )}

              {section === 'virtual-twin' && (
                <div className="card mb-6">
                  <h3 className="text-lg font-semibold mb-4">Gemelo Virtual</h3>
                  <VirtualTwin />
                </div>
              )}
            </div>

            {/* Retrospective panel is always visible above */}

            {/* Interventions panel removed from simplified prototype per UX simplification */}

            {/* IA construction panel is always visible above */}
            {/* UseCaseFlow is always visible above */}

            {/* Incident report form removed from simplified prototype */}

            {/* Dashboard and summary removed to keep prototype minimal */}
          </main>

          <Footer />
        </>
      )}
    </div>
  )
}

export default App
