import { useState } from 'react'

// Vista resumida y navegable del proyecto estratégico Farmacia–Anestesia.
// Contenido condensado del documento largo proporcionado por el usuario.
const sections = [
  {
    id: 'titulo',
    title: 'Título y Enunciado',
    content: `Optimización de la seguridad del paciente y la gestión de recursos mediante IA, farmacogenómica y colaboración interdepartamental. Modelo cooperativo Farmacia Hospitalaria – Anestesia/Unidad de Dolor (horizonte 3–5 años, escalable 10–15 años).`
  },
  {
    id: 'introduccion',
    title: 'Introducción clínica',
    content: `Rol del anestesiólogo en fases perioperatorias (pre, intra, 24–48h post). Alta complejidad farmacológica, necesidad de minimizar errores y personalizar analgesia.`
  },
  {
    id: 'problema',
    title: 'Descripción del problema',
    content: `Errores de medicación: dosificación, LASA, interacciones, vía incorrecta. Impacto económico y demográfico: pacientes ancianos polimedicados, presión asistencial, infrautilización de farmacogenómica y monitorización avanzada.`
  },
  {
    id: 'justificacion-ia',
    title: 'Justificación del uso de IA',
    content: `Predicción de errores; alertas inteligentes (interacciones + PGx); ajuste dinámico de dosis; optimización de stock. Benchmarks: Cleveland Clinic, Mayo Clinic.`
  },
  {
    id: 'objetivos',
    title: 'Objetivos',
    content: `General: reducir errores, personalizar analgesia, optimizar recursos. Específicos: (1) Datos estructurados HCE + PGx + IoT, (2) Algoritmos supervisados y dashboards, (3) Selección y validación multicéntrica, (4) Protocolos conjuntos Farmacia–Anestesia, (5) Evaluación de impacto clínico y económico.`
  },
  {
    id: 'metodologia',
    title: 'Metodología por fases',
    content: `Fase 1 (0–6m): Auditoría inicial y KPIs base. Fase 2 (6–18m): Pilotos IA + validación cruzada. Fase 3 (18–36m): Farmacogenómica aplicada (biobanco, ajuste posológico). Fase 4 (36–60m): Escalado total y comité permanente.`
  },
  {
    id: 'infraestructura',
    title: 'Infraestructura requerida',
    content: `Hardware (servidores GPU, almacenamiento seguro, IoT, NGS). Software (Python/R, TensorFlow/PyTorch, Spark, HL7/FHIR middleware). Organización (Comité Farmacia–Anestesia, gobernanza del dato, formación continua).`
  },
  {
    id: 'validacion',
    title: 'Validación y gobernanza',
    content: `Preclínica: limpieza, split dataset, AUC ≥0.90. Clínica: piloto asistente pasivo, concordancia (Kappa ≥0.8). Post-despliegue: supervisión humana, auditoría mensual, comité de supervisión algorítmica, revalidación periódica.`
  },
  {
    id: 'escalabilidad',
    title: 'Escalabilidad y sostenibilidad',
    content: `Arquitectura modular multi-servicio; contenedores para replicación; financiación innovación + ROI 3–4 años; comité permanente de innovación para actualización de algoritmos.`
  },
  {
    id: 'paciente',
    title: 'Perspectiva del paciente',
    content: `Cuestionarios preoperatorios (dolor, ansiedad); seguimiento postoperatorio móvil/portal; PROMs/PREMs integradas para retroalimentar modelos y mejorar analgesia personalizada.`
  },
  {
    id: 'impacto',
    title: 'Impacto esperado',
    content: `Reducción errores (≥30–50%); analgesia personalizada; ahorro costes (estancias, stock); generación de conocimiento exportable; cumplimiento ético/regulatorio (MDR, GDPR).`
  },
  {
    id: 'uso-diario',
    title: 'Uso diario (flujo operativo)',
    content: `Preoperatorio: plan analgésico IA + validación Farmacia. Quirófano: monitorización y alertas dosis/desviaciones. Postoperatorio/Dolor: ajuste dinámico y telemonitorización.`
  },
  {
    id: 'kpis',
    title: 'KPIs clave',
    content: `Seguridad: ↓ errores graves 50%. Operativa: tiempos preparación y administración. Paciente: control dolor, satisfacción. Recursos: stock ajustado y reducción tareas repetitivas.`
  }
]

export default function ProjectOverview() {
  const [open, setOpen] = useState<string | null>('titulo')
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Proyecto estratégico Farmacia–Anestesia</h2>
      <p className="small-muted text-sm">Resumen navegable del modelo de cooperación, fases y validación. Este panel condensa el documento completo y vincula objetivos con componentes vivos del dashboard.</p>
      <div className="flex flex-wrap gap-2 text-xs">
        {sections.map(s => (
          <button key={s.id} onClick={() => setOpen(s.id)} className={`px-2 py-1 rounded border ${open === s.id ? 'bg-white/10' : 'hover:bg-white/5'}`}>{s.title}</button>
        ))}
      </div>
      <div className="divide-y divide-white/10 border border-white/10 rounded">
        {sections.map(s => (
          <div key={s.id}>
            <button onClick={() => setOpen(open === s.id ? null : s.id)} className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-white/3">
              <span className="font-semibold text-sm">{s.title}</span>
              <span className="text-xs small-muted">{open === s.id ? '−' : '+'}</span>
            </button>
            {open === s.id && (
              <div className="px-4 pb-4 text-sm whitespace-pre-line small-muted">{s.content}</div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-6 text-xs small-muted">
        Enlaces funcionales: reglas CDSS (ver pestaña Intervenciones), panel IA/FGG para farmacogenómica, formulario Pre-Anestesia para captura estructurada. Próximos pasos: integrar IA predictiva y circuito de notificación no punitivo.
      </div>
    </div>
  )
}