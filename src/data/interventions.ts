import type { Intervention } from '../types/interventions'

// Datos de ejemplo iniciales basados en el plan de intervenciones provisto.
export const sampleInterventions: Intervention[] = [
  {
    id: 'int-1-review-preop',
    level: 1,
    title: 'Revisión farmacéutica preoperatoria focalizada',
    component: 'Revisión farmacéutica',
    description:
      'Evaluación dirigida a pacientes con insuficiencia renal/hepática, polimedicados o alto riesgo para detectar necesidad de ajuste de dosis, duplicidades e interacciones.',
    objective: 'Prevención primaria: reducir errores y eventos adversos relacionados con la medicación.',
    pilot: null,
    status: 'active',
    tags: ['preoperatorio', 'alto-riesgo', 'medicación'],
    metrics: { expectedImpact: 0.25 }
  },

  {
    id: 'int-1-checklist',
    level: 1,
    title: 'Lista de verificación Farmacia–Anestesia',
    component: 'Checklist',
    description:
      'Checklist operativa con concentraciones estándar, etiquetado inequívoco y doble chequeo para fármacos críticos en el área perioperatoria.',
    objective: 'Estandarización de procesos y reducción de confusión entre LASA.',
    pilot: null,
    status: 'active',
    tags: ['checklist', 'estandarización', 'LASA'],
    metrics: { items: 12 }
  },

  {
    id: 'int-1-reporting-circuit',
    level: 1,
    title: 'Circuito de notificación reforzado (no punitivo)',
    component: 'Reporte simplificado',
    description:
      'Canal de reporte simplificado y no punitivo para eventos y casi-errores, con resumen mensual para aprendizaje y mejora continua.',
    objective: 'Aprendizaje: fomentar reporte y análisis de causas raíz.',
    pilot: null,
    status: 'active',
    tags: ['reportes', 'aprendizaje', 'no-punitivo'],
    metrics: { monthlyReports: 0 }
  },

  // Nivel 2: pilotos
  {
    id: 'int-2-cdss',
    level: 2,
    title: 'Reglas clínicas digitales (CDSS)',
    component: 'CDSS',
    description:
      'Motor de reglas para ajuste por función renal/hepática, interacciones, duplicidades y alertas LASA. Se evaluará en modo piloto (Piloto A).',
    objective: 'Soporte en tiempo real: reducir alertas críticas y guiar ajustes de dosis.',
    pilot: 'Piloto A',
    status: 'pilot',
    tags: ['cdss', 'reglas', 'piloto'],
    metrics: { rulesCount: 8 }
  },

  {
    id: 'int-2-pgx',
    level: 2,
    title: 'Farmacogenómica (PGx) aplicada selectivamente',
    component: 'Farmacogenómica',
    description:
      'Evaluación de variantes relevantes (CYP2D6, CYP3A4, OPRM1) en pacientes seleccionados para personalizar elección y dosificación. Se evaluará en Piloto B.',
    objective: 'Personalización terapéutica en casos seleccionados para mejorar eficacia y seguridad.',
    pilot: 'Piloto B',
    status: 'pilot',
    tags: ['pgx', 'personalización', 'piloto'],
    metrics: { candidateRate: 0.05 }
  },

  {
    id: 'int-2-ia-predictive',
    level: 2,
    title: 'IA predictiva (modo silencioso)',
    component: 'IA predictiva',
    description:
      'Modelo de riesgo de error que se ejecuta inicialmente en modo "silencioso" para validación y calibración antes de integrar notificaciones activas.',
    objective: 'Priorización: identificar casos de alto riesgo para evaluación posterior.',
    pilot: 'Piloto IA',
    status: 'pilot',
    tags: ['ia', 'predictivo', 'piloto'],
    metrics: { baselineAUC: 0.6 }
  }
]

export function getInterventionById(id: string) {
  return sampleInterventions.find((i) => i.id === id) || null
}
