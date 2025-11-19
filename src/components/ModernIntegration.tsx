import { useState, useEffect } from 'react'
import useDashboardData from '../hooks/useDashboardData'
import PreAnesthesiaForm from './PreAnesthesiaForm'
import PredictiveRiskPanel from './PredictiveRiskPanel'

export default function ModernIntegration() {
  // Keep the dashboard hook for future needs
  useDashboardData()
  const [showForm, setShowForm] = useState(false)

  function loadDemoRecords(doConfirm = true) {
    const demo = [
      { paciente_id: 'demo-001', nombre: 'Sra. Gómez', edad: 64, sexo: 'F', peso_kg: 70, creatinina_mg_dL: 2.3, hemoglobina_g_dL: 10.8, plaquetas: 120, n_prev_procedures: 2, multiresistente: true, medicacion_actual: 'Clopidogrel 75 mg, Omeprazol 20 mg, Metformina 850 mg', antecedentes_relevantes: 'Diabetes, HTA' },
      { paciente_id: 'demo-002', nombre: 'Sr. Pérez', edad: 72, sexo: 'M', peso_kg: 82, creatinina_mg_dL: 1.1, hemoglobina_g_dL: 13.4, plaquetas: 250, n_prev_procedures: 1, multiresistente: false, medicacion_actual: 'Aspirina 100 mg, Warfarina 5 mg', antecedentes_relevantes: 'FA, HTA' },
      { paciente_id: 'demo-003', nombre: 'Sra. Ruiz', edad: 57, sexo: 'F', peso_kg: 68, creatinina_mg_dL: 0.95, hemoglobina_g_dL: 12.0, plaquetas: 210, n_prev_procedures: 0, multiresistente: false, medicacion_actual: 'Metformina 850 mg, Paracetamol 1 g', antecedentes_relevantes: 'DM2' },
      { paciente_id: 'demo-004', nombre: 'Sr. López', edad: 45, sexo: 'M', peso_kg: 90, creatinina_mg_dL: 1.6, hemoglobina_g_dL: 15.0, plaquetas: 300, n_prev_procedures: 3, multiresistente: false, medicacion_actual: 'Metoprolol 50 mg, Simvastatina 20 mg', antecedentes_relevantes: 'Cardiopatía' },
      { paciente_id: 'demo-005', nombre: 'Sra. Díaz', edad: 68, sexo: 'F', peso_kg: 60, creatinina_mg_dL: 1.9, hemoglobina_g_dL: 10.2, plaquetas: 100, n_prev_procedures: 2, multiresistente: true, medicacion_actual: 'Vancomicina 1 g, Metformina 850 mg', antecedentes_relevantes: 'Insuficiencia renal' },
      { paciente_id: 'demo-006', nombre: 'Sra. Alba', edad: 30, sexo: 'F', peso_kg: 55, creatinina_mg_dL: 0.8, hemoglobina_g_dL: 13.1, plaquetas: 289, n_prev_procedures: 0, multiresistente: false, medicacion_actual: 'Paracetamol 1 g', antecedentes_relevantes: 'Alergia leve' },
      { paciente_id: 'demo-007', nombre: 'Sr. Navarro', edad: 81, sexo: 'M', peso_kg: 78, creatinina_mg_dL: 2.8, hemoglobina_g_dL: 9.2, plaquetas: 88, n_prev_procedures: 4, multiresistente: true, medicacion_actual: 'Vancomicina 1 g, Clopidogrel 75 mg', antecedentes_relevantes: 'IRC, HTA' },
      { paciente_id: 'demo-008', nombre: 'Sra. Blanco', edad: 49, sexo: 'F', peso_kg: 65, creatinina_mg_dL: 1.2, hemoglobina_g_dL: 14.7, plaquetas: 220, n_prev_procedures: 1, multiresistente: false, medicacion_actual: 'Ibuprofeno 600 mg', antecedentes_relevantes: 'Asma' },
      { paciente_id: 'demo-009', nombre: 'Sr. Ruiz', edad: 60, sexo: 'M', peso_kg: 105, creatinina_mg_dL: 1.4, hemoglobina_g_dL: 11.9, plaquetas: 140, n_prev_procedures: 2, multiresistente: false, medicacion_actual: 'Metformina 850 mg, Omeprazol 20 mg', antecedentes_relevantes: 'Diabetes' },
      { paciente_id: 'demo-010', nombre: 'Sra. Fernández', edad: 38, sexo: 'F', peso_kg: 62, creatinina_mg_dL: 0.9, hemoglobina_g_dL: 12.5, plaquetas: 270, n_prev_procedures: 0, multiresistente: false, medicacion_actual: 'Levotiroxina 50 mcg', antecedentes_relevantes: 'Hipotiroidismo' }
    ]
    if (!doConfirm || confirm('Cargar registros demo y sobrescribir registros existentes?')) {
      localStorage.setItem('preanesthesia_records', JSON.stringify(demo))
      // Dispatch a custom event so PredictiveRiskPanel loads the data and runs model
      window.dispatchEvent(new CustomEvent('demoDataLoaded'))
      // Optionally show the form so user can inspect the first record
      setShowForm(true)
    }
  }

  function loadDemoIfEmpty() {
    try {
      const s = JSON.parse(localStorage.getItem('preanesthesia_records') || '[]') || []
      if (!s.length) loadDemoRecords(false)
    } catch (err) {
      loadDemoRecords(false)
    }
  }

  useEffect(() => {
    loadDemoIfEmpty()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <div className="space-y-4">
        <div className="relative w-full px-2">
          <div className="card max-w-none w-full">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold mb-2">Tabla de registros y predicción IA</h3>
              <div className="flex items-center gap-2">
                <button onClick={() => setShowForm((s) => !s)} className="px-3 py-1 rounded bg-white/6">{showForm ? 'Ocultar formulario' : 'Crear registro'}</button>
                <button onClick={() => loadDemoRecords()} className="px-3 py-1 rounded bg-indigo-600 text-white">Cargar demo</button>
                <button onClick={() => { if (confirm('¿Borrar todos los registros guardados?')) { localStorage.removeItem('preanesthesia_records'); location.reload() } }} className="px-3 py-1 rounded border">Limpiar registros</button>
              </div>
            </div>
            {showForm && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold mb-2">Formulario preanestesia</h4>
                <PreAnesthesiaForm allowApplyPgx={false} />
              </div>
            )}
            <PredictiveRiskPanel />
          </div>
        </div>

        {/* Datos recientes removed by request */}
      </div>
    </div>
  )
}
