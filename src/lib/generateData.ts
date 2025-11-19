// Generación de datos simulados para 36 meses y alertas (~200)
// Comentarios: esta función crea datos mensuales por área y un listado de alertas

export type MonthlyRecord = {
  mes: string // YYYY-MM
  area: string
  administraciones: number
  errores_totales: number
  errores_severos_GI: number
  near_miss: number
  dosis: number
  farmaco: number
  via: number
  velocidad: number
  lasa: number
  alertas_totales: number
  alertas_criticas: number
  alertas_aceptadas: number
}

export type AlertRecord = {
  fecha: string // YYYY-MM-DD
  area: string
  paciente_id: string
  alerta: string
  motivo: string
  critica: boolean
  aceptada: boolean
}

const AREAS = ['Quirófano', 'REA', 'UCI', 'Unidad de Dolor']

function fmtMonth(date: Date) {
  const y = date.getFullYear()
  const m = (date.getMonth() + 1).toString().padStart(2, '0')
  return `${y}-${m}`
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function choose<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function generateSampleData(): { monthly: MonthlyRecord[]; alerts: AlertRecord[] } {
  const monthly: MonthlyRecord[] = []
  const alerts: AlertRecord[] = []

  const today = new Date()
  // Generate 36 months ending on last month
  for (let i = 35; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1)
    const mes = fmtMonth(d)

    AREAS.forEach((area) => {
      const administraciones = randInt(2000, 6000)

      // base error rate per 1000 between 0.5 and 6.0
      const baseRate = 0.8 + Math.random() * 4.5
      const errores_totales = Math.max(0, Math.round((baseRate / 1000) * administraciones))

      const errores_severos_GI = Math.round(errores_totales * (0.05 + Math.random() * 0.15))
      const near_miss = Math.round(errores_totales * (0.1 + Math.random() * 0.5))

      // tipos distribution
      const dosis = Math.round(errores_totales * (0.25 + Math.random() * 0.2))
      const farmaco = Math.round(errores_totales * (0.2 + Math.random() * 0.2))
      const via = Math.round(errores_totales * (0.15 + Math.random() * 0.15))
      const velocidad = Math.round(errores_totales * (0.1 + Math.random() * 0.15))
      const lasa = Math.max(0, errores_totales - (dosis + farmaco + via + velocidad))

      const alertas_totales = Math.max(0, Math.round(errores_totales * (0.5 + Math.random() * 2)))
      const alertas_criticas = Math.round(alertas_totales * (0.05 + Math.random() * 0.25))
      const alertas_aceptadas = Math.round(alertas_totales * (0.5 + Math.random() * 0.4))

      monthly.push({
        mes,
        area,
        administraciones,
        errores_totales,
        errores_severos_GI,
        near_miss,
        dosis,
        farmaco,
        via,
        velocidad,
        lasa,
        alertas_totales,
        alertas_criticas,
        alertas_aceptadas
      })
    })
  }

  // generar ~200 alertas distribuidas en el periodo
  const totalAlerts = 200
  for (let i = 0; i < totalAlerts; i++) {
    const monthsBack = randInt(0, 35)
    const d = new Date(today.getFullYear(), today.getMonth() - monthsBack, randInt(1, 28))
    const fecha = d.toISOString().slice(0, 10)
    const area = choose(AREAS)
    const paciente_id = `P-${randInt(10000, 99999)}`
    const alerta = choose([
      'Intervención peligrosa',
      'Dosis fuera de rango',
      'Fármaco equivocado',
      'Vía incorrecta',
      'Velocidad de administración'
    ])
    const motivo = choose([
      'Errores de etiquetado',
      'Confusión parecido nombre',
      'Prescripción manual',
      'Administración urgente',
      'Error humano'
    ])
    const critica = Math.random() < 0.15
    const aceptada = Math.random() < 0.6

    alerts.push({ fecha, area, paciente_id, alerta, motivo, critica, aceptada })
  }

  return { monthly, alerts }
}
