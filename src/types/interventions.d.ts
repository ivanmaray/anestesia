// Tipos para modelar las intervenciones del proyecto
export type InterventionLevel = 1 | 2

export type InterventionStatus = 'draft' | 'pilot' | 'active' | 'archived'

export interface Intervention {
  id: string
  level: InterventionLevel
  title: string
  component: string
  description: string
  objective: string
  pilot?: string | null // nombre del piloto si aplica
  status: InterventionStatus
  tags?: string[]
  metrics?: { [key: string]: number }
  createdAt?: string
  checklistItems?: string[] // Añadida propiedad opcional para los ítems del checklist
}
