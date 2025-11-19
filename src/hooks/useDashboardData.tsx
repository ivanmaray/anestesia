import { useEffect, useMemo, useState } from 'react'
import { generateSampleData } from '../lib/generateData'
import type { MonthlyRecord, AlertRecord } from '../lib/generateData'

export type Filters = { period: number; area: string }

/**
 * Hook central para manejar datos del dashboard.
 * - Genera datos simulados al montar
 * - Permite sustituir datos mediante setData (por CSV)
 * - Provee funciones para filtrar y calcular KPIs, series y tabla
 */
export function useDashboardData() {
  const [monthly, setMonthly] = useState<MonthlyRecord[]>([])
  const [alerts, setAlerts] = useState<AlertRecord[]>([])

  useEffect(() => {
    const { monthly: m, alerts: a } = generateSampleData()
    setMonthly(m)
    setAlerts(a)
  }, [])

  const areas = useMemo(() => {
    const set = new Set<string>(monthly.map((m) => m.area))
    return ['Todas', ...Array.from(set)]
  }, [monthly])

  // filtrar por periodo (meses) y area
  function filterMonthly(filters: Filters) {
    const { period, area } = filters
    // ordenar por mes asc
    const sorted = [...monthly].sort((a, b) => (a.mes > b.mes ? 1 : -1))
    const last = sorted.slice(-period * (area === 'Todas' ? 1 : 1))
    const filtered = last.filter((r) => area === 'Todas' ? true : r.area === area)
    return filtered
  }

  // series por mes (labels: MMM-AAAA)
  function monthlySeries(filters: Filters) {
    const { period, area } = filters
    const sorted = [...monthly].sort((a, b) => (a.mes > b.mes ? 1 : -1))
    const last = sorted.slice(-period)
    const perArea = last.filter((r) => (area === 'Todas' ? true : r.area === area))
    // group by month across areas when area === 'Todas'
    const map = new Map<string, { administraciones: number; errores_totales: number }>()
    perArea.forEach((r) => {
      const key = r.mes
      const cur = map.get(key) || { administraciones: 0, errores_totales: 0 }
      cur.administraciones += r.administraciones
      cur.errores_totales += r.errores_totales
      map.set(key, cur)
    })
    const labels = Array.from(map.keys())
    const data = labels.map((k) => {
      const v = map.get(k)!
      const rate = v.administraciones ? (v.errores_totales / v.administraciones) * 1000 : 0
      return { mes: k, rate }
    })
    return data
  }

  // stacked by type: aggregated over period and area
  function stackedByType(filters: Filters) {
    const { period, area } = filters
    const sorted = [...monthly].sort((a, b) => (a.mes > b.mes ? 1 : -1))
    const last = sorted.slice(-period)
    const perArea = last.filter((r) => (area === 'Todas' ? true : r.area === area))
    const totals = perArea.reduce(
      (acc, r) => {
        acc.administraciones += r.administraciones
        acc.dosis += r.dosis
        acc.farmaco += r.farmaco
        acc.via += r.via
        acc.velocidad += r.velocidad
        acc.lasa += r.lasa
        return acc
      },
      { administraciones: 0, dosis: 0, farmaco: 0, via: 0, velocidad: 0, lasa: 0 }
    )
    const denom = totals.administraciones || 1
    return {
      dosis: (totals.dosis / denom) * 1000,
      farmaco: (totals.farmaco / denom) * 1000,
      via: (totals.via / denom) * 1000,
      velocidad: (totals.velocidad / denom) * 1000,
      lasa: (totals.lasa / denom) * 1000
    }
  }

  // KPIs: errors por 1000, errores severos por 1000, near-miss por 1000, % alertas aceptadas
  function computeKPIs(filters: Filters) {
    const { period, area } = filters
    const sorted = [...monthly].sort((a, b) => (a.mes > b.mes ? 1 : -1))
    const last = sorted.slice(-period)
    const perArea = last.filter((r) => (area === 'Todas' ? true : r.area === area))
    const totals = perArea.reduce(
      (acc, r) => {
        acc.administraciones += r.administraciones
        acc.errores_totales += r.errores_totales
        acc.errores_severos_GI += r.errores_severos_GI
        acc.near_miss += r.near_miss
        acc.alertas_totales += r.alertas_totales
        acc.alertas_aceptadas += r.alertas_aceptadas
        return acc
      },
      { administraciones: 0, errores_totales: 0, errores_severos_GI: 0, near_miss: 0, alertas_totales: 0, alertas_aceptadas: 0 }
    )

    const denom = totals.administraciones || 1
    const erroresPor1000 = (totals.errores_totales / denom) * 1000
    const severosPor1000 = (totals.errores_severos_GI / denom) * 1000
    const nearMissPor1000 = (totals.near_miss / denom) * 1000
    const pctAlertasAceptadas = totals.alertas_totales ? (totals.alertas_aceptadas / totals.alertas_totales) * 100 : 0

    // delta vs 12 meses previos al periodo elegido
    const prevPeriodMonths = 12
    const allSorted = [...monthly].sort((a, b) => (a.mes > b.mes ? 1 : -1))
    const endIndex = allSorted.length
  const prevSlice = allSorted.slice(Math.max(0, endIndex - period - prevPeriodMonths), Math.max(0, endIndex - period))

    function sumSlice(slice: MonthlyRecord[]) {
      const s = slice
        .filter((r) => (area === 'Todas' ? true : r.area === area))
        .reduce(
          (acc, r) => {
            acc.administraciones += r.administraciones
            acc.errores_totales += r.errores_totales
            acc.errores_severos_GI += r.errores_severos_GI
            acc.near_miss += r.near_miss
            acc.alertas_totales += r.alertas_totales
            acc.alertas_aceptadas += r.alertas_aceptadas
            return acc
          },
          { administraciones: 0, errores_totales: 0, errores_severos_GI: 0, near_miss: 0, alertas_totales: 0, alertas_aceptadas: 0 }
        )
      return s
    }

    let delta = {
      erroresPor1000: null as number | null,
      severosPor1000: null as number | null,
      nearMissPor1000: null as number | null,
      pctAlertasAceptadas: null as number | null
    }

    if (prevSlice.length >= 1) {
      const prev = sumSlice(prevSlice)
      const denomPrev = prev.administraciones || 1
      const prevErrores = (prev.errores_totales / denomPrev) * 1000
      const prevSeveros = (prev.errores_severos_GI / denomPrev) * 1000
      const prevNear = (prev.near_miss / denomPrev) * 1000
      const prevPctAlertas = prev.alertas_totales ? (prev.alertas_aceptadas / prev.alertas_totales) * 100 : 0

      delta = {
        erroresPor1000: ((erroresPor1000 - prevErrores) / (prevErrores || 1)) * 100,
        severosPor1000: ((severosPor1000 - prevSeveros) / (prevSeveros || 1)) * 100,
        nearMissPor1000: ((nearMissPor1000 - prevNear) / (prevNear || 1)) * 100,
        pctAlertasAceptadas: prevPctAlertas ? ((pctAlertasAceptadas - prevPctAlertas) / prevPctAlertas) * 100 : null
      }
    }

    return {
      erroresPor1000,
      severosPor1000,
      nearMissPor1000,
      pctAlertasAceptadas,
      delta
    }
  }

  // obtener alertas con filtros (period y area)
  function getAlerts(filters: Filters, opts?: { onlyCritical?: boolean; search?: string; page?: number; perPage?: number }) {
    const { period } = filters
    const perPage = opts?.perPage || 10
    const sortedAlerts = [...alerts].sort((a, b) => (a.fecha > b.fecha ? -1 : 1))
    const cutoff = new Date()
    cutoff.setMonth(cutoff.getMonth() - period + 1)
    const cutoffStr = cutoff.toISOString().slice(0, 10)
    let filtered = sortedAlerts.filter((a) => a.fecha >= cutoffStr)
    if (filters.area && filters.area !== 'Todas') filtered = filtered.filter((a) => a.area === filters.area)
    if (opts?.onlyCritical) filtered = filtered.filter((a) => a.critica)
    if (opts?.search) {
      const q = opts.search.toLowerCase()
      filtered = filtered.filter((a) => [a.paciente_id, a.alerta, a.motivo, a.area].join(' ').toLowerCase().includes(q))
    }
    const page = opts?.page || 1
    const start = (page - 1) * perPage
    const paged = filtered.slice(start, start + perPage)
    return { total: filtered.length, page, perPage, data: paged }
  }

  // sustituir datos (CSV)
  function replaceData(newMonthly: MonthlyRecord[] | null, newAlerts: AlertRecord[] | null) {
    if (newMonthly) setMonthly(newMonthly)
    if (newAlerts) setAlerts(newAlerts)
  }

  return {
    monthly,
    alerts,
    areas,
    filterMonthly,
    monthlySeries,
    stackedByType,
    computeKPIs,
    getAlerts,
    replaceData
  }
}

export default useDashboardData
